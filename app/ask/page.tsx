/**
 * "Ask MediMitra" — conversational Q&A grounded in openFDA label text.
 */

import { AskPanel } from '@frontend/components/ask/ask_panel';
import { PageHeader } from '@frontend/components/layout/page_header';

export default function AskPage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <PageHeader
        icon="💬"
        title="Ask MediMitra"
        description="Tap-and-hold questions about any of your medicines. Answers are grounded in the openFDA label and always finish with a reminder to consult your doctor."
      />
      <AskPanel />
    </div>
  );
}
