import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserSkill, Persona } from '../../types';
import { authService } from '../../services/auth';
import { api } from '../../services/api';
import { ArrowLeft, ArrowRight, Check, Plus, X, Loader2, GraduationCap } from 'lucide-react';

interface JobSeekerOnboardingFormProps {
  onBackToSelection: () => void;
  onSwitchPersona?: (persona: Persona) => void;
}

const TRADE_OPTIONS = [
  'Electrician & Electrical Maintenance',
  'Solar PV Technician & Installer',
  'Plumber & Pipe Fitting',
  'Garments & Apparel Tailoring',
  'Automobile & Motor Mechanic',
  'Construction & Masonry Work',
  'Retail Sales & Store Executive',
  'Delivery & Logistics Rider',
  'Custom Trade / Work Type',
];

const SUGGESTED_TRADE_SKILLS: Record<string, string[]> = {
  'Electrician & Electrical Maintenance': ['House Wiring', 'Circuit Breakers', 'Inverter Installation', 'Safety Equipment'],
  'Solar PV Technician & Installer': ['Solar Panel Mounting', 'Inverter Wiring', 'Battery Maintenance', 'DC Wiring'],
  'Plumber & Pipe Fitting': ['PVC Piping', 'Leakage Repair', 'Sanitary Fitting', 'Pump Servicing'],
  'Garments & Apparel Tailoring': ['Industrial Sewing Machine', 'Pattern Cutting', 'Quality Inspection', 'Alterations'],
};

export const JobSeekerOnboardingForm: React.FC<JobSeekerOnboardingFormProps> = ({ onBackToSelection, onSwitchPersona }) => {
  const { userSession, updateProfile, setPersona, setShowOnboarding, refreshAllData } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal
  const [name, setName] = useState(userSession?.name || '');
  const [age, setAge] = useState<number>(25);
  const [villageOrCity, setVillageOrCity] = useState('Ranchi');
  const [state, setState] = useState('Jharkhand');
  const [district, setDistrict] = useState('Ranchi');

  // Step 2: Work / Trade
  const [tradeOrDomain, setTradeOrDomain] = useState('Electrician & Electrical Maintenance');
  const [customTrade, setCustomTrade] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(['House Wiring', 'Inverter Installation', 'Safety Equipment']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [workDetails, setWorkDetails] = useState('');

  // Step 3: Preferences
  const [preferredLocation, setPreferredLocation] = useState('Ranchi / Nearby Industrial Hubs');
  const [preferredWorkType, setPreferredWorkType] = useState<'local_job' | 'remote' | 'apprenticeship' | 'freelance'>('local_job');

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsList([...skillsList, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    if (!userSession) return;
    setIsSubmitting(true);

    try {
      const finalTrade = tradeOrDomain === 'Custom Trade / Work Type' && customTrade ? customTrade : tradeOrDomain;

      // Construct UserSkill record
      const skillsRecord: Record<string, UserSkill> = {};
      skillsList.forEach((sk) => {
        skillsRecord[sk] = {
          name: sk,
          category: 'trade',
          level: 0,
          confidence: 0,
          evidence: ['self_report'],
        };
      });

      const profileData: UserProfile = {
        id: userSession.userId,
        name: name.trim() || userSession.name || 'Job Seeker Candidate',
        email: userSession.email,
        age: Number(age) || 25,
        persona: 'livelihood',
        location: {
          villageOrCity: villageOrCity.trim() || 'Ranchi',
          district: district.trim() || 'Ranchi',
          state: state.trim() || 'Jharkhand',
        },
        tradeOrDomain: finalTrade,
        targetRole: finalTrade,
        skills: skillsRecord,
        experienceYears: Number(experienceYears) || 0,
        preferredWorkType,
        educationLevel: 'ITI / Class 10th / Secondary',
        readinessScore: 0,
        hasCompletedOnboarding: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateProfile(profileData);
      setPersona('livelihood');
      setShowOnboarding(false);
      await refreshAllData();
    } catch (err) {
      console.error('Failed to complete job seeker onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSuggestions = SUGGESTED_TRADE_SKILLS[tradeOrDomain] || ['Safety Equipment', 'Basic Maintenance', 'Customer Handling', 'Digital Payments'];

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      {/* Mode Switcher Banner */}
      {onSwitchPersona && (
        <div className="flex items-center justify-between rounded-xl border border-[#FFF4EC] bg-[#FFF8F3] p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#D96B27]">💼 Job Seeker Mode</span>
            <span className="text-[#5A6065] text-[11px] hidden sm:inline">• Vocational & Livelihood Jobs</span>
          </div>
          <button
            type="button"
            onClick={() => onSwitchPersona('student')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#183B32] bg-[#E2ECE9] px-3 py-1.5 font-semibold text-[#183B32] hover:bg-[#CBE0DA] transition-colors cursor-pointer"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Switch to Student Form</span>
          </button>
        </div>
      )}

      {/* Header & Step Indicator */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#5A6065] mb-2">
          <span className="font-semibold text-[#D96B27]">💼 Job Seeker Profile Onboarding</span>
          <span>Step {step} of 3</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, label: '01 Personal' },
            { num: 2, label: '02 Work / Trade' },
            { num: 3, label: '03 Preferences' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  step >= s.num ? 'bg-[#D96B27]' : 'bg-[#E5E5DE]'
                }`}
              />
              <span className={`block text-[10px] font-medium text-center ${step === s.num ? 'text-[#D96B27] font-semibold' : 'text-[#8C949D]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal */}
      {step === 1 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">Tell us about yourself</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Mahto"
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Age</label>
              <input
                type="number"
                min={18}
                max={65}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">City / Village</label>
              <input
                type="text"
                value={villageOrCity}
                onChange={(e) => setVillageOrCity(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Jharkhand"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Work / Trade */}
      {step === 2 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">Your Trade & Skills</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Primary Work / Trade</label>
            <select
              value={tradeOrDomain}
              onChange={(e) => setTradeOrDomain(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
            >
              {TRADE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {tradeOrDomain === 'Custom Trade / Work Type' && (
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Specify Work / Trade</label>
              <input
                type="text"
                value={customTrade}
                onChange={(e) => setCustomTrade(e.target.value)}
                placeholder="e.g. Solar Pump Maintenance"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
          )}

          {/* Skill chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1E2022]">Skills & Tools You Use</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkillInput);
                  }
                }}
                placeholder="e.g. Wiring, Inverter Repair, Safety"
                className="flex-1 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="inline-flex items-center gap-1 rounded-xl bg-[#D96B27] px-3 py-2 text-xs font-semibold text-white hover:bg-[#C25B1B] transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] min-h-12">
              {skillsList.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF4EC] px-2.5 py-1 text-xs font-semibold text-[#D96B27]"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="rounded-full p-0.5 hover:bg-[#FFE6D5] transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentSuggestions.filter((s) => !skillsList.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E5E5DE] bg-white px-2.5 py-1 text-xs text-[#5A6065] hover:border-[#D96B27] hover:text-[#D96B27] transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Brief Description (Optional)</label>
              <input
                type="text"
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                placeholder="e.g. Experienced in domestic solar setups"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Preferences */}
      {step === 3 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">What are you looking for?</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Preferred Work Location</label>
            <input
              type="text"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              placeholder="e.g. Ranchi / Nearby Industrial Hubs"
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#D96B27] focus:bg-white focus:ring-1 focus:ring-[#D96B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-2">Preferred Work Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'local_job', label: 'Full-time / Local Job' },
                { id: 'freelance', label: 'Gig / Daily Work' },
                { id: 'apprenticeship', label: 'Apprenticeship / NAPS' },
                { id: 'remote', label: 'Remote / Flexi Work' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreferredWorkType(item.id as any)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer ${
                    preferredWorkType === item.id
                      ? 'border-[#D96B27] bg-[#FFF4EC] text-[#D96B27]'
                      : 'border-[#E5E5DE] bg-[#FBFBF9] text-[#5A6065] hover:border-[#CCD0D5]'
                  }`}
                >
                  <span>{item.label}</span>
                  {preferredWorkType === item.id && <Check className="h-4 w-4 text-[#D96B27]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between border-t border-[#E5E5DE] pt-4">
        {step === 1 ? (
          <button
            type="button"
            onClick={onBackToSelection}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6065] hover:text-[#1E2022] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Change Path</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as any)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6065] hover:text-[#1E2022] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as any)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D96B27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C25B1B] transition-colors cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D96B27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#C25B1B] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving profile...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>Complete Profile</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
