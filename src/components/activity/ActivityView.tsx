import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { LineChart, Clock, Award, BookOpen, CheckCircle2, Mic2, Landmark } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { activities, language, profile } = useApp();

  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mock_interview':
        return <Mic2 className="h-4 w-4 text-[#183B32]" />;
      case 'assessment':
        return <Award className="h-4 w-4 text-[#D96B27]" />;
      case 'roadmap_study':
        return <BookOpen className="h-4 w-4 text-[#4F46E5]" />;
      case 'scheme_view':
        return <Landmark className="h-4 w-4 text-[#92400E]" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#183B32]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#1E2022]">
          {t('activity', language)}
        </h1>
        <p className="mt-0.5 text-xs text-[#5A6065]">
          Your verified learning time and career preparation track record
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#5A6065]">Total Active Learning</span>
          <div className="mt-1 font-mono text-2xl font-bold text-[#183B32]">
            {Math.round(totalMinutes / 60)} hrs {totalMinutes % 60} mins
          </div>
          <p className="text-[11px] text-[#6B7280]">Across roadmaps & mock sessions</p>
        </div>

        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#5A6065]">Demonstrated Skills</span>
          <div className="mt-1 font-mono text-2xl font-bold text-[#D96B27]">
            {Object.values(profile?.skills || {}).filter((s) => s.evidence.includes('assessment')).length} Verified
          </div>
          <p className="text-[11px] text-[#6B7280]">Backed by concrete assessment</p>
        </div>

        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#5A6065]">Overall Readiness</span>
          <div className="mt-1 font-mono text-2xl font-bold text-[#183B32]">
            {profile?.readinessScore || 62}%
          </div>
          <p className="text-[11px] text-[#6B7280]">Calculated by matching engine</p>
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
          Chronological Activity Log
        </h2>

        <div className="mt-4 divide-y divide-[#F4F4F0]">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBFBF9] border border-[#E5E5DE] shrink-0 mt-0.5">
                {getActivityIcon(act.activityType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1E2022]">{act.title}</h3>
                  <span className="font-mono text-[10px] text-[#8C949D]">
                    {new Date(act.timestamp || act.date || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                {act.details && (
                  <p className="mt-0.5 text-[11px] text-[#5A6065]">{act.details}</p>
                )}
                <div className="mt-1 flex items-center gap-2 text-[10px] text-[#6B7280]">
                  <Clock className="h-3 w-3" />
                  <span>{act.minutes} minutes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
