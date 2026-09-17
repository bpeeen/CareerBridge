import { createClient } from '@supabase/supabase-js';
import {
  UserProfile,
  StructuredRoadmap,
  AssessmentSession,
  AssessmentResult,
  InterviewSession,
  ActivityItem,
  Persona
} from '../src/types';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uqweblvhlxudsaxszfqf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2VibHZobHh1ZHNheHN6ZnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzUxODYsImV4cCI6MjEwNTI1MTE4Nn0.CuhKu__tRuTelQOU7PJPg2gTnPZxNRwXJ32sZIBYmRE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  }
});

const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

// Default Student Demo Profile
export const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: 'user-student-demo',
  name: 'Bipin Kumar',
  email: 'bipinkr2308@gmail.com',
  age: 21,
  persona: 'student',
  location: {
    villageOrCity: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834001',
  },
  educationLevel: 'Bachelor of Technology (B.Tech)',
  college: 'Birla Institute of Technology (BIT Mesra)',
  degree: 'Computer Science & Engineering',
  branch: 'CSE',
  graduationYear: 2026,
  targetRole: 'Backend Developer',
  interests: ['Software Development', 'REST APIs', 'Cloud Computing', 'Databases'],
  skills: {
    Python: {
      name: 'Python',
      category: 'technical',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    SQL: {
      name: 'SQL',
      category: 'technical',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    DSA: {
      name: 'DSA',
      category: 'reasoning',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    Git: {
      name: 'Git',
      category: 'tool',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    'REST APIs': {
      name: 'REST APIs',
      category: 'technical',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    Communication: {
      name: 'Communication',
      category: 'soft_skill',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
  },
  readinessScore: 0,
  strongAreas: ['Python Basics', 'Git Version Control'],
  needsWorkAreas: ['SQL & Database Optimization', 'REST API Design', 'System Architecture'],
  nextMilestone: 'Complete REST API Design & PostgreSQL Integration',
  currentFocus: {
    moduleId: 'mod-1',
    submoduleId: 'sub-1-1',
    title: 'Language & Core Foundations',
    remainingMinutes: 30,
  },
  hasCompletedOnboarding: true,
  isDemo: true,
  createdAt: '2026-03-01T08:00:00Z',
  updatedAt: new Date().toISOString(),
};

// Default Rural Worker / Job Seeker Profile
export const DEFAULT_RURAL_PROFILE: UserProfile = {
  id: 'user-rural-demo',
  name: 'Ravi Kumar',
  email: 'ravi.kumar@example.org',
  age: 24,
  persona: 'livelihood',
  location: {
    villageOrCity: 'Namkum',
    district: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834010',
  },
  educationLevel: 'Class 10th & ITI Basic',
  tradeOrDomain: 'Electrician & Solar Technician',
  experienceYears: 1,
  preferredWorkType: 'local_job',
  workRadiusKm: 20,
  monthlyIncomeTarget: 18000,
  interests: ['Electrician', 'Solar PV', 'Wiring', 'Government Schemes'],
  skills: {
    'Basic Electrical': {
      name: 'Basic Electrical',
      category: 'trade',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    'Solar PV Installation': {
      name: 'Solar PV Installation',
      category: 'trade',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    'Safety Standards & PPE': {
      name: 'Safety Standards & PPE',
      category: 'trade',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
    'Smartphone & Digital Tools': {
      name: 'Smartphone & Digital Tools',
      category: 'tool',
      level: 0,
      confidence: 0,
      evidence: ['self_report'],
    },
  },
  readinessScore: 0,
  strongAreas: ['House Wiring', 'Safety Equipment'],
  needsWorkAreas: ['Solar On-Grid Inverter Setup', 'PMKVY Govt Certification', 'PM Vishwakarma Tool Application'],
  nextMilestone: 'Enroll in PMKVY 4.0 Solar Technician Certification',
  hasCompletedOnboarding: true,
  isDemo: true,
  createdAt: '2026-03-05T09:00:00Z',
  updatedAt: new Date().toISOString(),
};

class DatabaseStore {
  private profiles: Map<string, UserProfile> = new Map();
  private roadmaps: Map<string, StructuredRoadmap> = new Map();
  private assessmentSessions: Map<string, AssessmentSession> = new Map();
  private assessmentResults: Map<string, AssessmentResult[]> = new Map();
  private interviewSessions: Map<string, InterviewSession> = new Map();
  private activityLogs: Map<string, ActivityItem[]> = new Map();

  constructor() {
    this.profiles.set(DEFAULT_STUDENT_PROFILE.id, DEFAULT_STUDENT_PROFILE);
    this.profiles.set(DEFAULT_RURAL_PROFILE.id, DEFAULT_RURAL_PROFILE);

    // Initial student roadmap (uncompleted)
    const initialStudentRoadmap: StructuredRoadmap = {
      id: 'roadmap-init-student',
      userId: DEFAULT_STUDENT_PROFILE.id,
      targetRole: 'Backend Developer',
      overview: 'Structured path to master backend development and secure full-time engineering roles.',
      modules: [
        {
          id: 'mod-1',
          title: '01 — Language & Core Foundations',
          description: 'Object-oriented programming, data structures, memory management, and clean code principles.',
          learningObjective: 'Master syntax, algorithmic problem solving, and standard libraries.',
          submodules: [
            {
              id: 'sub-1-1',
              title: 'Modern Python Syntax & Types',
              description: 'Core types, control flow, functions, and error handling.',
              estimatedMinutes: 30,
              status: 'not_started',
              resources: [
                { title: 'Official Python Docs', url: 'https://docs.python.org/3/', type: 'Documentation' },
                { title: 'roadmap.sh Python Guide', url: 'https://roadmap.sh/python', type: 'Guide' },
              ],
            },
            {
              id: 'sub-1-2',
              title: 'OOP & Modular Code Architecture',
              description: 'Classes, inheritance, encapsulation, and SOLID design principles.',
              estimatedMinutes: 45,
              status: 'not_started',
              resources: [
                { title: 'Refactoring Guru: Design Patterns', url: 'https://refactoring.guru/design-patterns', type: 'Guide' },
              ],
            },
            {
              id: 'sub-1-3',
              title: 'Git Branching & GitHub Collaboration',
              description: 'Pull requests, git rebase, merge conflicts, and commit hygiene.',
              estimatedMinutes: 30,
              status: 'not_started',
              resources: [
                { title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2', type: 'Documentation' },
              ],
            },
          ],
        },
        {
          id: 'mod-2',
          title: '02 — High-Throughput REST APIs & Web Architecture',
          description: 'HTTP protocol, RESTful API design, middleware, authentication, and validation.',
          learningObjective: 'Build resilient, production-ready web endpoints.',
          submodules: [
            {
              id: 'sub-2-1',
              title: 'REST APIs & HTTP Status Codes',
              description: 'Idempotency, request lifecycles, and caching headers.',
              estimatedMinutes: 24,
              status: 'not_started',
              resources: [
                { title: 'MDN Web Docs: HTTP Protocol', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'Documentation' },
              ],
            },
            {
              id: 'sub-2-2',
              title: 'JWT Authentication & Authorization',
              description: 'Token validation, refresh mechanisms, and role-based access control.',
              estimatedMinutes: 40,
              status: 'not_started',
              resources: [
                { title: 'JWT.io Introduction & RFC Standards', url: 'https://jwt.io/introduction', type: 'Guide' },
              ],
            },
          ],
        },
        {
          id: 'mod-3',
          title: '03 — Database Architecture & Query Optimization',
          description: 'Relational data modeling, SQL queries, indexing, and connection pools.',
          learningObjective: 'Design scalable schemas and eliminate performance bottlenecks.',
          submodules: [
            {
              id: 'sub-3-1',
              title: 'PostgreSQL Schema Design & Constraints',
              description: 'Foreign keys, migrations, transactions, and ACID properties.',
              estimatedMinutes: 35,
              status: 'not_started',
              resources: [
                { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/current/', type: 'Documentation' },
              ],
            },
            {
              id: 'sub-3-2',
              title: 'SQL Indexing & Query Plan Optimization',
              description: 'B-tree indexes, EXPLAIN ANALYZE, and index scans.',
              estimatedMinutes: 50,
              status: 'not_started',
              resources: [
                { title: 'Use The Index, Luke! SQL Indexing Guide', url: 'https://use-the-index-luke.com/', type: 'Guide' },
              ],
            },
          ],
        },
      ],
      createdAt: '2026-03-01T08:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    this.roadmaps.set(DEFAULT_STUDENT_PROFILE.id, initialStudentRoadmap);

    // Initial activity logs
    this.activityLogs.set(DEFAULT_STUDENT_PROFILE.id, [
      { id: 'act-1', date: '2026-03-16', day: 'Fri', minutes: 51, activityType: 'roadmap_study', title: 'Completed Python Functions & OOP Practice' },
      { id: 'act-2', date: '2026-03-15', day: 'Thu', minutes: 27, activityType: 'mock_interview', title: 'Technical Interview: Authentication vs Authorization' },
      { id: 'act-3', date: '2026-03-14', day: 'Wed', minutes: 44, activityType: 'roadmap_study', title: 'Studied HTTP Status Codes & REST Specifications' },
      { id: 'act-4', date: '2026-03-13', day: 'Tue', minutes: 18, activityType: 'assessment', title: 'Verified Python Skill Level Assessment' },
      { id: 'act-5', date: '2026-03-12', day: 'Mon', minutes: 32, activityType: 'job_application', title: 'Matched 4 relevant opportunities in Bengaluru & Hyderabad' },
    ]);

    this.activityLogs.set(DEFAULT_RURAL_PROFILE.id, [
      { id: 'act-r1', date: '2026-03-16', day: 'Fri', minutes: 30, activityType: 'scheme_view', title: 'Checked PM Vishwakarma Toolkit Application' },
      { id: 'act-r2', date: '2026-03-15', day: 'Thu', minutes: 20, activityType: 'job_application', title: 'Viewed Solar Technician job in Namkum (12 km away)' },
      { id: 'act-r3', date: '2026-03-14', day: 'Wed', minutes: 40, activityType: 'assessment', title: 'Basic Electrical Safety Assessment' },
    ]);
  }

  // ---------------- Profile Methods ----------------
  async getProfile(id: string): Promise<UserProfile> {
    if (isUUID(id)) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            persona: data.persona,
            age: data.age,
            location: data.location,
            educationLevel: data.education_level,
            degree: data.degree,
            college: data.college,
            graduationYear: data.graduation_year,
            targetRole: data.target_role,
            tradeOrDomain: data.trade_or_domain,
            experienceYears: data.experience_years,
            skills: data.skills || {},
            readinessScore: data.readiness_score,
            hasCompletedOnboarding: data.has_completed_onboarding,
            preferredWorkType: data.work_type,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.error('[server db] Error loading profile from Supabase:', e);
      }
    }
    return this.profiles.get(id) || DEFAULT_STUDENT_PROFILE;
  }

  async getProfileByPersona(persona: Persona): Promise<UserProfile> {
    for (const p of this.profiles.values()) {
      if (p.persona === persona) return p;
    }
    return persona === 'student' ? DEFAULT_STUDENT_PROFILE : DEFAULT_RURAL_PROFILE;
  }

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    
    if (isUUID(profile.id)) {
      try {
        const payload = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          persona: profile.persona,
          age: profile.age,
          location: profile.location,
          education_level: profile.educationLevel,
          degree: profile.degree,
          college: profile.college,
          graduation_year: profile.graduationYear,
          target_role: profile.targetRole,
          trade_or_domain: profile.tradeOrDomain,
          experience_years: profile.experienceYears,
          work_type: profile.preferredWorkType,
          skills: profile.skills || {},
          readiness_score: profile.readinessScore || 60,
          has_completed_onboarding: profile.hasCompletedOnboarding ?? true,
          updated_at: updated.updatedAt,
        };

        const { error } = await supabase
          .from('profiles')
          .upsert(payload);

        if (error) {
          console.error('[server db] Supabase save error:', error);
          throw new Error(error.message);
        }
      } catch (e) {
        console.error('[server db] Exception saving profile to Supabase:', e);
        throw e;
      }
    }
    
    this.profiles.set(profile.id, updated);
    return updated;
  }

  async switchPersona(userId: string, newPersona: Persona): Promise<UserProfile> {
    const existing = await this.getProfile(userId);
    const updated: UserProfile = {
      ...existing,
      persona: newPersona,
      updatedAt: new Date().toISOString(),
    };

    if (isUUID(userId)) {
      try {
        await supabase
          .from('profiles')
          .update({ persona: newPersona, updated_at: updated.updatedAt })
          .eq('id', userId);
      } catch (e) {
        console.error('[server db] Error updating persona in Supabase:', e);
      }
    }

    this.profiles.set(userId, updated);
    return updated;
  }

  // ---------------- Roadmap Methods ----------------
  async getRoadmap(userId: string): Promise<StructuredRoadmap | null> {
    if (isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('roadmaps')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            userId: row.user_id,
            targetRole: row.target_role,
            overview: row.overview,
            modules: row.modules,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
      } catch (e) {
        console.error('[server db] Error getting roadmap from Supabase:', e);
      }
    }
    return this.roadmaps.get(userId) || null;
  }

  async saveRoadmap(userId: string, roadmap: StructuredRoadmap): Promise<StructuredRoadmap> {
    if (isUUID(userId)) {
      try {
        const payload = {
          user_id: userId,
          target_role: roadmap.targetRole,
          overview: roadmap.overview,
          modules: roadmap.modules,
          updated_at: new Date().toISOString(),
        };

        const existing = await this.getRoadmap(userId);
        const payloadWithId = {
          ...payload,
          id: existing?.id || undefined,
        };

        const { data, error } = await supabase
          .from('roadmaps')
          .upsert(payloadWithId)
          .select()
          .single();

        if (!error && data) {
          roadmap = {
            id: data.id,
            userId: data.user_id,
            targetRole: data.target_role,
            overview: data.overview,
            modules: data.modules,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.error('[server db] Error saving roadmap to Supabase:', e);
      }
    }
    this.roadmaps.set(userId, roadmap);
    return roadmap;
  }

  async deleteRoadmap(userId: string): Promise<void> {
    if (isUUID(userId)) {
      try {
        await supabase
          .from('roadmaps')
          .delete()
          .eq('user_id', userId);
      } catch (e) {
        console.error('[server db] Error deleting roadmap:', e);
      }
    }
    this.roadmaps.delete(userId);
  }

  async updateSubmoduleStatus(
    userId: string,
    moduleId: string,
    submoduleId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ): Promise<StructuredRoadmap | null> {
    const roadmap = await this.getRoadmap(userId);
    if (!roadmap) return null;

    let targetSubmoduleTitle = '';

    const updatedModules = roadmap.modules.map((m) => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        submodules: m.submodules.map((sm) => {
          if (sm.id !== submoduleId) return sm;
          targetSubmoduleTitle = sm.title;
          return {
            ...sm,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }),
      };
    });

    const updatedRoadmap: StructuredRoadmap = {
      ...roadmap,
      modules: updatedModules,
      updatedAt: new Date().toISOString(),
    };

    await this.saveRoadmap(userId, updatedRoadmap);

    // Update user's current focus and log activity if completed
    if (status === 'completed' && targetSubmoduleTitle) {
      await this.logActivity(userId, {
        minutes: 25,
        activityType: 'roadmap_study',
        title: `Completed Roadmap Milestone: ${targetSubmoduleTitle}`,
      });
    }

    return updatedRoadmap;
  }

  // ---------------- Assessment Methods ----------------
  async saveAssessmentSession(session: AssessmentSession): Promise<AssessmentSession> {
    this.assessmentSessions.set(session.id, session);
    return session;
  }

  async getAssessmentSession(sessionId: string): Promise<AssessmentSession | null> {
    return this.assessmentSessions.get(sessionId) || null;
  }

  async saveAssessmentResult(userId: string, result: AssessmentResult): Promise<AssessmentResult> {
    const existing = this.assessmentResults.get(userId) || [];
    existing.unshift(result);
    this.assessmentResults.set(userId, existing);

    // Update user skill in profile
    const profile = await this.getProfile(userId);
    if (profile && profile.skills) {
      const currentSkill = profile.skills[result.skill] || {
        name: result.skill,
        category: 'technical',
        level: 50,
        confidence: 0.5,
        evidence: ['self_report'],
      };

      const newEvidence = currentSkill.evidence.includes('assessment')
        ? currentSkill.evidence
        : [...currentSkill.evidence, 'assessment' as const];

      profile.skills[result.skill] = {
        ...currentSkill,
        level: result.score,
        confidence: 0.9,
        evidence: newEvidence,
        lastAssessedAt: new Date().toISOString().split('T')[0],
      };

      // Recalculate overall readiness score based on skill levels from assessments
      const skillValues = Object.values(profile.skills);
      if (skillValues.length > 0) {
        const sumLevels = skillValues.reduce((acc, s) => acc + (s.level || 0), 0);
        profile.readinessScore = Math.round(sumLevels / skillValues.length);
      }

      await this.saveProfile(profile);
    }

    if (isUUID(userId)) {
      try {
        await supabase
          .from('assessments')
          .insert({
            user_id: userId,
            skill: result.skill,
            score: result.score,
            total_questions: result.totalQuestions,
            correct_count: result.correctCount,
            strong_areas: result.strongAreas,
            needs_improvement: result.needsImprovement,
            recommended_next_step: result.recommendedNextStep,
          });
      } catch (e) {
        console.error('[server db] Error inserting assessment to Supabase:', e);
      }
    }

    await this.logActivity(userId, {
      minutes: 15,
      activityType: 'assessment',
      title: `Verified Assessment in ${result.skill} (${result.score}%)`,
      details: `${result.correctCount} / ${result.totalQuestions} questions correct`,
    });

    return result;
  }

  async getAssessmentResults(userId: string): Promise<AssessmentResult[]> {
    if (isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });
        if (!error && data) {
          return data.map(row => ({
            id: row.id,
            skill: row.skill,
            score: row.score,
            totalQuestions: row.total_questions,
            correctCount: row.correct_count,
            strongAreas: row.strong_areas,
            needsImprovement: row.needs_improvement,
            recommendedNextStep: row.recommended_next_step,
            completedAt: row.completed_at,
          }));
        }
      } catch (e) {
        console.error('[server db] Error getting assessments from Supabase:', e);
      }
    }
    return this.assessmentResults.get(userId) || [];
  }

  // ---------------- Interview Methods ----------------
  async saveInterviewSession(session: InterviewSession, userId?: string): Promise<InterviewSession> {
    this.interviewSessions.set(session.id, session);
    
    if (userId && isUUID(userId)) {
      try {
        const payload = {
          user_id: userId,
          role: session.role,
          difficulty: session.difficulty,
          status: session.status,
          questions: session.questions,
          current_question_index: session.currentQuestionIndex,
          final_report: session.finalReport,
          started_at: session.startedAt,
          completed_at: session.completedAt || null,
        };

        // If session ID is a UUID, we can upsert with it. If not (e.g. interview-178...), we let Supabase generate a UUID or we try upserting with a generated ID.
        // To be safe, we can look up an existing record by id if it is a UUID, or upsert using the ID.
        const recordId = isUUID(session.id) ? session.id : undefined;
        const payloadWithId = recordId ? { ...payload, id: recordId } : payload;

        const { data, error } = await supabase
          .from('interviews')
          .upsert(payloadWithId)
          .select()
          .single();
        if (!error && data) {
          session.id = data.id;
          this.interviewSessions.set(data.id, session);
        }
      } catch (e) {
        console.error('[server db] Error saving interview session to Supabase:', e);
      }
    }
    return session;
  }

  async getInterviewSession(sessionId: string): Promise<InterviewSession | null> {
    const local = this.interviewSessions.get(sessionId) || null;
    if (local) return local;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', sessionId)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          role: data.role,
          difficulty: data.difficulty as any,
          status: data.status as any,
          questions: data.questions,
          currentQuestionIndex: data.current_question_index,
          finalReport: data.final_report,
          startedAt: data.started_at,
          completedAt: data.completed_at,
        };
      }
    } catch (e) {
      console.error('[server db] Error loading interview session from Supabase:', e);
    }
    return null;
  }

  // ---------------- Activity Methods ----------------
  async getActivities(userId: string): Promise<ActivityItem[]> {
    if (isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return data.map(row => {
            const dateObj = new Date(row.created_at);
            return {
              id: row.id,
              date: dateObj.toISOString().split('T')[0],
              day: days[dateObj.getDay()],
              minutes: row.minutes,
              activityType: row.activity_type as any,
              title: row.title,
              details: row.details,
            };
          });
        }
      } catch (e) {
        console.error('[server db] Error getting activities from Supabase:', e);
      }
    }
    return this.activityLogs.get(userId) || [];
  }

  async logActivity(userId: string, item: Omit<ActivityItem, 'id' | 'date' | 'day'>): Promise<ActivityItem> {
    const logs = this.activityLogs.get(userId) || [];
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const localLog: ActivityItem = {
      id: `act-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      day: days[now.getDay()],
      minutes: item.minutes,
      activityType: item.activityType,
      title: item.title,
      details: item.details,
    };
    
    if (isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            user_id: userId,
            minutes: item.minutes,
            activity_type: item.activityType,
            title: item.title,
            details: item.details,
          })
          .select()
          .single();
        if (!error && data) {
          const dateObj = new Date(data.created_at);
          localLog.id = data.id;
          localLog.date = dateObj.toISOString().split('T')[0];
          localLog.day = days[dateObj.getDay()];
        }
      } catch (e) {
        console.error('[server db] Error inserting activity to Supabase:', e);
      }
    }
    
    logs.unshift(localLog);
    this.activityLogs.set(userId, logs.slice(0, 30));
    return localLog;
  }
}

export const db = new DatabaseStore();
