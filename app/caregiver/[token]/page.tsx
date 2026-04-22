/**
 * Read-only caregiver view.
 *
 * Decodes the base64 token in the URL and renders a friendly summary that
 * an adult child can scan in 10 seconds.
 */

import Link from 'next/link';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { PageHeader } from '@frontend/components/layout/page_header';
import { Progress } from '@frontend/components/ui/progress';

import { decodeCaregiverPayload } from '@backend/services/caregiver_link';
import { regimenRiskScore } from '@backend/services/interaction_engine';
import { TIME_SLOT_PICTOGRAM } from '@data/pictograms';

export default function CaregiverTokenPage({ params }: { params: { token: string } }) {
  const payload = decodeCaregiverPayload(params.token);

  if (!payload) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg font-semibold text-ink">This caregiver link is invalid or expired.</p>
            <p className="mt-1 text-sm text-ink-muted">Ask the patient to generate a fresh one from their schedule page.</p>
            <Link href="/" className="mt-4 inline-block">
              <Button>Back to home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const risk = regimenRiskScore(payload.schedule.map((s) => s.ingredient));

  return (
    <div className="container py-8 sm:py-12 space-y-6">
      <PageHeader
        icon="🧑‍🤝‍🧑"
        title={`${payload.patientName}'s care plan`}
        description={`Read-only view generated ${new Date(payload.generatedAt).toLocaleString()}.`}
        actions={<Badge tone="info">Caregiver</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Medicines</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">{payload.schedule.length}</p>
            <p className="mt-1 text-sm text-ink-muted">in the current regimen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Best streak</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">🔥 {Math.max(0, ...payload.schedule.map((s) => s.streakDays))}</p>
            <p className="mt-1 text-sm text-ink-muted">consecutive days of full adherence</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Polypharmacy risk</CardTitle>
              <Badge tone={risk.level === 'high' ? 'severe' : risk.level === 'moderate' ? 'moderate' : 'mild'}>
                {risk.level.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">{risk.score}<span className="text-base font-normal text-ink-muted"> / 100</span></p>
            <Progress value={risk.score} tone="severity" className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-100">
            {payload.schedule.map((entry, idx) => (
              <li key={idx} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-ink">{entry.brand}</div>
                  <div className="text-xs text-ink-muted">{entry.ingredient} · {entry.strength}</div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {entry.slots.map((slot) => (
                    <Badge key={slot} tone="info">
                      {TIME_SLOT_PICTOGRAM[slot].glyph} {TIME_SLOT_PICTOGRAM[slot].english}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {risk.alerts.length ? (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader><CardTitle>Heads-up</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-ink">
              {risk.alerts.map((a, i) => (
                <li key={i}>
                  <Badge tone={a.severity}>{a.severity.toUpperCase()}</Badge>
                  <span className="ml-2">{capitalise(a.a)} ↔ {capitalise(a.b)} — {a.reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-slate-50">
        <CardContent className="py-5 text-sm text-ink-muted">
          This caregiver view is generated client-side from a URL token. Nothing is stored on any server.
        </CardContent>
      </Card>
    </div>
  );
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
