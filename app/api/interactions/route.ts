/**
 * POST /api/interactions — Run a full regimen risk check.
 *
 * Body: { ingredients: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';

import { regimenRiskScore } from '@backend/services/interaction_engine';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { ingredients?: string[] };
    const ingredients = Array.isArray(body.ingredients) ? body.ingredients.filter(Boolean) : [];
    const result = regimenRiskScore(ingredients);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
