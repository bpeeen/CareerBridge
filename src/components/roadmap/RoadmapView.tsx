import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentModal } from '../assessment/AssessmentModal';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  PlayCircle,
  Target,
  Trash2
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const {
    profile,
    structuredRoadmap,
    generateRoadmap,
    deleteRoadmap,
    updateSubmoduleStatus,
    isGeneratingRoadmap,
  } = useApp();

  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);
  const [assessmentSkill, setAssessmentSkill] = useState<string | null>(null);

  // Initialize first module expanded when roadmap loads
  useEffect(() => {
    if (structuredRoadmap?.modules?.length && expandedModuleIds.length === 0) {
      setExpandedModuleIds([structuredRoadmap.modules[0].id]);
    }
  }, [structuredRoadmap]);

  // Calculate milestones completed vs total
  let totalSubmodules = 0;
  let completedSubmodules = 0;

  if (structuredRoadmap?.modules) {
    for (const mod of structuredRoadmap.modules) {
      for (const sm of mod.submodules) {
        totalSubmodules++;
        if (sm.status === 'completed') {
          completedSubmodules++;
        }
      }
    }
  }

  const progressPercent = totalSubmodules > 0
    ? Math.round((completedSubmodules / totalSubmodules) * 100)
    : 0;

  const toggleExpand = (modId: string) => {
    if (expandedModuleIds.includes(modId)) {
      setExpandedModuleIds(expandedModuleIds.filter((id) => id !== modId));
    } else {
      setExpandedModuleIds([...expandedModuleIds, modId]);
    }
  };

  const handleSubmoduleStatusChange = (
    moduleId: string,
    submoduleId: string,
    currentStatus: 'not_started' | 'in_progress' | 'completed'
  ) => {
    const nextStatus: 'not_started' | 'in_progress' | 'completed' =
      currentStatus === 'completed'
        ? 'not_started'
        : currentStatus === 'in_progress'
        ? 'completed'
        : 'in_progress';

    updateSubmoduleStatus(moduleId, submoduleId, nextStatus);
  };

  if (!structuredRoadmap) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-10 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E2ECE9] text-[#183B32]">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#1E2022]">Build your personalized roadmap</h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#5A6065]">
            Based on your skills ({Object.keys(profile?.skills || {}).join(', ') || 'demonstrated proficiencies'}) and target role ({profile?.targetRole || profile?.tradeOrDomain || 'Backend Developer'}).
          </p>
          <button
            onClick={() => generateRoadmap(profile?.targetRole || profile?.tradeOrDomain || 'Backend Developer')}
            disabled={isGeneratingRoadmap}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-colors"
          >
            <Sparkles className="h-4 w-4 text-[#A3E635]" />
            <span>{isGeneratingRoadmap ? 'Analyzing skills & generating curriculum...' : 'Build Roadmap'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header: Target role & Overall Progress */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#183B32] bg-[#E2ECE9] px-2 py-0.5 rounded">
                Personalized Learning Engine
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1E2022]">
              {profile?.targetRole || profile?.tradeOrDomain || structuredRoadmap.targetRole || 'Backend Developer'} Roadmap
            </h1>
            <p className="mt-1 text-xs text-[#5A6065] max-w-2xl leading-relaxed">
              Based on your demonstrated skills ({Object.keys(profile?.skills || {}).join(', ')}), this structured path advances your capability to job readiness.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6065]">
                Overall Progress
              </div>
              <div className="font-mono text-2xl font-bold text-[#183B32]">
                {progressPercent}%
              </div>
              <div className="text-[10px] text-[#2A6658]">
                {completedSubmodules} of {totalSubmodules} submodules done
              </div>
            </div>

            <button
              onClick={() => deleteRoadmap()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2] px-4 py-2.5 text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] transition-all"
            >
              <Trash2 className="h-4 w-4 text-[#DC2626]" />
              <span>Delete Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Structured Roadmap Modules View */}
      <div className="space-y-4">
        {structuredRoadmap.modules.map((mod, modIdx) => {
          const isExpanded = expandedModuleIds.includes(mod.id);
          const completedCount = mod.submodules.filter((s) => s.status === 'completed').length;
          const isAllCompleted = completedCount === mod.submodules.length && mod.submodules.length > 0;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all ${
                isAllCompleted
                  ? 'border-[#CCD0D5] bg-[#F8FAF9]'
                  : isExpanded
                  ? 'border-[#183B32] bg-white ring-1 ring-[#183B32]/10 shadow-xs'
                  : 'border-[#E5E5DE] bg-[#FBFBF9]'
              }`}
            >
              {/* Module Header */}
              <div
                onClick={() => toggleExpand(mod.id)}
                className="flex cursor-pointer items-center justify-between p-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0">
                    {isAllCompleted ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#183B32] text-white">
                        <CheckCircle2 className="h-5 w-5 text-[#A3E635]" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#183B32] font-mono text-xs font-bold text-[#183B32]">
                        Step {modIdx + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5A6065]">
                        Step {modIdx + 1}
                      </span>
                      <span className="rounded bg-[#EFEFED] px-1.5 py-0.2 font-mono text-[10px] text-[#5A6065]">
                        {completedCount} / {mod.submodules.length} Completed
                      </span>
                    </div>
                    <h2 className="mt-0.5 text-base font-bold text-[#1E2022]">
                      {mod.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-[11px] font-semibold text-[#183B32]">
                      {mod.learningObjective}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-[#5A6065]" /> : <ChevronDown className="h-5 w-5 text-[#5A6065]" />}
                </div>
              </div>

              {/* Module Submodules & Resources */}
              {isExpanded && (
                <div className="border-t border-[#E5E5DE] p-5 pt-4 space-y-4 bg-white rounded-b-2xl">
                  <p className="text-xs text-[#5A6065] leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
                      Submodules & Milestones
                    </h3>

                    {mod.submodules.map((submodule) => {
                      const isSubCompleted = submodule.status === 'completed';
                      const isSubInProgress = submodule.status === 'in_progress';

                      return (
                        <div
                          key={submodule.id}
                          className={`rounded-xl border p-3.5 transition-all ${
                            isSubCompleted
                              ? 'border-[#CCD0D5] bg-[#F8FAF9]'
                              : isSubInProgress
                              ? 'border-[#183B32] bg-[#E2ECE9]/30'
                              : 'border-[#E5E5DE] bg-white hover:bg-[#FBFBF9]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              {/* Toggle status button */}
                              <button
                                onClick={() => handleSubmoduleStatusChange(mod.id, submodule.id, submodule.status)}
                                className="mt-0.5 shrink-0 transition-transform active:scale-95"
                                title="Click to toggle: Not started -> In progress -> Completed"
                              >
                                {isSubCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-[#183B32] fill-[#183B32]/10" />
                                ) : isSubInProgress ? (
                                  <PlayCircle className="h-5 w-5 text-[#D96B27]" />
                                ) : (
                                  <Circle className="h-5 w-5 text-[#CCD0D5] hover:text-[#8C949D]" />
                                )}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-xs font-bold ${isSubCompleted ? 'line-through text-[#8C949D]' : 'text-[#1E2022]'}`}>
                                    {submodule.title}
                                  </h4>
                                  <span className="rounded bg-[#F4F4F0] px-1.5 py-0.5 font-mono text-[10px] text-[#5A6065] flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {submodule.estimatedMinutes}m
                                  </span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                      isSubCompleted
                                        ? 'bg-[#E2ECE9] text-[#183B32]'
                                        : isSubInProgress
                                        ? 'bg-[#FFF4EC] text-[#D96B27]'
                                        : 'bg-[#EFEFED] text-[#5A6065]'
                                    }`}
                                  >
                                    {isSubCompleted ? 'Completed' : isSubInProgress ? 'In Progress' : 'Not Started'}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-[#5A6065]">
                                  {submodule.description}
                                </p>

                                {/* Learning resource links */}
                                {submodule.resources && submodule.resources.length > 0 && (
                                  <div className="mt-2.5 flex flex-wrap gap-2">
                                    {submodule.resources.map((res, rIdx) => (
                                      <a
                                        key={rIdx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5DE] bg-white px-2 py-1 text-[11px] font-semibold text-[#183B32] hover:bg-[#F4F4F0] shadow-2xs"
                                      >
                                        <BookOpen className="h-3 w-3 text-[#183B32]" />
                                        <span>{res.title}</span>
                                        <ExternalLink className="h-2.5 w-2.5 text-[#8C949D]" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleSubmoduleStatusChange(mod.id, submodule.id, submodule.status)}
                              className={`rounded-lg px-3 py-1 text-xs font-semibold shrink-0 transition-colors ${
                                isSubCompleted
                                  ? 'border border-[#CCD0D5] bg-white text-[#5A6065] hover:bg-[#F4F4F0]'
                                  : isSubInProgress
                                  ? 'bg-[#183B32] text-white hover:bg-[#15342C]'
                                  : 'border border-[#183B32] text-[#183B32] hover:bg-[#E2ECE9]'
                              }`}
                            >
                              {isSubCompleted ? 'Mark Incomplete' : isSubInProgress ? 'Complete Milestone' : 'Start Milestone'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assessment Modal */}
      {assessmentSkill && (
        <AssessmentModal
          isOpen={Boolean(assessmentSkill)}
          onClose={() => setAssessmentSkill(null)}
          skillName={assessmentSkill}
        />
      )}
    </div>
  );
};
