import React from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { X, ExternalLink, CheckCircle2, AlertCircle, Building2, MapPin, Zap } from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
}) => {
  const { language, setActiveTab } = useApp();

  if (!opportunity) return null;

  const rec = opportunity.matchRecommendation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-[#E5E5DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#E2ECE9] px-2 py-0.5 font-mono text-xs font-bold text-[#183B32]">
                {rec?.matchScore ?? 0}% MATCH
              </span>
              <span className="text-xs text-[#6B7280]">{opportunity.jobType}</span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-[#1E2022]">{opportunity.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#5A6065]">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>{opportunity.company}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{opportunity.location}</span>
              </span>
              <span className="font-semibold text-[#183B32]">{opportunity.salary}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EFEFED]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Explainable Match Reason Card */}
        <div className="mt-5 rounded-xl border border-[#E2ECE9] bg-white p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#183B32]">
            {t('whyThisMatches', language)}
          </h3>
          <ul className="mt-2 space-y-1.5 text-xs text-[#33373B]">
            {rec?.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#183B32] shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skill Gap Analysis Box */}
        {rec && rec.missingRequirements && rec.missingRequirements.length > 0 && (
          <div className="mt-4 rounded-xl border border-[#FED7AA] bg-[#FFF4EC] p-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#D96B27]">
              <AlertCircle className="h-4 w-4" />
              <span>Skill Gap & Recommended Action</span>
            </div>
            <p className="mt-1 text-[#9A3412]">
              To increase your match probability for this role, focus on:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {rec.missingRequirements.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-[#FDBA74] bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#D96B27]"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('roadmap');
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D96B27] hover:underline"
              >
                <span>Jump to relevant roadmap milestone</span>
                <Zap className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Job Description & Responsibilities */}
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
            Role Overview & Requirements
          </h3>
          <p className="text-xs text-[#5A6065] leading-relaxed">{opportunity.description}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {opportunity.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-md border border-[#E5E5DE] bg-white px-2.5 py-1 text-xs font-medium text-[#33373B]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Source & Freshness Metadata */}
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#E5E5DE] pt-4 text-[11px] text-[#6B7280] sm:flex-row sm:items-center">
          <div>
            <span>Source: <strong className="text-[#1E2022]">{opportunity.source}</strong></span>
            <span className="ml-2 font-mono text-[10px]">({opportunity.postedAt})</span>
          </div>

          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#183B32] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-colors"
          >
            <span>View original listing</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
