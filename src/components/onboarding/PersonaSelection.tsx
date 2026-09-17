import React from 'react';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { Persona } from '../../types';

interface PersonaSelectionProps {
  onSelectPersona: (persona: Persona) => void;
}

export const PersonaSelection: React.FC<PersonaSelectionProps> = ({ onSelectPersona }) => {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#E2ECE9] px-3.5 py-1.5 text-xs font-semibold text-[#183B32]">
          <span>CareerBridge Onboarding</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E2022] sm:text-3xl">
          How can CareerBridge help you?
        </h1>
        <p className="text-xs text-[#5A6065] sm:text-sm">
          Choose your path to customize your experience and roadmap
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 text-left pt-2">
        {/* Student Card */}
        <button
          type="button"
          onClick={() => onSelectPersona('student')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs transition-all hover:border-[#183B32] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E2ECE9] text-[#183B32] group-hover:bg-[#183B32] group-hover:text-white transition-colors">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E2022] group-hover:text-[#183B32] transition-colors">
                🎓 Student
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5A6065]">
                Build skills, create a personalized roadmap, prepare for interviews and discover relevant jobs.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center text-xs font-semibold text-[#183B32] group-hover:translate-x-1 transition-transform">
            <span>Continue as Student</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </button>

        {/* Job Seeker Card */}
        <button
          type="button"
          onClick={() => onSelectPersona('livelihood')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E5DE] bg-white p-5 shadow-xs transition-all hover:border-[#D96B27] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4EC] text-[#D96B27] group-hover:bg-[#D96B27] group-hover:text-white transition-colors">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E2022] group-hover:text-[#D96B27] transition-colors">
                💼 Job Seeker
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5A6065]">
                Find jobs, discover government schemes and explore opportunities around you.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center text-xs font-semibold text-[#D96B27] group-hover:translate-x-1 transition-transform">
            <span>Continue as Job Seeker</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
