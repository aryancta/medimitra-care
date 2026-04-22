/**
 * Drug-drug interaction engine.
 *
 * What this service does:
 *   Given a candidate new medicine and a user's current medicine list,
 *   produces an ordered list of interaction alerts (Mild / Moderate / Severe)
 *   with a plain-English reason and advice. Also computes a single 0–100
 *   "polypharmacy risk score" for the whole regimen.
 *
 * Why it matters for SDG 3:
 *   This is the heart of the safety layer. Research consistently names
 *   drug-drug interactions as the #1 preventable driver of adverse drug
 *   events in elderly Indian patients. A one-screen, color-coded check
 *   before adding any new pill can literally prevent hospitalisations.
 */

import {
  INTERACTIONS,
  SEVERITY_WEIGHT,
  findInteraction,
  type Interaction,
  type Severity,
} from '@data/drug_interactions';

export type InteractionAlert = Interaction & {
  /** The medicine in the user's existing list that triggered the alert. */
  against: string;
};

/**
 * Find every interaction between a new candidate ingredient and a set of
 * existing ingredients. Results are sorted severe → mild.
 */
export function checkCandidate(
  candidateIngredient: string,
  existingIngredients: string[],
): InteractionAlert[] {
  if (!candidateIngredient) return [];
  const alerts: InteractionAlert[] = [];
  for (const existing of existingIngredients) {
    if (!existing) continue;
    if (existing.toLowerCase() === candidateIngredient.toLowerCase()) {
      alerts.push({
        a: candidateIngredient,
        b: existing,
        severity: 'moderate',
        reason: 'This medicine is already in your schedule — adding it again would double the dose.',
        advice: 'Do not duplicate. Review with your doctor before any dose change.',
        source: 'DrugBank',
        against: existing,
      });
      continue;
    }
    const hit = findInteraction(candidateIngredient, existing);
    if (hit) {
      alerts.push({ ...hit, against: existing });
    }
  }
  return alerts.sort((x, y) => rank(y.severity) - rank(x.severity));
}

/**
 * Compute a 0–100 polypharmacy risk score for the user's full regimen.
 *   0   = no interactions found
 *   100 = multiple severe interactions present
 *
 * Uses each pairwise interaction's severity weight plus a penalty for
 * regimen size (because, research-backed, >5 drugs is itself a risk marker).
 */
export function regimenRiskScore(ingredients: string[]): {
  score: number;
  level: 'low' | 'moderate' | 'high';
  alerts: InteractionAlert[];
  summary: string;
} {
  const alerts: InteractionAlert[] = [];
  const unique = Array.from(new Set(ingredients.filter(Boolean).map((s) => s.toLowerCase())));
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const hit = findInteraction(unique[i], unique[j]);
      if (hit) alerts.push({ ...hit, against: unique[j] });
    }
  }
  let score = alerts.reduce((acc, a) => acc + SEVERITY_WEIGHT[a.severity], 0);
  if (unique.length >= 5) score += 10;
  if (unique.length >= 8) score += 10;
  score = Math.min(100, Math.max(0, score));
  const level: 'low' | 'moderate' | 'high' =
    score >= 60 ? 'high' : score >= 25 ? 'moderate' : 'low';
  const summary =
    level === 'high'
      ? 'Several safety concerns were found in this regimen. Please review with your doctor at the next visit.'
      : level === 'moderate'
        ? 'A few interactions were flagged. None are severe, but worth discussing with your doctor.'
        : 'No significant interactions were found. Keep up the great adherence!';
  return { score, level, alerts, summary };
}

function rank(s: Severity): number {
  return SEVERITY_WEIGHT[s];
}

/**
 * Export the raw interaction count for dashboard widgets.
 */
export function interactionCatalogueSize(): number {
  return INTERACTIONS.length;
}
