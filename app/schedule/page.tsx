/**
 * Pictogram Pill Schedule page.
 *
 * Converts the user's medicine list into a visual timeline (morning / afternoon /
 * evening / night) with large pictograms, a tap-to-mark-taken gesture, a streak
 * counter, browser push notification opt-in, and a voice-read-my-schedule button
 * (Web Speech API).
 */

import { PageHeader } from '@frontend/components/layout/page_header';
import { ScheduleView } from '@frontend/components/schedule/schedule_view';

export default function SchedulePage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <PageHeader
        icon="📅"
        title="My Pictogram Pill Schedule"
        description="Large sun/moon icons, voice read-aloud in Hindi or English, and a Duolingo-style streak to keep every dose on track."
      />
      <ScheduleView />
    </div>
  );
}
