import {
  UserProfile,
  Opportunity,
  GovScheme,
  ActivityItem,
  StructuredRoadmap,
  RoadmapDiff,
  AssessmentSession,
  AssessmentResult,
  InterviewSession,
  AnswerEvaluation,
  InterviewReport,
  VoiceIntentResult,
  ArchitectureStatus,
  Persona
} from '../types';

export const api = {
  // ---------------- AUTH & PROFILE ----------------
  async getMe(userId?: string): Promise<UserProfile> {
    const url = userId ? `/api/auth/me?userId=${encodeURIComponent(userId)}` : '/api/auth/me';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch user');
    const data = await res.json();
    return data.user;
  },

  async login(email?: string, persona?: Persona): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, persona }),
    });
    if (!res.ok) throw new Error('Failed to login');
    const data = await res.json();
    return data.user;
  },

  async signup(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to signup');
    const data = await res.json();
    return data.user;
  },

  async getProfile(userId?: string): Promise<UserProfile> {
    const url = userId ? `/api/profile?userId=${encodeURIComponent(userId)}` : '/api/profile';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to save profile');
    return res.json();
  },

  async switchMode(userId: string, persona: Persona): Promise<UserProfile> {
    const res = await fetch('/api/profile/switch-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, persona }),
    });
    if (!res.ok) throw new Error('Failed to switch mode');
    return res.json();
  },

  // ---------------- ROADMAP (ON-DEMAND AI) ----------------
  async getRoadmap(userId?: string): Promise<StructuredRoadmap | null> {
    const url = userId ? `/api/roadmap?userId=${encodeURIComponent(userId)}` : '/api/roadmap';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    const data = await res.json();
    return data.roadmap;
  },

  async generateRoadmap(userId: string, targetRole: string): Promise<StructuredRoadmap> {
    const res = await fetch('/api/roadmap/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetRole }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate roadmap');
    }
    const data = await res.json();
    return data.roadmap;
  },

  async adaptRoadmap(userId: string, updatedSkills: Record<string, number>): Promise<{ updatedRoadmap: StructuredRoadmap; diff: RoadmapDiff }> {
    const res = await fetch('/api/roadmap/adapt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, updatedSkills }),
    });
    if (!res.ok) throw new Error('Failed to adapt roadmap');
    return res.json();
  },

  async updateSubmoduleStatus(
    userId: string,
    moduleId: string,
    submoduleId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ): Promise<StructuredRoadmap> {
    const res = await fetch('/api/roadmap/submodule/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, moduleId, submoduleId, status }),
    });
    if (!res.ok) throw new Error('Failed to update submodule status');
    const data = await res.json();
    return data.roadmap;
  },

  async deleteRoadmap(userId: string): Promise<void> {
    const res = await fetch('/api/roadmap/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to delete roadmap');
  },

  // ---------------- ASSESSMENTS (ON-DEMAND AI) ----------------
  async generateAssessment(skill: string, userId: string): Promise<AssessmentSession> {
    const res = await fetch('/api/assessment/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, userId }),
    });
    if (!res.ok) throw new Error('Failed to generate assessment');
    return res.json();
  },

  async submitAssessment(sessionId: string, userId: string, answers: Record<string, number>): Promise<{ result: AssessmentResult; updatedProfile: UserProfile }> {
    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId, answers }),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  },

  // ---------------- MOCK INTERVIEW (ON-DEMAND AI) ----------------
  async startInterview(role: string, userId: string): Promise<InterviewSession> {
    const res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, userId }),
    });
    if (!res.ok) throw new Error('Failed to start interview');
    return res.json();
  },

  async evaluateInterviewAnswer(sessionId: string, questionId: string, answer: string, role?: string): Promise<AnswerEvaluation> {
    const res = await fetch('/api/interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId, answer, role }),
    });
    if (!res.ok) throw new Error('Failed to evaluate answer');
    const data = await res.json();
    return data.evaluation;
  },

  async getNextInterviewQuestion(sessionId: string, userId: string): Promise<{ session: InterviewSession; nextQuestion: any }> {
    const res = await fetch('/api/interview/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId }),
    });
    if (!res.ok) throw new Error('Failed to fetch next question');
    return res.json();
  },

  async finishInterview(sessionId: string, userId: string): Promise<{ session: InterviewSession; report: InterviewReport }> {
    const res = await fetch('/api/interview/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId }),
    });
    if (!res.ok) throw new Error('Failed to complete interview');
    return res.json();
  },

  // ---------------- JOBS & SCHEMES ----------------
  async getJobs(params?: { query?: string; location?: string; isRemote?: boolean; persona?: string; district?: string; state?: string; tradeOrDomain?: string; targetRole?: string }): Promise<Opportunity[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.isRemote) searchParams.set('isRemote', 'true');
    if (params?.persona) searchParams.set('persona', params.persona);
    if (params?.district) searchParams.set('district', params.district);
    if (params?.state) searchParams.set('state', params.state);
    if (params?.tradeOrDomain) searchParams.set('tradeOrDomain', params.tradeOrDomain);
    if (params?.targetRole) searchParams.set('targetRole', params.targetRole);

    const res = await fetch(`/api/jobs?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getSchemes(category?: string, query?: string, locationParams?: { state?: string; district?: string }): Promise<GovScheme[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (query) params.set('query', query);
    if (locationParams?.state) params.set('state', locationParams.state);
    if (locationParams?.district) params.set('district', locationParams.district);

    const res = await fetch(`/api/schemes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return res.json();
  },

  async querySchemesRAG(query: string, language: 'en' | 'hi' = 'en'): Promise<{
    answer: string;
    matchedSchemes: GovScheme[];
    sourceCitations: { name: string; authority: string; url: string }[];
  }> {
    const res = await fetch('/api/schemes/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    });
    if (!res.ok) throw new Error('Failed to query schemes RAG');
    return res.json();
  },

  // ---------------- VOICE & ACTIVITY ----------------
  async parseVoiceIntent(query: string, language: 'en' | 'hi', userId: string): Promise<VoiceIntentResult> {
    const res = await fetch('/api/voice/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, userId }),
    });
    if (!res.ok) throw new Error('Failed to parse voice intent');
    return res.json();
  },

  async getActivities(userId: string): Promise<ActivityItem[]> {
    const res = await fetch(`/api/activity?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async logActivity(data: { userId: string; minutes: number; activityType: string; title: string; details?: string }): Promise<ActivityItem> {
    const res = await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log activity');
    return res.json();
  },

  async getArchitectureStatus(): Promise<ArchitectureStatus> {
    const res = await fetch('/api/architecture/status');
    if (!res.ok) throw new Error('Failed to fetch architecture status');
    return res.json();
  },
};
