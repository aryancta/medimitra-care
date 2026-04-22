/**
 * Safety check page: interaction matrix + polypharmacy risk score + talking
 * points for the next doctor visit.
 */

import { PageHeader } from '@frontend/components/layout/page_header';
import { SafetyPanel } from '@frontend/components/safety/safety_panel';

export default function SafetyPage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <PageHeader
        icon="🛡️"
        title="Interaction & Polypharmacy Safety Check"
        description="A one-screen view of every interaction across your pill list, a single risk number out of 100, and the three things we think you should mention to your doctor next."
      />
      <SafetyPanel />
    </div>
  );
}
