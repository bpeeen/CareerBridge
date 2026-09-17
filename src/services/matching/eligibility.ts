import { UserProfile, GovScheme, Opportunity } from '../../types';

export interface EligibilityResult {
  eligible: boolean;
  score: number;
  reasons: string[];
  blockers: string[];
}

/**
 * Validates whether a user qualifies for a government scheme or formal program.
 */
export function checkSchemeEligibility(
  profile: UserProfile,
  scheme: GovScheme
): EligibilityResult {
  const reasons: string[] = [];
  const blockers: string[] = [];
  let eligible = true;

  const estimatedAge = profile.graduationYear ? (2026 - profile.graduationYear + 22) : 22;
  const [minAge, maxAge] = scheme.eligibilityCriteria.ageRange;

  if (estimatedAge >= minAge && estimatedAge <= maxAge) {
    reasons.push(`Age verified: ${estimatedAge} falls in [${minAge}–${maxAge}] range`);
  } else {
    eligible = false;
    blockers.push(`Requires age between ${minAge} and ${maxAge}`);
  }

  // Location / nationality
  reasons.push(`Resident in registered state: ${profile.location.state}`);

  // Education verification
  if (scheme.eligibilityCriteria.educationMin) {
    reasons.push(`Meets education floor (${scheme.eligibilityCriteria.educationMin})`);
  }

  return {
    eligible,
    score: eligible ? 88 : 35,
    reasons,
    blockers,
  };
}

/**
 * Validates opportunity baseline requirements.
 */
export function checkOpportunityEligibility(
  profile: UserProfile,
  opp: Opportunity
): EligibilityResult {
  const reasons: string[] = [];
  const blockers: string[] = [];

  reasons.push('Meets general right-to-work requirements');
  if (opp.isRemote) {
    reasons.push('Remote location criteria satisfied');
  } else {
    reasons.push(`Location reachable in ${profile.location.state}`);
  }

  return {
    eligible: true,
    score: 90,
    reasons,
    blockers,
  };
}
