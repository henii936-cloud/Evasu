import { WinnerClaim, UserStats } from '../types';
import { saveRemoteWinner, fetchRemoteWinners, clearRemoteWinners } from '../lib/supabase';

const STORAGE_KEY_WINNERS = 'hotk_winners_list_v1';
const STORAGE_KEY_USER_STATS = 'hotk_user_stats_v1';
const STORAGE_KEY_PRESET_CARDS = 'hotk_preset_reward_cards_v1';

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
    // Mark current user's card code if matching
    const mapped = remote.map((w) => ({
      ...w,
      isCurrentUser: localStats.claimedCardCode === w.cardCode,
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

export function claimPrize(userName: string, score: number, timeSpent: number): WinnerClaim | null {
  const winners = getWinners();
  if (winners.length >= 5) {
    return null; // All 5 prize slots taken!
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
  
  // Save to user stats
  const stats = getUserStats();
  stats.claimedCardCode = newCardCode;
  saveUserStats(stats);

  // Sync to Supabase in background
  saveRemoteWinner(claim);

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

export function resetWinnersToDefault(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(DEFAULT_WINNERS));
  clearRemoteWinners();
}

export function clearAllWinners(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
  clearRemoteWinners();
}

export function resetAllGameData(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEY_USER_STATS);
  clearRemoteWinners();
}

