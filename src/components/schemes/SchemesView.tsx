import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { api } from '../../services/api';
import { GovScheme } from '../../types';
import { AudioPlayer } from '../ui/AudioPlayer';
import { VoiceButton } from '../ui/VoiceButton';
import { 
  Landmark, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';

export const SchemesView: React.FC = () => {
  const { schemes, language, profile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string>(schemes[0]?.id || 'scheme-pmkvy-4');

  // Grounded RAG Chat query state
  const [ragQuery, setRagQuery] = useState('');
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [ragResponse, setRagResponse] = useState<{
    answer: string;
    matchedSchemes: GovScheme[];
    sourceCitations: { name: string; authority: string; url: string }[];
  } | null>(null);

  const handleRagSearch = async (queryToRun?: string) => {
    const q = queryToRun || ragQuery;
    if (!q.trim()) return;
    setIsRagLoading(true);

    try {
      const result = await api.querySchemesRAG(q, language);
      setRagResponse(result);
    } catch (err) {
      console.error('RAG query error:', err);
    } finally {
      setIsRagLoading(false);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nameHi.includes(searchQuery) ||
      s.category.toLowerCase().includes(q) ||
      s.targetAudience.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1E2022]">
            {t('schemes', language)}
          </h1>
          <p className="mt-0.5 text-xs text-[#5A6065]">
            Verified Government Skill & Livelihood Support Schemes with Grounded Eligibility Matching
          </p>
        </div>
      </div>

      {/* Grounded RAG Natural Language & Voice Assistance Box */}
      <div className="rounded-2xl border border-[#D8D8CF] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#183B32] text-white">
              <Sparkles className="h-4 w-4 text-[#A3E635]" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#183B32]">
                {language === 'hi' ? 'स्मार्ट योजना सहायता (Grounded AI Guidance)' : 'Smart Scheme Finder & Eligibility Assistant'}
              </h3>
              <p className="text-[11px] text-[#5A6065]">
                {language === 'hi'
                  ? 'अपनी आवश्यकता बोलकर या लिखकर पूछें — केवल आधिकारिक सरकारी स्रोतों से उत्तर'
                  : 'Ask natural questions about free training, loans, or tools in English or Hindi'}
              </p>
            </div>
          </div>
        </div>

        {/* Input bar with Voice and Submit */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRagSearch()}
              placeholder={
                language === 'hi'
                  ? 'जैसे: "मेरे लिए कोई सरकारी योजना है जिसमें स्किल ट्रेनिंग फ्री हो?"'
                  : 'e.g. "Which scheme provides free solar electrician certification and toolkit voucher?"'
              }
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2.5 pl-3.5 pr-10 text-xs text-[#1E2022] placeholder:text-[#8C949D] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            />
          </div>

          <VoiceButton
            onTranscript={(text) => {
              setRagQuery(text);
              handleRagSearch(text);
            }}
          />

          <button
            onClick={() => handleRagSearch()}
            disabled={isRagLoading || !ragQuery.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#15342C] disabled:opacity-50 transition-all"
          >
            {isRagLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>

        {/* Preset Sample Prompts */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#5A6065]">
          <span className="font-semibold text-[#8C949D]">Try asking:</span>
          <button
            onClick={() => {
              const q = language === 'hi' ? 'पीएम विश्वकर्मा योजना के क्या फायदे हैं और टूलकिट कैसे मिलेगी?' : 'What benefits does PM Vishwakarma provide for electricians?';
              setRagQuery(q);
              handleRagSearch(q);
            }}
            className="rounded-md border border-[#E5E5DE] bg-[#FBFBF9] px-2 py-0.5 hover:bg-[#F4F4F0] text-[#1E2022]"
          >
            {language === 'hi' ? 'विश्वकर्मा योजना टूलकिट' : 'PM Vishwakarma Toolkit'}
          </button>
          <button
            onClick={() => {
              const q = language === 'hi' ? 'PMKVY में फ्री ट्रेनिंग और सर्टिफिकेट कैसे लें?' : 'How to enroll in PMKVY free certification course?';
              setRagQuery(q);
              handleRagSearch(q);
            }}
            className="rounded-md border border-[#E5E5DE] bg-[#FBFBF9] px-2 py-0.5 hover:bg-[#F4F4F0] text-[#1E2022]"
          >
            {language === 'hi' ? 'PMKVY फ्री ट्रेनिंग' : 'PMKVY Free Training'}
          </button>
        </div>

        {/* Grounded RAG Result Display */}
        {ragResponse && (
          <div className="mt-4 rounded-xl border border-[#E2ECE9] bg-[#F8FAF9] p-4 text-xs text-[#1E2022] space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#E2ECE9] pb-2">
              <span className="font-bold text-[#183B32]">Verified Guidance Synthesis</span>
              <AudioPlayer textToRead={ragResponse.answer} />
            </div>

            <p className="text-xs leading-relaxed text-[#1F4D42] whitespace-pre-line">
              {ragResponse.answer}
            </p>

            {ragResponse.sourceCitations.length > 0 && (
              <div className="border-t border-[#E2ECE9] pt-2 text-[11px] text-[#5A6065]">
                <span className="font-bold text-[#183B32]">Official Sourced Portals:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {ragResponse.sourceCitations.map((cite, i) => (
                    <a
                      key={i}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#183B32] border border-[#CCD0D5] hover:underline"
                    >
                      <span>{cite.name}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Official Schemes Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E2022]">
            Verified Government Schemes Directory
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#8C949D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter schemes..."
              className="w-48 rounded-lg border border-[#E5E5DE] bg-white py-1 pl-8 pr-3 text-xs text-[#1E2022] focus:border-[#183B32] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSchemes.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;
            const rec = scheme.matchRecommendation;

            return (
              <div
                key={scheme.id}
                id={`scheme-card-${scheme.id}`}
                className="rounded-xl border border-[#E5E5DE] bg-white shadow-2xs hover:border-[#CCD0D5] transition-all"
              >
                <div
                  onClick={() => setExpandedSchemeId(isExpanded ? '' : scheme.id)}
                  className="flex cursor-pointer items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E2ECE9] text-[#183B32] shrink-0">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-[#EFEFED] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#5A6065]">
                          {scheme.category}
                        </span>
                        {scheme.id.startsWith('scheme-state') || scheme.id.startsWith('scheme-jsdm') || scheme.id.startsWith('scheme-bihar') || scheme.id.startsWith('scheme-up') || scheme.id.startsWith('scheme-jh') ? (
                          <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-bold text-[#92400E]">
                            📍 State Scheme ({profile?.location?.state || 'Local'})
                          </span>
                        ) : (
                          <span className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-medium text-[#4B5563]">
                            🇮🇳 Central Scheme
                          </span>
                        )}
                        {rec && rec.matchScore >= 80 && (
                          <span className="rounded bg-[#E2ECE9] px-1.5 py-0.5 text-[10px] font-bold text-[#183B32]">
                            {rec.matchScore}% ELIGIBLE
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-[#1E2022]">
                        {language === 'hi' ? scheme.nameHi : scheme.name}
                      </h3>
                      <p className="text-[11px] text-[#5A6065]">{scheme.authority}</p>

                      {/* Concise Key Benefit Preview */}
                      <p className="mt-1 line-clamp-1 text-xs font-medium text-[#183B32]">
                        ✓ {(language === 'hi' && scheme.benefitsHi ? scheme.benefitsHi[0] : scheme.benefits[0])}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <AudioPlayer
                      textToRead={`${scheme.name}. ${scheme.benefits.join('. ')}`}
                    />
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-[#5A6065]" /> : <ChevronDown className="h-4 w-4 text-[#5A6065]" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#E5E5DE] p-4 pt-3 bg-[#FBFBF9] space-y-4 rounded-b-xl text-xs">
                    {/* Key Benefits */}
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[#183B32] text-[11px]">
                        Scheme Benefits & Financial Support
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-[#33373B]">
                        {(language === 'hi' && scheme.benefitsHi ? scheme.benefitsHi : scheme.benefits).map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Eligibility & Documents */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                      <div className="rounded-lg border border-[#E5E5DE] bg-white p-3">
                        <div className="font-bold text-[#1E2022]">Eligibility Criteria</div>
                        <ul className="mt-1.5 space-y-1 text-[11px] text-[#5A6065]">
                          <li>• Age: {scheme.eligibilityCriteria.ageRange[0]}–{scheme.eligibilityCriteria.ageRange[1]} years</li>
                          <li>• Education: {scheme.eligibilityCriteria.educationMin}</li>
                          {scheme.eligibilityCriteria.specialCriteria?.map((sc, i) => (
                            <li key={i}>• {sc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-[#E5E5DE] bg-white p-3">
                        <div className="font-bold text-[#1E2022]">Required Documents</div>
                        <ul className="mt-1.5 space-y-1 text-[11px] text-[#5A6065]">
                          {scheme.requiredDocuments.map((doc, i) => (
                            <li key={i}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Application steps */}
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[#1E2022] text-[11px]">
                        Application Steps & Enrollment
                      </h4>
                      <div className="mt-2 space-y-1.5">
                        {scheme.applicationProcess.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-[#5A6065]">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#183B32] text-[9px] font-bold text-white shrink-0">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer with official portal link */}
                    <div className="flex items-center justify-between border-t border-[#E5E5DE] pt-3 text-[11px] text-[#8C949D]">
                      <span>Source: {scheme.officialSource} ({scheme.lastUpdated})</span>
                      <a
                        href={scheme.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#183B32] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#15342C] transition-colors"
                      >
                        <span>Official Government Portal</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
