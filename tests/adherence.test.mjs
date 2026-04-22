import test from 'node:test';
import assert from 'node:assert/strict';

function adherenceToday(schedule) {
  const total = schedule.reduce((acc, s) => acc + s.slots.length, 0);
  const taken = schedule.reduce((acc, s) => acc + s.takenToday.length, 0);
  const pct = total === 0 ? 0 : Math.round((taken / total) * 100);
  return { taken, total, pct };
}

test('adherence with empty schedule is 0%', () => {
  const { pct } = adherenceToday([]);
  assert.equal(pct, 0);
});

test('adherence computes ratio', () => {
  const { taken, total, pct } = adherenceToday([
    { slots: ['morning', 'night'], takenToday: ['morning'] },
    { slots: ['morning'], takenToday: ['morning'] },
  ]);
  assert.equal(taken, 2);
  assert.equal(total, 3);
  assert.equal(pct, 67);
});
