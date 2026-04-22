/**
 * GET /api/drug?name=... — Look up a single drug's canonical info.
 *
 * Useful for future integrations and already used by CLI smoke tests. Returns
 * RxNorm resolution + openFDA label card in one response.
 */

import { NextRequest, NextResponse } from 'next/server';

import { resolveRxNorm } from '@backend/services/rxnorm_service';
import { fetchLabelCard } from '@backend/services/openfda_service';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');
  if (!name) {
    return NextResponse.json({ error: 'name query parameter required' }, { status: 400 });
  }
  const rx = await resolveRxNorm(name);
  const label = await fetchLabelCard(rx.ingredient, req.headers.get('x-user-openfda-key') ?? undefined);
  return NextResponse.json({ rx, label });
}
