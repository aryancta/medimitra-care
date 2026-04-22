/**
 * Global disclaimer footer.
 *
 * Why it matters for SDG 3:
 *   Any tool that influences medication behaviour must be unambiguously
 *   framed as decision-support, not a substitute for a pharmacist or
 *   doctor. This footer appears on every page.
 */

import Link from 'next/link';

export function DisclaimerFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container py-8 text-sm text-ink-muted">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="font-semibold text-ink">For information only.</p>
            <p>
              Consult a doctor or pharmacist before any change in medication. Data sourced from RxNorm, openFDA, and
              the public DrugBank DDI dataset.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/safety" className="hover:text-ink">Safety check</Link>
            <Link href="/caregiver" className="hover:text-ink">Caregiver view</Link>
            <Link href="/settings" className="hover:text-ink">Settings</Link>
            <span className="inline-flex items-center gap-1 text-xs">SDG 3 · Good Health and Well-being</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
