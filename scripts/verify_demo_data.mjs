/**
 * scripts/verify_demo_data.mjs
 *
 * Dev-only smoke test: ensures every seeded medicine has at least one FDA
 * label card entry (live or cached) so the scanner always produces a
 * complete info card. Run with: node scripts/verify_demo_data.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const meds = readFileSync(resolve(here, '../data/indian_medicines.ts'), 'utf8');
const labels = readFileSync(resolve(here, '../data/openfda_label_cache.ts'), 'utf8');

const ingredients = Array.from(meds.matchAll(/ingredient:\s*'([^']+)'/g)).map((m) => m[1].toLowerCase());
const labelKeys = Array.from(labels.matchAll(/^\s{2}([a-z ]+\+?\s?[a-z ]*):/gm)).map((m) => m[1].trim());

const missing = [];
for (const ing of ingredients) {
  const anyMatch = labelKeys.some((k) => ing.includes(k) || k.includes(ing.split(' +')[0]));
  if (!anyMatch) missing.push(ing);
}

if (missing.length) {
  console.error('Missing label cache entries for:', missing);
  process.exit(1);
} else {
  console.log(`OK — ${ingredients.length} seeded medicines mapped to label cache.`);
}
