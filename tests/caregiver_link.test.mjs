import test from 'node:test';
import assert from 'node:assert/strict';

function b64encode(str) {
  return Buffer.from(str, 'utf8').toString('base64url');
}

function b64decode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function encode(p) {
  return b64encode(JSON.stringify(p));
}
function decode(token) {
  try {
    return JSON.parse(b64decode(token));
  } catch {
    return null;
  }
}

test('caregiver payload round-trips', () => {
  const payload = { patientName: 'Test', generatedAt: '2026-01-01T00:00:00Z', schedule: [] };
  const token = encode(payload);
  assert.deepEqual(decode(token), payload);
});

test('invalid token returns null', () => {
  assert.equal(decode('&&&invalid&&&'), null);
});
