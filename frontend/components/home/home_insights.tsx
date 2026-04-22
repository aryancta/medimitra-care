/**
 * Home-page insights strip: adherence % today, streak, risk score, caregiver
 * share. Pulls from the Zustand store so it reacts instantly to any action
 * on the schedule or scanner pages.
 */

'use client';

import Link from 'next/link';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Progress } from '@frontend/components/ui/progress';
import { usePatientStore } from '@frontend/state/patient_store';

import { adherenceToday, bestStreak } from '@backend/services/adherence_service';
import { regimenRiskScore } from '@backend/services/interaction_engine';

export function HomeInsights() {
  const medicines = usePatientStore((s) => s.medicines);
  const adherence = adherenceToday(medicines);
  const streak = bestStreak(medicines);
  const risk = regimenRiskScore(medicines.map((m) => m.ingredient));

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today&apos;s adherence</CardTitle>
            <Badge tone="info">Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-ink">{adherence.pct}%</span>
            <span className="text-sm text-ink-muted">
              {adherence.taken}/{adherence.total} doses taken
            </span>
          </div>
          <Progress value={adherence.pct} />
          <Link href="/schedule" className="mt-4 inline-flex text-sm font-semibold text-teal-700 hover:underline">
            Mark a dose →
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Best streak</CardTitle>
            <Badge tone="success">🔥 {streak}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-ink">{streak} days</p>
          <p className="mt-2 text-sm text-ink-muted">
            Keep it going! Elderly patients who streak for 30+ days cut hospital re-admissions by nearly half.
          </p>
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
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-ink">{risk.score}</span>
            <span className="text-sm text-ink-muted">/ 100</span>
          </div>
          <Progress value={risk.score} tone="severity" />
          <Link href="/safety" className="mt-4 inline-block">
            <Button size="sm" variant="outline">Run full safety check</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
