import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityDetailModal } from '../opportunities/OpportunityDetailModal';
import { Opportunity } from '../../types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GitBranch,
  Award,
  Clock,
  ChevronRight,
  Compass,
  Target
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    profile,
    opportunities,
    structuredRoadmap,
    setActiveTab,
    startAssessment,
    generateRoadmap,
    isGeneratingRoadmap
  } = useApp();
  
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  if (!profile) return null;

  // Calculate milestones completed vs total
  let totalSubmodules = 0;
  let completedSubmodules = 0;
  let inProgressSubmodule: { moduleTitle: string; title: string; minutes: number } | null = null;

  if (structuredRoadmap?.modules) {
    for (const mod of structuredRoadmap.modules) {
      for (const sm of mod.submodules) {
        totalSubmodules++;
        if (sm.status === 'completed') {
          completedSubmodules++;
        } else if (sm.status === 'in_progress' && !inProgressSubmodule) {
          inProgressSubmodule = {
            moduleTitle: mod.title,
            title: sm.title,
            minutes: sm.estimatedMinutes,
          };
        }
      }
    }
  }

  const progressPercent = totalSubmodules > 0
    ? Math.round((completedSubmodules / totalSubmodules) * 100)
    : 0;

  const topOpportunities = opportunities.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. User Greeting & Target Role Header */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#5A6065]">
                {profile.degree || 'B.Tech CSE'} • Class of {profile.graduationYear || 2026}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2022]">
              Welcome back, {profile.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#5A6065]">
              Target Role: <strong className="text-[#183B32]">{profile.targetRole || 'Backend Developer'}</strong> • {profile.location?.villageOrCity || 'Bengaluru'}, {profile.location?.state || 'India'}
            </p>
          </div>

          {/* Target Role & Progress Pills */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Overall Skill Progress (Calculated from skill assessments) */}
            <div className="flex items-center gap-3 rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-3.5">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6065]">
                  Overall Progress
                </div>
                <div className="font-mono text-2xl font-bold text-[#183B32]">
                  {profile.readinessScore || 0}%
                </div>
                <div className="text-[10px] text-[#2A6658]">
                  From skill assessments
                </div>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#183B32] text-white">
                <Award className="h-4.5 w-4.5 text-[#A3E635]" />
              </div>
            </div>

            {/* Roadmap Progress */}
            <div className="flex items-center gap-3 rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-3.5">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6065]">
                  Roadmap Progress
                </div>
                <div className="font-mono text-2xl font-bold text-[#183B32]">
                  {progressPercent}%
                </div>
                <div className="text-[10px] text-[#2A6658]">
                  {completedSubmodules} / {totalSubmodules || 0} milestones
                </div>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#183B32] text-white">
                <Target className="h-4.5 w-4.5 text-[#A3E635]" />
              </div>
            </div>
          </div>
        </div>

        {/* Next Recommended Action */}
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-[#E2ECE9] bg-[#F4F8F6] p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#183B32] text-white shrink-0">
              <Compass className="h-4 w-4 text-[#A3E635]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#183B32]">Next Recommended Action</span>
              <p className="text-xs font-semibold text-[#1E2022]">
                {structuredRoadmap
                  ? inProgressSubmodule
                    ? `Continue: ${inProgressSubmodule.title}`
                    : 'Practice a Mock Technical Interview for ' + (profile.targetRole || 'Backend Developer')
                  : 'Build your customized AI learning roadmap'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!structuredRoadmap) {
                setActiveTab('roadmap');
              } else if (inProgressSubmodule) {
                setActiveTab('roadmap');
              } else {
                setActiveTab('interview');
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#183B32] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#15342C] transition-colors shrink-0"
          >
            <span>{!structuredRoadmap ? 'Start Now' : inProgressSubmodule ? 'Open Module' : 'Practice Interview'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Roadmap Progress & Current Learning Focus OR Empty State Callout */}
      {structuredRoadmap ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Roadmap Progress Card */}
          <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6065] flex items-center gap-1.5">
                  <GitBranch className="h-4 w-4 text-[#183B32]" />
                  Roadmap Progress
                </span>
                <span className="font-mono text-sm font-bold text-[#183B32]">
                  {progressPercent}%
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-[#1E2022]">
                {completedSubmodules} of {totalSubmodules} submodules completed
              </h3>
              <p className="mt-1 text-xs text-[#5A6065]">
                {structuredRoadmap.targetRole} Curriculum — validated by Groq AI.
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full rounded-full bg-[#E5E5DE] overflow-hidden">
                <div
                  className="h-full bg-[#183B32] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F4F4F0]">
              <button
                onClick={() => setActiveTab('roadmap')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#183B32] hover:underline"
              >
                <span>Open Full Interactive Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Current Learning Focus Card */}
          <div className="rounded-2xl border border-[#183B32] bg-[#E2ECE9] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#183B32] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                  CURRENT LEARNING FOCUS
                </span>
                {inProgressSubmodule && (
                  <span className="text-[11px] font-semibold text-[#183B32] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {inProgressSubmodule.minutes} min estimated
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-bold text-[#1E2022]">
                {inProgressSubmodule
                  ? inProgressSubmodule.title
                  : structuredRoadmap.modules[0]?.submodules[0]?.title || 'Core Foundations'}
              </h3>
              <p className="mt-1 text-xs text-[#1F4D42]">
                {inProgressSubmodule
                  ? inProgressSubmodule.moduleTitle
                  : structuredRoadmap.modules[0]?.description || 'Master core foundational concepts for your target role.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#CBDAD5]">
              <button
                onClick={() => setActiveTab('roadmap')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#183B32] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C] transition-colors"
              >
                <span>Continue Study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Roadmap State per Requirement 3 */
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2ECE9] text-[#183B32]">
            <GitBranch className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-[#1E2022]">Build your personalized roadmap</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#5A6065]">
            Based on your skills and target role ({profile.targetRole || 'Backend Developer'}).
          </p>
          <button
            onClick={() => {
              setActiveTab('roadmap');
              generateRoadmap(profile.targetRole || 'Backend Developer');
            }}
            disabled={isGeneratingRoadmap}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-colors"
          >
            <Sparkles className="h-4 w-4 text-[#A3E635]" />
            <span>{isGeneratingRoadmap ? 'Analyzing skills with Groq...' : 'Build Roadmap'}</span>
          </button>
        </div>
      )}

      {/* 3. Skill Snapshot */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E2022] flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#183B32]" />
              Skill Snapshot
            </h2>
            <p className="text-[11px] text-[#5A6065]">
              Demonstrated proficiencies & verification status
            </p>
          </div>

          <button
            onClick={() => setActiveTab('assessment')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#183B32] hover:underline"
          >
            <span>Take Skill Assessment</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(profile.skills || {}).map(([name, skill]) => {
            const isDemonstrated = skill.evidence?.includes('assessment') || skill.evidence?.includes('interview');
            return (
              <div
                key={name}
                className="rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] p-3 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E2022]">{name}</span>
                  <span className="font-mono font-semibold text-[#183B32]">{skill.level}%</span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#E5E5DE] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDemonstrated ? 'bg-[#183B32]' : 'bg-[#D96B27]'
                    }`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span className={isDemonstrated ? 'font-semibold text-[#183B32]' : 'text-[#8C949D]'}>
                    {isDemonstrated ? '✓ Verified' : skill.level > 0 ? 'Self-Reported' : 'Not Assessed'}
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('assessment');
                      startAssessment(name);
                    }}
                    className="text-[#183B32] font-semibold hover:underline"
                  >
                    Assess
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Relevant Jobs Matching Section */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E2022] flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-[#183B32]" />
              Relevant Job Opportunities ({opportunities.length})
            </h2>
            <p className="text-[11px] text-[#5A6065]">
              Real job listings ranked by deterministic skill overlap & location
            </p>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#183B32] hover:underline"
          >
            <span>Explore all jobs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {topOpportunities.map((opp) => {
            const rec = opp.matchRecommendation;
            return (
              <div
                key={opp.id}
                onClick={() => setSelectedOpp(opp)}
                className="flex cursor-pointer flex-col justify-between gap-3 rounded-xl border border-[#E5E5DE] p-3.5 hover:border-[#CCD0D5] hover:bg-[#FBFBF9] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#1E2022] truncate">{opp.title}</h3>
                    <span className="rounded-md bg-[#E2ECE9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#183B32] shrink-0">
                      {rec?.matchScore ?? 0}% MATCH
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#5A6065]">
                    {opp.company} • {opp.location}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#183B32]">
                    {opp.salary}
                  </div>
                  {rec && rec.reasons && rec.reasons.length > 0 && (
                    <div className="mt-2 text-[11px] text-[#2A6658]">
                      ✓ {rec.reasons[0]}
                    </div>
                  )}
                  {rec && rec.missingSkills && rec.missingSkills.length > 0 && (
                    <div className="mt-1 text-[11px] text-[#D96B27]">
                      △ Gap: {rec.missingSkills[0]}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F0] text-xs">
                  <span className="text-[11px] text-[#8C949D]">{opp.source || 'Live Search'}</span>
                  <span className="font-semibold text-[#183B32] flex items-center gap-1">
                    Details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <OpportunityDetailModal
          opportunity={selectedOpp}
          onClose={() => setSelectedOpp(null)}
        />
      )}
    </div>
  );
};
