/**
 * /settings — API-key management + language + demo reset.
 *
 * All keys persist in localStorage only. None of them are sent to the
 * MediMitra server or written to disk.
 */

import { PageHeader } from '@frontend/components/layout/page_header';
import { SettingsPanel } from '@frontend/components/settings/settings_panel';

export default function SettingsPage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <PageHeader
        icon="⚙️"
        title="Settings"
        description="Add your own free-tier API keys to unlock live scanning and Q&A. Keys live in your browser only — nothing is sent to our servers."
      />
      <SettingsPanel />
    </div>
  );
}
