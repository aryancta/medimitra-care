/**
 * RxNorm REST client.
 *
 * What this service does:
 *   Normalizes a free-text brand or generic drug name (e.g. "Crocin") to the
 *   canonical RxNorm ingredient name ("Paracetamol") and RxCUI. Uses the
 *   free, key-less REST endpoint at rxnav.nlm.nih.gov (20 req/s rate limit).
 *
 * Why it matters for SDG 3:
 *   A standard RxCUI is the "passport" that lets us query openFDA and cross-
 *   check our interaction table consistently. Without it, two different
 *   records could refer to the same drug without us realizing.
 *
 * Demo-mode fallback:
 *   When the network is unavailable or the call fails, we transparently fall
 *   back to the bundled Indian medicines catalogue. The UI tells the user
 *   whether it used a live RxNorm answer or the cached one.
 */

import { findMedicine } from '@data/indian_medicines';

export type RxNormResolution = {
  /** What the user typed. */
  query: string;
  /** Canonical ingredient name from RxNorm (or the cache). */
  ingredient: string;
  /** RxNorm RxCUI. */
  rxcui: string;
  /** Whether this came from the live API or the offline cache. */
  source: 'rxnorm-live' | 'offline-cache';
};

const RXNAV_BASE = 'https://rxnav.nlm.nih.gov/REST';

/**
 * Resolve a free-text drug name to an RxNorm RxCUI.
 *
 * Attempts a live call; on any error, falls back to the seeded catalogue.
 * The function NEVER throws — callers can rely on a resolution always
 * coming back (possibly empty string for unknowns).
 */
export async function resolveRxNorm(query: string): Promise<RxNormResolution> {
  const trimmed = (query ?? '').trim();
  if (!trimmed) {
    return { query: trimmed, ingredient: '', rxcui: '', source: 'offline-cache' };
  }

  try {
    const url = `${RXNAV_BASE}/rxcui.json?name=${encodeURIComponent(trimmed)}&search=2`;
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const json = (await res.json()) as { idGroup?: { rxnormId?: string[]; name?: string } };
      const id = json.idGroup?.rxnormId?.[0];
      const name = json.idGroup?.name ?? trimmed;
      if (id) {
        return { query: trimmed, ingredient: name, rxcui: id, source: 'rxnorm-live' };
      }
    }
  } catch {
    // swallow; fall through to offline cache
  }

  const cached = findMedicine(trimmed);
  if (cached) {
    return { query: trimmed, ingredient: cached.ingredient, rxcui: cached.rxcui, source: 'offline-cache' };
  }

  return { query: trimmed, ingredient: trimmed, rxcui: '', source: 'offline-cache' };
}
