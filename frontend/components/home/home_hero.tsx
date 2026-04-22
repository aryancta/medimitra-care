/**
 * Landing hero: big welcome, live demo-mode banner, and the primary CTA.
 */

'use client';

import Link from 'next/link';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { usePatientStore } from '@frontend/state/patient_store';

import { nextDose } from '@backend/services/adherence_service';

export function HomeHero() {
  const patient = usePatientStore((s) => s.patientName);
  const medicines = usePatientStore((s) => s.medicines);
  const next = nextDose(medicines);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card sm:p-12">
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-saffron-100 via-white to-teal-100" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3 space-y-4">
          <Badge tone="info" className="text-xs">UN SDG 3 · Good Health and Well-being</Badge>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Apki Dawaiyon Ka Dost
            <span className="mt-1 block text-lg font-normal text-ink-muted sm:text-xl">
              Your medicine&apos;s best friend — one photo is all it takes.
            </span>
          </h1>
          <p className="max-w-xl text-base text-ink-muted sm:text-lg">
            Built for India&apos;s 140 million-strong elderly community and the adult children who worry about them.
            Snap a strip, catch a dangerous interaction, and never miss a dose again.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/scan">
              <Button size="xl" variant="primary">📷 Scan My Medicine</Button>
            </Link>
            <Link href="/schedule">
              <Button size="xl" variant="outline">View Today&apos;s Schedule</Button>
            </Link>
          </div>
          <p className="pt-2 text-sm text-ink-muted">
            Welcome back, <strong className="text-ink">{patient}</strong>.
            {next ? (
              <>
                {' '}Next dose: <strong className="text-ink">{next.brand}</strong> in{' '}
                <span className="text-teal-700 font-semibold">
                  {next.minutesAway <= 0 ? 'right now' : `${next.minutesAway} min`}
                </span>
                .
              </>
            ) : (
              ' All caught up for today.'
            )}
          </p>
        </div>
        <div className="lg:col-span-2">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <defs>
          <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#99f6e4" />
          </linearGradient>
          <linearGradient id="phoneGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="300" rx="28" fill="url(#bgGrad)" />
        <g transform="translate(70 30)">
          <rect x="0" y="0" width="180" height="260" rx="22" fill="url(#phoneGrad)" stroke="#0f172a" strokeOpacity="0.08" />
          <rect x="14" y="20" width="152" height="90" rx="14" fill="#0f172a" fillOpacity="0.88" />
          <rect x="30" y="34" width="120" height="8" rx="4" fill="#fb923c" />
          <rect x="30" y="50" width="90" height="6" rx="3" fill="#5eead4" />
          <rect x="30" y="62" width="110" height="6" rx="3" fill="#e2e8f0" fillOpacity="0.6" />
          <rect x="30" y="74" width="70" height="6" rx="3" fill="#e2e8f0" fillOpacity="0.5" />
          <g transform="translate(14 122)">
            <rect x="0" y="0" width="152" height="40" rx="10" fill="#0d9488" />
            <text x="76" y="25" textAnchor="middle" fontSize="14" fontFamily="ui-sans-serif" fill="#ffffff" fontWeight="700">💊 Add to my pills</text>
          </g>
          <g transform="translate(14 172)">
            <rect x="0" y="0" width="152" height="58" rx="10" fill="#fecaca" />
            <text x="76" y="22" textAnchor="middle" fontSize="11" fontFamily="ui-sans-serif" fill="#7f1d1d" fontWeight="700">⚠ Moderate interaction</text>
            <text x="76" y="38" textAnchor="middle" fontSize="9" fill="#7f1d1d">with Warfarin already in list</text>
            <text x="76" y="50" textAnchor="middle" fontSize="8" fill="#7f1d1d" opacity="0.7">Source: openFDA</text>
          </g>
        </g>
        <g transform="translate(270 110)">
          <rect x="-10" y="-10" width="90" height="50" rx="10" fill="#ffffff" stroke="#0d9488" />
          <text x="36" y="12" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">Crocin</text>
          <text x="36" y="26" textAnchor="middle" fontSize="9" fill="#475569">500 mg</text>
          <circle cx="76" cy="6" r="8" fill="#fb923c" />
          <text x="76" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">!</text>
        </g>
      </svg>
    </div>
  );
}
