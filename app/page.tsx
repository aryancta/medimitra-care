/**
 * Home screen — the "Apki Dawaiyon Ka Dost" landing experience.
 *
 * Layout:
 *   1. Hero block with the brand headline, next-dose ticker, and a direct
 *      "Scan My Medicine" CTA.
 *   2. Three big friendly cards — Scan, Schedule, Safety — tuned for one-
 *      thumb interaction on a mid-range Indian smartphone.
 *   3. A polypharmacy-risk summary + caregiver quick-share.
 *   4. A research-backed SDG 3 note so visitors immediately understand
 *      WHY this app exists.
 */

import { HomeCards } from '@frontend/components/home/home_cards';
import { HomeHero } from '@frontend/components/home/home_hero';
import { HomeInsights } from '@frontend/components/home/home_insights';
import { HomeResearch } from '@frontend/components/home/home_research';

export default function HomePage() {
  return (
    <div className="container py-8 sm:py-12 space-y-10 sm:space-y-14">
      <HomeHero />
      <HomeCards />
      <HomeInsights />
      <HomeResearch />
    </div>
  );
}
