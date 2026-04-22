/**
 * Default seed patient used to populate the app on first load.
 *
 * Why it matters for SDG 3:
 *   Judges (and first-time users) should land on a populated screen so the
 *   app's value is obvious in under 10 seconds — not on an empty "add your
 *   first medicine" shell.
 */

import type { TimeSlot, MealRelation } from './pictograms';

export type SeedScheduleEntry = {
  id: string;
  brand: string;
  ingredient: string;
  strength: string;
  rxcui: string;
  slots: TimeSlot[];
  meal: MealRelation;
  streakDays: number;
  takenToday: TimeSlot[];
};

export const SEED_PATIENT = {
  name: 'Rameshwari Devi',
  ageYears: 68,
  language: 'hi-IN',
  conditions: ['Hypertension', 'Type-2 Diabetes', 'Atrial Fibrillation'],
  caregiverName: 'Aryan (son)',
  caregiverPhone: '+91 90000 00000',
};

export const SEED_SCHEDULE: SeedScheduleEntry[] = [
  {
    id: 'seed-telma',
    brand: 'Telma 40',
    ingredient: 'Telmisartan',
    strength: '40 mg',
    rxcui: '73494',
    slots: ['morning'],
    meal: 'after-meal',
    streakDays: 12,
    takenToday: ['morning'],
  },
  {
    id: 'seed-metformin',
    brand: 'Metformin SR 500',
    ingredient: 'Metformin',
    strength: '500 mg',
    rxcui: '6809',
    slots: ['morning', 'night'],
    meal: 'with-meal',
    streakDays: 21,
    takenToday: ['morning'],
  },
  {
    id: 'seed-warfarin',
    brand: 'Warf 5',
    ingredient: 'Warfarin',
    strength: '5 mg',
    rxcui: '11289',
    slots: ['night'],
    meal: 'after-meal',
    streakDays: 7,
    takenToday: [],
  },
];
