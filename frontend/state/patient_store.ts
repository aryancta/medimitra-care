/**
 * Zustand store: patient medicine list + per-slot "taken today" log.
 *
 * What this store does:
 *   Single client-side source of truth for the logged-in user's medicines.
 *   Persisted to `localStorage` under `medimitra_patient_state` so refreshes
 *   and demos keep their state. Seeded from `SEED_SCHEDULE` on first run.
 *
 * Why it matters for SDG 3:
 *   All personal health data stays in the browser — no server round-trip,
 *   no backend database — which respects privacy and keeps the app usable
 *   offline.
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { SEED_SCHEDULE, SEED_PATIENT, type SeedScheduleEntry } from '@data/seed_patient';
import type { TimeSlot, MealRelation } from '@data/pictograms';

export type MedicineEntry = {
  id: string;
  brand: string;
  ingredient: string;
  strength: string;
  rxcui: string;
  slots: TimeSlot[];
  meal: MealRelation;
  streakDays: number;
  takenToday: TimeSlot[];
  addedAt: string;
};

type PatientState = {
  patientName: string;
  language: 'en' | 'hi';
  medicines: MedicineEntry[];
  addMedicine: (m: Omit<MedicineEntry, 'addedAt' | 'streakDays' | 'takenToday'>) => void;
  removeMedicine: (id: string) => void;
  markTaken: (id: string, slot: TimeSlot) => void;
  markMissed: (id: string, slot: TimeSlot) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  resetToSeed: () => void;
};

function toEntry(e: SeedScheduleEntry): MedicineEntry {
  return { ...e, addedAt: new Date(Date.now() - 86_400_000 * 3).toISOString() };
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patientName: SEED_PATIENT.name,
      language: 'en',
      medicines: SEED_SCHEDULE.map(toEntry),
      addMedicine: (m) =>
        set((s) => ({
          medicines: [
            ...s.medicines,
            { ...m, streakDays: 0, takenToday: [], addedAt: new Date().toISOString() },
          ],
        })),
      removeMedicine: (id) =>
        set((s) => ({ medicines: s.medicines.filter((m) => m.id !== id) })),
      markTaken: (id, slot) =>
        set((s) => ({
          medicines: s.medicines.map((m) => {
            if (m.id !== id) return m;
            if (m.takenToday.includes(slot)) return m;
            const allTakenToday = [...m.takenToday, slot].length === m.slots.length;
            return {
              ...m,
              takenToday: [...m.takenToday, slot],
              streakDays: allTakenToday ? m.streakDays + 1 : m.streakDays,
            };
          }),
        })),
      markMissed: (id, slot) =>
        set((s) => ({
          medicines: s.medicines.map((m) =>
            m.id === id
              ? { ...m, takenToday: m.takenToday.filter((t) => t !== slot), streakDays: Math.max(0, m.streakDays - 1) }
              : m,
          ),
        })),
      setLanguage: (language) => set({ language }),
      resetToSeed: () =>
        set({
          patientName: SEED_PATIENT.name,
          language: 'en',
          medicines: SEED_SCHEDULE.map(toEntry),
        }),
    }),
    {
      name: 'medimitra_patient_state',
      storage: createJSONStorage(() => (typeof window === 'undefined' ? (undefined as any) : window.localStorage)),
      version: 1,
    },
  ),
);
