/**
 * POST /api/ask — Conversational Q&A about a specific medicine.
 *
 * Request body: { question: string; medicine?: string; language?: 'en' | 'hi' }
 * Headers: optional x-user-gemini-key
 *
 * Response: { answer: string; source: 'gemini-live' | 'demo-mode'; mentions: DrugMention[] }
 */

import { NextRequest, NextResponse } from 'next/server';

import { askAboutMedicine } from '@backend/services/gemini_service';
import { extractDrugs } from '@ml/ner_rules';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      question?: string;
      medicine?: string;
      language?: 'en' | 'hi';
    };
    if (!body.question?.trim()) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 });
    }
    const geminiKey = req.headers.get('x-user-gemini-key') ?? undefined;
    const mentions = extractDrugs(body.question);
    const medicineName = body.medicine || mentions[0]?.canonical || 'the medicine you asked about';

    const { answer, source } = await askAboutMedicine(
      body.question,
      medicineName,
      geminiKey,
      body.language ?? 'en',
    );

    return NextResponse.json({ answer, source, mentions });
  } catch {
    return NextResponse.json({ error: 'Could not answer.' }, { status: 500 });
  }
}
