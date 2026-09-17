import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { Opportunity } from '../../types';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Award,
  AlertTriangle,
  Banknote,
  Compass,
  Check,
  ChevronRight
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, language, profile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'high_match' | 'remote' | 'nearby'>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  // User skills map for fast lookup
  const userSkillNames = new Set(
    Object.keys(profile?.skills || {}).map((s) => s.toLowerCase().trim())
  );

  const highMatchCount = opportunities.filter((o) => (o.matchRecommendation?.matchScore || 0) >= 80).length;
  const remoteCount = opportunities.filter((o) => o.isRemote).length;
  const nearbyCount = opportunities.filter((o) => o.distanceKm !== undefined && o.distanceKm <= 20).length;

  const filteredOpportunities = opportunities.filter((opp) => {
    // Tab filter
    if (selectedTab === 'high_match' && (opp.matchRecommendation?.matchScore || 0) < 80) return false;
    if (selectedTab === 'remote' && !opp.isRemote) return false;
    if (selectedTab === 'nearby' && (opp.distanceKm === undefined || opp.distanceKm > 20)) return false;

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q) ||
        opp.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Matching Explanation Banner */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#183B32] bg-[#E2ECE9] px-2 py-0.5 rounded">
                AI Career Alignment
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1E2022]">
              {t('opportunities', language)}
            </h1>
            <p className="mt-1 text-xs text-[#5A6065] max-w-2xl leading-relaxed">
              Jobs evaluated specifically against your profile skills ({Object.keys(profile?.skills || {}).join(', ')}), location ({profile?.location?.villageOrCity || 'Bengaluru'}), and experience.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8C949D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, skill, or location..."
                className="w-64 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2 pl-9 pr-3 text-xs text-[#1E2022] placeholder:text-[#8C949D] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#F4F4F0] pt-4">
          <button
            onClick={() => setSelectedTab('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedTab === 'all'
                ? 'bg-[#183B32] text-white shadow-2xs'
                : 'border border-[#E5E5DE] bg-white text-[#5A6065] hover:bg-[#F4F4F0]'
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>

          <button
            onClick={() => setSelectedTab('high_match')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedTab === 'high_match'
                ? 'bg-[#183B32] text-white shadow-2xs'
                : 'border border-[#E5E5DE] bg-white text-[#5A6065] hover:bg-[#F4F4F0]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#A3E635]" />
            <span>High Match (80%+) ({highMatchCount})</span>
          </button>

          <button
            onClick={() => setSelectedTab('remote')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedTab === 'remote'
                ? 'bg-[#183B32] text-white shadow-2xs'
                : 'border border-[#E5E5DE] bg-white text-[#5A6065] hover:bg-[#F4F4F0]'
            }`}
          >
            Remote Jobs ({remoteCount})
          </button>

          {nearbyCount > 0 && (
            <button
              onClick={() => setSelectedTab('nearby')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedTab === 'nearby'
                  ? 'bg-[#183B32] text-white shadow-2xs'
                  : 'border border-[#E5E5DE] bg-white text-[#5A6065] hover:bg-[#F4F4F0]'
              }`}
            >
              Nearby (&lt;20 km) ({nearbyCount})
            </button>
          )}
        </div>
      </div>

      {/* 2. User-Friendly Job Cards List */}
      {filteredOpportunities.length > 0 ? (
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => {
            const rec = opp.matchRecommendation;
            const score = rec?.matchScore || 75;

            // Determine badge styling based on score
            let scoreBadgeClass = 'bg-[#E2ECE9] text-[#183B32] border-[#CBDAD5]';
            let scoreLabel = 'Good Match';
            if (score >= 80) {
              scoreBadgeClass = 'bg-[#183B32] text-white border-[#183B32]';
              scoreLabel = 'Excellent Match';
            } else if (score < 65) {
              scoreBadgeClass = 'bg-[#FFF4EC] text-[#D96B27] border-[#FDBA74]';
              scoreLabel = 'Moderate Fit';
            }

            return (
              <div
                key={opp.id}
                id={`opp-card-${opp.id}`}
                className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-2xs hover:border-[#CBDAD5] transition-all space-y-4"
              >
                {/* Header Row: Title, Company, Match Pill */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E2022]">
                        {opp.title}
                      </h3>
                      {opp.isRemote ? (
                        <span className="rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4F46E5]">
                          Remote
                        </span>
                      ) : (
                        <span className="rounded-md bg-[#F4F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#5A6065]">
                          {opp.jobType || 'Full-Time'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6065] pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-[#33373B]">
                        <Building2 className="h-3.5 w-3.5 text-[#8C949D]" />
                        <span>{opp.company}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#8C949D]" />
                        <span>{opp.location}</span>
                      </span>
                      {opp.distanceKm !== undefined && (
                        <span className="text-[11px] text-[#2A6658]">
                          📍 {opp.distanceKm} km away
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side: Match Score Badge & Salary */}
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end shrink-0">
                    <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold ${scoreBadgeClass}`}>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{score}% Match • {scoreLabel}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#183B32]">
                      <Banknote className="h-3.5 w-3.5 text-[#183B32]" />
                      <span>{opp.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Why You Fit Highlights Box */}
                {rec && rec.reasons && rec.reasons.length > 0 && (
                  <div className="rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-3 text-xs space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#183B32] block">
                      Why this position fits you:
                    </span>
                    {rec.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#33373B]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32] shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skill Compatibility Tags: Matched vs Missing */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-[#5A6065]">
                    Required Skills Breakdown:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.skills.map((s, idx) => {
                      const isUserHasSkill = userSkillNames.has(s.toLowerCase().trim());
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border ${
                            isUserHasSkill
                              ? 'border-[#CBDAD5] bg-[#E2ECE9] text-[#183B32] font-semibold'
                              : 'border-[#E5E5DE] bg-[#FBFBF9] text-[#6B7280]'
                          }`}
                        >
                          {isUserHasSkill ? (
                            <Check className="h-3 w-3 text-[#183B32]" />
                          ) : (
                            <span className="text-[#8C949D]">•</span>
                          )}
                          <span>{s}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer: Metadata & Action */}
                <div className="flex flex-col justify-between gap-3 border-t border-[#F4F4F0] pt-3 text-xs sm:flex-row sm:items-center">
                  <span className="text-[11px] text-[#8C949D]">
                    Listed via {opp.source} • {opp.postedAt}
                  </span>

                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183B32] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-all"
                  >
                    <span>{t('viewDetails', language)} & Apply</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#CCD0D5] bg-white p-10 text-center shadow-2xs">
          <Briefcase className="mx-auto h-10 w-10 text-[#8C949D]" />
          <h3 className="mt-3 text-base font-bold text-[#1E2022]">No job opportunities match this filter</h3>
          <p className="mt-1 text-xs text-[#5A6065] max-w-sm mx-auto">
            Try switching filter tabs or clearing your search query to explore more jobs.
          </p>
          <button
            onClick={() => {
              setSelectedTab('all');
              setSearchQuery('');
            }}
            className="mt-4 rounded-xl bg-[#183B32] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15342C] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

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

