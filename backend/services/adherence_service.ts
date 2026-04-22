/**
 * Adherence and streak computation.
 *
 * What this service does:
 *   Pure, testable helpers that convert a user's schedule + today's "taken"
 *   log into: dose timeline, next-dose-in-X-minutes, and a streak counter.
 *
 * Why it matters for SDG 3:
 *   Research shows up to 75% of elderly Indian patients are non-adherent to
 *   chronic medication. A gamified streak, even a trivial Duolingo-style
 *   one, materially nudges daily intake and gives the caregiver a single
 *   number to rally around.
 */

import { TIME_SLOT_PICTOGRAM, type TimeSlot } from '@data/pictograms';

export type TimelineEntry = {
  slot: TimeSlot;
  hour: number;
  glyph: string;
  english: string;
  hindi: string;
  items: Array<{
    scheduleId: string;
    brand: string;
    strength: string;
    taken: boolean;
  }>;
};

export type ScheduleLike = {
  id: string;
  brand: string;
  strength: string;
  slots: TimeSlot[];
  takenToday: TimeSlot[];
};

/**
 * Build a morning→night timeline of dose cards, one per slot that has at
 * least one medicine scheduled.
 */
export function buildTimeline(schedule: ScheduleLike[]): TimelineEntry[] {
  const slotOrder: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];
  return slotOrder
    .map((slot) => {
      const items = schedule
        .filter((s) => s.slots.includes(slot))
        .map((s) => ({
          scheduleId: s.id,
          brand: s.brand,
          strength: s.strength,
          taken: s.takenToday.includes(slot),
        }));
      if (!items.length) return null;
      return {
        slot,
        hour: TIME_SLOT_PICTOGRAM[slot].hour,
        glyph: TIME_SLOT_PICTOGRAM[slot].glyph,
        english: TIME_SLOT_PICTOGRAM[slot].english,
        hindi: TIME_SLOT_PICTOGRAM[slot].hindi,
        items,
      } satisfies TimelineEntry;
    })
    .filter((x): x is TimelineEntry => Boolean(x));
}

/**
 * Given the current time (defaults to `new Date()`), return the next dose
 * that hasn't been marked taken yet. Useful for the big "Next dose" CTA on
 * the home screen.
 */
export function nextDose(schedule: ScheduleLike[], now: Date = new Date()): {
  brand: string;
  slot: TimeSlot;
  minutesAway: number;
} | null {
  const slotOrder: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let best: { brand: string; slot: TimeSlot; minutesAway: number } | null = null;
  for (const slot of slotOrder) {
    const slotMinutes = TIME_SLOT_PICTOGRAM[slot].hour * 60;
    const due = schedule.find((s) => s.slots.includes(slot) && !s.takenToday.includes(slot));
    if (!due) continue;
    const delta = slotMinutes - currentMinutes;
    if (delta < -60) continue; // already missed by >1h
    if (!best || Math.abs(delta) < Math.abs(best.minutesAway)) {
      best = { brand: due.brand, slot, minutesAway: delta };
    }
  }
  return best;
}

/**
 * Compute the best (max) streak across all items in the schedule.
 * A gentle signal: users react better to "your streak" than to raw % stats.
 */
export function bestStreak(schedule: Array<{ streakDays: number }>): number {
  return schedule.reduce((acc, s) => Math.max(acc, s.streakDays), 0);
}

/**
 * Total doses taken today / total doses scheduled today.
 */
export function adherenceToday(schedule: ScheduleLike[]): { taken: number; total: number; pct: number } {
  const total = schedule.reduce((acc, s) => acc + s.slots.length, 0);
  const taken = schedule.reduce((acc, s) => acc + s.takenToday.length, 0);
  const pct = total === 0 ? 0 : Math.round((taken / total) * 100);
  return { taken, total, pct };
}
