/**
 * Seed dataset of commonly-dispensed Indian medicine brands.
 *
 * What this module provides:
 *   A hand-curated catalogue of 12 best-selling generics/brands across India
 *   (Crocin, Dolo, Combiflam, Telma, Metformin SR, etc.) with their RxNorm
 *   identifiers, dosage forms, typical indications, and the pictogram key
 *   used by the schedule view.
 *
 * Why it matters for SDG 3:
 *   Indian medicine strips look dramatically different from US ones —
 *   different fonts, bilingual labelling, batch stickers. Shipping this
 *   known-good set guarantees the 60-second demo always works even when
 *   the Gemini vision API is throttled, and more importantly gives rural
 *   community health workers an offline fallback when connectivity fails.
 *
 * Data provenance:
 *   Brand → active ingredient mapping cross-checked against India's CDSCO
 *   Essential Medicines List 2022. RxCUIs resolved via the free RxNorm
 *   REST API (rxnav.nlm.nih.gov). No proprietary data.
 */

export type IndianMedicine = {
  /** Brand name as printed on the strip (e.g. "Crocin Advance"). */
  brand: string;
  /** Canonical active ingredient (e.g. "Paracetamol"). */
  ingredient: string;
  /** Strength as it appears on the label (e.g. "500 mg"). */
  strength: string;
  /** RxNorm RxCUI for the ingredient — used for cross-API lookups. */
  rxcui: string;
  /** Human-readable therapy category (Pain, Diabetes, Cardiac…). */
  category: string;
  /** Plain-English indication for the elderly-user info card. */
  indication: string;
  /** Max safe daily dose in common units. */
  maxDailyDose: string;
  /** Pictogram icon key; see data/pictograms.ts. */
  pictogram: 'pill' | 'capsule' | 'syrup' | 'injection' | 'drops';
  /** Frequency hint used to pre-fill the schedule builder. */
  defaultFrequency: 'once' | 'twice' | 'thrice' | 'prn';
  /** Short bilingual tag (English / Hindi transliteration). */
  bilingualTag: string;
};

/**
 * Canonical list. Adding a new medicine here makes it instantly available
 * to the scanner, the schedule builder, and the interaction engine.
 */
export const INDIAN_MEDICINES: IndianMedicine[] = [
  {
    brand: 'Crocin Advance',
    ingredient: 'Paracetamol',
    strength: '500 mg',
    rxcui: '161',
    category: 'Pain & Fever',
    indication: 'Used to relieve mild-to-moderate pain and to bring down fever.',
    maxDailyDose: '4 tablets / day',
    pictogram: 'pill',
    defaultFrequency: 'thrice',
    bilingualTag: 'Pain & Fever · दर्द और बुखार',
  },
  {
    brand: 'Dolo 650',
    ingredient: 'Paracetamol',
    strength: '650 mg',
    rxcui: '161',
    category: 'Pain & Fever',
    indication: 'Higher-strength paracetamol widely used for fevers in adults.',
    maxDailyDose: '4 tablets / day',
    pictogram: 'pill',
    defaultFrequency: 'thrice',
    bilingualTag: 'Pain & Fever · दर्द और बुखार',
  },
  {
    brand: 'Combiflam',
    ingredient: 'Ibuprofen + Paracetamol',
    strength: '400 mg + 325 mg',
    rxcui: '5640',
    category: 'Pain & Inflammation',
    indication: 'Combination pain reliever; take with food to protect the stomach.',
    maxDailyDose: '3 tablets / day',
    pictogram: 'pill',
    defaultFrequency: 'thrice',
    bilingualTag: 'Pain & Inflammation · सूजन',
  },
  {
    brand: 'Telma 40',
    ingredient: 'Telmisartan',
    strength: '40 mg',
    rxcui: '73494',
    category: 'Blood Pressure',
    indication: 'Lowers high blood pressure. Take at the same time each day.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'pill',
    defaultFrequency: 'once',
    bilingualTag: 'Blood Pressure · रक्तचाप',
  },
  {
    brand: 'Metformin SR 500',
    ingredient: 'Metformin',
    strength: '500 mg',
    rxcui: '6809',
    category: 'Diabetes',
    indication: 'Controls blood sugar in type-2 diabetes. Take with meals.',
    maxDailyDose: '4 tablets / day',
    pictogram: 'pill',
    defaultFrequency: 'twice',
    bilingualTag: 'Diabetes · मधुमेह',
  },
  {
    brand: 'Ecosprin 75',
    ingredient: 'Aspirin',
    strength: '75 mg',
    rxcui: '1191',
    category: 'Cardiac',
    indication: 'Low-dose aspirin to reduce heart-attack and stroke risk.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'pill',
    defaultFrequency: 'once',
    bilingualTag: 'Cardiac · हृदय',
  },
  {
    brand: 'Atorva 10',
    ingredient: 'Atorvastatin',
    strength: '10 mg',
    rxcui: '83367',
    category: 'Cholesterol',
    indication: 'Lowers cholesterol. Take in the evening for best effect.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'pill',
    defaultFrequency: 'once',
    bilingualTag: 'Cholesterol · कोलेस्ट्रॉल',
  },
  {
    brand: 'Warf 5',
    ingredient: 'Warfarin',
    strength: '5 mg',
    rxcui: '11289',
    category: 'Blood Thinner',
    indication: 'Blood-thinning medication. Needs regular INR monitoring.',
    maxDailyDose: 'As prescribed',
    pictogram: 'pill',
    defaultFrequency: 'once',
    bilingualTag: 'Blood Thinner · रक्त पतला',
  },
  {
    brand: 'Glycomet GP1',
    ingredient: 'Metformin + Glimepiride',
    strength: '500 mg + 1 mg',
    rxcui: '6809',
    category: 'Diabetes',
    indication: 'Combination diabetes pill. Do not skip a meal after taking.',
    maxDailyDose: '2 tablets / day',
    pictogram: 'pill',
    defaultFrequency: 'twice',
    bilingualTag: 'Diabetes · मधुमेह',
  },
  {
    brand: 'Pan 40',
    ingredient: 'Pantoprazole',
    strength: '40 mg',
    rxcui: '40790',
    category: 'Acidity',
    indication: 'Reduces stomach acid. Take 30 minutes before breakfast.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'capsule',
    defaultFrequency: 'once',
    bilingualTag: 'Acidity · अम्लता',
  },
  {
    brand: 'Thyronorm 50',
    ingredient: 'Levothyroxine',
    strength: '50 mcg',
    rxcui: '10582',
    category: 'Thyroid',
    indication: 'Thyroid hormone. Take on an empty stomach with water.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'pill',
    defaultFrequency: 'once',
    bilingualTag: 'Thyroid · थायरॉयड',
  },
  {
    brand: 'Azithral 500',
    ingredient: 'Azithromycin',
    strength: '500 mg',
    rxcui: '18631',
    category: 'Antibiotic',
    indication: 'Antibiotic. Finish the full course even if you feel better.',
    maxDailyDose: '1 tablet / day',
    pictogram: 'capsule',
    defaultFrequency: 'once',
    bilingualTag: 'Antibiotic · एंटीबायोटिक',
  },
];

/**
 * Case-insensitive fuzzy lookup by brand or ingredient. Returns the best
 * match or undefined. Exported so the scanner, Q&A assistant, and interaction
 * engine share exactly one resolution path.
 */
export function findMedicine(query: string): IndianMedicine | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().replace(/\s+/g, ' ').trim();
  const byBrand = INDIAN_MEDICINES.find((m) =>
    q.includes(m.brand.toLowerCase()) || m.brand.toLowerCase().includes(q),
  );
  if (byBrand) return byBrand;
  return INDIAN_MEDICINES.find((m) =>
    q.includes(m.ingredient.toLowerCase()) ||
    m.ingredient.toLowerCase().split(/[\s+]+/).some((w) => q.includes(w)),
  );
}
