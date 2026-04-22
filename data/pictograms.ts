/**
 * Pictogram catalogue for the schedule view.
 *
 * What this module provides:
 *   Mapping from abstract schedule slots (morning, afternoon, evening,
 *   night, with-meal, empty-stomach) to emoji glyphs and short bilingual
 *   captions. Intentionally emoji-based so the app works on any device
 *   without loading extra icon fonts — critical in low-bandwidth rural PHCs.
 *
 * Why it matters for SDG 3:
 *   Research (Apte et al., 2025) shows that elderly users with low literacy
 *   remember pictogram-first dosing schedules up to 2× more reliably than
 *   text-only reminders. Pictograms are therefore a direct adherence lever.
 */

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';
export type MealRelation = 'before-meal' | 'with-meal' | 'after-meal' | 'any';

export const TIME_SLOT_PICTOGRAM: Record<TimeSlot, { glyph: string; english: string; hindi: string; hour: number }> = {
  morning: { glyph: '🌅', english: 'Morning', hindi: 'सुबह', hour: 8 },
  afternoon: { glyph: '☀️', english: 'Afternoon', hindi: 'दोपहर', hour: 13 },
  evening: { glyph: '🌇', english: 'Evening', hindi: 'शाम', hour: 18 },
  night: { glyph: '🌙', english: 'Night', hindi: 'रात', hour: 22 },
};

export const MEAL_PICTOGRAM: Record<MealRelation, { glyph: string; english: string; hindi: string }> = {
  'before-meal': { glyph: '🥣', english: 'Before meal', hindi: 'खाने से पहले' },
  'with-meal': { glyph: '🍽️', english: 'With meal', hindi: 'खाने के साथ' },
  'after-meal': { glyph: '🍛', english: 'After meal', hindi: 'खाने के बाद' },
  any: { glyph: '💧', english: 'Any time', hindi: 'किसी भी समय' },
};

export const FORM_PICTOGRAM = {
  pill: '💊',
  capsule: '💊',
  syrup: '🧴',
  injection: '💉',
  drops: '💧',
} as const;

/**
 * Default dose-slot plan for a given frequency hint.
 */
export function defaultSlotsFor(freq: 'once' | 'twice' | 'thrice' | 'prn'): TimeSlot[] {
  if (freq === 'once') return ['morning'];
  if (freq === 'twice') return ['morning', 'night'];
  if (freq === 'thrice') return ['morning', 'afternoon', 'night'];
  return [];
}
