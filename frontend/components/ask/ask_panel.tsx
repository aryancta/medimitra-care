/**
 * Chat-style Ask panel.
 */

'use client';

import * as React from 'react';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Input, Label, Textarea } from '@frontend/components/ui/input';
import { useToast } from '@frontend/components/ui/toast';
import { buildKeyHeaders } from '@frontend/lib/api_keys_storage';
import { usePatientStore } from '@frontend/state/patient_store';

type ChatTurn = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  source?: 'gemini-live' | 'demo-mode';
};

const SUGGESTED = [
  'Can I take this with milk?',
  'What if I miss a dose?',
  'Is it safe with my other pills?',
  'इस दवा को खाने के साथ लेना है या पहले?',
];

export function AskPanel() {
  const medicines = usePatientStore((s) => s.medicines);
  const language = usePatientStore((s) => s.language);
  const [medicine, setMedicine] = React.useState(medicines[0]?.ingredient ?? 'Paracetamol');
  const [question, setQuestion] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [turns, setTurns] = React.useState<ChatTurn[]>([]);
  const { toast } = useToast();

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setQuestion('');
    setPending(true);
    setTurns((prev) => [...prev, { id: Date.now(), role: 'user', text: q }]);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...buildKeyHeaders() },
        body: JSON.stringify({ question: q, medicine, language }),
      });
      if (!res.ok) throw new Error('ask-failed');
      const data = (await res.json()) as { answer: string; source: 'gemini-live' | 'demo-mode' };
      setTurns((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: data.answer, source: data.source },
      ]);
    } catch {
      toast({ title: 'Could not answer', description: 'Try again in a moment.', tone: 'error' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Which medicine?</CardTitle>
          <p className="text-sm text-ink-muted">We&apos;ll ground every answer in that medicine&apos;s FDA label.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="med-input">Medicine name</Label>
          <Input
            id="med-input"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="e.g. Paracetamol"
          />
          <div className="grid gap-2 pt-2">
            {(medicines.length ? medicines : []).slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => setMedicine(m.ingredient)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-teal-300"
              >
                <div className="font-medium text-ink">{m.brand}</div>
                <div className="text-xs text-ink-muted">{m.ingredient} · {m.strength}</div>
              </button>
            ))}
          </div>
          <div className="pt-2 text-xs text-ink-muted">
            Language: {language === 'hi' ? 'हिंदी' : 'English'} · change from the schedule page.
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversation</CardTitle>
            <Badge tone="info">MediMitra</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[480px] space-y-3 overflow-y-auto scrollbar-thin pr-1" aria-live="polite">
            {turns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-ink-muted">
                Ask anything about <strong>{medicine}</strong> — dose timing, food, missed doses, side effects. Every answer ends with a reminder to consult your doctor.
              </div>
            ) : (
              turns.map((t) => (
                <div
                  key={t.id}
                  className={`max-w-[90%] rounded-2xl border px-4 py-3 text-sm ${
                    t.role === 'user'
                      ? 'ml-auto bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-ink border-slate-200'
                  }`}
                >
                  {t.text}
                  {t.role === 'assistant' && t.source ? (
                    <div className="mt-2 text-[11px] uppercase tracking-wide text-ink-muted">
                      {t.source === 'gemini-live' ? 'Gemini 2.5 Flash' : 'Demo mode · offline label'}
                    </div>
                  ) : null}
                </div>
              ))
            )}
            {pending ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink-muted">
                <span className="inline-block h-2 w-2 animate-pulse-soft rounded-full bg-teal-500" />
                MediMitra is typing…
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-ink hover:border-teal-300"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask about ${medicine}…`}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(question);
                }
              }}
            />
            <Button onClick={() => send(question)} disabled={pending || !question.trim()} size="lg">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
