import { create } from 'zustand'

const DEFAULT_INTAKE = {
  idea: '',
  technology: 'React, Node.js, Express, MongoDB, TailwindCSS',
  skillLevel: 'Intermediate',
  deadline: '2026-10-15',
  availableHours: 4,
  teamType: 'Individual', // 'Individual' | 'Team'
}

// Generator helper function to build comprehensive project spec & timetable
function generateProjectSpec(intake) {
  const { idea, technology, skillLevel, deadline, availableHours, teamType } = intake

  // Calculate target days
  const today = new Date()
  const targetDate = deadline ? new Date(deadline) : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const diffTime = Math.max(1, targetDate.getTime() - today.getTime())
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7))
  const totalCapacityHours = totalDays * Number(availableHours) * (teamType === 'Team' ? 2.5 : 1)

  const projectName = idea
    ? idea.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Platform'
    : 'Custom Full-Stack System'

  const techList = technology.split(',').map(t => t.trim()).filter(Boolean)
  const mainFrontend = techList.find(t => /react|vue|angular|next|svelte|html/i.test(t)) || 'React & TailwindCSS'
  const mainBackend = techList.find(t => /node|express|python|django|fastapi|java|spring|nest|go/i.test(t)) || 'Node.js & Express'
  const mainDb = techList.find(t => /mongo|postgres|sql|firebase|prisma|supabase|redis/i.test(t)) || 'PostgreSQL & Prisma ORM'

  // Generate realistic timetable phases
  const weeks = []
  const phaseDistribution = [
    { phase: 'Phase 1: Requirements & Architecture', weight: 0.15, icon: 'Layout' },
    { phase: 'Phase 2: Database Schema & Core API Backend', weight: 0.25, icon: 'Database' },
    { phase: 'Phase 3: Frontend UI Components & State Management', weight: 0.30, icon: 'Code' },
    { phase: 'Phase 4: AI Feature Integration & Third-party APIs', weight: 0.15, icon: 'Sparkles' },
    { phase: 'Phase 5: Testing, Optimization & Deployment', weight: 0.15, icon: 'Rocket' },
  ]

  let currentWeekNumber = 1
  for (let pIdx = 0; pIdx < phaseDistribution.length; pIdx++) {
    const p = phaseDistribution[pIdx]
    const phaseWeeksCount = Math.max(1, Math.round(p.weight * totalWeeks))
    for (let w = 0; w < phaseWeeksCount && currentWeekNumber <= totalWeeks; w++) {
      weeks.push({
        weekNumber: currentWeekNumber,
        phase: p.phase,
        title: `Week ${currentWeekNumber}: ${p.phase.split(':')[1].trim()} Part ${w + 1}`,
        estimatedHours: Math.round((totalCapacityHours / totalWeeks)),
        tasks: [
          `Setup development milestones for ${p.phase.split(':')[1].trim()}`,
          `Implement key modules using ${mainFrontend} and ${mainBackend}`,
          `Conduct code review & test cases matching ${skillLevel} standards`,
          `Validate progress against target deadline (${totalDays} days left)`
        ]
      })
      currentWeekNumber++
    }
  }

  // Fallback to ensure all weeks covered if rounding missed some
  while (weeks.length < totalWeeks) {
    weeks.push({
      weekNumber: weeks.length + 1,
      phase: 'Phase 5: Testing, Optimization & Deployment',
      title: `Week ${weeks.length + 1}: Final Refinements & User Feedback`,
      estimatedHours: Math.round(totalCapacityHours / totalWeeks),
      tasks: ['Security hardening', 'End-to-end integration testing', 'Final deployment checklist', 'Production launch preparation']
    })
  }

  return {
    overview: {
      projectName,
      ideaSummary: idea || 'Full-Stack Modern AI Web Application',
      totalDays,
      totalWeeks,
      totalHours: totalCapacityHours,
      availableHoursPerDay: availableHours,
      skillLevel,
      teamType,
      deadlineDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    problemStatement: `Developing a scalable, user-centric software solution that efficiently addresses: "${idea || 'automated workflow management and intelligent user assistance'}". Modern users face friction due to fragmented tools, lack of AI guidance, and slow performance. This application unifies core workflows into an intuitive, high-performance interface.`,
    objectives: [
      `Deliver a fully functional MVP within ${totalDays} days (${totalWeeks} weeks) with a daily workload of ${availableHours} hours.`,
      `Implement modular, decoupled architecture using ${technology}.`,
      `Ensure end-to-end type safety, responsive layout, and robust database schema handling.`,
      `Achieve smooth AI integration with low latency, robust error handling, and intuitive interaction controls.`
    ],
    features: [
      { title: 'Interactive User Dashboard', desc: 'Real-time telemetry, overview metrics, activity logs, and status visualizers.' },
      { title: 'AI Automation & Copilot Assistant', desc: 'Integrated contextual AI suggestions, code execution preview, and error diagnosis.' },
      { title: 'Authentication & Role Management', desc: 'Secure session handling, JWT/OAuth auth flows, and fine-grained access control.' },
      { title: 'Data Analytics & Exporting', desc: 'Interactive charts, CSV/PDF report generation, and historical data comparison.' },
      { title: 'Real-time Notifications & Alerts', desc: 'Event-driven toasts, email summaries, and deadline milestone alerts.' }
    ],
    functionalRequirements: [
      'User must be able to create an account, log in securely, and manage profile settings.',
      'System must process intake inputs and dynamically render real-time project metrics.',
      'AI assistant must accept text prompts and image/screenshot uploads for instant diagnostic analysis.',
      'System must save application state, chat logs, and customized project settings persistently.',
      'User must be able to export project blueprints, code snippets, and timetable schedules.'
    ],
    nonFunctionalRequirements: [
      { aspect: 'Performance', detail: 'Initial page load < 1.2s; API endpoint responses < 250ms for normal queries.' },
      { aspect: 'Scalability', detail: 'Stateless backend service architecture horizontal scaling ready with connection pooling.' },
      { aspect: 'Security', detail: 'TLS/HTTPS encryption in transit, bcrypt/Argon2 hashing for secrets, CORS restriction policies.' },
      { aspect: 'Usability', detail: 'Dark mode UI design system adhering to WCAG 2.1 AA accessibility guidelines.' },
      { aspect: 'Reliability', detail: '99.9% uptime target with graceful error boundaries and retry fallbacks.' }
    ],
    technologyStack: {
      frontend: mainFrontend,
      backend: mainBackend,
      database: mainDb,
      aiProvider: 'Google Gemini API / Multi-modal Vision Model',
      styling: 'TailwindCSS / Glassmorphism UI tokens',
      deployment: 'Vercel / Render / Cloudflare Workers'
    },
    architecture: {
      pattern: 'Client-Server Layered Micro-Architecture with Decoupled REST/GraphQL API & Event Bus',
      diagram: `
+-------------------------------------------------------------------------+
|                              FRONTEND LAYER                             |
|    [ React 19 / SPA UI ] <---> [ Zustand State Store ] <---> [ Axios ]   |
+------------------------------------+------------------------------------+
                                     |  HTTP REST / WebSocket
                                     v
+-------------------------------------------------------------------------+
|                              BACKEND LAYER                              |
|   [ API Gateway / Express Router ] ---> [ Auth & Controller Middleware ]|
|   [ Business Logic Services ]      ---> [ AI Vision & Chat Service ]    |
+------------------------------------+------------------------------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
+-----------------------------+             +-----------------------------+
|       DATABASE LAYER        |             |      EXTERNAL AI SERVICES   |
| [ PostgreSQL / MongoDB ]    |             | [ Gemini Vision & LLM API ] |
+-----------------------------+             +-----------------------------+
`
    },
    database: {
      schemaSummary: 'Relational or Document schema optimized for user multi-tenancy, state logs, and chat threads.',
      tables: [
        { name: 'Users', fields: 'id (PK), name, email, password_hash, role, created_at' },
        { name: 'Projects', fields: 'id (PK), user_id (FK), name, description, tech_stack, deadline, hours_per_day, created_at' },
        { name: 'TimetablePhases', fields: 'id (PK), project_id (FK), week_number, phase_name, estimated_hours, is_completed' },
        { name: 'ChatSessions', fields: 'id (PK), project_id (FK), title, last_active_at' },
        { name: 'ChatMessages', fields: 'id (PK), session_id (FK), sender, content, image_url, timestamp' }
      ]
    },
    apiDesign: [
      { method: 'POST', path: '/api/v1/projects/generate', desc: 'Accepts intake parameters and generates complete specification.' },
      { method: 'GET', path: '/api/v1/projects/:id', desc: 'Fetches project blueprint and weekly schedule breakdown.' },
      { method: 'POST', path: '/api/v1/ai/chat', desc: 'Processes text + base64 image screenshot for technical debugging.' },
      { method: 'PUT', path: '/api/v1/timetable/:id/progress', desc: 'Updates completion status of weekly tasks.' }
    ],
    frontendPages: [
      { name: 'Landing & Onboarding', route: '/', desc: 'Hero section, feature highlight, and quick CTA.' },
      { name: 'Project Assistant Intake', route: '/app/project-assistant', desc: 'Wizard form to input idea, stack, deadline, and hours.' },
      { name: 'Specification Blueprint', route: '/app/project-assistant/spec', desc: '14-section project documentation viewer.' },
      { name: 'Interactive Timetable', route: '/app/project-assistant/timetable', desc: 'Dynamic timeline tracking deadline and hours.' },
      { name: 'AI Technical Support Hub', route: '/app/project-assistant/chat', desc: 'Debugging & screenshot upload assistant.' }
    ],
    backendModules: [
      { module: 'AuthService', responsibility: 'JWT token signing, refresh tokens, password validation.' },
      { module: 'ProjectEngine', responsibility: 'Algorithmic breakdown of tasks based on deadline and user hours.' },
      { module: 'AIService', responsibility: 'Prompt construction, multi-modal Vision payload formatting, and response parsing.' },
      { module: 'NotificationWorker', responsibility: 'Milestone reminder scheduling and deadline alert triggers.' }
    ],
    aiIntegration: {
      capabilities: [
        'Multi-modal Screenshot Diagnostic: Analyzes uploaded UI bugs or error stack trace screenshots.',
        'Code Refactoring Engine: Provides idiomatic code examples matched to team skill level.',
        'Architecture Advisor: Recommends design patterns, caching strategies, and API security measures.',
        'Automated Test Case Generation: Generates unit, integration, and e2e test boilerplate.'
      ],
      promptContext: `Act as a senior principal architect assisting a developer (${skillLevel} level) building ${projectName} using ${technology}. Target deadline: ${totalDays} days.`
    },
    testing: [
      { type: 'Unit Testing', tools: 'Vitest / Jest', coverage: '80%+ on utility helper functions, data transformers, and custom hooks.' },
      { type: 'Integration Testing', tools: 'Supertest / React Testing Library', coverage: 'Critical user workflows (auth flow, form submission, spec rendering).' },
      { type: 'End-to-End (E2E)', tools: 'Playwright / Cypress', coverage: 'Full user journey from intake form submission to screenshot upload chat.' },
      { type: 'Screenshot & Visual Regression', tools: 'Percy / Storybook', coverage: 'UI components visual alignment and responsive layouts.' }
    ],
    deployment: [
      { phase: 'CI/CD Pipeline', setup: 'GitHub Actions workflow triggered on push to main branch.' },
      { phase: 'Frontend Hosting', setup: 'Deploy Vite SPA to Vercel/Netlify with global CDN distribution.' },
      { phase: 'Backend Hosting', setup: 'Containerized Node.js service running on Render / AWS ECS.' },
      { phase: 'Database Hosting', setup: 'Managed Supabase / Neon PostgreSQL with daily automated backups.' },
      { phase: 'Environment Config', setup: 'Strict secret management via Vault or Vercel Environment Variables.' }
    ],
    timetable: weeks
  }
}

export const useProjectAssistantStore = create((set, get) => ({
  // Form intake state
  intake: DEFAULT_INTAKE,
  
  // Current UI Step: 'intake' | 'blueprint'
  step: 'intake',
  
  // Generated Spec
  spec: null,
  isGenerating: false,
  
  // Selected Spec Tab
  activeTab: 'problem',

  // Technical Chat state
  chatMessages: [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 Hi! I'm your AI Project Assistant. I've analyzed your project setup. Ask me any technical questions, request code snippets, ask for architecture guidance, or upload a screenshot of any error/UI problem you encounter!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ],
  isChatOpen: false,
  isThinking: false,

  // Actions
  setIntakeField: (field, value) => {
    set((state) => ({
      intake: { ...state.intake, [field]: value }
    }))
  },

  resetIntake: () => {
    set({ intake: DEFAULT_INTAKE, step: 'intake', spec: null })
  },

  generateSpec: () => {
    set({ isGenerating: true })
    setTimeout(() => {
      const generated = generateProjectSpec(get().intake)
      set({
        spec: generated,
        step: 'blueprint',
        isGenerating: false
      })
    }, 600)
  },

  setStep: (step) => set({ step }),
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),

  // Send message to AI technical assistant
  sendChatMessage: (text, imageBase64 = null) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      image: imageBase64,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isThinking: true
    }))

    // Generate intelligent contextual response
    setTimeout(() => {
      const state = get()
      const tech = state.intake.technology || 'React & Node.js'
      const skill = state.intake.skillLevel || 'Intermediate'
      let replyText = ''

      if (imageBase64) {
        replyText = `📸 **Screenshot Diagnostic Analysis**:\n\n1. **Observed Issue**: Captured visual component breakdown or console error artifact in your screenshot.\n2. **Potential Root Cause**: State synchronization mismatch or undefined prop dereferencing in your ${tech} layout.\n3. **Recommended Fix**:\n\`\`\`javascript\n// Wrap dereferenced object in optional chaining & null checks\nconst safeValue = data?.targetProperty ?? 'Default Fallback';\n\n// Ensure component re-renders with valid keys\n<Component key={item.id || index} data={safeValue} />\n\`\`\`\nWould you like me to inspect another specific module or guide you through setting up test cases?`
      } else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('debug') || text.toLowerCase().includes('fix')) {
        replyText = `🛠️ **Debugging Guidance for ${tech}**:\n\n- **Step 1**: Check browser DevTools console or terminal stdout for the exact call stack.\n- **Step 2**: Ensure async functions are wrapped with try/catch blocks or error boundaries.\n- **Step 3**: Verify environment variables and API base URLs are defined correctly.\n\n\`\`\`javascript\ntry {\n  const res = await fetch('/api/v1/resource');\n  if (!res.ok) throw new Error(\`HTTP status \${res.status}\`);\n  const data = await res.json();\n} catch (err) {\n  console.error("Diagnostic failure:", err.message);\n}\n\`\`\`\n`
      } else if (text.toLowerCase().includes('database') || text.toLowerCase().includes('schema') || text.toLowerCase().includes('sql')) {
        replyText = `🗄️ **Database & Architecture Advice**:\n\nFor your **${skill}** level project, ensure database indexes are placed on foreign key columns (\`user_id\`, \`project_id\`). Use database migrations (Prisma/Knex/TypeORM) to keep schema in sync across development and production.`
      } else if (text.toLowerCase().includes('deploy') || text.toLowerCase().includes('host') || text.toLowerCase().includes('docker')) {
        replyText = `🚀 **Deployment Recommendations**:\n\n1. **Frontend**: Host on Vercel or Netlify with automated preview builds per PR.\n2. **Backend**: Deploy Docker container to Render, Railway, or AWS App Runner.\n3. **Database**: Use Supabase or Neon PostgreSQL with SSL mode enabled.`
      } else {
        replyText = `💡 **Technical Insights for ${state.spec?.overview?.projectName || 'Project'}**:\n\nBased on your tech stack (${tech}) and target timeline (${state.intake.availableHours} hrs/day), I recommend keeping modules decoupled and building the database schema first.\n\nNeed help writing code for any specific module, API endpoint, or testing suite? Feel free to paste code or upload a screenshot!`
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        isThinking: false
      }))
    }, 1000)
  }
}))
