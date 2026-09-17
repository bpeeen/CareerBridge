import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { Zap, RefreshCw, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const RoadmapSimulator: React.FC = () => {
  const {
    profile,
    persona,
    language,
    adaptRoadmap,
    resetRoadmapSimulation,
    simulatedDiff,
    isAdaptingRoadmap,
  } = useApp();

  const [simulatedSql, setSimulatedSql] = useState<number>(85);
  const [simulatedPython, setSimulatedPython] = useState<number>(90);

  const handleRunSimulation = async () => {
    if (persona === 'student') {
      await adaptRoadmap({
        SQL: simulatedSql,
        Python: simulatedPython,
      });
    } else {
      await adaptRoadmap({
        'Solar PV Installation': 85,
        'Basic Electrical': 90,
      });
    }
  };

  return (
    <div id="roadmap-simulator-card" className="rounded-xl border border-[#E5E5DE] bg-white p-4 shadow-2xs">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF4EC] text-[#D96B27]">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
              {t('simulateSkillUpdate', language)}
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#5A6065]">
            {t('simulateSub', language)}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="run-simulation-btn"
            onClick={handleRunSimulation}
            disabled={isAdaptingRoadmap}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#183B32] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#15342C] disabled:opacity-50 transition-all"
          >
            {isAdaptingRoadmap ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-[#A3E635]" />
            )}
            <span>Apply Skill Update (Demo)</span>
          </button>

          {simulatedDiff && (
            <button
              id="reset-simulation-btn"
              onClick={resetRoadmapSimulation}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E5DE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#5A6065] hover:bg-[#F4F4F0]"
              title="Reset to Initial Baseline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Before & After Diff Box */}
      {simulatedDiff && (
        <div id="what-changed-panel" className="mt-4 rounded-xl border border-[#D8D8CF] bg-[#F8FAF9] p-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between border-b border-[#E2ECE9] pb-2 text-xs font-bold text-[#183B32]">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#183B32]" />
              <span>{t('whatChanged', language)}</span>
            </div>
            <span className="font-mono text-[11px] text-[#2A6658]">
              {simulatedDiff.estimatedTimeSavedHours ? `Saved ~${simulatedDiff.estimatedTimeSavedHours} hrs` : 'Roadmap Recalculated Dynamically'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[#E2ECE9] bg-white p-2.5">
              <span className="text-[10px] font-semibold text-[#5A6065] uppercase tracking-wider">
                {t('milestonesCompleted', language)}
              </span>
              <div className="mt-1 font-mono text-lg font-bold text-[#183B32]">
                +{simulatedDiff.milestonesCompleted || 1} Completed
              </div>
              <p className="text-[11px] text-[#5A6065]">Foundations verified</p>
            </div>

            <div className="rounded-lg border border-[#E2ECE9] bg-white p-2.5">
              <span className="text-[10px] font-semibold text-[#5A6065] uppercase tracking-wider">
                {t('milestonesAccelerated', language)}
              </span>
              <div className="mt-1 font-mono text-lg font-bold text-[#D96B27]">
                +{simulatedDiff.milestonesAccelerated || 2} Accelerated
              </div>
              <p className="text-[11px] text-[#5A6065]">Advanced milestones unlocked</p>
            </div>

            <div className="rounded-lg border border-[#E2ECE9] bg-white p-2.5">
              <span className="text-[10px] font-semibold text-[#5A6065] uppercase tracking-wider">
                {t('newFocus', language)}
              </span>
              <div className="mt-1 text-xs font-bold text-[#1E2022] truncate">
                {simulatedDiff.nowNext || 'Production System Deployment'}
              </div>
              <p className="text-[11px] text-[#5A6065]">Next immediate step</p>
            </div>
          </div>

          {simulatedDiff.details && simulatedDiff.details.length > 0 && (
            <div className="mt-3 space-y-1">
              {simulatedDiff.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#1F4D42]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32] shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
