/**
 * Caregiver index — explains what the share link does and shows how to
 * generate one from the schedule page. Always has a live example link for
 * the seeded patient so judges can explore instantly.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { PageHeader } from '@frontend/components/layout/page_header';
import { usePatientStore } from '@frontend/state/patient_store';

import { encodeCaregiverPayload } from '@backend/services/caregiver_link';

export default function CaregiverIndexPage() {
  const medicines = usePatientStore((s) => s.medicines);
  const patientName = usePatientStore((s) => s.patientName);
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    setToken(
      encodeCaregiverPayload({
        patientName,
        generatedAt: new Date().toISOString(),
        schedule: medicines.map((m) => ({
          brand: m.brand,
          ingredient: m.ingredient,
          strength: m.strength,
          slots: m.slots,
          meal: m.meal,
          streakDays: m.streakDays,
        })),
      }),
    );
  }, [medicines, patientName]);

  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <PageHeader
        icon="🧑‍🤝‍🧑"
        title="Caregiver mode"
        description="Adult children living away from their parents can open a read-only dashboard with one tap — no login, no app install."
      />
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-ink">
          <p>
            From the <Link href="/schedule" className="font-semibold text-teal-700 hover:underline">Schedule page</Link>, tap <em>Share with caregiver</em>.
            We encode the current plan into a URL and copy it to your clipboard or open WhatsApp with the message pre-filled.
          </p>
          <p>
            The link contains no identifying information beyond the patient&apos;s first name; it lives in the URL itself,
            so nothing is stored on any server. Revoke access by simply not re-sharing a fresh link.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preview the caregiver view</CardTitle>
          <p className="text-sm text-ink-muted">Opens the link we&apos;d send for the seeded patient.</p>
        </CardHeader>
        <CardContent>
          <Link href={`/caregiver/${token}`}>
            <Button>Open {patientName}&apos;s caregiver view →</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
