import { UserProfile, RoadmapNode, RoadmapDiff } from '../../types';

/**
 * Generates an adaptive, structured 5-stage progression for any target role or trade domain.
 */
export function generateAdaptiveRoadmap(profile: UserProfile): RoadmapNode[] {
  const role = (profile.targetRole || profile.tradeOrDomain || 'Backend Developer').toLowerCase();
  const skills = profile.skills;

  if (profile.persona === 'livelihood') {
    return generateLivelihoodRoadmap(profile, role, skills);
  }

  // Student / Graduate roadmap
  if (role.includes('data') || role.includes('ai') || role.includes('machine learning')) {
    return generateDataAIRoadmap(skills);
  } else if (role.includes('frontend') || role.includes('ui') || role.includes('web')) {
    return generateFrontendRoadmap(skills);
  }

  // Default: Backend Developer / Software Engineering
  return generateBackendRoadmap(skills);
}

function generateBackendRoadmap(skills: Record<string, { level: number }>): RoadmapNode[] {
  const pythonLevel = skills['Python']?.level || 0;
  const sqlLevel = skills['SQL']?.level || 0;
  const gitLevel = skills['Git']?.level || 0;
  const apiLevel = skills['REST APIs']?.level || 0;
  const dsaLevel = skills['DSA']?.level || 0;

  const node1Status: 'completed' | 'in_progress' | 'locked' | 'accelerated' = pythonLevel >= 70 ? 'completed' : 'in_progress';
  const node2Status: 'completed' | 'in_progress' | 'locked' | 'accelerated' = node1Status === 'completed'
    ? (sqlLevel >= 60 && apiLevel >= 50 ? 'completed' : 'in_progress')
    : (sqlLevel >= 40 ? 'accelerated' : 'locked');
  const node3Status: 'completed' | 'in_progress' | 'locked' | 'accelerated' = (node2Status === 'completed' || node2Status === 'accelerated')
    ? 'in_progress'
    : 'locked';
  const node4Status: 'completed' | 'in_progress' | 'locked' | 'accelerated' = (dsaLevel >= 60)
    ? 'in_progress'
    : 'locked';
  const node5Status: 'completed' | 'in_progress' | 'locked' | 'accelerated' = 'locked';

  return [
    {
      id: 'node-backend-1',
      stage: 'FOUNDATION',
      stageOrder: 1,
      title: '01 — Python Foundations',
      titleHi: '01 — पायथन बुनियादी सिद्धांत',
      description: 'Core syntax, variables, data structures, control flow, and Object-Oriented Programming principles.',
      whyThisMatters: 'Mandatory prerequisite for 89% of backend developer listings.',
      skills: ['Python', 'Git', 'OOP'],
      status: node1Status,
      estimatedHours: node1Status === 'completed' ? 0 : 18,
      learningResources: [
        { title: 'Python 3.12 Deep Dive Docs', type: 'docs', url: 'https://docs.python.org/3/', free: true },
        { title: 'Modern OOP & Design Patterns', type: 'article', url: 'https://refactoring.guru/design-patterns/python', free: true },
        { title: 'Interactive CLI Practice', type: 'course', url: 'https://exercism.org/tracks/python', free: true }
      ],
      tasks: [
        { id: 't1', title: 'Master List comprehensions & generators', completed: pythonLevel >= 50 },
        { id: 't2', title: 'Implement OOP inheritance & polymorphism', completed: pythonLevel >= 70 },
        { id: 't3', title: 'Git branch & PR workflow', completed: gitLevel >= 40 }
      ],
      practiceProject: {
        title: 'CLI Task & Resource Manager',
        description: 'Build a modular CLI with file persistence, JSON serialization, and error handling.',
        deliverable: 'GitHub repository with unit tests'
      },
      assessmentAvailable: true
    },
    {
      id: 'node-backend-2',
      stage: 'CORE_SKILLS',
      stageOrder: 2,
      title: '02 — Backend Fundamentals & REST APIs',
      titleHi: '02 — बैकएंड बेसिक्स और REST APIs',
      description: 'HTTP protocol, RESTful architectural design, relational databases (PostgreSQL/SQL), indexes, and authentication (JWT/Sessions).',
      whyThisMatters: 'Required by 78% of your matched backend roles in Hyderabad & Bengaluru.',
      skills: ['REST APIs', 'SQL', 'PostgreSQL', 'Auth'],
      status: node2Status,
      estimatedHours: node2Status === 'completed' ? 0 : 24,
      learningResources: [
        { title: 'RESTful API Best Practices Specification', type: 'article', url: 'https://restfulapi.net/', free: true },
        { title: 'PostgreSQL Tutorial & Schema Optimization', type: 'docs', url: 'https://www.postgresqltutorial.com/', free: true },
        { title: 'JWT Authentication Architecture', type: 'article', url: 'https://jwt.io/introduction', free: true }
      ],
      tasks: [
        { id: 't4', title: 'Design RESTful routes with proper status codes & pagination', completed: apiLevel >= 50 },
        { id: 't5', title: 'Write complex SQL JOINs, GROUP BY & index queries', completed: sqlLevel >= 60 },
        { id: 't6', title: 'Implement JWT authentication with refresh tokens', completed: false }
      ],
      practiceProject: {
        title: 'Production REST API with PostgreSQL',
        description: 'Create a full CRUD API service with rate limiting, input validation, and migrations.',
        deliverable: 'Deployed web service endpoint + Swagger docs'
      },
      assessmentAvailable: true
    },
    {
      id: 'node-backend-3',
      stage: 'PROJECTS',
      stageOrder: 3,
      title: '03 — Scalable Backend Systems',
      titleHi: '03 — बड़े बैकएंड प्रोजेक्ट्स और डिप्लॉयमेंट',
      description: 'Caching with Redis, asynchronous background workers, Docker containerization, and Cloud deployment.',
      whyThisMatters: 'Distinguishes top candidates during technical portfolio screenings.',
      skills: ['Docker', 'Redis', 'System Design', 'Cloud Deploy'],
      status: node3Status,
      estimatedHours: 30,
      learningResources: [
        { title: 'Docker for Backend Engineers', type: 'docs', url: 'https://docs.docker.com/get-started/', free: true },
        { title: 'System Design Primer', type: 'article', url: 'https://github.com/donnemartin/system-design-primer', free: true }
      ],
      tasks: [
        { id: 't7', title: 'Containerize backend service with multi-stage Dockerfile', completed: false },
        { id: 't8', title: 'Implement Redis caching layer for read-heavy endpoints', completed: false },
        { id: 't9', title: 'Deploy on Cloud Run with CI/CD pipeline', completed: false }
      ],
      practiceProject: {
        title: 'High-Throughput E-Commerce/Booking Engine',
        description: 'Complete resilient backend system handling concurrent operations with transactional consistency.',
        deliverable: 'Live containerized API with load testing report'
      }
    },
    {
      id: 'node-backend-4',
      stage: 'JOB_READINESS',
      stageOrder: 4,
      title: '04 — Interview Ready & Technical Depth',
      titleHi: '04 — इंटरव्यू तैयारी और मॉक टेस्ट',
      description: 'Targeted technical problem solving (DSA), SQL optimization queries, system design discussions, and mock AI evaluations.',
      whyThisMatters: 'Boosts final interview offer conversion rate by over 60%.',
      skills: ['DSA', 'System Design', 'Behavioral Communication'],
      status: node4Status,
      estimatedHours: 15,
      learningResources: [
        { title: 'Curated 75 High-Yield Backend Interview Questions', type: 'article', url: 'https://leetcode.com/discuss', free: true },
        { title: 'STAR Method for Engineering Behavioral Rounds', type: 'article', url: 'https://hbr.org', free: true }
      ],
      tasks: [
        { id: 't10', title: 'Complete 3 Mock Interviews with AI Evaluator', completed: false },
        { id: 't11', title: 'Solve 20 high-yield DSA patterns (Hashing, Two Pointers, Trees)', completed: dsaLevel >= 40 },
        { id: 't12', title: 'Optimize resume bullet points using quantified impact metrics', completed: false }
      ]
    },
    {
      id: 'node-backend-5',
      stage: 'APPLICATIONS',
      stageOrder: 5,
      title: '05 — Targeted Applications & Referrals',
      titleHi: '05 — लक्षित आवेदन और नेटवर्किंग',
      description: 'Strategic outreach, tailored cover notes, matched direct job applications, and recruitment drive tracking.',
      whyThisMatters: 'Converts readiness directly into interviews.',
      skills: ['Networking', 'Application Strategy'],
      status: node5Status,
      estimatedHours: 10,
      learningResources: [
        { title: 'Direct Recruiter Outreach Framework', type: 'article', url: 'https://careerbridge.org/outreach', free: true }
      ],
      tasks: [
        { id: 't13', title: 'Apply to top 5 verified matched opportunities', completed: false },
        { id: 't14', title: 'Send 3 structured alumni/recruiter connection requests', completed: false }
      ]
    }
  ];
}

function generateDataAIRoadmap(skills: Record<string, { level: number }>): RoadmapNode[] {
  const pythonLevel = skills['Python']?.level || 0;
  const sqlLevel = skills['SQL']?.level || 0;

  return [
    {
      id: 'node-ai-1',
      stage: 'FOUNDATION',
      stageOrder: 1,
      title: '01 — Mathematical & Python Foundations',
      titleHi: '01 — गणित और पायथन की नींव',
      description: 'Linear algebra, probability, NumPy, Pandas, and exploratory data analysis.',
      whyThisMatters: 'Foundational baseline for 92% of analytics & ML positions.',
      skills: ['Python', 'NumPy', 'Pandas', 'Statistics'],
      status: pythonLevel >= 60 ? 'completed' : 'in_progress',
      estimatedHours: 20,
      learningResources: [
        { title: 'Pandas Documentation & Cookbook', type: 'docs', url: 'https://pandas.pydata.org/', free: true }
      ],
      tasks: [
        { id: 't-ai-1', title: 'Clean & analyze real-world dirty datasets with Pandas', completed: pythonLevel >= 50 },
        { id: 't-ai-2', title: 'Perform hypothesis testing & statistical distributions', completed: false }
      ]
    },
    {
      id: 'node-ai-2',
      stage: 'CORE_SKILLS',
      stageOrder: 2,
      title: '02 — Machine Learning & SQL Pipelines',
      titleHi: '02 — मशीन लर्निंग और डेटा पाइपलाइन',
      description: 'Supervised/Unsupervised models with Scikit-Learn, complex SQL aggregation, and feature engineering.',
      whyThisMatters: 'Core technical interview criteria across data science hiring.',
      skills: ['Scikit-Learn', 'SQL', 'Feature Engineering'],
      status: pythonLevel >= 60 && sqlLevel >= 50 ? 'in_progress' : 'locked',
      estimatedHours: 28,
      learningResources: [
        { title: 'Scikit-Learn User Guide', type: 'docs', url: 'https://scikit-learn.org/', free: true }
      ],
      tasks: [
        { id: 't-ai-3', title: 'Train, tune hyperparameters, and evaluate classifiers', completed: false },
        { id: 't-ai-4', title: 'Build automated data transformation pipeline', completed: false }
      ]
    },
    {
      id: 'node-ai-3',
      stage: 'PROJECTS',
      stageOrder: 3,
      title: '03 — LLMs, GenAI & Model Deployment',
      titleHi: '03 — जेनरेटिव एआई और मॉडल डिप्लॉयमेंट',
      description: 'RAG pipelines, Gemini API integration, vector embeddings, and FastAPI serving.',
      whyThisMatters: 'High market demand for applied AI engineers.',
      skills: ['Gemini API', 'Vector DB', 'FastAPI'],
      status: 'locked',
      estimatedHours: 25,
      learningResources: [
        { title: 'Google GenAI SDK Documentation', type: 'docs', url: 'https://ai.google.dev', free: true }
      ],
      tasks: [
        { id: 't-ai-5', title: 'Build and deploy a semantic search RAG application', completed: false }
      ]
    },
    {
      id: 'node-ai-4',
      stage: 'JOB_READINESS',
      stageOrder: 4,
      title: '04 — Data & AI Interview Readiness',
      titleHi: '04 — डेटा और एआई इंटरव्यू तैयारी',
      description: 'Case studies, metrics discussion, ML system design, and mock evaluations.',
      whyThisMatters: 'Prepares for data science problem breakdown rounds.',
      skills: ['Case Studies', 'ML Design'],
      status: 'locked',
      estimatedHours: 15,
      learningResources: [],
      tasks: [
        { id: 't-ai-6', title: 'Complete AI data mock interview round', completed: false }
      ]
    },
    {
      id: 'node-ai-5',
      stage: 'APPLICATIONS',
      stageOrder: 5,
      title: '05 — Portfolio & Applications',
      titleHi: '05 — पोर्टफोलियो और आवेदन',
      description: 'Publish interactive Streamlit/web demos and apply to matched roles.',
      whyThisMatters: 'Concrete deliverables show evidence of applied skills.',
      skills: ['Portfolio', 'Applications'],
      status: 'locked',
      estimatedHours: 10,
      learningResources: [],
      tasks: [
        { id: 't-ai-7', title: 'Submit applications to verified matched employers', completed: false }
      ]
    }
  ];
}

function generateFrontendRoadmap(skills: Record<string, { level: number }>): RoadmapNode[] {
  return [
    {
      id: 'node-fe-1',
      stage: 'FOUNDATION',
      stageOrder: 1,
      title: '01 — Modern JavaScript & TypeScript',
      description: 'ES6+, asynchronous JS, event loop, TypeScript types, and DOM performance.',
      whyThisMatters: 'Core building block for modern web interfaces.',
      skills: ['JavaScript', 'TypeScript', 'HTML/CSS'],
      status: 'completed',
      estimatedHours: 14,
      learningResources: [],
      tasks: [{ id: 't-fe-1', title: 'Build typed utilities and async workflows', completed: true }]
    },
    {
      id: 'node-fe-2',
      stage: 'CORE_SKILLS',
      stageOrder: 2,
      title: '02 — React 19 & State Architecture',
      description: 'Component lifecycles, custom hooks, context, Tailwind CSS styling, and accessibility.',
      whyThisMatters: 'Required by 85% of frontend developer vacancies.',
      skills: ['React', 'Tailwind CSS', 'State Management'],
      status: 'in_progress',
      estimatedHours: 20,
      learningResources: [],
      tasks: [{ id: 't-fe-2', title: 'Implement clean component hierarchy with zero layout shift', completed: false }]
    },
    {
      id: 'node-fe-3',
      stage: 'PROJECTS',
      stageOrder: 3,
      title: '03 — Performance, Animations & Dashboards',
      description: 'Build fast, responsive dashboard interfaces with smooth micro-interactions.',
      whyThisMatters: 'Demonstrates design sense and production polish.',
      skills: ['Performance', 'Motion'],
      status: 'locked',
      estimatedHours: 24,
      learningResources: [],
      tasks: [{ id: 't-fe-3', title: 'Deploy a high-polish web application', completed: false }]
    },
    {
      id: 'node-fe-4',
      stage: 'JOB_READINESS',
      stageOrder: 4,
      title: '04 — Frontend Mock Interviews',
      description: 'Coding live UI widgets, component design, and JavaScript tricky questions.',
      whyThisMatters: 'Prepares for machine coding rounds.',
      skills: ['Live Coding', 'UI Design'],
      status: 'locked',
      estimatedHours: 12,
      learningResources: [],
      tasks: [{ id: 't-fe-4', title: 'Pass 2 live machine coding simulations', completed: false }]
    },
    {
      id: 'node-fe-5',
      stage: 'APPLICATIONS',
      stageOrder: 5,
      title: '05 — Targeted Job Applications',
      description: 'Direct applications to matched tech startups and companies.',
      whyThisMatters: 'Direct pipeline to recruiter screening.',
      skills: ['Applications'],
      status: 'locked',
      estimatedHours: 8,
      learningResources: [],
      tasks: [{ id: 't-fe-5', title: 'Apply to top matched positions', completed: false }]
    }
  ];
}

function generateLivelihoodRoadmap(
  profile: UserProfile,
  trade: string,
  skills: Record<string, { level: number }>
): RoadmapNode[] {
  const tradeName = profile.tradeOrDomain || 'Electrician & Solar Technician';
  const tradeSkillLevel = Object.values(skills)[0]?.level || 30;

  return [
    {
      id: 'node-trade-1',
      stage: 'FOUNDATION',
      stageOrder: 1,
      title: `01 — ${tradeName} बुनियादी प्रशिक्षण (Foundations)`,
      titleHi: `01 — ${tradeName} बुनियादी प्रशिक्षण`,
      description: 'सुरक्षा मानक (Safety protocols), बुनियादी उपकरण (Tools handling), और कार्यस्थल नियम।',
      whyThisMatters: 'स्थानीय वर्कशॉप और कांट्रेक्टर के लिए अनिवार्य बुनियादी योग्यता।',
      skills: [tradeName, 'Safety Standards'],
      status: tradeSkillLevel >= 50 ? 'completed' : 'in_progress',
      estimatedHours: 16,
      learningResources: [
        { title: 'Skill India Digital: प्रैक्टिकल वीडियो मॉड्यूल', type: 'video', url: 'https://skillindiadigital.gov.in', free: true },
        { title: 'सुरक्षा एवं औजार गाइडबुक (PDF)', type: 'docs', url: 'https://msde.gov.in', free: true }
      ],
      tasks: [
        { id: 't-r-1', title: 'औजारों की पहचान और सुरक्षा उपकरण (PPE) उपयोग', completed: tradeSkillLevel >= 40 },
        { id: 't-r-2', title: 'बुनियादी खराबी पहचान (Troubleshooting)', completed: tradeSkillLevel >= 50 }
      ]
    },
    {
      id: 'node-trade-2',
      stage: 'CORE_SKILLS',
      stageOrder: 2,
      title: '02 — व्यावहारिक कौशल एवं सरकारी प्रमाणन (Govt Certification)',
      titleHi: '02 — व्यावहारिक कौशल एवं सरकारी प्रमाणन',
      description: 'PMKVY / NSDC द्वारा मान्यता प्राप्त ट्रेड ट्रेनिंग और कौशल प्रमाण पत्र प्राप्त करना।',
      whyThisMatters: 'सर्टिफिकेट होने से मासिक वेतन में 25–40% की वृद्धि होती है।',
      skills: ['PMKVY Certification', 'Practical Trade'],
      status: tradeSkillLevel >= 60 ? 'completed' : 'in_progress',
      estimatedHours: 24,
      learningResources: [
        { title: 'PMKVY 4.0 नजदीकी केंद्र खोजें', type: 'article', url: 'https://pmkvyofficial.org', free: true }
      ],
      tasks: [
        { id: 't-r-3', title: 'नजदीकी स्किल इंडिया सेंटर में रजिस्ट्रेशन', completed: true },
        { id: 't-r-4', title: 'प्रैक्टिकल असेसमेंट परीक्षा उत्तीर्ण करना', completed: false }
      ]
    },
    {
      id: 'node-trade-3',
      stage: 'PROJECTS',
      stageOrder: 3,
      title: '03 — ऑन-जॉब अप्रेंटिसशिप / फील्ड अनुभव',
      titleHi: '03 — ऑन-जॉब अप्रेंटिसशिप / फील्ड अनुभव',
      description: 'स्थानीय कांट्रेक्टर या उद्यम के साथ 1 माह का हैंड्स-ऑन फील्ड कार्य।',
      whyThisMatters: 'फील्ड अनुभव से आत्मविश्वास और ग्राहकों का भरोसा बनता है।',
      skills: ['Field Work', 'Customer Service'],
      status: 'locked',
      estimatedHours: 40,
      learningResources: [],
      tasks: [
        { id: 't-r-5', title: '5 वास्तविक फील्ड कार्यों का सफलतापूर्वक निष्पादन', completed: false }
      ]
    },
    {
      id: 'node-trade-4',
      stage: 'JOB_READINESS',
      stageOrder: 4,
      title: '04 — स्वरोजगार टूलकिट एवं सरकारी मुद्रा लोन (Self-Employment & Finance)',
      titleHi: '04 — स्वरोजगार टूलकिट एवं सरकारी मुद्रा लोन',
      description: 'PM विश्वकर्मा योजना टूलकिट सहायता (₹15,000) या PM मुद्रा लोन के लिए आवेदन।',
      whyThisMatters: 'अपना खुद का काम या दुकान शुरू करने के लिए आर्थिक सहायता।',
      skills: ['Mudra Loan', 'Tool Kit', 'Business Basics'],
      status: 'locked',
      estimatedHours: 8,
      learningResources: [
        { title: 'PM विश्वकर्मा पोर्टल रजिस्ट्रेशन गाइड', type: 'article', url: 'https://pmvishwakarma.gov.in', free: true }
      ],
      tasks: [
        { id: 't-r-6', title: 'आवश्यक दस्तावेज (आधार, बैंक खाता) तैयार करना', completed: false },
        { id: 't-r-7', title: 'नजदीकी CSC केंद्र से लोन/टूलकिट अप्लाई करना', completed: false }
      ]
    },
    {
      id: 'node-trade-5',
      stage: 'APPLICATIONS',
      stageOrder: 5,
      title: '05 — स्थानीय काम और रोजगार अनुबंध (Local Job Matching)',
      titleHi: '05 — स्थानीय काम और रोजगार अनुबंध',
      description: 'जिले में सत्यापित कंपनियों, सर्विस सेंटरों और कांट्रेक्टरों से जुड़ें।',
      whyThisMatters: 'नियमित मासिक आय और काम की गारंटी।',
      skills: ['Local Employment'],
      status: 'locked',
      estimatedHours: 6,
      learningResources: [],
      tasks: [
        { id: 't-r-8', title: 'नजदीकी 3 काम के अवसरों पर आवेदन / संपर्क करना', completed: false }
      ]
    }
  ];
}

/**
 * Recalculates roadmap state and generates the exact Before/After diff breakdown
 * triggered by a simulated or genuine skill update.
 */
export function calculateRoadmapDiff(
  previousRoadmap: RoadmapNode[],
  updatedRoadmap: RoadmapNode[]
): RoadmapDiff {
  let completedCount = 0;
  let acceleratedCount = 0;
  const newFocusAreas: string[] = [];
  const details: string[] = [];

  for (let i = 0; i < updatedRoadmap.length; i++) {
    const prev = previousRoadmap[i];
    const curr = updatedRoadmap[i];

    if (prev && curr) {
      if (prev.status !== 'completed' && curr.status === 'completed') {
        completedCount++;
        details.push(`Milestone "${curr.title.split('—')[1]?.trim() || curr.title}" is now marked COMPLETED`);
      } else if (prev.status === 'locked' && (curr.status === 'in_progress' || curr.status === 'accelerated')) {
        acceleratedCount++;
        details.push(`Milestone "${curr.title.split('—')[1]?.trim() || curr.title}" UNLOCKED & ACCELERATED`);
      }
    }
  }

  // Find next active milestone
  const prevNextNode = previousRoadmap.find((n) => n.status === 'in_progress');
  const currNextNode = updatedRoadmap.find((n) => n.status === 'in_progress');

  if (currNextNode) {
    newFocusAreas.push(...currNextNode.skills);
  }

  return {
    milestonesCompleted: completedCount,
    milestonesAccelerated: acceleratedCount,
    newFocusAreas: Array.from(new Set(newFocusAreas)),
    previouslyNext: prevNextNode?.title || 'Python Foundations',
    nowNext: currNextNode?.title || 'REST APIs & Database Architecture',
    details,
  };
}
