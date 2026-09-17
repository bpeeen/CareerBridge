import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  Persona,
  Language,
  Opportunity,
  GovScheme,
  StructuredRoadmap,
  RoadmapDiff,
  ActivityItem,
  AssessmentSession,
  AssessmentResult,
  InterviewSession,
  AnswerEvaluation,
  InterviewReport
} from '../types';
import { api } from '../services/api';
import { authService, AuthSession } from '../services/auth';
import { matchingEngine } from '../services/matching/matchingEngine';

interface AppContextType {
  userSession: AuthSession | null;
  profile: UserProfile | null;
  persona: Persona;
  language: Language;
  activeTab: string;
  opportunities: Opportunity[];
  schemes: GovScheme[];
  structuredRoadmap: StructuredRoadmap | null;
  simulatedDiff: RoadmapDiff | null;
  activities: ActivityItem[];
  
  // Loading & Action states
  isLoading: boolean;
  isGeneratingRoadmap: boolean;
  isAdaptingRoadmap: boolean;
  isGeneratingAssessment: boolean;
  assessmentSkillName: string | null;
  isEvaluatingInterview: boolean;
  
  // Modals & UI States
  showOnboarding: boolean;
  showAuthModal: boolean;
  showArchitectureModal: boolean;
  activeVoiceQuery: string;
  
  // Interactive Assessment & Interview
  assessmentSession: AssessmentSession | null;
  latestAssessmentResult: AssessmentResult | null;
  interviewSession: InterviewSession | null;

  // Actions
  setPersona: (persona: Persona) => void;
  switchMode: (newPersona: Persona) => Promise<void>;
  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: string) => void;
  setShowOnboarding: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowArchitectureModal: (show: boolean) => void;
  setActiveVoiceQuery: (query: string) => void;

  // Auth & Profile
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: { email: string; password?: string; name: string; persona?: Persona }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;

  // Roadmap Actions (ON-DEMAND AI)
  generateRoadmap: (targetRole?: string) => Promise<void>;
  adaptRoadmap: (updatedSkills: Record<string, number>) => Promise<void>;
  updateSubmoduleStatus: (moduleId: string, submoduleId: string, status: 'not_started' | 'in_progress' | 'completed') => Promise<void>;
  deleteRoadmap: () => Promise<void>;
  resetRoadmapSimulation: () => void;

  // Assessment Actions (ON-DEMAND AI)
  startAssessment: (skill: string) => Promise<void>;
  submitAssessment: (answers: Record<string, number>) => Promise<AssessmentResult | null>;
  closeAssessment: () => void;

  // Interview Actions (ON-DEMAND AI)
  startInterview: (role?: string) => Promise<void>;
  submitInterviewAnswer: (answer: string) => Promise<AnswerEvaluation | null>;
  nextInterviewQuestion: () => Promise<void>;
  endInterview: () => void;

  // Jobs & Search
  searchJobs: (query?: string, location?: string, isRemote?: boolean) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userSession, setUserSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [persona, setPersonaState] = useState<Persona>('student');
  const [language, setLanguageState] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [structuredRoadmap, setStructuredRoadmap] = useState<StructuredRoadmap | null>(null);
  const [simulatedDiff, setSimulatedDiff] = useState<RoadmapDiff | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
  const [isAdaptingRoadmap, setIsAdaptingRoadmap] = useState<boolean>(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState<boolean>(false);
  const [assessmentSkillName, setAssessmentSkillName] = useState<string | null>(null);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState<boolean>(false);

  // Modals & UI States
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const [activeVoiceQuery, setActiveVoiceQuery] = useState<string>('');

  // Assessment & Interview
  const [assessmentSession, setAssessmentSession] = useState<AssessmentSession | null>(null);
  const [latestAssessmentResult, setLatestAssessmentResult] = useState<AssessmentResult | null>(null);
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);

  // Load User Data
  const loadUserData = useCallback(async (session: AuthSession) => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      let fetchedProfile = await api.getProfile(session.userId).catch(() => null);
      if (!fetchedProfile) {
        fetchedProfile = await authService.getProfileFromSupabase(session.userId);
      }

      if (fetchedProfile && fetchedProfile.hasCompletedOnboarding) {
        // 2. Load Jobs, Schemes, Existing Roadmap & Activities
        const [fetchedJobs, fetchedSchemes, fetchedRoadmap, fetchedActivities] = await Promise.all([
          api.getJobs({
            persona: fetchedProfile.persona,
            district: fetchedProfile.location?.district,
            state: fetchedProfile.location?.state,
            location: `${fetchedProfile.location?.villageOrCity || ''}, ${fetchedProfile.location?.state || ''}`.trim(),
            tradeOrDomain: fetchedProfile.tradeOrDomain,
            targetRole: fetchedProfile.targetRole,
          }),
          api.getSchemes(undefined, undefined, {
            state: fetchedProfile.location?.state,
            district: fetchedProfile.location?.district,
          }),
          api.getRoadmap(fetchedProfile.id),
          api.getActivities(fetchedProfile.id),
        ]);

        const rankedJobs = matchingEngine.matchOpportunities(fetchedProfile, fetchedJobs);
        const rankedSchemes = matchingEngine.matchSchemes(fetchedProfile, fetchedSchemes);

        setProfile(fetchedProfile);
        setPersonaState(fetchedProfile.persona || 'student');
        setOpportunities(rankedJobs);
        setSchemes(rankedSchemes);
        setStructuredRoadmap(fetchedRoadmap);
        setActivities(fetchedActivities);
        setShowOnboarding(false);
      } else {
        setProfile(fetchedProfile || null);
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Auth Session Check
  useEffect(() => {
    let mounted = true;
    async function initAuth() {
      setIsLoading(true);
      try {
        const session = await authService.getCurrentSession();
        if (mounted) {
          if (session) {
            setUserSession(session);
            await loadUserData(session);
          } else {
            setUserSession(null);
            setProfile(null);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('Init auth notice:', err);
        if (mounted) {
          setUserSession(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    }
    initAuth();
    return () => {
      mounted = false;
    };
  }, [loadUserData]);

  // Persona switching preserving user profile & data
  const switchMode = async (newPersona: Persona) => {
    if (!profile) return;
    try {
      const updated = await api.switchMode(profile.id, newPersona);
      await authService.saveProfileToSupabase(updated);
      setProfile(updated);
      setPersonaState(newPersona);
      setActiveTab('overview');
      setSimulatedDiff(null);
      setShowOnboarding(true);

      // Refresh jobs & schemes for new persona & location
      const [jobs, fetchedSchemes] = await Promise.all([
        api.getJobs({
          persona: newPersona,
          district: updated.location?.district,
          state: updated.location?.state,
          location: `${updated.location?.villageOrCity || ''}, ${updated.location?.state || ''}`.trim(),
          tradeOrDomain: updated.tradeOrDomain,
          targetRole: updated.targetRole,
        }),
        api.getSchemes(undefined, undefined, {
          state: updated.location?.state,
          district: updated.location?.district,
        }),
      ]);
      setOpportunities(matchingEngine.matchOpportunities(updated, jobs));
      setSchemes(matchingEngine.matchSchemes(updated, fetchedSchemes));
    } catch (err) {
      console.error('Failed to switch mode:', err);
      const fallbackProfile: UserProfile = { ...profile, persona: newPersona, updatedAt: new Date().toISOString() };
      setProfile(fallbackProfile);
      setPersonaState(newPersona);
      setShowOnboarding(true);
    }
  };

  const setPersona = (newPersona: Persona) => {
    switchMode(newPersona);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Auth Functions
  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const session = await authService.signIn(email, password || 'password123');
      setUserSession(session);
      await loadUserData(session);
      setShowAuthModal(false);
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { email: string; password?: string; name: string; persona?: Persona }) => {
    setIsLoading(true);
    try {
      const session = await authService.signUp(
        data.email,
        data.password || 'password123',
        data.name,
        data.persona || 'student'
      );
      setUserSession(session);

      // Attempt to retrieve the profile row created by the DB trigger
      let fetchedProfile = await authService.getProfileFromSupabase(session.userId).catch(() => null);
      if (!fetchedProfile) {
        fetchedProfile = {
          id: session.userId,
          name: data.name,
          email: data.email,
          persona: data.persona || 'student',
          hasCompletedOnboarding: false,
          experienceYears: 0,
          readinessScore: 60,
          skills: {},
          location: {
            villageOrCity: 'Ranchi',
            district: 'Ranchi',
            state: 'Jharkhand',
          },
          updatedAt: new Date().toISOString(),
        };
      }
      setProfile(fetchedProfile);
      setShowOnboarding(true);
      setShowAuthModal(false);
    } catch (err: any) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } catch (e) {
      console.warn('Logout notice:', e);
    } finally {
      setUserSession(null);
      setProfile(null);
      setStructuredRoadmap(null);
      setActivities([]);
      setShowOnboarding(false);
      setShowAuthModal(false);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>) => {
    let currentProfile = profile;
    if (!currentProfile && userSession) {
      currentProfile = {
        id: userSession.userId,
        name: userSession.name || 'Career Candidate',
        email: userSession.email,
        persona: userSession.persona || 'student',
        hasCompletedOnboarding: false,
        experienceYears: 0,
        readinessScore: 60,
        skills: {},
        location: {
          villageOrCity: updatedFields.location?.villageOrCity || 'Ranchi',
          district: updatedFields.location?.district || 'Ranchi',
          state: updatedFields.location?.state || 'Jharkhand',
        },
        updatedAt: new Date().toISOString()
      };
    }

    const base: UserProfile = currentProfile || {
      id: updatedFields.id || userSession?.userId || 'temp',
      name: updatedFields.name || userSession?.name || 'Candidate',
      email: updatedFields.email || userSession?.email || '',
      persona: updatedFields.persona || userSession?.persona || 'student',
      hasCompletedOnboarding: false,
      experienceYears: 0,
      readinessScore: 60,
      skills: {},
      location: {
        villageOrCity: updatedFields.location?.villageOrCity || 'Ranchi',
        district: updatedFields.location?.district || 'Ranchi',
        state: updatedFields.location?.state || 'Jharkhand',
      },
      updatedAt: new Date().toISOString()
    };

    const merged: UserProfile = {
      ...base,
      ...updatedFields,
      location: {
        villageOrCity: updatedFields.location?.villageOrCity || base.location?.villageOrCity || 'Ranchi',
        district: updatedFields.location?.district || base.location?.district || 'Ranchi',
        state: updatedFields.location?.state || base.location?.state || 'Jharkhand',
      }
    };

    console.log('[CareerBridge] Onboarding save triggered:', merged);

    let saved = merged;
    // 1. Save to local server (memory or sqlite proxy)
    try {
      saved = await api.saveProfile(merged);
    } catch (e) {
      console.warn('[AppContext] Local Express server saveProfile failed, falling back to merged client-side profile data:', e);
    }

    // 2. Save to Supabase (auth/database client)
    try {
      await authService.saveProfileToSupabase(saved);
    } catch (e) {
      console.warn('[AppContext] Supabase saveProfileToSupabase failed, falling back to local state and storage:', e);
      // Ensure we still update local storage so it persists locally
      try {
        localStorage.setItem('careerbridge_profile_cached', JSON.stringify(saved));
      } catch (localErr) {
        console.error('[AppContext] Failed to set local storage backup:', localErr);
      }
    }
    
    let freshJobs = opportunities;
    let freshSchemes = schemes;
    try {
      [freshJobs, freshSchemes] = await Promise.all([
        api.getJobs({
          persona: saved.persona,
          district: saved.location?.district,
          state: saved.location?.state,
          location: `${saved.location?.villageOrCity || ''}, ${saved.location?.state || ''}`.trim(),
          tradeOrDomain: saved.tradeOrDomain,
          targetRole: saved.targetRole,
        }).catch((err) => {
          console.warn('[AppContext] Failed to fetch updated jobs, using existing state:', err);
          return opportunities;
        }),
        api.getSchemes(undefined, undefined, {
          state: saved.location?.state,
          district: saved.location?.district,
        }).catch((err) => {
          console.warn('[AppContext] Failed to fetch updated schemes, using existing state:', err);
          return schemes;
        }),
      ]);
    } catch (e) {
      console.warn('Could not re-fetch jobs/schemes:', e);
    }

    const rankedJobs = matchingEngine.matchOpportunities(saved, freshJobs);
    const rankedSchemes = matchingEngine.matchSchemes(saved, freshSchemes);

    setProfile(saved);
    setPersonaState(saved.persona);
    setOpportunities(rankedJobs);
    setSchemes(rankedSchemes);
  };

  // ---------------- ROADMAP ON-DEMAND AI ----------------
  const generateRoadmap = async (targetRole?: string) => {
    if (!profile) return;
    setIsGeneratingRoadmap(true);
    try {
      const role = targetRole || profile.targetRole || profile.tradeOrDomain || 'Backend Developer';
      const roadmap = await api.generateRoadmap(profile.id, role);
      setStructuredRoadmap(roadmap);
      setSimulatedDiff(null);
      const acts = await api.getActivities(profile.id);
      setActivities(acts);
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const adaptRoadmap = async (updatedSkills: Record<string, number>) => {
    if (!profile) return;
    setIsAdaptingRoadmap(true);
    try {
      const result = await api.adaptRoadmap(profile.id, updatedSkills);
      setStructuredRoadmap(result.updatedRoadmap);
      setSimulatedDiff(result.diff);

      // Update skills in profile
      const updatedProfileSkills = { ...profile.skills };
      Object.entries(updatedSkills).forEach(([skillName, level]) => {
        if (updatedProfileSkills[skillName]) {
          updatedProfileSkills[skillName] = {
            ...updatedProfileSkills[skillName],
            level,
            evidence: updatedProfileSkills[skillName].evidence.includes('assessment')
              ? updatedProfileSkills[skillName].evidence
              : [...updatedProfileSkills[skillName].evidence, 'assessment'],
          };
        }
      });
      await updateProfile({ skills: updatedProfileSkills });

      const acts = await api.getActivities(profile.id);
      setActivities(acts);
    } catch (err) {
      console.error('Error adapting roadmap:', err);
    } finally {
      setIsAdaptingRoadmap(false);
    }
  };

  const updateSubmoduleStatus = async (
    moduleId: string,
    submoduleId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    if (!profile || !structuredRoadmap) return;
    try {
      const updated = await api.updateSubmoduleStatus(profile.id, moduleId, submoduleId, status);
      setStructuredRoadmap(updated);
      const acts = await api.getActivities(profile.id);
      setActivities(acts);
    } catch (err) {
      console.error('Error updating submodule status:', err);
    }
  };

  const deleteRoadmap = async () => {
    if (!profile) return;
    try {
      await api.deleteRoadmap(profile.id);
      setStructuredRoadmap(null);
      setSimulatedDiff(null);
    } catch (err) {
      console.error('Error deleting roadmap:', err);
      setStructuredRoadmap(null);
      setSimulatedDiff(null);
    }
  };

  const resetRoadmapSimulation = () => {
    setSimulatedDiff(null);
  };

  // ---------------- ASSESSMENT ON-DEMAND AI ----------------
  const startAssessment = async (skill: string) => {
    if (!profile) return;
    setIsGeneratingAssessment(true);
    setAssessmentSkillName(skill);
    try {
      const session = await api.generateAssessment(skill, profile.id);
      setAssessmentSession(session);
      setLatestAssessmentResult(null);
    } catch (err) {
      console.error('Error starting assessment:', err);
    } finally {
      setIsGeneratingAssessment(false);
      setAssessmentSkillName(null);
    }
  };

  const submitAssessment = async (answers: Record<string, number>): Promise<AssessmentResult | null> => {
    if (!assessmentSession || !profile) return null;
    try {
      const { result, updatedProfile } = await api.submitAssessment(assessmentSession.id, profile.id, answers);
      setLatestAssessmentResult(result);
      setProfile(updatedProfile);
      setAssessmentSession((prev) => (prev ? { ...prev, isCompleted: true, result } : null));
      const acts = await api.getActivities(profile.id);
      setActivities(acts);
      return result;
    } catch (err) {
      console.error('Error submitting assessment:', err);
      return null;
    }
  };

  const closeAssessment = () => {
    setAssessmentSession(null);
    setLatestAssessmentResult(null);
  };

  // ---------------- MOCK INTERVIEW ON-DEMAND AI ----------------
  const startInterview = async (role?: string) => {
    if (!profile) return;
    setIsEvaluatingInterview(true);
    try {
      const targetRole = role || profile.targetRole || 'Backend Developer';
      const session = await api.startInterview(targetRole, profile.id);
      setInterviewSession(session);
    } catch (err) {
      console.error('Error starting interview:', err);
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  const submitInterviewAnswer = async (answer: string): Promise<AnswerEvaluation | null> => {
    if (!interviewSession || !profile) return null;
    setIsEvaluatingInterview(true);
    try {
      const currentQ = interviewSession.questions[interviewSession.currentQuestionIndex];
      const evaluation = await api.evaluateInterviewAnswer(
        interviewSession.id,
        currentQ.id,
        answer,
        interviewSession.role
      );

      const updatedQuestions = [...interviewSession.questions];
      updatedQuestions[interviewSession.currentQuestionIndex] = {
        ...currentQ,
        userAnswer: answer,
        evaluation,
      };

      setInterviewSession({
        ...interviewSession,
        questions: updatedQuestions,
      });

      return evaluation;
    } catch (err) {
      console.error('Error submitting interview answer:', err);
      return null;
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  const nextInterviewQuestion = async () => {
    if (!interviewSession || !profile) return;
    setIsEvaluatingInterview(true);
    try {
      if (interviewSession.questions.length >= 3) {
        // Finalize interview
        const { session, report } = await api.finishInterview(interviewSession.id, profile.id);
        setInterviewSession({ ...session, finalReport: report, status: 'completed' });
        const acts = await api.getActivities(profile.id);
        setActivities(acts);
      } else {
        const { session } = await api.getNextInterviewQuestion(interviewSession.id, profile.id);
        setInterviewSession(session);
      }
    } catch (err) {
      console.error('Error moving to next interview question:', err);
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  const endInterview = () => {
    setInterviewSession(null);
  };

  // ---------------- JOBS SEARCH ----------------
  const searchJobs = async (query?: string, location?: string, isRemote?: boolean) => {
    try {
      const loc = location || (profile?.location ? `${profile.location.villageOrCity}, ${profile.location.state}` : undefined);
      const fetched = await api.getJobs({
        query,
        location: loc,
        district: profile?.location?.district,
        state: profile?.location?.state,
        isRemote,
        persona,
      });
      if (profile) {
        setOpportunities(matchingEngine.matchOpportunities(profile, fetched));
      } else {
        setOpportunities(fetched);
      }
    } catch (err) {
      console.error('Error searching jobs:', err);
    }
  };

  const refreshAllData = async () => {
    if (userSession) {
      await loadUserData(userSession);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userSession,
        profile,
        persona,
        language,
        activeTab,
        opportunities,
        schemes,
        structuredRoadmap,
        simulatedDiff,
        activities,

        isLoading,
        isGeneratingRoadmap,
        isAdaptingRoadmap,
        isGeneratingAssessment,
        assessmentSkillName,
        isEvaluatingInterview,

        showOnboarding,
        showAuthModal,
        showArchitectureModal,
        activeVoiceQuery,

        assessmentSession,
        latestAssessmentResult,
        interviewSession,

        setPersona,
        switchMode,
        setLanguage,
        setActiveTab,
        setShowOnboarding,
        setShowAuthModal,
        setShowArchitectureModal,
        setActiveVoiceQuery,

        login,
        signup,
        logout,
        updateProfile,

        generateRoadmap,
        adaptRoadmap,
        updateSubmoduleStatus,
        deleteRoadmap,
        resetRoadmapSimulation,

        startAssessment,
        submitAssessment,
        closeAssessment,

        startInterview,
        submitInterviewAnswer,
        nextInterviewQuestion,
        endInterview,

        searchJobs,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
