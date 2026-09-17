import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { AudioPlayer } from '../ui/AudioPlayer';
import { OpportunityDetailModal } from '../opportunities/OpportunityDetailModal';
import { Opportunity } from '../../types';
import {
  Briefcase,
  Landmark,
  GraduationCap,
  Mic,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const RuralDashboard: React.FC = () => {
  const {
    profile,
    opportunities,
    schemes,
    setActiveTab,
    language,
    setActiveVoiceQuery,
  } = useApp();

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  if (!profile) return null;

  const topOpportunities = opportunities.slice(0, 3);
  const topSchemes = schemes.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Greeting Header */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#E2ECE9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#183B32]">
                {profile.tradeOrDomain || 'Electrical Trade'}
              </span>
              <span className="text-xs text-[#5A6065]">
                {profile.experienceYears} Years Practical Experience
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2022]">
              {language === 'hi' ? `नमस्ते, ${profile.name}` : `Namaste, ${profile.name}`}
            </h1>
            <p className="mt-0.5 text-xs text-[#5A6065]">
              {profile.location.villageOrCity}, {profile.location.district} ({profile.location.state}) • Search Radius: 15 km
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AudioPlayer
              textToRead={
                language === 'hi'
                  ? `नमस्ते ${profile.name}, आपके क्षेत्र में ${topOpportunities.length} रोजगार के अवसर और सरकारी योजनाएं उपलब्ध हैं।`
                  : `Hello ${profile.name}, there are ${topOpportunities.length} verified opportunities and schemes near you in ${profile.location.district}.`
              }
            />
          </div>
        </div>

        {/* 2. What do you need today? Big 4 Touch Action Cards */}
        <div className="mt-6 border-t border-[#F4F4F0] pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5A6065]">
            {language === 'hi' ? 'आज आपको क्या चाहिए?' : 'What do you need today?'}
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              id="rural-action-jobs"
              onClick={() => setActiveTab('opportunities')}
              className="flex flex-col items-start rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] p-4 text-left hover:border-[#183B32] hover:bg-white transition-all shadow-2xs group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E2ECE9] text-[#183B32] group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#1E2022]">
                {language === 'hi' ? 'नजदीकी काम खोजें' : 'Find Local Work'}
              </h3>
              <p className="mt-1 text-[11px] text-[#5A6065]">
                {topOpportunities.length} opportunities in {profile.location.district}
              </p>
            </button>

            <button
              id="rural-action-schemes"
              onClick={() => setActiveTab('schemes')}
              className="flex flex-col items-start rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] p-4 text-left hover:border-[#183B32] hover:bg-white transition-all shadow-2xs group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF4EC] text-[#D96B27] group-hover:scale-105 transition-transform">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#1E2022]">
                {language === 'hi' ? 'सरकारी योजनाएं' : 'Government Schemes'}
              </h3>
              <p className="mt-1 text-[11px] text-[#5A6065]">
                {schemes.length} schemes match your profile
              </p>
            </button>

            <button
              id="rural-action-voice"
              onClick={() => {
                setActiveVoiceQuery('PMKVY');
                setActiveTab('schemes');
              }}
              className="flex flex-col items-start rounded-xl border border-[#183B32] bg-[#E2ECE9]/50 p-4 text-left hover:bg-[#E2ECE9] transition-all shadow-2xs group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#183B32] text-white group-hover:scale-105 transition-transform">
                <Mic className="h-5 w-5 text-[#A3E635]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#183B32]">
                {language === 'hi' ? 'बोलकर पूछें' : 'Ask CareerBridge'}
              </h3>
              <p className="mt-1 text-[11px] text-[#1F4D42]">
                {language === 'hi' ? 'हिंदी या इंग्लिश में बोलें' : 'Voice assistant in Hindi / English'}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Top Local Opportunities Section */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
              {language === 'hi' ? 'आपके नजदीकी रोजगार के अवसर' : 'Verified Local Work Opportunities'}
            </h2>
            <p className="text-[11px] text-[#5A6065]">
              Matching {profile.tradeOrDomain || 'Electrical'} in {profile.location.district} and neighboring industrial zones
            </p>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#183B32] hover:underline"
          >
            <span>{t('viewDetails', language)}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {topOpportunities.map((opp) => {
            const rec = opp.matchRecommendation;
            return (
              <div
                key={opp.id}
                onClick={() => setSelectedOpp(opp)}
                className="flex cursor-pointer flex-col justify-between gap-2 rounded-xl border border-[#E5E5DE] p-3.5 hover:border-[#CCD0D5] hover:bg-[#FBFBF9] transition-all sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1E2022]">{opp.title}</h3>
                    {opp.distanceKm !== undefined && (
                      <span className="rounded bg-[#EFEFED] px-1.5 py-0.5 text-[10px] font-semibold text-[#5A6065]">
                        {opp.distanceKm} km
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-[#5A6065]">
                    {opp.company} • {opp.location} • <strong className="text-[#183B32]">{opp.salary}</strong>
                  </div>
                  {rec && rec.reasons.length > 0 && (
                    <div className="mt-1 text-[11px] text-[#2A6658]">
                      ✓ {rec.reasons[0]}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded bg-[#E2ECE9] px-2 py-1 font-mono text-xs font-bold text-[#183B32]">
                    {rec?.matchScore ?? 0}% MATCH
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#8C949D]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top Government Schemes */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E2022]">
              {language === 'hi' ? 'आपके लिए सरकारी योजनाएं एवं लाभ' : 'Government Schemes You Are Eligible For'}
            </h2>
            <p className="text-[11px] text-[#5A6065]">
              Free skill development, equipment vouchers, and subsidized credit
            </p>
          </div>

          <button
            onClick={() => setActiveTab('schemes')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#183B32] hover:underline"
          >
            <span>{language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#183B32] border border-[#CCD0D5]">
                    {scheme.category}
                  </span>
                  <AudioPlayer textToRead={`${scheme.name}. ${scheme.benefits[0]}`} />
                </div>
                <h3 className="mt-2 text-sm font-bold text-[#1E2022]">
                  {language === 'hi' ? scheme.nameHi : scheme.name}
                </h3>
                <p className="text-[11px] text-[#5A6065]">{scheme.authority}</p>

                <div className="mt-3 space-y-1 text-xs text-[#1F4D42]">
                  {scheme.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2ECE9] flex justify-end">
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="text-xs font-bold text-[#183B32] hover:underline"
                >
                  {language === 'hi' ? 'आवेदन की प्रक्रिया देखें →' : 'View application steps →'}
                </button>
              </div>
            </div>
          ))}
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
