import { createClient } from '@supabase/supabase-js';
import { WinnerClaim, IpClaimRecord } from '../types';

const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://unbxzdfinweaifgkepum.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYnh6ZGZpbndlYWlmZ2tlcHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODk2NDAsImV4cCI6MjEwMjE2NTY0MH0.UmZEnqkdyzQHod86q32cmToJr_wnIMxuObrtaVYte9c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('winners').select('id').limit(1);
    // If error code is 42P01 (relation does not exist), table needs to be created, but connection itself works
    if (error && error.code !== 'PGRST301' && error.code !== '42P01') {
      console.warn('Supabase ping check:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
}

export async function fetchRemoteWinners(): Promise<WinnerClaim[] | null> {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('*')
      .order('claimed_at', { ascending: false })
      .limit(5);

    if (error) {
      console.warn('Could not fetch remote winners from Supabase:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name || 'Kingdom Warrior',
      claimedAt: row.claimed_at || new Date().toISOString(),
      cardCode: row.card_code,
      score: row.score || 10,
      timeTakenSeconds: row.time_taken_seconds || 0,
      ipAddress: row.ip_address || undefined,
      isCurrentUser: false,
    }));
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

export async function saveRemoteWinner(winner: WinnerClaim): Promise<boolean> {
  try {
    const { error } = await supabase.from('winners').insert({
      id: winner.id,
      name: winner.name,
      card_code: winner.cardCode,
      score: winner.score,
      time_taken_seconds: winner.timeTakenSeconds,
      claimed_at: winner.claimedAt,
      ip_address: winner.ipAddress || null,
    });

    if (error) {
      // If error is about missing ip_address column, retry without ip_address
      if (error.message?.includes('ip_address')) {
        await supabase.from('winners').insert({
          id: winner.id,
          name: winner.name,
          card_code: winner.cardCode,
          score: winner.score,
          time_taken_seconds: winner.timeTakenSeconds,
          claimed_at: winner.claimedAt,
        });
      } else {
        console.warn('Could not save winner to Supabase:', error.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('Supabase insert error:', err);
    return false;
  }
}

export async function clearRemoteWinners(): Promise<boolean> {
  try {
    const { error } = await supabase.from('winners').delete().neq('id', '');
    if (error) {
      console.warn('Could not clear remote winners on Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete error:', err);
    return false;
  }
}

/**
 * Permanent IP Claim Storage in Supabase
 * Stored in `ip_claims` table so game resets do not erase IP claim history.
 */
export async function savePermanentRemoteIpClaim(record: IpClaimRecord): Promise<boolean> {
  try {
    const { error } = await supabase.from('ip_claims').upsert({
      ip: record.ip,
      card_code: record.cardCode,
      name: record.name,
      score: record.score || 10,
      claimed_at: record.claimedAt || new Date().toISOString(),
    }, { onConflict: 'ip' });

    if (error) {
      console.warn('Could not record permanent IP claim to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase ip_claims insert error:', err);
    return false;
  }
}

export async function checkRemoteIpClaimed(ip: string): Promise<IpClaimRecord | null> {
  if (!ip) return null;

  try {
    // 1. Check dedicated ip_claims table
    const { data: ipData, error: ipError } = await supabase
      .from('ip_claims')
      .select('*')
      .eq('ip', ip)
      .maybeSingle();

    if (!ipError && ipData) {
      return {
        ip: ipData.ip,
        claimedAt: ipData.claimed_at,
        cardCode: ipData.card_code,
        name: ipData.name,
        score: ipData.score,
      };
    }

    // 2. Also check if winners table contains this ip_address
    const { data: winnerData, error: winnerError } = await supabase
      .from('winners')
      .select('*')
      .eq('ip_address', ip)
      .limit(1);

    if (!winnerError && winnerData && winnerData.length > 0) {
      const w = winnerData[0];
      return {
        ip,
        claimedAt: w.claimed_at || new Date().toISOString(),
        cardCode: w.card_code,
        name: w.name,
        score: w.score,
      };
    }
  } catch (err) {
    console.warn('Error checking remote IP claim in Supabase:', err);
  }

  return null;
}

export async function fetchAllRemoteIpClaims(): Promise<IpClaimRecord[]> {
  try {
    const { data, error } = await supabase
      .from('ip_claims')
      .select('*')
      .order('claimed_at', { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        ip: d.ip,
        claimedAt: d.claimed_at,
        cardCode: d.card_code,
        name: d.name,
        score: d.score,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch all ip_claims error:', err);
  }
  return [];
}

export async function clearAllRemoteIpClaims(): Promise<boolean> {
  try {
    const { error } = await supabase.from('ip_claims').delete().neq('ip', '');
    if (error) {
      console.warn('Could not clear remote ip_claims on Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete ip_claims error:', err);
    return false;
  }
}

