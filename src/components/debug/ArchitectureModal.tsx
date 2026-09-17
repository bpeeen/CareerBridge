import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ArchitectureStatus } from '../../types';
import { Cpu, CheckCircle2, Database, Sparkles, X, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const { showArchitectureModal, setShowArchitectureModal } = useApp();
  const [telemetry, setTelemetry] = useState<ArchitectureStatus | null>(null);

  useEffect(() => {
    if (showArchitectureModal) {
      api.getArchitectureStatus().then(setTelemetry).catch(console.error);
    }
  }, [showArchitectureModal]);

  if (!showArchitectureModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#183B32] text-white">
              <Cpu className="h-4 w-4 text-[#A3E635]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2022]">Architecture & Engine Telemetry</h2>
              <p className="text-[11px] text-[#5A6065]">
                Shared Matching Engine & Grounded Data Pipeline Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EFEFED]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Architecture Pipeline Map */}
        <div className="mt-6 rounded-xl border border-[#E5E5DE] bg-white p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6065]">
            Unified Architecture Pipeline
          </h3>

          <div className="mt-4 flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-between">
            {/* Box 1: User Profile */}
            <div className="flex w-full flex-col rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] p-3 text-center sm:w-1/4">
              <span className="font-mono text-[10px] text-[#8C949D]">INPUT LAYER</span>
              <span className="mt-1 font-bold text-[#1E2022]">User Profile</span>
              <span className="text-[10px] text-[#5A6065]">Student / Rural Worker</span>
            </div>

            <ArrowRight className="h-4 w-4 text-[#5A6065] shrink-0" />

            {/* Box 2: Shared Matching Engine */}
            <div className="flex w-full flex-col rounded-lg border-2 border-[#183B32] bg-[#E2ECE9] p-3 text-center sm:w-2/4">
              <div className="flex items-center justify-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-[#183B32]" />
                <span className="font-bold text-[#183B32]">SHARED MATCHING ENGINE</span>
              </div>
              <p className="mt-1 text-[10px] text-[#1F4D42]">
                • 8-Factor Explainable Scoring<br />
                • Deterministic & Fuzzy Eligibility<br />
                • Adaptive DAG Roadmap Generator<br />
                • Grounded RAG Schemes Retrieval
              </p>
            </div>

            <ArrowRight className="h-4 w-4 text-[#5A6065] shrink-0" />

            {/* Box 3: Shared Output Contracts */}
            <div className="flex w-full flex-col rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] p-3 text-center sm:w-1/4">
              <span className="font-mono text-[10px] text-[#8C949D]">OUTPUT INTERFACES</span>
              <span className="mt-1 font-bold text-[#1E2022]">Standard Contract</span>
              <span className="text-[10px] text-[#5A6065]">Recommendation & Roadmap</span>
            </div>
          </div>
        </div>

        {/* Scoring Factor Weights */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E5E5DE] bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E2022]">
              <Layers className="h-4 w-4 text-[#183B32]" />
              <span>Transparent Scoring Factors (100% Total)</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-[#5A6065]">
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Skill Match (Demonstrated & Self-Reported)</span>
                <span className="font-mono font-semibold text-[#183B32]">35%</span>
              </li>
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Location Proximity & Commute Radius</span>
                <span className="font-mono font-semibold text-[#183B32]">20%</span>
              </li>
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Eligibility & Right-to-Work Criteria</span>
                <span className="font-mono font-semibold text-[#183B32]">15%</span>
              </li>
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Experience Baseline & Track Record</span>
                <span className="font-mono font-semibold text-[#183B32]">10%</span>
              </li>
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Education Background Compatibility</span>
                <span className="font-mono font-semibold text-[#183B32]">10%</span>
              </li>
              <li className="flex justify-between border-b border-[#F4F4F0] pb-1">
                <span>Interest & Long-Term Domain Alignment</span>
                <span className="font-mono font-semibold text-[#183B32]">5%</span>
              </li>
              <li className="flex justify-between">
                <span>Data Freshness & Source Verifiability</span>
                <span className="font-mono font-semibold text-[#183B32]">5%</span>
              </li>
            </ul>
          </div>

          {/* Live Providers & Integrity Status */}
          <div className="rounded-xl border border-[#E5E5DE] bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E2022]">
              <ShieldCheck className="h-4 w-4 text-[#183B32]" />
              <span>Live Data Sources & AI Grounding</span>
            </div>
            <div className="mt-3 space-y-2 text-xs text-[#5A6065]">
              <div className="flex items-center justify-between rounded-lg bg-[#FBFBF9] p-2 border border-[#E5E5DE]">
                <div>
                  <div className="font-semibold text-[#1E2022]">National Career Service (NCS)</div>
                  <div className="text-[10px] text-[#8C949D]">Live Aggregated Jobs & Verified Feed</div>
                </div>
                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#183B32]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32]" /> Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#FBFBF9] p-2 border border-[#E5E5DE]">
                <div>
                  <div className="font-semibold text-[#1E2022]">MSDE & NSDC Schemes Repository</div>
                  <div className="text-[10px] text-[#8C949D]">PMKVY 4.0, PM Vishwakarma, DDU-GKY, Mudra</div>
                </div>
                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#183B32]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32]" /> 6 Verified
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#FBFBF9] p-2 border border-[#E5E5DE]">
                <div>
                  <div className="font-semibold text-[#1E2022]">Gemini 3.8 Flash (Server-Side)</div>
                  <div className="text-[10px] text-[#8C949D]">Grounded RAG & Deep Interview Evaluation</div>
                </div>
                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#183B32]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#183B32]" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-[#E5E5DE] pt-4">
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="rounded-lg bg-[#183B32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#15342C]"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
