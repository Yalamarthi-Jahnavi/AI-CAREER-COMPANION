/**
 * Dashboard API Service
 * Encapsulates all dashboard data fetching, real-time metrics, and cross-feature career aggregation.
 */

const MOCK_DASHBOARD_DATA = {
  // ─── 1. Career Health (6 Core Pillars) ───────────────────────
  careerHealth: {
    overallScore: 84,
    healthStatus: 'Excellent — Tier 1 Candidate',
    pillars: [
      {
        id: 'technical',
        title: 'Technical Skills',
        score: 90,
        total: 100,
        stars: '⭐⭐⭐⭐⭐',
        change: '+6% this week',
        status: 'Strong',
        color: '#6366f1',
        icon: 'Code2',
        path: '/app/current-technology-practice',
        description: 'High proficiency across React, Python, and SQL with consistent test streaks.',
      },
      {
        id: 'interview',
        title: 'Interview',
        score: 82,
        total: 100,
        stars: '⭐⭐⭐⭐',
        change: '+8 from last mock',
        status: 'Proficient',
        color: '#a855f7',
        icon: 'MicVocal',
        path: '/app/mock-interview',
        description: 'System design and STAR behavioral responses evaluated with strong technical depth.',
      },
      {
        id: 'resume',
        title: 'Resume',
        score: 88,
        total: 100,
        stars: '⭐⭐⭐⭐',
        change: '+12 with ATS v2',
        status: 'ATS Optimized',
        color: '#ec4899',
        icon: 'FileText',
        path: '/app/resume-analyzer',
        description: 'Quantified impact bullets aligned with Senior Full Stack & Cloud job descriptions.',
      },
      {
        id: 'learning',
        title: 'Learning',
        score: 85,
        total: 100,
        stars: '⭐⭐⭐⭐',
        change: '14-Day Streak 🔥',
        status: 'On Track',
        color: '#10b981',
        icon: 'BookOpen',
        path: '/app/learning-planner',
        description: 'Completed 9 of 12 modules in React 19 & Next.js Fullstack roadmap.',
      },
      {
        id: 'projects',
        title: 'Projects',
        score: 85,
        total: 100,
        stars: '⭐⭐⭐⭐',
        change: '85% Complete',
        status: 'Near Launch',
        color: '#06b6d4',
        icon: 'FolderKanban',
        path: '/app/project-assistant',
        description: 'DevCollab Real-time Workspace & Distributed Event Streaming blueprint active.',
      },
      {
        id: 'jobSwitch',
        title: 'Job Switch',
        score: 80,
        total: 100,
        stars: '⭐⭐⭐⭐',
        change: 'Low Risk',
        status: 'Transition Ready',
        color: '#f59e0b',
        icon: 'Briefcase',
        path: '/app/job-switch-readiness',
        description: 'Transition safety verified across notice period, emergency runway, and offer terms.',
      },
    ],
  },

  // ─── 2. Current Technology Practice ──────────────────────────
  practiceTechnologies: [
    {
      id: 'react',
      name: 'React',
      category: 'Frontend',
      score: 92,
      total: 100,
      scoreDisplay: '92/100',
      stars: '⭐⭐⭐⭐⭐',
      starCount: 5,
      proficiency: 92,
      level: 'Expert',
      questionsSolved: 210,
      streak: '12 days',
      accentColor: '#38bdf8',
      recentTopic: 'React 19 Server Actions, Hooks & Profiler Optimization',
      status: 'Active Mastery',
    },
    {
      id: 'python',
      name: 'Python',
      category: 'Backend / Data',
      score: 84,
      total: 100,
      scoreDisplay: '84/100',
      stars: '⭐⭐⭐⭐',
      starCount: 4,
      proficiency: 84,
      level: 'Advanced',
      questionsSolved: 142,
      streak: '6 days',
      accentColor: '#60a5fa',
      recentTopic: 'AsyncIO Event Loops, Generators & FastAPI',
      status: 'Advanced',
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'Cloud & DevOps',
      score: 76,
      total: 100,
      scoreDisplay: '76/100',
      stars: '⭐⭐⭐',
      starCount: 3,
      proficiency: 76,
      level: 'Intermediate',
      questionsSolved: 95,
      streak: '5 days',
      accentColor: '#fbbf24',
      recentTopic: 'ECS Fargate, IAM Roles & CloudFront Caching',
      status: 'Target Growth',
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Containers / Infra',
      score: 80,
      total: 100,
      scoreDisplay: '80/100',
      stars: '⭐⭐⭐⭐',
      starCount: 4,
      proficiency: 80,
      level: 'Advanced',
      questionsSolved: 88,
      streak: '4 days',
      accentColor: '#0ea5e9',
      recentTopic: 'Multi-stage builds, Cache Mounts & Compose',
      status: 'Solid',
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Database Architecture',
      score: 82,
      total: 100,
      scoreDisplay: '82/100',
      stars: '⭐⭐⭐⭐',
      starCount: 4,
      proficiency: 82,
      level: 'Advanced',
      questionsSolved: 165,
      streak: '8 days',
      accentColor: '#a855f7',
      recentTopic: 'Window Functions, CTEs & B-Tree Index Optimization',
      status: 'Solid',
    },
  ],

  // ─── 3. Learning (Today's Learning Task) ────────────────────
  learningToday: {
    currentTechnology: 'React 19 & Next.js Fullstack',
    currentLevel: 'Advanced (Level 4 of 5)',
    completedPercentage: 74,
    totalModules: 12,
    completedModules: 9,
    streakDays: 14,
    todayTask: {
      title: 'Complete React Hooks & Lifecycle Deep-Dive',
      module: 'Module 9: Server Actions, Cache API & Streaming SSR',
      estimatedTime: '45 mins',
      focusArea: 'Custom Hooks Extraction & WebSocket Cleanups',
      path: '/app/learning-planner',
    },
  },

  // ─── 4. Project (Current Project Progress) ───────────────────
  projectToday: {
    title: 'DevCollab — Real-time Distributed Code Workspace',
    techStack: ['React', 'TypeScript', 'Node.js', 'Redis', 'Docker'],
    progressPercentage: 85,
    currentPhase: 'Phase 3: WebSocket Scaling & Concurrency Testing',
    nextMilestone: 'Deploy Staging Cluster & Performance Profiling',
    status: 'On Track for Friday Release',
    path: '/app/project-assistant',
  },

  // ─── 5. Upcoming Deadlines ───────────────────────────────────
  upcomingDeadlines: [
    {
      id: 'dl-1',
      category: 'Project',
      title: 'Distributed Event Streaming Service (Kafka)',
      dueDate: 'Tomorrow, 5:00 PM',
      priority: 'high',
      completed: false,
      tag: 'Portfolio Project',
      progress: 85,
    },
    {
      id: 'dl-2',
      category: 'Learning',
      title: 'Complete AWS Certified Solutions Architect Module 4',
      dueDate: 'In 2 days (Sep 10)',
      priority: 'medium',
      completed: false,
      tag: 'Cloud Mastery',
      progress: 60,
    },
    {
      id: 'dl-3',
      category: 'Interview',
      title: 'Mock Technical System Design Interview (Round 2)',
      dueDate: 'In 3 days (Sep 11, 2:00 PM)',
      priority: 'high',
      completed: false,
      tag: 'AI Simulation',
      progress: 40,
    },
    {
      id: 'dl-4',
      category: 'Practice',
      title: 'Timed Diagnostic: Graph Traversal & Dijkstra in Python',
      dueDate: 'In 4 days (Sep 12)',
      priority: 'medium',
      completed: false,
      tag: 'Coding Assessment',
      progress: 25,
    },
  ],

  // ─── 6. Interview (Next Recommended Practice) ───────────────
  interviewNext: {
    recommendedRole: 'Senior Full Stack Engineer',
    topic: 'System Design: Distributed Caching & Rate Limiting',
    format: 'STAR Behavioral + Technical Architecture Round',
    lastScore: 82,
    weakArea: 'Quantitative impact metrics in past project explanations',
    path: '/app/mock-interview',
    duration: '20 mins',
  },

  // ─── 7. Job Switch Readiness ─────────────────────────────────
  jobSwitchReadiness: {
    readinessScore: 80,
    safetyLevel: 'LOW',
    safetyLabel: 'Low Transition Risk — High Market Demand',
    marketTiming: 'Favorable (Q3/Q4 Senior Tech Hiring Wave)',
    emergencyRunway: '6 Months Liquid Reserves',
    activePipelines: '3 Active Discussions (2 Screenings Passed)',
    path: '/app/job-switch-readiness',
  },

  // ─── 8. Offer (Latest Offer Analysis) ────────────────────────
  latestOffer: {
    hasOffer: true,
    companyName: 'Acme Corp Technologies',
    jobTitle: 'Senior Software Engineer',
    salary: '$140,000 / year (Fixed) + $15,000 Bonus',
    joiningDate: 'October 15, 2026',
    safetyLevel: 'LOW',
    safetyScore: 86,
    safetyStatus: 'Low Risk — Standard Tech Terms',
    keyClarification: 'Verify non-compete clause geographic restrictions with HR',
    path: '/app/offer-letter-analyzer',
  },

  // ─── 9. Single Personalized Action Plan (Today's Priorities) ─
  todaysPriorities: [
    {
      id: 'p-1',
      number: 1,
      title: 'Complete React Hooks lesson',
      detail: 'Module 9: Cleanups, stale closure prevention & batch updates',
      category: 'Learning',
      status: 'pending', // completed | pending
      path: '/app/learning-planner',
      badge: '45m',
    },
    {
      id: 'p-2',
      number: 2,
      title: 'Finish API module',
      detail: 'Implement abortable fetch & optimistic UI mutations in DevCollab',
      category: 'Project',
      status: 'pending',
      path: '/app/project-assistant',
      badge: '30m',
    },
    {
      id: 'p-3',
      number: 3,
      title: 'Take React practice test',
      detail: 'Timed 10-question intermediate assessment to surpass 92% score',
      category: 'Practice',
      status: 'pending',
      path: '/app/current-technology-practice',
      badge: '15m',
    },
    {
      id: 'p-4',
      number: 4,
      title: 'Review weak topics',
      detail: 'Inspect missed questions from last test: Hooks Dependencies & Closures',
      category: 'Assessment',
      status: 'pending',
      path: '/app/history',
      badge: '20m',
    },
    {
      id: 'p-5',
      number: 5,
      title: 'Prepare 5 HR questions',
      detail: 'Master variable pay evaluation & notice period buyout negotiation',
      category: 'Interview',
      status: 'pending',
      path: '/app/hr-questions',
      badge: '15m',
    },
  ],
}

/**
 * Fetch complete dashboard data summary
 */
export async function fetchDashboardData() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return JSON.parse(JSON.stringify(MOCK_DASHBOARD_DATA))
}

/**
 * Update deadline status
 */
export async function updateDeadlineStatus(deadlineId, completed) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return { id: deadlineId, completed }
}

/**
 * Update priority item completion status
 */
export async function updatePriorityItemStatus(priorityId, completed) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return { id: priorityId, completed }
}
