/**
 * Google Gemini 2.5 Flash client.
 *
 * What this service does:
 *   Two capabilities:
 *     1. `extractMedicineFromImage` — takes a base64-encoded photo of an
 *        Indian medicine strip and returns a structured {brand, strength}
 *        object by calling the multimodal Gemini endpoint.
 *     2. `askAboutMedicine` — answers a patient's natural-language question
 *        about a given medicine in Hindi or English, grounded in the label
 *        card we've already fetched.
 *
 * Why it matters for SDG 3:
 *   Gemini Flash's multimodal input removes the need for an OCR + NER
 *   pipeline, shaving the "scan → safe-use info" journey down to a few
 *   seconds — a must-have for the 60-second live demo and, more importantly,
 *   for elderly users with limited patience for fiddly apps.
 *
 * Demo-mode fallback:
 *   When no API key is configured or the call fails, this module returns a
 *   deterministic response that still lets the app demonstrate its full
 *   workflow using the bundled Indian medicine catalogue. The caller can
 *   tell the difference via the `source` field.
 */

import { INDIAN_MEDICINES, findMedicine, type IndianMedicine } from '@data/indian_medicines';
import { findLabelCard } from '@data/openfda_label_cache';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export type ExtractedMedicine = {
  brand: string;
  ingredient: string;
  strength: string;
  confidence: number;
  source: 'gemini-live' | 'demo-mode';
};

/**
 * Ask Gemini to read an Indian medicine strip photo.
 *
 * @param imageBase64 base64 payload without the `data:` prefix
 * @param mimeType e.g. image/jpeg, image/png
 * @param apiKey user-provided key (from /settings). If absent the function
 *               returns a demo-mode response and the UI shows a banner.
 */
export async function extractMedicineFromImage(
  imageBase64: string,
  mimeType: string,
  apiKey: string | undefined,
): Promise<ExtractedMedicine> {
  if (!apiKey) {
    return demoScan();
  }

  const prompt = `You are MediMitra Care, an assistant reading an Indian medicine strip photo.
Return STRICT JSON: {"brand": string, "ingredient": string, "strength": string}.
The brand must be the text printed most prominently on the strip.
The ingredient is the active molecule (may be a combination e.g. "Ibuprofen + Paracetamol").
The strength is the printed dose per tablet (e.g. "500 mg", "40 mcg").
If nothing readable, return an empty object {}. Do not add commentary.`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  try {
    const res = await fetch(`${GEMINI_URL(GEMINI_MODEL)}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return demoScan();
    const json = await res.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return demoScan();
    const parsed = safeParseJson(text);
    if (!parsed || typeof parsed !== 'object') return demoScan();
    const brand = String((parsed as any).brand ?? '').trim();
    const ingredient = String((parsed as any).ingredient ?? '').trim();
    const strength = String((parsed as any).strength ?? '').trim();
    if (!brand && !ingredient) return demoScan();
    return {
      brand,
      ingredient: ingredient || findMedicine(brand)?.ingredient || brand,
      strength,
      confidence: 0.88,
      source: 'gemini-live',
    };
  } catch {
    return demoScan();
  }
}

/**
 * Answer a patient's question about a given medicine. Grounded with the
 * openFDA label card so the model has regulatory-accurate context.
 */
export async function askAboutMedicine(
  question: string,
  medicineName: string,
  apiKey: string | undefined,
  language: 'en' | 'hi' = 'en',
): Promise<{ answer: string; source: 'gemini-live' | 'demo-mode' }> {
  const label = findLabelCard(medicineName);
  if (!apiKey) {
    return { answer: demoAnswer(question, medicineName, label, language), source: 'demo-mode' };
  }
  const grounding = label
    ? `Indication: ${label.indication}\nWarnings: ${label.warnings.join(' | ')}\nContraindications: ${label.contraindications.join(' | ')}`
    : 'No FDA label context available.';
  const system = language === 'hi'
    ? 'You are MediMitra Care, a compassionate medicine helper. Answer in Hindi (Devanagari), 2-3 short sentences, end with "Always consult your doctor."'
    : 'You are MediMitra Care, a compassionate medicine helper. Answer in simple English, 2-3 short sentences, end with "Always consult your doctor."';

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${system}\n\nMedicine: ${medicineName}\nContext (from FDA label):\n${grounding}\n\nPatient question: ${question}` },
        ],
      },
    ],
    generationConfig: { temperature: 0.4 },
  };
  try {
    const res = await fetch(`${GEMINI_URL(GEMINI_MODEL)}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { answer: demoAnswer(question, medicineName, label, language), source: 'demo-mode' };
    const json = await res.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return { answer: demoAnswer(question, medicineName, label, language), source: 'demo-mode' };
    return { answer: text.trim(), source: 'gemini-live' };
  } catch {
    return { answer: demoAnswer(question, medicineName, label, language), source: 'demo-mode' };
  }
}

function demoScan(): ExtractedMedicine {
  const pick = pickDemoMedicine();
  return {
    brand: pick.brand,
    ingredient: pick.ingredient,
    strength: pick.strength,
    confidence: 0.82,
    source: 'demo-mode',
  };
}

let demoCursor = 0;
function pickDemoMedicine(): IndianMedicine {
  const preferred = ['Crocin Advance', 'Combiflam', 'Telma 40', 'Metformin SR 500'];
  const name = preferred[demoCursor % preferred.length];
  demoCursor += 1;
  return findMedicine(name) ?? INDIAN_MEDICINES[0];
}

function demoAnswer(
  question: string,
  medicineName: string,
  label: ReturnType<typeof findLabelCard>,
  language: 'en' | 'hi',
): string {
  const q = question.toLowerCase();
  if (language === 'hi') {
    if (q.includes('miss') || q.includes('भूल')) {
      return `${medicineName} की खुराक भूल जाने पर जैसे ही याद आए ले लें। अगर अगली खुराक का समय नज़दीक है तो भूली हुई खुराक छोड़ दें। डॉक्टर से ज़रूर सलाह लें।`;
    }
    return `${medicineName} ${label?.indication ?? 'आपकी निर्धारित दवा'} के लिए दी जाती है। इसे अपने डॉक्टर के बताए अनुसार ही लें। डॉक्टर से ज़रूर सलाह लें।`;
  }
  if (q.includes('miss')) {
    return `If you miss a dose of ${medicineName}, take it as soon as you remember. If it's almost time for the next dose, skip the missed one — never double up. Always consult your doctor.`;
  }
  if (q.includes('milk') || q.includes('food')) {
    return `${medicineName} is usually fine with food unless your label says "empty stomach". ${label?.warnings?.[0] ?? ''} Always consult your doctor.`;
  }
  return `${medicineName}: ${label?.indication ?? 'prescribed for your condition'}. ${label?.warnings?.[0] ?? ''} Always consult your doctor.`;
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
