import { createClient } from '@supabase/supabase-js';
import { WinnerClaim } from '../types';

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
    });

    if (error) {
      console.warn('Could not save winner to Supabase:', error.message);
      return false;
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
