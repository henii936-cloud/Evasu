import { WinnerClaim, UserStats } from '../types';

const STORAGE_KEY_WINNERS = 'hotk_winners_list_v1';
const STORAGE_KEY_USER_STATS = 'hotk_user_stats_v1';

// Initial default winners (0 claimed out of 5 total, so all 5 remain available)
const DEFAULT_WINNERS: WinnerClaim[] = [];

export function generate13DigitCardCode(): string {
  // Generates a 13-digit card formatted as XXXX-XXXX-XXXX-X
  const d = () => Math.floor(Math.random() * 9000 + 1000).toString();
  const last = Math.floor(Math.random() * 9 + 1).toString();
  return `${d()}-${d()}-${d()}-${last}`;
}

export function getWinners(): WinnerClaim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WINNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(DEFAULT_WINNERS));
      return DEFAULT_WINNERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WINNERS;
  }
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

  const newCardCode = generate13DigitCardCode();
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
}

export function clearAllWinners(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
}

export function resetAllGameData(): void {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEY_USER_STATS);
}
