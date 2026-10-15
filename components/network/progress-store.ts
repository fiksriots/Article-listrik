export const NETWORK_PROGRESS_KEY = 'fiks-network-progress-v1';
export function readNetworkProgress(): string[] {
  try { const value:unknown = JSON.parse(localStorage.getItem(NETWORK_PROGRESS_KEY) || '[]'); return Array.isArray(value) ? value.filter((x):x is string => typeof x === 'string') : []; } catch { return []; }
}
