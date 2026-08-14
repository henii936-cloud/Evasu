/**
 * Client IP Detection and Device Fingerprinting Utility
 * Provides multi-provider IP resolution with fallback to device signature.
 */

let cachedIp: string | null = null;

export async function fetchClientIp(): Promise<string> {
  if (cachedIp) return cachedIp;

  // Try Provider 1: api64.ipify.org (supports IPv4 and IPv6)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api64.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip && typeof data.ip === 'string') {
        cachedIp = data.ip.trim();
        return cachedIp;
      }
    }
  } catch {
    // Continue to fallback
  }

  // Try Provider 2: api.ipify.org
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip && typeof data.ip === 'string') {
        cachedIp = data.ip.trim();
        return cachedIp;
      }
    }
  } catch {
    // Continue to fallback
  }

  // Try Provider 3: api.db-ip.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.db-ip.com/v2/free/myip', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ipAddress && typeof data.ipAddress === 'string') {
        cachedIp = data.ipAddress.trim();
        return cachedIp;
      }
    }
  } catch {
    // Continue to fallback
  }

  // Try Provider 4: icanhazip.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://icanhazip.com', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length >= 7) {
        cachedIp = text.trim();
        return cachedIp;
      }
    }
  } catch {
    // Continue to fallback
  }

  // Fallback: Persistent device client ID
  const fallbackId = getOrCreateDeviceFingerprint();
  cachedIp = fallbackId;
  return fallbackId;
}

export function getOrCreateDeviceFingerprint(): string {
  const STORAGE_KEY = 'hotk_permanent_device_id_v1';
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) {
      return existing;
    }
  } catch {}

  const nav = typeof navigator !== 'undefined' ? navigator : ({} as any);
  const screenObj = typeof screen !== 'undefined' ? screen : ({} as any);

  const rawSeed = [
    nav.userAgent || '',
    nav.language || '',
    screenObj.width || '',
    screenObj.height || '',
    screenObj.colorDepth || '',
    new Date().getTimezoneOffset(),
    Math.random().toString(36).substring(2, 10),
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    const char = rawSeed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  const generated = `dev-${Math.abs(hash).toString(16)}-${Date.now().toString(36)}`;
  try {
    localStorage.setItem(STORAGE_KEY, generated);
  } catch {}

  return generated;
}

export function maskIp(ip: string): string {
  if (!ip) return 'Unknown IP';
  if (ip.startsWith('dev-')) {
    return 'Device #' + ip.slice(4, 12).toUpperCase();
  }
  // IPv4 masking
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }
  // IPv6 masking
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:****:****`;
    }
  }
  return ip;
}
