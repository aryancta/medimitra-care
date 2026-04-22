/**
 * Browser-side API key storage.
 *
 * What this module provides:
 *   Tiny wrappers around `localStorage` that persist judge-supplied API
 *   keys under a namespaced key (`medimitra_api_keys`). Keys NEVER leave
 *   the browser except as an `x-user-*-key` header on the request that
 *   needs them.
 *
 * Why it matters:
 *   Hackathon judges need to swap in their own free-tier keys in under a
 *   minute, and they (rightly) don't want those keys logged or committed.
 *   This module is the single source of truth for that flow.
 */

export type ApiKeyName = 'gemini' | 'openfda' | 'huggingface';

const STORAGE_KEY = 'medimitra_api_keys';

export type ApiKeyBundle = Partial<Record<ApiKeyName, string>>;

export function readApiKeys(): ApiKeyBundle {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ApiKeyBundle;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function writeApiKeys(bundle: ApiKeyBundle): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    // quota or private mode — silently ignore; app degrades to demo mode
  }
}

export function clearApiKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

/**
 * Build the outbound request headers the Next.js route handlers expect.
 * Only adds a header when a key is actually present — absence is fine,
 * the server gracefully falls back to demo mode.
 */
export function buildKeyHeaders(bundle: ApiKeyBundle = readApiKeys()): Record<string, string> {
  const headers: Record<string, string> = {};
  if (bundle.gemini) headers['x-user-gemini-key'] = bundle.gemini;
  if (bundle.openfda) headers['x-user-openfda-key'] = bundle.openfda;
  if (bundle.huggingface) headers['x-user-huggingface-key'] = bundle.huggingface;
  return headers;
}
