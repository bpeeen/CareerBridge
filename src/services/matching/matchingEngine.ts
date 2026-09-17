import { UserProfile, Opportunity, GovScheme, RoadmapNode, RoadmapDiff } from '../../types';
import { rankOpportunities, rankSchemes } from './ranking';
import { generateAdaptiveRoadmap, calculateRoadmapDiff } from './roadmapEngine';
import { calculateOpportunityScore } from './scoring';

/**
 * CareerBridge Unified Shared Matching & Intelligence Engine
 * 
 * ARCHITECTURAL MANDATE:
 * Both Student/Graduate and Rural Livelihood personas invoke the SAME engine methods.
 * No segregated recommendation algorithms exist.
 */
class MatchingEngine {
  private version = '3.4.0-shared-core';

  public getVersion(): string {
    return this.version;
  }

  /**
   * Evaluates and ranks live opportunities with full explainability.
   */
  public matchOpportunities(
    profile: UserProfile,
    opportunities: Opportunity[]
  ): Opportunity[] {
    return rankOpportunities(profile, opportunities);
  }

  /**
   * Evaluates and ranks government schemes and public programs.
   */
  public matchSchemes(
    profile: UserProfile,
    schemes: GovScheme[]
  ): GovScheme[] {
    return rankSchemes(profile, schemes);
  }

  /**
   * Generates or adapts a structured progression roadmap based on the current profile state.
   */
  public generateRoadmap(profile: UserProfile): RoadmapNode[] {
    return generateAdaptiveRoadmap(profile);
  }

  /**
   * Calculates the delta and explanations between two roadmap iterations (e.g. after skill update).
   */
  public diffRoadmap(
    previous: RoadmapNode[],
    updated: RoadmapNode[]
  ): RoadmapDiff {
    return calculateRoadmapDiff(previous, updated);
  }

  /**
   * Computes overall career readiness percentage based on matched requirements and verified skills.
   */
  public computeProfileReadiness(profile: UserProfile, targetOpportunities: Opportunity[]): number {
    if (!targetOpportunities || targetOpportunities.length === 0) {
      const skillValues = Object.values(profile.skills);
      if (skillValues.length === 0) return 30;
      const avg = skillValues.reduce((sum, s) => sum + s.level, 0) / skillValues.length;
      return Math.min(95, Math.round(avg * 0.9 + 10));
    }

    const topMatches = targetOpportunities.slice(0, 5);
    const avgScore = topMatches.reduce((acc, opp) => {
      const score = opp.matchRecommendation?.matchScore || calculateOpportunityScore(profile, opp).totalScore;
      return acc + score;
    }, 0) / topMatches.length;

    return Math.min(98, Math.max(25, Math.round(avgScore)));
  }
}

export const matchingEngine = new MatchingEngine();
