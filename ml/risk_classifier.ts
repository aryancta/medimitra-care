/**
 * Heuristic polypharmacy risk classifier.
 *
 * What this module provides:
 *   A one-line explanation-generator for the risk score tile. Takes the
 *   numeric score and the list of interaction alerts and returns a friendly
 *   "3 things to discuss with your doctor" list.
 *
 * Why it matters for SDG 3:
 *   Caregivers ask "so what do I DO about this?" — this module translates
 *   the score into actionable next steps.
 */

import type { InteractionAlert } from '@backend/services/interaction_engine';

export function buildDiscussionPoints(alerts: InteractionAlert[], numMedicines: number): string[] {
  const points: string[] = [];
  const severe = alerts.filter((a) => a.severity === 'severe');
  const moderate = alerts.filter((a) => a.severity === 'moderate');
  if (severe.length) {
    points.push(
      `Ask your doctor whether ${severe[0].a} and ${severe[0].b} can be safely taken together, or whether one should be swapped.`,
    );
  }
  if (moderate.length) {
    points.push(
      `Discuss the moderate interaction between ${moderate[0].a} and ${moderate[0].b} — dose timing may need adjusting.`,
    );
  }
  if (numMedicines >= 5) {
    points.push('Request a medication review — 5+ daily medicines increases the risk of side effects.');
  }
  if (!points.length) {
    points.push('Continue your current regimen and review again in 3 months.');
  }
  return points.slice(0, 3);
}
