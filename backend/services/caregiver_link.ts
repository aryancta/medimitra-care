/**
 * Caregiver share-link encoder/decoder.
 *
 * What this service does:
 *   Serialises the patient's current schedule into a compact, URL-safe
 *   base64 token so an adult child can open a read-only view at
 *   `/caregiver/[token]`. Everything is client-side; no server storage.
 *
 * Why it matters for SDG 3:
 *   Millions of urban Indian adults manage their rural parents' medications
 *   remotely. A single shareable link (no login, no email, no app install)
 *   is the lightest-weight way to pull them into the loop.
 */

import type { SeedScheduleEntry } from '@data/seed_patient';

export type CaregiverPayload = {
  patientName: string;
  generatedAt: string;
  schedule: Array<Pick<SeedScheduleEntry, 'brand' | 'ingredient' | 'strength' | 'slots' | 'meal' | 'streakDays'>>;
  riskLevel?: 'low' | 'moderate' | 'high';
  riskScore?: number;
};

function b64encode(str: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window
      .btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  return Buffer.from(str, 'utf8').toString('base64url');
}

function b64decode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const pad = padded + '==='.slice((padded.length + 3) % 4);
    return decodeURIComponent(escape(window.atob(pad)));
  }
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function encodeCaregiverPayload(p: CaregiverPayload): string {
  return b64encode(JSON.stringify(p));
}

export function decodeCaregiverPayload(token: string): CaregiverPayload | null {
  try {
    return JSON.parse(b64decode(token)) as CaregiverPayload;
  } catch {
    return null;
  }
}
