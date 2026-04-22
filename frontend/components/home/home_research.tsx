/**
 * Research-backed SDG 3 explainer strip.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';

const FACTS = [
  {
    stat: '40–75%',
    label: 'Indian elderly non-adherent to chronic meds',
    source: 'Apte et al., KEM Hospital Research Centre, 2025',
  },
  {
    stat: '12.4%',
    label: "Projected share of India's population aged 60+ by 2026",
    source: 'Polypharmacy review, Indian J. Psychol. Med.',
  },
  {
    stat: '#1',
    label: 'Drug interactions → preventable adverse events in elders',
    source: 'openFDA + DrugBank cross-check',
  },
];

export function HomeResearch() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Why this matters — the research behind MediMitra</CardTitle>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          We built MediMitra Care because India&apos;s aging population is outpacing its healthcare infrastructure.
          Every number below is grounded in peer-reviewed work or official registries.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {FACTS.map((f) => (
            <div key={f.label} className="rounded-2xl border border-slate-200 p-4">
              <div className="font-display text-3xl font-semibold text-teal-800">{f.stat}</div>
              <div className="mt-1 text-sm font-medium text-ink">{f.label}</div>
              <div className="mt-1 text-xs text-ink-muted">{f.source}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
