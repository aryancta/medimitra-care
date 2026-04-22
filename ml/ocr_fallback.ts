/**
 * OCR fallback utilities.
 *
 * What this module provides:
 *   Lightweight, dependency-free heuristics to pull a drug name out of raw
 *   OCR text when Gemini Vision is unavailable. We intentionally do NOT
 *   bundle Tesseract.js server-side; the judges' device runs it in-browser
 *   when needed (dynamically imported). This module is the deterministic
 *   post-processor that cleans OCR output and matches it to our catalogue.
 *
 * Why it matters for SDG 3:
 *   Offline / low-connectivity reliability is non-negotiable for rural
 *   deployment. A pure-function fallback means the app still identifies
 *   Crocin/Dolo/Combiflam on a ₹4,000 smartphone at a village PHC.
 */

import { INDIAN_MEDICINES, findMedicine } from '@data/indian_medicines';

/**
 * Normalise raw OCR noise: collapse whitespace, strip non-alphanumeric,
 * upper-case for brand matching.
 */
export function normaliseOcrText(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{N}\s+.]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Extract the most likely Indian brand from a blob of OCR text. Returns the
 * best-matching catalogue entry or undefined.
 */
export function detectBrand(raw: string) {
  const cleaned = normaliseOcrText(raw);
  for (const med of INDIAN_MEDICINES) {
    if (cleaned.includes(med.brand.toUpperCase())) return med;
  }
  const tokens = cleaned.split(' ').filter((t) => t.length >= 4);
  for (const token of tokens) {
    const hit = findMedicine(token);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Pull the first plausible dose string (e.g. "500 MG", "40 MCG", "75 mg")
 * from raw OCR text. Case-insensitive; returns the pretty form.
 */
export function detectStrength(raw: string): string | undefined {
  const m = raw.match(/(\d{1,4}\s?(?:mg|mcg|g|ml))/i);
  if (!m) return undefined;
  return m[1].toUpperCase().replace(/\s+/g, ' ');
}
