/**
 * Interview API — Questions, 6-Dimension Evaluator, HR Question Generator, and Multi-Score Reporter
 *
 * Evaluates:
 *   1. Technical accuracy
 *   2. Communication
 *   3. Problem solving
 *   4. Confidence
 *   5. Clarity
 *   6. Relevance
 *
 * Generates at end:
 *   - Interview Score
 *   - Technical Score
 *   - Communication Score
 *   - Confidence Score
 *   - HR Score
 *   - Problem Solving Score
 *   - Stars for encouragement (1–5)
 */

// ─── Question Catalog ─────────────────────────────────────────
export const QUESTION_BANK = {
  'Frontend Engineer': {
    technical: [
      {
        id: 'fe-q1',
        question: 'How does React\'s Virtual DOM work, and how does React 18\'s concurrent rendering improve perceived performance?',
        category: 'Framework Architecture',
        sampleKeyPoints: ['Diffing algorithm & Fiber reconciliation', 'Batching updates automatically', 'Transitions with useTransition / useDeferredValue', 'Non-blocking render interruptions'],
      },
      {
        id: 'fe-q2',
        question: 'Explain the difference between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR). When would you use each?',
        category: 'Rendering & Web Vitals',
        sampleKeyPoints: ['TTFB vs FCP vs LCP trade-offs', 'SEO requirements and dynamic user-specific data', 'Incremental Static Regeneration (ISR)', 'Hydration costs'],
      },
      {
        id: 'fe-q3',
        question: 'How do you prevent unnecessary re-renders in a large-scale React application? Describe your profiling workflow.',
        category: 'Performance Optimization',
        sampleKeyPoints: ['React DevTools Profiler', 'useMemo and useCallback with dependency arrays', 'State collocation and component decomposition', 'Context splitting to prevent cascading renders'],
      },
      {
        id: 'fe-q4',
        question: 'How would you architect a reusable, accessible design system component (such as a Modal or Autocomplete) from scratch?',
        category: 'UI & Accessibility',
        sampleKeyPoints: ['WAI-ARIA roles, aria-expanded, aria-controls', 'Keyboard navigation (Esc, Tab trapping)', 'Z-index and portal rendering', 'Headless vs styled component patterns'],
      },
      {
        id: 'fe-q5',
        question: 'Describe how browsers handle the Critical Rendering Path. How would you optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?',
        category: 'Browser Internals',
        sampleKeyPoints: ['DOM + CSSOM construction, Render tree, Layout, Paint', 'Preloading hero fonts/images with fetchpriority="high"', 'Explicit width/height on media to prevent layout shift', 'Code splitting and deferring non-critical scripts'],
      },
    ],
  },
  'Backend Engineer': {
    technical: [
      {
        id: 'be-q1',
        question: 'How do you design a high-throughput REST or gRPC API that can handle sudden 10x traffic spikes without crashing?',
        category: 'System Design',
        sampleKeyPoints: ['Horizontal scaling behind load balancers', 'Rate limiting & token bucket algorithms', 'Redis caching and read replicas', 'Asynchronous processing with message queues (Kafka/RabbitMQ)'],
      },
      {
        id: 'be-q2',
        question: 'Explain database indexing. How do B-Trees work, and when can an index actually degrade query performance?',
        category: 'Database Internals',
        sampleKeyPoints: ['B-Tree lookup time complexity O(log N)', 'Composite indexes and leftmost prefix rule', 'Write amplification on INSERT/UPDATE/DELETE', 'Index cardinality and table scan thresholds'],
      },
      {
        id: 'be-q3',
        question: 'How do you maintain data consistency across microservices without relying on distributed 2-Phase Commit (2PC)?',
        category: 'Distributed Systems',
        sampleKeyPoints: ['Saga pattern (orchestration vs choreography)', 'Idempotent consumers and unique transaction IDs', 'Outbox pattern for reliable event publishing', 'Eventual consistency and compensatory transactions'],
      },
      {
        id: 'be-q4',
        question: 'How do you secure an API against OWASP Top 10 vulnerabilities like SQL Injection, Broken Object-Level Authorization (BOLA), and SSRF?',
        category: 'API Security',
        sampleKeyPoints: ['Parameterized queries & ORM sanitation', 'Role-Based Access Control (RBAC) checked at entity level', 'Strict egress firewalls & URL whitelisting for SSRF', 'JWT expiration, refresh tokens, and rate limits'],
      },
      {
        id: 'be-q5',
        question: 'Describe how you troubleshoot a memory leak or CPU spike in a production Node.js or Python service.',
        category: 'Observability & Debugging',
        sampleKeyPoints: ['Heap dump analysis with Chrome DevTools or pprof', 'Event loop delay metrics & profiling', 'APM tracing (Datadog/New Relic) and correlation IDs', 'Graceful pod restarts and canary rollbacks'],
      },
    ],
  },
  'Full Stack Developer': {
    technical: [
      {
        id: 'fs-q1',
        question: 'Walk me through the complete lifecycle of a user clicking "Place Order" on an e-commerce platform—from frontend state to database commit.',
        category: 'End-to-End Architecture',
        sampleKeyPoints: ['Optimistic UI update & client-side validation', 'HTTPS TLS handshake & JWT authentication', 'Backend transaction isolation level', 'Inventory reservation via Redis or DB lock', 'Async order confirmation webhook'],
      },
      {
        id: 'fs-q2',
        question: 'How do you structure state management in a fullstack application between client state, server state (React Query), and URL state?',
        category: 'State Architecture',
        sampleKeyPoints: ['Single source of truth separation', 'Server caching, invalidation & polling via React Query/SWR', 'Zustand or Redux for purely local UI state', 'URL search params for shareable/bookmarkable filters'],
      },
      {
        id: 'fs-q3',
        question: 'When designing a database schema, how do you decide between a relational database (PostgreSQL) and a NoSQL document store (MongoDB)?',
        category: 'Data Modeling',
        sampleKeyPoints: ['ACID guarantees vs flexible schema evolution', 'Relational joins & foreign keys vs embedded documents', 'Read/write ratio and horizontal sharding requirements', 'Hybrid architectures (PostgreSQL JSONB)'],
      },
      {
        id: 'fs-q4',
        question: 'Describe an end-to-end CI/CD pipeline you would set up for a fullstack app with zero-downtime deployment.',
        category: 'DevOps & Tooling',
        sampleKeyPoints: ['GitHub Actions linting, unit tests, E2E tests', 'Docker multi-stage builds', 'Blue-Green or Rolling deployments on Kubernetes/Cloud Run', 'Database migration rollback strategies'],
      },
      {
        id: 'fs-q5',
        question: 'How do you handle authentication securely across a single-page app and a REST API backend?',
        category: 'Security Architecture',
        sampleKeyPoints: ['HttpOnly, Secure, SameSite cookies to mitigate XSS', 'Access token short TTL + refresh token rotation', 'CSRF tokens or SameSite strict cookies', 'OAuth2 / OpenID Connect flows'],
      },
    ],
  },
}

// ─── HR & Behavioral Question Bank ────────────────────────────
export const HR_QUESTIONS = [
  {
    id: 'hr-1',
    category: 'intro',
    categoryLabel: 'Self Introduction & Story',
    question: 'Tell me about yourself and walk me through the key milestones of your engineering journey.',
    whatHrLooksFor: 'Clear professional narrative, passion for engineering, concise summary of skills, and why you are interested in this specific career stage.',
    pitfalls: 'Reciting your entire resume chronologically or talking for more than 2–3 minutes without focusing on impact.',
    starGuide: {
      situation: 'Present: What is your current role and core expertise?',
      task: 'Past: What formative projects or technical problems shaped your abilities?',
      action: 'Differentiator: What makes you unique as a software engineer?',
      result: 'Future: Why does this company/role match your immediate ambitions?',
    },
    sampleAnswer: 'I am a Full Stack Developer with over 4 years of experience crafting high-throughput web applications. In my current role at TechCorp, I led the re-architecture of our payment pipeline, which handled 2M daily requests and improved checkout completion by 18%. Prior to that, I built scalable analytics dashboards and microservices. What excites me most about this position is your team’s focus on distributed systems, where I can apply my experience in React, Go, and cloud scalability.',
  },
  {
    id: 'hr-2',
    category: 'conflict',
    categoryLabel: 'Conflict & Collaboration',
    question: 'Tell me about a time you had a strong technical disagreement with a teammate or tech lead. How did you resolve it?',
    whatHrLooksFor: 'Emotional intelligence, ability to disagree and commit, reliance on data/benchmarks over ego, and preserving healthy team relationships.',
    pitfalls: 'Saying you never have disagreements, or blaming the other engineer without showing how you found common ground.',
    starGuide: {
      situation: 'Describe the technical fork (e.g. choice of database, library, or architectural pattern).',
      task: 'What was your stake, and what were the conflicting priorities between both sides?',
      action: 'How did you depersonalize the debate (e.g. PoC benchmark, team RFC, pros/cons matrix)?',
      result: 'What was the outcome, and how did the project benefit from the constructive debate?',
    },
    sampleAnswer: 'During a redesign of our user authentication service, my tech lead favored sticking with a session-based cookie model on Redis, while I proposed adopting stateless JWTs with refresh token rotation to support our upcoming mobile app. Rather than arguing back and forth, I built a quick prototype demonstrating latency and mobile token handoff for both approaches, documenting the trade-offs in an RFC. When the benchmarks showed JWT rotation gave us mobile compatibility with minimal overhead, the lead agreed. We delivered on time with zero auth regressions.',
  },
  {
    id: 'hr-3',
    category: 'leadership',
    categoryLabel: 'Ownership & Initiative',
    question: 'Describe a project where you took ownership outside your official job description to solve an urgent problem.',
    whatHrLooksFor: 'Proactivity, customer focus, ability to unblock others, and drive without waiting for top-down instructions.',
    pitfalls: 'Describing a routine assigned task or ignoring the contributions of collaborators.',
    starGuide: {
      situation: 'Identify an overlooked bottleneck, recurring bug, or process drag.',
      task: 'Why did nobody else tackle it, and why did you decide to step up?',
      action: 'What steps did you take to research, build, and roll out the fix?',
      result: 'How did it save engineering hours or improve user reliability?',
    },
    sampleAnswer: 'Our customer support team was spending over 15 hours every week manually querying database logs to diagnose failed transactions for users. Even though this was outside my roadmap tasks, I realized it was slowing down product delivery and frustrating customers. Over two sprints, I built an internal self-service diagnostic tool in our admin portal with role-based access. It reduced support escalations by 75% and freed up engineering time for new feature development.',
  },
  {
    id: 'hr-4',
    category: 'pressure',
    categoryLabel: 'Pressure & Deadlines',
    question: 'How do you handle high-pressure situations when a critical production outage happens or a tight deadline is looming?',
    whatHrLooksFor: 'Composure under stress, clear communication with stakeholders, triage mindset, and conducting blameless post-mortems.',
    pitfalls: 'Panicking, pointing fingers, or cutting corners on quality and testing.',
    starGuide: {
      situation: 'Describe a high-stakes incident (e.g. outage during peak sales or broken deployment).',
      task: 'What was at risk, and who needed immediate communication?',
      action: 'How did you stay methodical (rollback first, isolate root cause, coordinate with team)?',
      result: 'How quickly was it restored, and what preventative guardrails did you put in place?',
    },
    sampleAnswer: 'On Black Friday, our API began throwing 500 errors for 8% of incoming requests due to an unindexed query bottleneck under sudden traffic. I opened an incident channel immediately, alerted the customer operations team with an ETA, and executed a safe rollback to our previous stable release while monitoring error rates. Once stabilized, we isolated the missing composite index, tested it on staging, and deployed the patch within 40 minutes. Afterwards, I led a blameless post-mortem and added automated query plan alerts to our CI pipeline.',
  },
  {
    id: 'hr-5',
    category: 'negotiation',
    categoryLabel: 'Career & Expectations',
    question: 'Where do you see yourself in 2 to 3 years, and what are your expectations for career growth?',
    whatHrLooksFor: 'Realistic ambition, commitment to skill mastery, interest in mentorship, and alignment with company trajectory.',
    pitfalls: 'Saying "I want your job" or having no clear technical goals.',
    starGuide: {
      situation: 'Current foundation: What skills have you solidified?',
      task: 'Growth areas: What complex domains do you want to master next?',
      action: 'Contribution: How do you plan to give back to the team (mentorship, architecture)?',
      result: 'Impact: Becoming a trusted go-to technical lead in your domain.',
    },
    sampleAnswer: 'Over the next 2 to 3 years, my goal is to evolve from an experienced individual contributor into a Staff/Lead Engineer who shapes technical architecture and mentors rising talent. I want to deepen my expertise in distributed data systems and cloud observability. I am eager to join a company where I can take end-to-end ownership of core systems and help establish robust engineering practices as the team scales.',
  },
]

// ─── Question Generator for Mock Interview ────────────────────
export function getQuestionsForRole(role = 'Full Stack Developer', roundType = 'mixed', count = 5) {
  const roleBank = QUESTION_BANK[role] || QUESTION_BANK['Full Stack Developer']
  const techQuestions = roleBank.technical || []

  if (roundType === 'technical') {
    return techQuestions.slice(0, count)
  }

  if (roundType === 'hr') {
    return HR_QUESTIONS.slice(0, count).map((hr) => ({
      id: hr.id,
      question: hr.question,
      category: hr.categoryLabel,
      role,
      sampleKeyPoints: [hr.whatHrLooksFor, hr.starGuide.situation, hr.starGuide.action, hr.starGuide.result],
    }))
  }

  // Mixed: 3 technical + 2 behavioral
  const techPart = techQuestions.slice(0, Math.min(3, count - 1))
  const hrPart = HR_QUESTIONS.slice(0, count - techPart.length).map((hr) => ({
    id: hr.id,
    question: hr.question,
    category: hr.categoryLabel,
    role,
    sampleKeyPoints: [hr.whatHrLooksFor, hr.starGuide.situation, hr.starGuide.action, hr.starGuide.result],
  }))

  return [...techPart, ...hrPart]
}

// ─── 6-Dimension Answer Evaluator ─────────────────────────────
export async function evaluateAnswer(questionObj, userAnswer, role) {
  await new Promise((r) => setTimeout(r, 800))

  const cleanAnswer = (userAnswer || '').trim()
  const words = cleanAnswer.split(/\s+/).filter(Boolean).length
  const lower = cleanAnswer.toLowerCase()

  // Baseline scoring based on answer depth, terminology, and structure
  let technicalAccuracy = 60
  let communication = 65
  let problemSolving = 60
  let confidence = 65
  let clarity = 65
  let relevance = 70

  if (words < 15) {
    // Too short / terse
    technicalAccuracy = 45
    communication = 50
    problemSolving = 45
    confidence = 50
    clarity = 55
    relevance = 55
  } else if (words >= 50 && words <= 250) {
    // Good sweet spot
    communication += 15
    clarity += 15
    confidence += 12
    problemSolving += 15
    technicalAccuracy += 15
  } else if (words > 250) {
    // Very thorough
    technicalAccuracy += 20
    problemSolving += 20
    communication += 10
    clarity += 8
    confidence += 15
  }

  // Check key terms alignment from question
  const keyPoints = questionObj.sampleKeyPoints || []
  let matches = 0
  keyPoints.forEach((kp) => {
    const tokens = kp.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    if (tokens.some((t) => lower.includes(t))) {
      matches++
    }
  })

  if (matches > 0) {
    technicalAccuracy += matches * 6
    relevance += matches * 7
    problemSolving += matches * 5
  }

  // Check structural markers (e.g. "first", "trade-off", "because", "for example", metrics)
  if (/first|second|initially|finally|step/i.test(cleanAnswer)) clarity += 8
  if (/trade-off|latency|scale|bottleneck|versus/i.test(cleanAnswer)) problemSolving += 8
  if (/\d+%|\d+x|\d+ms|seconds/i.test(cleanAnswer)) confidence += 8
  if (/situation|task|action|result|in my experience/i.test(cleanAnswer)) communication += 8

  // Clamp 0-100
  technicalAccuracy = Math.min(98, Math.max(35, technicalAccuracy))
  communication = Math.min(98, Math.max(40, communication))
  problemSolving = Math.min(98, Math.max(35, problemSolving))
  confidence = Math.min(98, Math.max(40, confidence))
  clarity = Math.min(98, Math.max(40, clarity))
  relevance = Math.min(98, Math.max(40, relevance))

  // Feedback points
  const strengths = []
  const improvements = []

  if (technicalAccuracy >= 75) {
    strengths.push('Demonstrated strong command of core engineering principles.')
  } else {
    improvements.push('Incorporate deeper technical specifics (e.g., protocols, memory behavior, or time complexity).')
  }

  if (communication >= 75 && clarity >= 75) {
    strengths.push('Answer was well-structured with a clear logical progression.')
  } else {
    improvements.push('Use the STAR framework (Situation, Task, Action, Result) or numbered steps for crisper delivery.')
  }

  if (confidence >= 80) {
    strengths.push('Convincing tone with authoritative real-world grounding.')
  } else {
    improvements.push('Include concrete metrics or personal project outcomes to back up claims.')
  }

  return {
    scores: {
      technicalAccuracy,
      communication,
      problemSolving,
      confidence,
      clarity,
      relevance,
    },
    strengths,
    improvements,
    feedback: `Good response (${words} words). ${strengths[0] || 'Clear delivery.'} ${improvements[0] || 'Keep answers quantified.'}`,
  }
}

// ─── Final Multi-Score Report Calculator ──────────────────────
export function calculateFinalReport(session) {
  const answers = session.answers || []
  if (answers.length === 0) {
    return {
      interviewScore: 70,
      technicalScore: 70,
      communicationScore: 70,
      confidenceScore: 70,
      hrScore: 70,
      problemSolvingScore: 70,
      stars: 3,
      encouragement: 'Keep practicing to unlock your full potential!',
      summary: 'Session completed.',
    }
  }

  // Calculate averages across answers
  const avg = (key) =>
    Math.round(answers.reduce((acc, a) => acc + (a.evaluated?.scores?.[key] || 70), 0) / answers.length)

  const technicalScore = avg('technicalAccuracy')
  const communicationScore = avg('communication')
  const problemSolvingScore = avg('problemSolving')
  const confidenceScore = avg('confidence')
  const clarityScore = avg('clarity')
  const relevanceScore = avg('relevance')

  // HR score is composite of communication, confidence, and relevance
  const hrScore = Math.round((communicationScore + confidenceScore + relevanceScore) / 3)

  // Overall Interview Composite Score
  const interviewScore = Math.round(
    technicalScore * 0.30 +
    problemSolvingScore * 0.25 +
    communicationScore * 0.20 +
    confidenceScore * 0.15 +
    hrScore * 0.10
  )

  // Stars calculation (1 to 5 stars)
  let stars = 3
  let encouragement = 'Good effort! Continue refining your answers with metrics and concise structure.'

  if (interviewScore >= 90) {
    stars = 5
    encouragement = '🌟 Outstanding Performance! You displayed senior-level depth, clear communication, and exceptional problem solving. Ready for top-tier tech interviews!'
  } else if (interviewScore >= 80) {
    stars = 4
    encouragement = '⭐ Great Job! Your answers were technically robust and convincing. A few refinements on architectural trade-offs will push you into the top tier.'
  } else if (interviewScore >= 70) {
    stars = 3
    encouragement = '👍 Solid Foundation! You understand the key concepts. Focus on adding quantifiable results and practicing the STAR method.'
  } else if (interviewScore >= 60) {
    stars = 2
    encouragement = '💪 Developing Well! Review core technical mechanisms and give more detailed explanations with real-world examples.'
  } else {
    stars = 1
    encouragement = '🌱 Keep Going! Use the interview preparation modules and HR question trainer to build your confidence and technical vocabulary.'
  }

  return {
    interviewScore,
    technicalScore,
    communicationScore,
    confidenceScore,
    hrScore,
    problemSolvingScore,
    clarityScore,
    relevanceScore,
    stars,
    starsString: '⭐'.repeat(stars),
    encouragement,
    summary: `Completed ${answers.length} interview questions for ${session.role}. Overall score: ${interviewScore}/100 with a ${technicalScore}% technical rating.`,
    timeTaken: `${Math.max(1, Math.round((Date.now() - (session.startTime || Date.now())) / 60000))}m 24s`,
  }
}
