import { UserProfile, Opportunity, GovScheme, Recommendation } from '../../types';
import { calculateOpportunityScore, calculateSchemeScore } from './scoring';
import { checkOpportunityEligibility, checkSchemeEligibility } from './eligibility';

/**
 * Standardized recommendation ranking engine.
 * Ensures the structured recommendation contract across both Student and Livelihood flows.
 */
export function rankOpportunities(
  profile: UserProfile,
  opportunities: Opportunity[]
): Opportunity[] {
  return opportunities
    .map((opp) => {
      const scoreData = calculateOpportunityScore(profile, opp);
      const elig = checkOpportunityEligibility(profile, opp);

      const recommendation: Recommendation = {
        id: `rec-opp-${opp.id}`,
        type: 'job',
        matchScore: scoreData.totalScore,
        reasons: scoreData.reasons,
        missingRequirements: scoreData.missingRequirements,
        eligibility: {
          eligible: elig.eligible,
          reasons: elig.reasons,
        },
        source: opp.source,
        freshness: opp.postedAt || 'Recently updated',
      };

      return {
        ...opp,
        matchRecommendation: recommendation,
      };
    })
    .sort((a, b) => {
      const scoreA = a.matchRecommendation?.matchScore || 0;
      const scoreB = b.matchRecommendation?.matchScore || 0;
      return scoreB - scoreA;
    });
}

export function rankSchemes(
  profile: UserProfile,
  schemes: GovScheme[]
): GovScheme[] {
  return schemes
    .map((scheme) => {
      const schemeScore = calculateSchemeScore(profile, scheme);
      const elig = checkSchemeEligibility(profile, scheme);

      const recommendation: Recommendation = {
        id: `rec-scheme-${scheme.id}`,
        type: 'scheme',
        matchScore: schemeScore.score,
        reasons: schemeScore.reasons,
        missingRequirements: schemeScore.missingRequirements,
        eligibility: {
          eligible: elig.eligible,
          reasons: elig.reasons,
        },
        source: scheme.officialSource,
        freshness: scheme.lastUpdated,
      };

      return {
        ...scheme,
        matchRecommendation: recommendation,
      };
    })
    .sort((a, b) => {
      const scoreA = a.matchRecommendation?.matchScore || 0;
      const scoreB = b.matchRecommendation?.matchScore || 0;
      return scoreB - scoreA;
    });
}
