export type Persona = 'student' | 'livelihood';
export type Language = 'en' | 'hi';

export type UserSkillEvidence = 'self_report' | 'assessment' | 'interview' | 'project';

export interface UserSkill {
  name: string;
  category: 'technical' | 'tool' | 'soft_skill' | 'reasoning' | 'trade';
  level: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  evidence: UserSkillEvidence[];
  lastAssessedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  persona: Persona; // 'student' (Student) | 'livelihood' (Job Seeker)
  location: {
    villageOrCity: string;
    district: string;
    state: string;
    pincode?: string;
  };
  educationLevel?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  targetRole?: string;
  tradeOrDomain?: string;
  interests?: string[];
  skills: Record<string, UserSkill>;
  experienceYears?: number;
  preferredWorkType?: 'remote' | 'local_job' | 'apprenticeship' | 'freelance';
  workRadiusKm?: number;
  monthlyIncomeTarget?: number;
  readinessScore?: number;
  strongAreas?: string[];
  needsWorkAreas?: string[];
  nextMilestone?: string;
  isDemo?: boolean;
  hasCompletedOnboarding?: boolean;
  currentFocus?: {
    moduleId: string;
    submoduleId: string;
    title: string;
    remainingMinutes: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Recommendation {
  id?: string;
  type?: string;
  matchScore: number; // 0 - 100
  reasons: string[];
  missingRequirements: string[];
  missingSkills?: string[];
  isEligible?: boolean;
  eligibility?: {
    eligible: boolean;
    reasons?: string[];
  };
  eligibilityNotes?: string;
  priorityRank?: number;
  source?: string;
  freshness?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote?: boolean;
  salary: string;
  jobType: string;
  experienceRequired: string;
  skills: string[];
  description: string;
  source: string;
  postedAt: string;
  fetchedAt: string;
  url: string;
  distanceKm?: number;
  matchRecommendation?: Recommendation;
}

export interface GovScheme {
  id: string;
  name: string;
  nameHi: string;
  authority: string;
  targetAudience: string;
  category: 'Skill Development' | 'Financial Support' | 'Self Employment' | 'Apprenticeship' | 'Rural Livelihoods';
  eligibilityCriteria: {
    ageRange: [number, number];
    educationMin: string;
    incomeLimit?: string;
    specialCriteria?: string[];
  };
  benefits: string[];
  benefitsHi?: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  officialSource: string;
  officialUrl: string;
  lastUpdated: string;
  matchRecommendation?: Recommendation;
}

// Structured Roadmap Types
export interface RoadmapResource {
  title: string;
  url: string;
  type: string; // 'Documentation' | 'Video' | 'Interactive' | 'Guide'
}

export interface RoadmapSubmodule {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  resources: RoadmapResource[];
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  learningObjective?: string;
  submodules: RoadmapSubmodule[];
}

export interface StructuredRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  overview: string;
  modules: RoadmapModule[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapDiff {
  milestonesCompleted?: number;
  milestonesAccelerated?: number;
  newFocusAreas?: string[];
  previouslyNext?: string;
  nowNext?: string;
  details?: string[];
  reason?: string;
  estimatedTimeSavedHours?: number;
  unlockedModules?: string[];
  modifiedMilestones?: string[];
}

// Assessment Types
export interface AssessmentQuestion {
  id: string;
  skill: string;
  topic?: string;
  prompt?: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string;
  explanation?: string;
  type?: 'mcq' | 'scenario' | 'code';
}

export interface AssessmentSession {
  id: string;
  skill: string;
  difficulty: string;
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  isCompleted: boolean;
  result?: AssessmentResult;
  createdAt: string;
}

export interface AssessmentResult {
  id: string;
  skill: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  strongAreas: string[];
  needsImprovement: string[];
  recommendedNextStep: string;
  recommendedNextMilestone?: string;
  completedAt: string;
}

// Interview Types
export interface AnswerEvaluation {
  technicalAccuracyScore: number; // 0 - 100
  structureScore: number;
  communicationScore: number;
  confidenceScore: number;
  whatWentWell: string[];
  whatWasMissing: string[];
  idealAnswer: string;
  howToImprove?: string | string[];
  betterStructure?: string;
  recommendedPractice?: string;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  questionHi?: string;
  expectedKeyPoints?: string[];
  userAnswer?: string;
  evaluation?: AnswerEvaluation;
}

export interface InterviewReport {
  overallReadiness: number;
  technicalScore: number;
  communicationScore: number;
  structureScore: number;
  confidenceScore: number;
  strongestArea?: string;
  needsAttention?: string;
  nextPracticeSuggestions: string[];
  strengths?: string[];
  areasToImprove?: string[];
  recommendedSubmodules?: string[];
}

export interface InterviewSession {
  id: string;
  role: string;
  difficulty: 'entry' | 'intermediate' | 'advanced';
  status: 'not_started' | 'in_progress' | 'completed';
  questions: InterviewQuestionItem[];
  currentQuestionIndex: number;
  finalReport?: InterviewReport;
  startedAt: string;
  completedAt?: string;
}

// Activity Log Types
export interface ActivityItem {
  id: string;
  date?: string;
  timestamp?: string;
  day?: string;
  minutes: number;
  activityType: 'roadmap_study' | 'mock_interview' | 'assessment' | 'job_application' | 'scheme_view';
  title: string;
  details?: string;
}

// Voice and Intent Types
export interface VoiceIntentResult {
  intent: 'scheme_search' | 'job_search' | 'skill_training' | 'eligibility_query' | 'general_advice';
  language: 'en' | 'hi';
  extractedQuery: string;
  filterParams?: {
    trade?: string;
    location?: string;
    category?: string;
  };
  spokenResponse: string;
}

export interface RoadmapNode {
  id: string;
  stage: 'FOUNDATION' | 'CORE_SKILLS' | 'PROJECTS' | 'JOB_READINESS' | 'APPLICATIONS';
  stageOrder: number;
  title: string;
  titleHi?: string;
  description: string;
  whyThisMatters: string;
  skills: string[];
  status: 'completed' | 'in_progress' | 'locked' | 'accelerated';
  estimatedHours: number;
  learningResources: {
    title: string;
    type: 'video' | 'article' | 'docs' | 'course';
    url: string;
    free: boolean;
  }[];
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  practiceProject?: {
    title: string;
    description: string;
    deliverable: string;
  };
  assessmentAvailable?: boolean;
  completedAt?: string;
}

export interface ArchitectureStatus {
  sharedEngineVersion: string;
  scoringFactors: string[];
  activePersona: Persona;
  geminiModel: string;
  jobProviders: { name: string; status: 'active' | 'cached' | 'connected'; count: number }[];
  schemesIndexed: number;
  ragStatus: string;
  serverTimestamp: string;
}
