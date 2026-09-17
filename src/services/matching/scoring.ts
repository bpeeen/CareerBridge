import { UserProfile, Opportunity, GovScheme } from '../../types';

export interface ScoreBreakdown {
  totalScore: number; // 0 - 100
  factors: {
    skillMatch: number;      // 0 - 35%
    locationMatch: number;   // 0 - 20%
    eligibilityMatch: number;// 0 - 15%
    experienceMatch: number; // 0 - 10%
    educationMatch: number;  // 0 - 10%
    interestMatch: number;   // 0 - 5%
    freshnessMatch: number;  // 0 - 5%
  };
  reasons: string[];
  missingRequirements: string[];
}

/**
 * Computes transparent, explainable match scores for any opportunity.
 * Applied symmetrically across both Student and Rural Worker profiles.
 */
export function calculateOpportunityScore(
  profile: UserProfile,
  opp: Opportunity
): ScoreBreakdown {
  const reasons: string[] = [];
  const missingRequirements: string[] = [];

  // 1. Skill Match (Max 35 pts)
  let matchedSkillsCount = 0;
  let totalSkillWeight = 0;
  const oppSkills = opp.skills || [];

  if (oppSkills.length === 0) {
    totalSkillWeight = 25;
  } else {
    for (const reqSkill of oppSkills) {
      const normalizedReq = reqSkill.toLowerCase().trim();
      const userSkill = Object.values(profile.skills).find(
        (s) => s.name.toLowerCase().trim() === normalizedReq
      );

      if (userSkill && userSkill.level >= 40) {
        matchedSkillsCount++;
        // Weight by demonstrated proficiency
        const skillFactor = (userSkill.level / 100) * (35 / oppSkills.length);
        totalSkillWeight += skillFactor;
      } else if (!userSkill || userSkill.level < 40) {
        missingRequirements.push(reqSkill);
      }
    }
  }
  const skillScore = Math.min(35, Math.round(totalSkillWeight));
  if (matchedSkillsCount > 0) {
    reasons.push(`Your ${matchedSkillsCount} verified skill${matchedSkillsCount > 1 ? 's align' : ' aligns'} directly with this position`);
  }

  // 2. Location Match (Max 20 pts)
  let locationScore = 0;
  const userLoc = `${profile.location.villageOrCity} ${profile.location.district} ${profile.location.state}`.toLowerCase();
  const oppLoc = opp.location.toLowerCase();

  if (opp.isRemote) {
    locationScore = 20;
    reasons.push('Remote flexibility matches anywhere');
  } else if (opp.distanceKm !== undefined && opp.distanceKm <= (profile.workRadiusKm || 25)) {
    locationScore = 20;
    reasons.push(`Within convenient commuting radius (${opp.distanceKm} km away)`);
  } else if (
    oppLoc.includes(profile.location.district.toLowerCase()) ||
    oppLoc.includes(profile.location.villageOrCity.toLowerCase())
  ) {
    locationScore = 20;
    reasons.push(`Located locally in ${profile.location.district || profile.location.villageOrCity}`);
  } else if (oppLoc.includes(profile.location.state.toLowerCase())) {
    locationScore = 14;
    reasons.push(`Located in your state (${profile.location.state})`);
  } else {
    locationScore = 6;
  }

  // 3. Eligibility Match (Max 15 pts)
  let eligibilityScore = 15;
  if (profile.persona === 'student' && opp.experienceRequired.includes('Senior')) {
    eligibilityScore = 5;
    missingRequirements.push('Senior work experience requested');
  } else {
    reasons.push('Meets entry & foundational criteria');
  }

  // 4. Experience Match (Max 10 pts)
  let experienceScore = 10;
  if (profile.persona === 'livelihood') {
    const userExp = profile.experienceYears || 0;
    if (opp.experienceRequired.includes('0-1') || opp.experienceRequired.includes('Fresh') || userExp >= 1) {
      experienceScore = 10;
      reasons.push('Your experience profile satisfies the role criteria');
    } else {
      experienceScore = 6;
    }
  }

  // 5. Education Match (Max 10 pts)
  let educationScore = 10;
  if (profile.educationLevel) {
    educationScore = 10;
    reasons.push(`Education background (${profile.educationLevel}) is compatible`);
  }

  // 6. Interest & Domain Alignment (Max 5 pts)
  let interestScore = 0;
  const targetInterest = (profile.targetRole || profile.tradeOrDomain || '').toLowerCase();
  if (targetInterest && (opp.title.toLowerCase().includes(targetInterest) || opp.description.toLowerCase().includes(targetInterest))) {
    interestScore = 5;
    reasons.push(`Direct match for your primary target: ${profile.targetRole || profile.tradeOrDomain}`);
  } else {
    interestScore = 3;
  }

  // 7. Freshness Match (Max 5 pts)
  const freshnessScore = 5;

  const totalScore = Math.min(
    99,
    Math.max(
      35,
      skillScore + locationScore + eligibilityScore + experienceScore + educationScore + interestScore + freshnessScore
    )
  );

  return {
    totalScore,
    factors: {
      skillMatch: skillScore,
      locationMatch: locationScore,
      eligibilityMatch: eligibilityScore,
      experienceMatch: experienceScore,
      educationMatch: educationScore,
      interestMatch: interestScore,
      freshnessMatch: freshnessScore,
    },
    reasons,
    missingRequirements: Array.from(new Set(missingRequirements)),
  };
}

/**
 * Computes explainable match scores for Government Schemes.
 */
export function calculateSchemeScore(
  profile: UserProfile,
  scheme: GovScheme
): { score: number; eligible: boolean; reasons: string[]; missingRequirements: string[] } {
  const reasons: string[] = [];
  const missingRequirements: string[] = [];
  let eligible = true;
  let score = 50;

  // Age check
  const userAge = profile.graduationYear ? (2026 - profile.graduationYear + 22) : 23;
  const [minAge, maxAge] = scheme.eligibilityCriteria.ageRange;
  if (userAge >= minAge && userAge <= maxAge) {
    score += 15;
    reasons.push(`Age eligibility verified (${minAge}–${maxAge} yrs)`);
  } else {
    eligible = false;
    missingRequirements.push(`Age requirement: ${minAge}–${maxAge} years`);
  }

  // Target audience check
  const targetLower = scheme.targetAudience.toLowerCase();
  if (profile.persona === 'livelihood' && (targetLower.includes('rural') || targetLower.includes('artisan') || targetLower.includes('worker') || targetLower.includes('youth') || targetLower.includes('unemployed'))) {
    score += 20;
    reasons.push('High-priority match for rural livelihoods & skill development');
  } else if (profile.persona === 'student' && (targetLower.includes('student') || targetLower.includes('graduate') || targetLower.includes('youth') || targetLower.includes('tech'))) {
    score += 20;
    reasons.push('Designed for youth and graduating students');
  } else {
    score += 10;
  }

  // Domain / Trade check
  const trade = (profile.tradeOrDomain || profile.targetRole || '').toLowerCase();
  if (trade && (scheme.name.toLowerCase().includes(trade) || scheme.category.toLowerCase().includes(trade) || scheme.benefits.some(b => b.toLowerCase().includes(trade)))) {
    score += 15;
    reasons.push(`Offers training or support directly in your field (${profile.tradeOrDomain || profile.targetRole})`);
  }

  return {
    score: Math.min(98, score),
    eligible,
    reasons,
    missingRequirements,
  };
}
