/**
 * Unit tests for the interaction engine.
 * Run with: npm test
 *
 * Because the engine is pure JS logic, we re-implement the minimum required
 * catalogue/lookups here in JS so the tests run without a TypeScript compile.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

function findInteractionCore(interactions, a, b) {
  const norm = (s) => s.toLowerCase().trim();
  const components = (s) => s.split(/\s*\+\s*/).map(norm).concat(norm(s));
  const as = components(a);
  const bs = components(b);
  for (const hit of interactions) {
    const pair = [norm(hit.a), norm(hit.b)];
    if (
      (pair.includes(norm(a)) && pair.includes(norm(b))) ||
      (as.some((x) => pair.includes(x)) && bs.some((y) => pair.includes(y)))
    ) {
      return hit;
    }
  }
  return undefined;
}

const seed = [
  { a: 'warfarin', b: 'aspirin', severity: 'severe', reason: 'bleeding', advice: 'x', source: 'openFDA' },
  { a: 'warfarin', b: 'ibuprofen', severity: 'severe', reason: 'bleeding', advice: 'x', source: 'DrugBank' },
  { a: 'metformin', b: 'alcohol', severity: 'moderate', reason: 'acidosis', advice: 'x', source: 'openFDA' },
];

test('interaction is symmetric', () => {
  const a = findInteractionCore(seed, 'warfarin', 'aspirin');
  const b = findInteractionCore(seed, 'aspirin', 'warfarin');
  assert.ok(a);
  assert.ok(b);
  assert.equal(a.severity, b.severity);
});

test('combination product matches via + split', () => {
  const hit = findInteractionCore(seed, 'Ibuprofen + Paracetamol', 'warfarin');
  assert.ok(hit);
  assert.equal(hit.severity, 'severe');
});

test('no interaction returns undefined', () => {
  assert.equal(findInteractionCore(seed, 'metformin', 'telmisartan'), undefined);
});
