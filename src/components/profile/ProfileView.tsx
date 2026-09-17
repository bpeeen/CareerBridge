import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/i18n';
import { AssessmentModal } from '../assessment/AssessmentModal';
import { INDIAN_STATES_DISTRICTS, getDistrictsForState } from '../../data/indianLocations';
import { 
  User, 
  MapPin, 
  Building2, 
  Award, 
  Save, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, language, persona, setPersona } = useApp();
  const [assessmentSkill, setAssessmentSkill] = useState<string | null>(null);

  const [name, setName] = useState(profile?.name || '');
  const [city, setCity] = useState(profile?.location.villageOrCity || '');
  const [district, setDistrict] = useState(profile?.location.district || '');
  const [stateName, setStateName] = useState(profile?.location.state || 'Jharkhand');
  const [targetRole, setTargetRole] = useState(profile?.targetRole || profile?.tradeOrDomain || '');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      location: {
        ...profile.location,
        villageOrCity: city,
        district: district,
        state: stateName,
      },
      targetRole: persona === 'student' ? targetRole : profile.targetRole,
      tradeOrDomain: persona === 'livelihood' ? targetRole : profile.tradeOrDomain,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    const updatedSkills = {
      ...profile.skills,
      [newSkillName.trim()]: {
        name: newSkillName.trim(),
        category: 'technical' as const,
        level: newSkillLevel,
        confidence: 0.7,
        evidence: ['self_report' as const],
        lastAssessedAt: new Date().toISOString().split('T')[0],
      },
    };
    await updateProfile({ skills: updatedSkills });
    setNewSkillName('');
    setNewSkillLevel(60);
  };

  const handleSkillChange = async (skillName: string, newLevel: number) => {
    const updatedSkills = {
      ...profile.skills,
      [skillName]: {
        ...profile.skills[skillName],
        level: newLevel,
      },
    };
    await updateProfile({ skills: updatedSkills });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#1E2022]">
          {t('profile', language)}
        </h1>
        <p className="mt-0.5 text-xs text-[#5A6065]">
          Manage your verified competencies, career targets, and background details
        </p>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2ECE9] text-[#183B32]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E2022]">Personal & Career Identity</h2>
              <p className="text-xs text-[#5A6065]">
                {persona === 'student' ? 'Student Profile' : 'Rural Worker Profile'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#183B32] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#15342C] transition-all"
          >
            {isSaved ? <CheckCircle2 className="h-4 w-4 text-[#A3E635]" /> : <Save className="h-4 w-4" />}
            <span>{isSaved ? 'Saved!' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#5A6065]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A6065]">
              {persona === 'student' ? 'Target Career Role' : 'Trade / Domain'}
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A6065]">State</label>
            <select
              value={stateName}
              onChange={(e) => {
                const ns = e.target.value;
                setStateName(ns);
                const dists = getDistrictsForState(ns);
                if (dists.length > 0) {
                  setDistrict(dists[0]);
                }
              }}
              className="mt-1 w-full rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            >
              {INDIAN_STATES_DISTRICTS.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A6065]">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            >
              {getDistrictsForState(stateName).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A6065]">Village / Town / Locality</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] px-3 py-2 text-xs text-[#1E2022] focus:border-[#183B32] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </form>

      {/* Skills & Evidence Inventory */}
      <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4F4F0] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E2022]">Competencies & Verified Evidence</h2>
            <p className="text-xs text-[#5A6065]">
              Adjust levels or take skill verification assessments to increase match accuracy
            </p>
          </div>
        </div>

        {/* Existing skills list */}
        <div className="space-y-3">
          {Object.entries(profile.skills).map(([skillKey, skill]) => {
            const isDemonstrated = skill.evidence.includes('assessment') || skill.evidence.includes('project');
            return (
              <div
                key={skillKey}
                className="flex flex-col justify-between gap-2 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] p-3.5 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1E2022]">{skill.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isDemonstrated
                          ? 'bg-[#E2ECE9] text-[#183B32]'
                          : 'bg-[#FFF4EC] text-[#D96B27]'
                      }`}
                    >
                      {isDemonstrated ? 'Demonstrated Evidence' : 'Self-Reported'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Evidence: {skill.evidence.join(', ')} • Last: {skill.lastAssessedAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={skill.level}
                    onChange={(e) => handleSkillChange(skillKey, Number(e.target.value))}
                    className="w-28 accent-[#183B32]"
                  />
                  <span className="font-mono text-xs font-bold text-[#183B32] w-8">
                    {skill.level}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setAssessmentSkill(skill.name)}
                    className="rounded border border-[#CCD0D5] bg-white px-2 py-1 text-[11px] font-semibold text-[#183B32] hover:bg-[#E2ECE9] shadow-2xs"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Skill Row */}
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[#CCD0D5] p-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Add new skill (e.g. Docker, TypeScript, Solar PV)..."
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 rounded-lg border border-[#E5E5DE] bg-white px-3 py-1.5 text-xs text-[#1E2022] focus:border-[#183B32] focus:outline-hidden"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6065]">Initial: {newSkillLevel}%</span>
            <input
              type="range"
              min={20}
              max={90}
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Number(e.target.value))}
              className="w-20 accent-[#183B32]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center gap-1 rounded-lg bg-[#183B32] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#15342C]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {assessmentSkill && (
        <AssessmentModal
          isOpen={Boolean(assessmentSkill)}
          onClose={() => setAssessmentSkill(null)}
          skillName={assessmentSkill}
        />
      )}
    </div>
  );
};
