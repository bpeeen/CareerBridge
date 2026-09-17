import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Persona } from '../../types';
import { GraduationCap, Briefcase, ArrowRight, CheckCircle2, Sparkles, X, MapPin, Wrench } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, getDistrictsForState } from '../../data/indianLocations';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, persona, setPersona, profile, updateProfile } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(persona || 'student');

  // Common Profile States
  const [name, setName] = useState(profile?.name || '');
  const [city, setCity] = useState(profile?.location.villageOrCity || '');
  const [district, setDistrict] = useState(profile?.location.district || '');
  const [state, setState] = useState(profile?.location.state || 'Jharkhand');
  const [age, setAge] = useState<number>(profile?.age || 21);

  // Student specific
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Backend Developer');
  const [degree, setDegree] = useState(profile?.degree || 'Bachelor of Technology (B.Tech)');
  const [gradYear, setGradYear] = useState<number>(profile?.graduationYear || 2026);
  const [skillsInput, setSkillsInput] = useState(
    profile?.skills ? Object.keys(profile.skills).join(', ') : 'Python, SQL, REST APIs, Git'
  );

  // Job Seeker specific
  const [trade, setTrade] = useState(profile?.tradeOrDomain || 'Electrician & Solar Technician');
  const [experienceYears, setExperienceYears] = useState<number>(profile?.experienceYears || 1);
  const [preferredWorkType, setPreferredWorkType] = useState(profile?.preferredWorkType || 'local_job');
  const [educationLevel, setEducationLevel] = useState(profile?.educationLevel || 'Class 10th / ITI');

  if (!showOnboarding) return null;

  const handleFinish = async () => {
    setPersona(selectedPersona);

    // Parse skills
    const rawSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const skillsMap: Record<string, any> = {};
    rawSkills.forEach((s) => {
      skillsMap[s] = profile?.skills?.[s] || {
        name: s,
        category: selectedPersona === 'student' ? 'technical' : 'trade',
        level: 60,
        confidence: 0.7,
        evidence: ['self_report'],
      };
    });

    if (selectedPersona === 'student') {
      await updateProfile({
        name: name || 'Career Candidate',
        persona: 'student',
        age: Number(age) || 21,
        location: {
          villageOrCity: city || 'Bengaluru',
          district: district || 'Bengaluru Urban',
          state: state || 'Karnataka',
        },
        degree: degree || 'Bachelor of Technology (B.Tech)',
        targetRole: targetRole || 'Backend Developer',
        graduationYear: Number(gradYear) || 2026,
        skills: skillsMap,
        hasCompletedOnboarding: true,
      });
    } else {
      await updateProfile({
        name: name || 'Livelihood Seeker',
        persona: 'livelihood',
        age: Number(age) || 24,
        location: {
          villageOrCity: city || 'Namkum',
          district: district || 'Ranchi',
          state: state || 'Jharkhand',
        },
        tradeOrDomain: trade || 'Electrician & Solar Technician',
        experienceYears: Number(experienceYears) || 1,
        educationLevel: educationLevel || 'Class 10th / ITI',
        preferredWorkType: preferredWorkType || 'local_job',
        skills: skillsMap,
        hasCompletedOnboarding: true,
      });
    }
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#183B32] text-white">
              <Sparkles className="h-4 w-4 text-[#A3E635]" />
            </div>
            <h2 className="text-base font-bold text-[#1E2022]">Career Profile Setup</h2>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EFEFED]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 1 ? (
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#1E2022]">Choose Your Mode</h3>
              <p className="mt-1 text-xs text-[#5A6065]">
                Select how you want CareerBridge to personalize your roadmaps, assessments, and matching.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedPersona('student')}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                  selectedPersona === 'student'
                    ? 'border-[#183B32] bg-white ring-2 ring-[#183B32]/10 shadow-xs'
                    : 'border-[#E5E5DE] bg-white hover:border-[#CCD0D5]'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E2ECE9] text-[#183B32]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-[#1E2022]">🎓 Student / Tech Career</h4>
                <p className="mt-1 text-xs text-[#5A6065]">
                  For students and graduates preparing for tech roles, roadmaps, skill assessments, and mock interviews.
                </p>
                {selectedPersona === 'student' && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#183B32]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Selected</span>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPersona('livelihood')}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                  selectedPersona === 'livelihood'
                    ? 'border-[#D96B27] bg-white ring-2 ring-[#D96B27]/10 shadow-xs'
                    : 'border-[#E5E5DE] bg-white hover:border-[#CCD0D5]'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF4EC] text-[#D96B27]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-[#1E2022]">💼 Job Seeker / Livelihood</h4>
                <p className="mt-1 text-xs text-[#5A6065]">
                  For technicians, trade apprentices, and job seekers finding local work, wages, and verified government schemes.
                </p>
                {selectedPersona === 'livelihood' && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#D96B27]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C]"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E2022]">
                {selectedPersona === 'student' ? '🎓 Student Career Profile' : '💼 Job Seeker & Trade Profile'}
              </h3>
              <p className="text-[11px] text-[#5A6065]">
                Provide your details to enable accurate AI roadmaps and opportunity matching.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bipin Kumar"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="21"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                />
              </div>

              {selectedPersona === 'student' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Degree / Branch</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={gradYear}
                      onChange={(e) => setGradYear(Number(e.target.value))}
                      placeholder="2026"
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Target Tech Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Backend Developer, Data Engineer, Full Stack"
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Work / Trade Domain</label>
                    <input
                      type="text"
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      placeholder="e.g. Electrician, Solar Technician, Plumber"
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      placeholder="1"
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                    >
                      <option value="Class 8th / 10th">Class 8th / 10th Pass</option>
                      <option value="Class 12th Pass">Class 12th Pass</option>
                      <option value="ITI Certified">ITI Certified</option>
                      <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  {selectedPersona === 'student' ? 'Skills / Tech Stack (comma separated)' : 'Skills & Tools (comma separated)'}
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Python, SQL, REST APIs, Git"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState(newState);
                    const districts = getDistrictsForState(newState);
                    if (districts.length > 0) {
                      setDistrict(districts[0]);
                    }
                  }}
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                >
                  {INDIAN_STATES_DISTRICTS.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                >
                  {getDistrictsForState(state).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">City / Village / Locality</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Namkum / Main Road"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DE]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#5A6065] hover:text-[#1E2022]"
              >
                Back to Mode Selection
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-xl bg-[#183B32] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C]"
              >
                <span>Save Profile & Open Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
