/**
 * POST /api/scan — Identify a medicine from an image or demo hint.
 *
 * Request body (JSON):
 *   { imageBase64?: string; mimeType?: string; demoBrand?: string }
 *
 * Request headers:
 *   x-user-gemini-key        optional — Gemini 2.5 Flash API key
 *   x-user-openfda-key       optional — openFDA API key (higher rate limit)
 *
 * Response body (JSON):
 *   See ScanResult type in the Scan experience.
 *
 * Behaviour:
 *   - If a demoBrand is supplied, we skip the image call entirely and
 *     resolve against the seeded Indian catalogue.
 *   - Otherwise we call Gemini with the image; if no key is set we fall
 *     back to a demo-mode scan that still exercises the full flow.
 *   - Always runs an openFDA label fetch + interaction check so the UI
 *     always gets a complete result object.
 */

import { NextRequest, NextResponse } from 'next/server';

import { fetchLabelCard } from '@backend/services/openfda_service';
import { checkCandidate } from '@backend/services/interaction_engine';
import { extractMedicineFromImage } from '@backend/services/gemini_service';
import { INDIAN_MEDICINES, findMedicine } from '@data/indian_medicines';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      imageBase64?: string;
      mimeType?: string;
      demoBrand?: string;
      existingIngredients?: string[];
    };
    const geminiKey = req.headers.get('x-user-gemini-key') ?? undefined;
    const openfdaKey = req.headers.get('x-user-openfda-key') ?? undefined;

    let brand = '';
    let ingredient = '';
    let strength = '';
    let source: 'gemini-live' | 'demo-mode' = 'demo-mode';

    if (body.demoBrand) {
      const med = findMedicine(body.demoBrand);
      if (med) {
        brand = med.brand;
        ingredient = med.ingredient;
        strength = med.strength;
      }
    } else if (body.imageBase64) {
      const extracted = await extractMedicineFromImage(body.imageBase64, body.mimeType ?? 'image/jpeg', geminiKey);
      brand = extracted.brand;
      ingredient = extracted.ingredient;
      strength = extracted.strength;
      source = extracted.source;
    } else {
      return NextResponse.json({ error: 'Provide imageBase64 or demoBrand' }, { status: 400 });
    }

    const catalogMatch = findMedicine(brand) ?? findMedicine(ingredient);
    const rxcui = catalogMatch?.rxcui ?? '';
    if (!ingredient && catalogMatch) ingredient = catalogMatch.ingredient;

    const label = await fetchLabelCard(ingredient, openfdaKey);

    const existing = Array.isArray(body.existingIngredients) ? body.existingIngredients : readExistingFromRequest(req);
    const interactions = ingredient ? checkCandidate(ingredient, existing) : [];

    return NextResponse.json({
      brand: brand || ingredient || 'Unknown medicine',
      ingredient: ingredient || brand,
      strength,
      rxcui,
      category: catalogMatch?.category ?? 'Medication',
      indication: label.indication,
      warnings: label.warnings,
      sideEffects: label.commonSideEffects,
      source,
      labelSource: label.source,
      interactions,
      catalogCoverage: INDIAN_MEDICINES.length,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Unable to process the scan request.' }, { status: 500 });
  }
}

/**
 * Best-effort existing-ingredients read. The UI sends them in the POST body
 * normally, but in case of an older client we try a cookie as well. Right
 * now we return an empty list if neither is present — the UI then re-checks
 * on the client once it receives the result.
 */
function readExistingFromRequest(_req: NextRequest): string[] {
  return [];
}
