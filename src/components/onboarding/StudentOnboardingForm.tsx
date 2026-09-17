import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserSkill, Persona } from '../../types';
import { authService } from '../../services/auth';
import { api } from '../../services/api';
import { ArrowLeft, ArrowRight, Check, Plus, X, Loader2, Briefcase } from 'lucide-react';

interface StudentOnboardingFormProps {
  onBackToSelection: () => void;
  onSwitchPersona?: (persona: Persona) => void;
}

const POPULAR_SKILLS = ['Python', 'SQL', 'Git', 'Java', 'React', 'Data Structures', 'TypeScript', 'Node.js', 'C++', 'HTML/CSS'];

const DEGREE_OPTIONS = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Computer Applications (BCA)',
  'Bachelor of Science (B.Sc CS/IT)',
  'Diploma / Polytechnic in Engineering',
  'Master of Computer Applications (MCA)',
  'Master of Technology (M.Tech)',
  'Other / Custom Degree',
];

const TARGET_ROLE_OPTIONS = [
  'Backend Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Data Engineer / Analyst',
  'DevOps & Cloud Engineer',
  'AI / ML Specialist',
  'Mobile App Developer',
  'Custom Target Role',
];

export const StudentOnboardingForm: React.FC<StudentOnboardingFormProps> = ({ onBackToSelection, onSwitchPersona }) => {
  const { userSession, updateProfile, setPersona, setShowOnboarding, refreshAllData } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal
  const [name, setName] = useState(userSession?.name || '');
  const [age, setAge] = useState<number>(21);
  const [villageOrCity, setVillageOrCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');

  // Step 2: Education
  const [degree, setDegree] = useState('Bachelor of Technology (B.Tech)');
  const [customDegree, setCustomDegree] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [experienceYears, setExperienceYears] = useState<number>(0);

  // Step 3: Skills
  const [skillsList, setSkillsList] = useState<string[]>(['Python', 'SQL', 'Git']);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Step 4: Career Goal
  const [targetRole, setTargetRole] = useState('Backend Developer');
  const [customTargetRole, setCustomTargetRole] = useState('');

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
      const finalDegree = degree === 'Other / Custom Degree' && customDegree ? customDegree : degree;
      const finalRole = targetRole === 'Custom Target Role' && customTargetRole ? customTargetRole : targetRole;

      // Construct UserSkill record
      const skillsRecord: Record<string, UserSkill> = {};
      skillsList.forEach((sk) => {
        skillsRecord[sk] = {
          name: sk,
          category: 'technical',
          level: 0,
          confidence: 0,
          evidence: ['self_report'],
        };
      });

      const profileData: UserProfile = {
        id: userSession.userId,
        name: name.trim() || userSession.name || 'Student Candidate',
        email: userSession.email,
        age: Number(age) || 21,
        persona: 'student',
        location: {
          villageOrCity: villageOrCity.trim() || 'Bengaluru',
          district: district.trim() || 'Bengaluru',
          state: state.trim() || 'Karnataka',
        },
        educationLevel: finalDegree,
        degree: finalDegree,
        college: college.trim() || 'University Institute',
        graduationYear: Number(graduationYear) || 2026,
        experienceYears: Number(experienceYears) || 0,
        targetRole: finalRole,
        skills: skillsRecord,
        readinessScore: 0,
        hasCompletedOnboarding: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateProfile(profileData);
      setPersona('student');
      setShowOnboarding(false);
      await refreshAllData();
    } catch (err) {
      console.error('Failed to complete student onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      {/* Mode Switcher Banner */}
      {onSwitchPersona && (
        <div className="flex items-center justify-between rounded-xl border border-[#E2ECE9] bg-[#F4F9F8] p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#183B32]">🎓 Student Mode</span>
            <span className="text-[#5A6065] text-[11px] hidden sm:inline">• Degree & Tech Pathways</span>
          </div>
          <button
            type="button"
            onClick={() => onSwitchPersona('livelihood')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D96B27] bg-[#FFF4EC] px-3 py-1.5 font-semibold text-[#D96B27] hover:bg-[#FFE6D5] transition-colors cursor-pointer"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Switch to Job Seeker Form</span>
          </button>
        </div>
      )}

      {/* Header & Step Indicator */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#5A6065] mb-2">
          <span className="font-semibold text-[#183B32]">🎓 Student Profile Onboarding</span>
          <span>Step {step} of 4</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: '01 Personal' },
            { num: 2, label: '02 Education' },
            { num: 3, label: '03 Skills' },
            { num: 4, label: '04 Goal' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  step >= s.num ? 'bg-[#183B32]' : 'bg-[#E5E5DE]'
                }`}
              />
              <span className={`block text-[10px] font-medium text-center ${step === s.num ? 'text-[#183B32] font-semibold' : 'text-[#8C949D]'}`}>
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
              placeholder="e.g. Ananya Sharma"
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Age</label>
              <input
                type="number"
                min={15}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">City / Village</label>
              <input
                type="text"
                value={villageOrCity}
                onChange={(e) => setVillageOrCity(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
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
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Education */}
      {step === 2 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">Your Education Background</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Degree / Qualification</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
            >
              {DEGREE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {degree === 'Other / Custom Degree' && (
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Specify Degree</label>
              <input
                type="text"
                value={customDegree}
                onChange={(e) => setCustomDegree(e.target.value)}
                placeholder="e.g. Bachelor of Design"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">College / University Name</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. National Institute of Technology"
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Graduation Year</label>
              <input
                type="number"
                min={2015}
                max={2030}
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={30}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Skills */}
      {step === 3 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">Your Skills & Tools</h2>
          <p className="text-xs text-[#5A6065]">Add skills you know or are currently learning.</p>

          {/* Add skill input */}
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
              placeholder="e.g. Python, SQL, React"
              className="flex-1 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkillInput)}
              className="inline-flex items-center gap-1 rounded-xl bg-[#183B32] px-3 py-2 text-xs font-semibold text-white hover:bg-[#15342C] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Selected Skills Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-2">Selected Skills ({skillsList.length})</label>
            <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9]">
              {skillsList.length === 0 ? (
                <span className="text-xs text-[#8C949D]">No skills added yet. Select from below or type above.</span>
              ) : (
                skillsList.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#E2ECE9] px-2.5 py-1 text-xs font-semibold text-[#183B32]"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk)}
                      className="rounded-full p-0.5 hover:bg-[#CBE0DA] transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Popular Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1.5">Quick Add Suggestions</label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter((s) => !skillsList.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E5E5DE] bg-white px-2.5 py-1 text-xs text-[#5A6065] hover:border-[#183B32] hover:text-[#183B32] transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Career Goal */}
      {step === 4 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-[#1E2022]">Target Career Goal</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
            >
              {TARGET_ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {targetRole === 'Custom Target Role' && (
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Specify Role</label>
              <input
                type="text"
                value={customTargetRole}
                onChange={(e) => setCustomTargetRole(e.target.value)}
                placeholder="e.g. Cybersecurity Specialist"
                className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          )}
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

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as any)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#15342C] transition-colors cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#183B32] px-5 py-2 text-xs font-semibold text-white hover:bg-[#15342C] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving profile...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-[#A3E635]" />
                <span>Complete Profile</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
