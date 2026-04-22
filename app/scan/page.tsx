/**
 * Scan page — the 60-second demo centrepiece.
 *
 * User journey:
 *   1. User taps one of the demo Indian medicines (Crocin, Combiflam, Telma, Metformin)
 *      or uploads a photo.
 *   2. App POSTs the image (or a "demo hint") to /api/scan which hands off to
 *      Gemini 2.5 Flash (when an API key is present) or a seeded fallback.
 *   3. An animated "scanning…" state resolves into a friendly info card with
 *      pictograms, strength, purpose, and safety warnings.
 *   4. A prominent "Add to my pills" button runs an interaction check against
 *      the user's existing list and shows the color-coded result.
 */

import { ScanExperience } from '@frontend/components/scan/scan_experience';

export default function ScanPage() {
  return (
    <div className="container py-8 sm:py-12">
      <ScanExperience />
    </div>
  );
}
