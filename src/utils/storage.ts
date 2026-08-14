import { WinnerClaim, UserStats, IpClaimRecord } from '../types';
import { 
  saveRemoteWinner, 
  fetchRemoteWinners, 
  clearRemoteWinners,
  savePermanentRemoteIpClaim,
  checkRemoteIpClaimed,
  fetchAllRemoteIpClaims,
  clearAllRemoteIpClaims
} from '../lib/supabase';
import { fetchClientIp } from './ipTracker';

const STORAGE_KEY_WINNERS = 'hotk_winners_list_v1';
const STORAGE_KEY_USER_STATS = 'hotk_user_stats_v1';
const STORAGE_KEY_PRESET_CARDS = 'hotk_preset_reward_cards_v1';

// PERMANENT STORAGE KEYS: These are NEVER wiped when the game is reset or winners cleared
const STORAGE_KEY_PERMANENT_IP_CLAIMS = 'hotk_permanent_claimed_ips_v1';
const STORAGE_KEY_MY_PERMANENT_CLAIM = 'hotk_my_permanent_claim_v1';

// Initial default winners (0 claimed out of 5 total, so all 5 remain available)
const DEFAULT_WINNERS: WinnerClaim[] = [];

export function generate13DigitCardCode(): string {
  // Generates a 13-digit card formatted as XXXX-XXXX-XXXX-X
  const d = () => Math.floor(Math.random() * 9000 + 1000).toString();
  const last = Math.floor(Math.random() * 9 + 1).toString();
  return `${d()}-${d()}-${d()}-${last}`;
}

export function format13DigitCard(raw: string): string {
  const clean = raw.replace(/[^0-9]/g, '');
  if (clean.length === 13) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12)}`;
  }
  return raw.trim() || generate13DigitCardCode();
}

export function getPresetRewardCards(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESET_CARDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 5) {
        return parsed;
      }
    }
  } catch {}
  const defaults = [1, 2, 3, 4, 5].map(() => generate13DigitCardCode());
  localStorage.setItem(STORAGE_KEY_PRESET_CARDS, JSON.stringify(defaults));
  return defaults;
}

export function savePresetRewardCards(cards: string[]): string[] {
  const formatted = cards.slice(0, 5).map((c) => format13DigitCard(c));
  while (formatted.length < 5) {
    formatted.push(generate13DigitCardCode());
  }
  localStorage.setItem(STORAGE_KEY_PRESET_CARDS, JSON.stringify(formatted));
  return formatted;
}

export function getWinners(): WinnerClaim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WINNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(DEFAULT_WINNERS));
      return DEFAULT_WINNERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_WINNERS;
  } catch {
    return DEFAULT_WINNERS;
  }
}

export async function syncWinnersFromSupabase(): Promise<WinnerClaim[]> {
  const remote = await fetchRemoteWinners();
  if (remote !== null) {
    const localStats = getUserStats();
    const myClaim = getMyPermanentClaimRecord();
    // Mark current user's card code if matching
    const mapped = remote.map((w) => ({
      ...w,
      isCurrentUser: localStats.claimedCardCode === w.cardCode || myClaim?.cardCode === w.cardCode,
    }));
    localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(mapped));
    return mapped;
  }
  return getWinners();
}

export function getRemainingWinnerSlots(): number {
  const winners = getWinners();
  return Math.max(0, 5 - winners.length);
}

// -------------------------------------------------------------
// PERMANENT IP RESTRICTION LOGIC (1 CLAIM PER IP EVER)
// -------------------------------------------------------------

export function getLocalPermanentIpClaims(): Record<string, IpClaimRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMANENT_IP_CLAIMS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function getMyPermanentClaimRecord(): IpClaimRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MY_PERMANENT_CLAIM);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveLocalPermanentIpClaim(record: IpClaimRecord): void {
  try {
    const map = getLocalPermanentIpClaims();
    map[record.ip] = record;
    localStorage.setItem(STORAGE_KEY_PERMANENT_IP_CLAIMS, JSON.stringify(map));
    localStorage.setItem(STORAGE_KEY_MY_PERMANENT_CLAIM, JSON.stringify(record));
  } catch (e) {
    console.error('Failed to save local permanent IP claim', e);
  }
}

/**
 * Checks whether an IP address has already claimed a reward card.
 * Checks both local permanent cache and remote Supabase permanent IP registry.
 */
export async function checkIfIpIsClaimed(ip: string): Promise<{ alreadyClaimed: boolean; record?: IpClaimRecord }> {
  if (!ip) {
    const fallbackIp = await fetchClientIp();
    ip = fallbackIp;
  }

  // 1. Check direct client permanent claim in this browser
  const myRecord = getMyPermanentClaimRecord();
  if (myRecord) {
    return { alreadyClaimed: true, record: myRecord };
  }

  // 2. Check local permanent IP map
  const localMap = getLocalPermanentIpClaims();
  if (localMap[ip]) {
    return { alreadyClaimed: true, record: localMap[ip] };
  }

  // 3. Check remote Supabase IP registry
  const remoteRecord = await checkRemoteIpClaimed(ip);
  if (remoteRecord) {
    // Cache locally
    saveLocalPermanentIpClaim(remoteRecord);
    return { alreadyClaimed: true, record: remoteRecord };
  }

  return { alreadyClaimed: false };
}

/**
 * Claims a prize with strict 1 IP = 1 Time limitation.
 * Even after game resets, previously claimed IPs will be rejected.
 */
export async function claimPrizeWithIp(
  userName: string, 
  score: number, 
  timeSpent: number,
  explicitIp?: string
): Promise<{ success: boolean; claim?: WinnerClaim; error?: string; existingRecord?: IpClaimRecord }> {
  const clientIp = explicitIp || (await fetchClientIp());

  // Strict 1 IP Check
  const check = await checkIfIpIsClaimed(clientIp);
  if (check.alreadyClaimed && check.record) {
    return {
      success: false,
      error: 'ALREADY_CLAIMED_BY_IP',
      existingRecord: check.record,
    };
  }

  const winners = getWinners();
  if (winners.length >= 5) {
    return {
      success: false,
      error: 'SLOTS_EXHAUSTED',
    };
  }

  const presetCards = getPresetRewardCards();
  const cardIndex = winners.length;
  const newCardCode = presetCards[cardIndex] || generate13DigitCardCode();

  const claim: WinnerClaim = {
    id: 'w-' + Date.now(),
    name: userName || 'Kingdom Warrior',
    claimedAt: new Date().toISOString(),
    cardCode: newCardCode,
    score: score,
    timeTakenSeconds: timeSpent,
    ipAddress: clientIp,
    isCurrentUser: true,
  };

  // 1. Update current winners list
  const updated = [claim, ...winners];
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(updated));
  
  // 2. Save user stats
  const stats = getUserStats();
  stats.claimedCardCode = newCardCode;
  saveUserStats(stats);

  // 3. Save permanent IP claim record locally (Will survive all resets!)
  const ipRecord: IpClaimRecord = {
    ip: clientIp,
    claimedAt: claim.claimedAt,
    cardCode: newCardCode,
    name: claim.name,
    score: score,
  };
  saveLocalPermanentIpClaim(ipRecord);

  // 4. Sync to Supabase in background (both winners list & permanent IP claims registry)
  saveRemoteWinner(claim);
  savePermanentRemoteIpClaim(ipRecord);

  return {
    success: true,
    claim,
  };
}

/**
 * Backward-compatible synchronous claimPrize wrapper
 */
export function claimPrize(userName: string, score: number, timeSpent: number): WinnerClaim | null {
  const winners = getWinners();
  if (winners.length >= 5) {
    return null;
  }

  const presetCards = getPresetRewardCards();
  const cardIndex = winners.length;
  const newCardCode = presetCards[cardIndex] || generate13DigitCardCode();

  const claim: WinnerClaim = {
    id: 'w-' + Date.now(),
    name: userName || 'Kingdom Warrior',
    claimedAt: new Date().toISOString(),
    cardCode: newCardCode,
    score: score,
    timeTakenSeconds: timeSpent,
    isCurrentUser: true,
  };

  const updated = [claim, ...winners];
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(updated));
  
  const stats = getUserStats();
  stats.claimedCardCode = newCardCode;
  saveUserStats(stats);

  fetchClientIp().then((ip) => {
    claim.ipAddress = ip;
    const ipRecord: IpClaimRecord = {
      ip,
      claimedAt: claim.claimedAt,
      cardCode: newCardCode,
      name: claim.name,
      score: score,
    };
    saveLocalPermanentIpClaim(ipRecord);
    saveRemoteWinner(claim);
    savePermanentRemoteIpClaim(ipRecord);
  });

  return claim;
}

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_STATS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  const initial: UserStats = {
    totalXp: 120,
    streakDays: 3,
    gamesCompleted: 1,
    badges: ['Seed of Faith', 'Kingdom Seeker'],
  };
  return initial;
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

/**
 * Resets the active winners board to open 5 slots.
 * CRITICAL: Permanent IP claims are NOT cleared by this reset.
 * An IP that already claimed will still be blocked from claiming again.
 */
export function resetWinnersToDefault(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(DEFAULT_WINNERS));
  clearRemoteWinners();
}

/**
 * Clears active claimed slots (5/5 open).
 * CRITICAL: Permanent IP claims are NOT cleared by this.
 */
export function clearAllWinners(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
  clearRemoteWinners();
}

/**
 * Resets user game data (score, hearts, stats).
 * CRITICAL: Permanent IP claims are NOT cleared by this.
 */
export function resetAllGameData(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEY_USER_STATS);
  clearRemoteWinners();
}

/**
 * Admin utility: Fetch count or list of permanently restricted IPs
 */
export async function getPermanentIpClaimsList(): Promise<IpClaimRecord[]> {
  const localMap = getLocalPermanentIpClaims();
  const remoteList = await fetchAllRemoteIpClaims();
  
  const merged: Record<string, IpClaimRecord> = { ...localMap };
  remoteList.forEach((r) => {
    if (r.ip) merged[r.ip] = r;
  });

  return Object.values(merged);
}

/**
 * Admin-only utility: Unblock all IP restrictions (explicit action only)
 */
export async function adminClearAllIpRestrictions(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY_PERMANENT_IP_CLAIMS);
  localStorage.removeItem(STORAGE_KEY_MY_PERMANENT_CLAIM);
  await clearAllRemoteIpClaims();
}


