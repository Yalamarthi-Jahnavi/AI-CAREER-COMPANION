/**
 * Project Assistant API — Blueprint Generator & AI Chat Engine
 *
 * Generates:
 *   • 14-section project blueprint
 *   • Realistic development timetable
 *   • Contextual AI chat responses
 *   • Screenshot analysis
 *
 * All generation is client-side with rich, realistic templates.
 */

// ─── Technology catalog ───────────────────────────────────────
export const TECH_OPTIONS = [
  { id: 'react', name: 'React', icon: '⚛️', category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', category: 'Frontend' },
  { id: 'vue', name: 'Vue.js', icon: '💚', category: 'Frontend' },
  { id: 'angular', name: 'Angular', icon: '🅰️', category: 'Frontend' },
  { id: 'svelte', name: 'Svelte', icon: '🔥', category: 'Frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢', category: 'Backend' },
  { id: 'express', name: 'Express.js', icon: '🚂', category: 'Backend' },
  { id: 'python', name: 'Python', icon: '🐍', category: 'Backend' },
  { id: 'django', name: 'Django', icon: '🎸', category: 'Backend' },
  { id: 'flask', name: 'Flask', icon: '🧪', category: 'Backend' },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', category: 'Backend' },
  { id: 'java', name: 'Java', icon: '☕', category: 'Backend' },
  { id: 'springboot', name: 'Spring Boot', icon: '🌱', category: 'Backend' },
  { id: 'golang', name: 'Go', icon: '🐹', category: 'Backend' },
  { id: 'rust', name: 'Rust', icon: '🦀', category: 'Backend' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', category: 'Database' },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { id: 'mysql', name: 'MySQL', icon: '🐬', category: 'Database' },
  { id: 'redis', name: 'Redis', icon: '🔴', category: 'Database' },
  { id: 'firebase', name: 'Firebase', icon: '🔥', category: 'Cloud' },
  { id: 'aws', name: 'AWS', icon: '☁️', category: 'Cloud' },
  { id: 'gcp', name: 'Google Cloud', icon: '🌐', category: 'Cloud' },
  { id: 'docker', name: 'Docker', icon: '🐳', category: 'DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', icon: '⎈', category: 'DevOps' },
  { id: 'tensorflow', name: 'TensorFlow', icon: '🧠', category: 'AI/ML' },
  { id: 'pytorch', name: 'PyTorch', icon: '🔦', category: 'AI/ML' },
  { id: 'openai', name: 'OpenAI API', icon: '🤖', category: 'AI/ML' },
  { id: 'flutter', name: 'Flutter', icon: '💙', category: 'Mobile' },
  { id: 'reactnative', name: 'React Native', icon: '📱', category: 'Mobile' },
]

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

// ─── Helpers ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function getTechNames(ids) {
  return ids
    .map((id) => TECH_OPTIONS.find((t) => t.id === id)?.name || id)
    .join(', ')
}

function getCategory(ids, cat) {
  return ids
    .map((id) => TECH_OPTIONS.find((t) => t.id === id))
    .filter(Boolean)
    .filter((t) => t.category === cat)
    .map((t) => t.name)
}

function daysUntilDeadline(deadlineStr) {
  if (!deadlineStr) return 30
  const now = new Date()
  const deadline = new Date(deadlineStr)
  const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 1)
}

function weeksFromDays(days) {
  return Math.max(Math.ceil(days / 7), 1)
}

// ─── Blueprint Generator ─────────────────────────────────────
export async function generateBlueprint(inputs) {
  await delay(1200 + Math.random() * 800) // simulate thinking

  const {
    projectName,
    projectIdea,
    technologies,
    otherTech,
    skillLevel,
    deadline,
    dailyHours,
    teamType,
    teamSize,
  } = inputs

  const techNames = getTechNames(technologies)
  const allTech = otherTech ? `${techNames}, ${otherTech}` : techNames
  const frontends = getCategory(technologies, 'Frontend')
  const backends = getCategory(technologies, 'Backend')
  const databases = getCategory(technologies, 'Database')
  const clouds = getCategory(technologies, 'Cloud')
  const devops = getCategory(technologies, 'DevOps')
  const aiml = getCategory(technologies, 'AI/ML')
  const mobile = getCategory(technologies, 'Mobile')
  const days = daysUntilDeadline(deadline)
  const weeks = weeksFromDays(days)
  const totalHours = days * dailyHours
  const teamLabel = teamType === 'team' ? `a team of ${teamSize}` : 'an individual developer'

  return {
    // 1. Problem Statement
    problemStatement: {
      title: 'Problem Statement',
      content: `In the current landscape, there exists a clear gap for a solution that addresses: "${projectIdea}". Existing alternatives are either too complex, expensive, or lack critical features that users need. This project—**${projectName}**—aims to bridge this gap by delivering a focused, user-friendly solution built with modern technology (${allTech}). The target audience needs a reliable, performant tool that simplifies their workflow and provides real value from day one.`,
      keyPoints: [
        `Core problem: ${projectIdea}`,
        `Target users need an accessible, performant solution`,
        `Existing solutions fail to address specific pain points`,
        `Opportunity to leverage ${allTech} for a modern approach`,
      ],
    },

    // 2. Objectives
    objectives: {
      title: 'Objectives',
      items: [
        { label: 'Primary', text: `Deliver a functional MVP of ${projectName} within ${weeks} weeks that solves the core problem effectively.` },
        { label: 'User Experience', text: `Create an intuitive, responsive UI that requires minimal onboarding for ${skillLevel.toLowerCase()}-level users.` },
        { label: 'Performance', text: 'Achieve sub-2-second page loads and 60fps interactions across all supported devices.' },
        { label: 'Scalability', text: `Design architecture to support growth from initial launch to 10,000+ concurrent users.` },
        { label: 'Quality', text: 'Maintain >80% test coverage and zero critical bugs at launch.' },
        { label: 'Deadline', text: `Complete all development, testing, and deployment within ${days} calendar days (${totalHours} available work hours as ${teamLabel}).` },
      ],
    },

    // 3. Features
    features: {
      title: 'Features',
      categories: [
        {
          name: 'Core Features (MVP)',
          priority: 'P0',
          items: [
            'User authentication and authorization (sign up, login, password reset)',
            `Primary functionality: ${projectIdea}`,
            'Dashboard with key metrics and activity feed',
            'Responsive design for desktop and mobile',
            'Data persistence and state management',
          ],
        },
        {
          name: 'Enhanced Features',
          priority: 'P1',
          items: [
            'Search and filtering capabilities',
            'User profile management and settings',
            'Notification system (in-app and email)',
            'Data export (CSV / PDF)',
            'Activity logging and history',
          ],
        },
        {
          name: 'Nice-to-Have Features',
          priority: 'P2',
          items: [
            'Real-time collaboration or updates',
            'Advanced analytics and reporting',
            'Third-party integrations',
            'Offline support with sync',
            aiml.length > 0 ? 'AI-powered recommendations and insights' : 'Dark / light theme toggle',
          ],
        },
      ],
    },

    // 4. Functional Requirements
    functionalRequirements: {
      title: 'Functional Requirements',
      sections: [
        {
          area: 'Authentication',
          requirements: [
            'FR-01: Users shall register with email and password',
            'FR-02: Users shall log in with credentials and receive a JWT token',
            'FR-03: Password reset via email verification link',
            'FR-04: Session management with token refresh and auto-logout',
          ],
        },
        {
          area: 'Core Business Logic',
          requirements: [
            `FR-05: System shall process and handle: ${projectIdea}`,
            'FR-06: CRUD operations for all primary entities',
            'FR-07: Input validation with clear error messages',
            'FR-08: Data filtering, sorting, and pagination',
          ],
        },
        {
          area: 'User Interface',
          requirements: [
            'FR-09: Responsive layout adapting to screen sizes 320px–2560px',
            'FR-10: Loading states, skeleton screens, and error boundaries',
            'FR-11: Form validation with real-time feedback',
            'FR-12: Accessible navigation with keyboard support (WCAG 2.1 AA)',
          ],
        },
        {
          area: 'Data Management',
          requirements: [
            'FR-13: Auto-save for form data and user preferences',
            'FR-14: Data export in CSV and PDF formats',
            'FR-15: Search with debounced full-text capability',
            'FR-16: Audit trail for critical operations',
          ],
        },
      ],
    },

    // 5. Non-functional Requirements
    nonFunctionalRequirements: {
      title: 'Non-functional Requirements',
      items: [
        { category: 'Performance', requirement: 'Page load time < 2 seconds on 3G network. API response time < 500ms for 95th percentile.' },
        { category: 'Scalability', requirement: 'Support 10,000 concurrent users. Horizontal scaling for backend services.' },
        { category: 'Security', requirement: 'OWASP Top 10 compliance. Data encryption at rest (AES-256) and in transit (TLS 1.3). Rate limiting on all API endpoints.' },
        { category: 'Reliability', requirement: '99.9% uptime SLA. Automated failover and health checks. Graceful degradation under load.' },
        { category: 'Maintainability', requirement: 'Modular codebase with clear separation of concerns. Comprehensive documentation. CI/CD pipeline with automated testing.' },
        { category: 'Compatibility', requirement: 'Chrome, Firefox, Safari, Edge (last 2 versions). iOS 15+, Android 12+.' },
        { category: 'Accessibility', requirement: 'WCAG 2.1 Level AA compliance. Screen reader compatibility. Keyboard navigation support.' },
      ],
    },

    // 6. Technology Stack
    technologyStack: {
      title: 'Technology Stack',
      layers: [
        { layer: 'Frontend', technologies: frontends.length > 0 ? frontends : ['React'], rationale: 'Component-based architecture with rich ecosystem and community support.' },
        { layer: 'Backend', technologies: backends.length > 0 ? backends : ['Node.js + Express'], rationale: 'Fast development cycle, strong async capabilities, and shared JS ecosystem.' },
        { layer: 'Database', technologies: databases.length > 0 ? databases : ['PostgreSQL'], rationale: 'ACID compliance, powerful querying, excellent tooling, and scalability.' },
        { layer: 'Cloud / Hosting', technologies: clouds.length > 0 ? clouds : ['Vercel + Railway'], rationale: 'Zero-config deployments, auto-scaling, and generous free tiers for MVP.' },
        { layer: 'DevOps', technologies: devops.length > 0 ? devops : ['GitHub Actions'], rationale: 'Native CI/CD integration, container support, and infrastructure as code.' },
        ...(aiml.length > 0 ? [{ layer: 'AI / ML', technologies: aiml, rationale: 'Enables intelligent features like recommendations, NLP, and predictive analytics.' }] : []),
        ...(mobile.length > 0 ? [{ layer: 'Mobile', technologies: mobile, rationale: 'Cross-platform mobile development with shared codebase and native performance.' }] : []),
        { layer: 'Testing', technologies: ['Jest', 'Testing Library', 'Cypress'], rationale: 'Comprehensive unit, integration, and end-to-end testing coverage.' },
        { layer: 'Tooling', technologies: ['ESLint', 'Prettier', 'Husky', 'TypeScript'], rationale: 'Code quality enforcement, consistent formatting, and type safety.' },
      ],
    },

    // 7. Architecture
    architecture: {
      title: 'Architecture',
      pattern: backends.length > 0 ? 'Client-Server with RESTful API' : 'Serverless / JAMstack',
      description: `The application follows a modern ${backends.length > 0 ? 'client-server' : 'serverless'} architecture with clear separation between the presentation layer, business logic, and data access layer. This enables independent development, testing, and deployment of each layer.`,
      layers: [
        { name: 'Presentation Layer', description: `${frontends[0] || 'React'} SPA with component-based UI, state management via Context/Redux/Zustand, and client-side routing.` },
        { name: 'API Layer', description: `RESTful API with versioned endpoints (/api/v1/*), request validation, authentication middleware, and rate limiting.` },
        { name: 'Business Logic Layer', description: 'Service classes handling core domain logic, data transformations, and third-party integrations.' },
        { name: 'Data Access Layer', description: `ORM/ODM for ${databases[0] || 'PostgreSQL'} interactions with migrations, seeds, and connection pooling.` },
        { name: 'Infrastructure Layer', description: `${clouds[0] || 'Cloud'} deployment with containerization, load balancing, and monitoring.` },
      ],
      diagram: `
┌─────────────────────────────────────────────┐
│              Client (Browser/App)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Pages  │  │Components│  │  State   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────┬────────────────────────┘
                     │ HTTPS / REST
┌────────────────────┴────────────────────────┐
│              API Gateway / Server            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Routes  │  │Middleware│  │Controllers│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Services │  │  Helpers │  │Validators│  │
│  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────┴────────────────────────┐
│              Data Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Database │  │   Cache  │  │  Storage │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘`,
    },

    // 8. Database
    database: {
      title: 'Database Design',
      type: databases[0] || 'PostgreSQL',
      tables: [
        {
          name: 'users',
          description: 'Stores user accounts and authentication details',
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT uuid_generate_v4()' },
            { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NOT NULL' },
            { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
            { name: 'full_name', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
            { name: 'avatar_url', type: 'TEXT', constraints: 'NULLABLE' },
            { name: 'role', type: 'ENUM', constraints: "DEFAULT 'user'" },
            { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()' },
            { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()' },
          ],
        },
        {
          name: 'projects',
          description: 'Core entity table for project data',
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
            { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY → users(id)' },
            { name: 'title', type: 'VARCHAR(200)', constraints: 'NOT NULL' },
            { name: 'description', type: 'TEXT', constraints: 'NULLABLE' },
            { name: 'status', type: 'ENUM', constraints: "DEFAULT 'draft'" },
            { name: 'metadata', type: 'JSONB', constraints: 'DEFAULT {}' },
            { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()' },
            { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()' },
          ],
        },
        {
          name: 'tasks',
          description: 'Individual tasks/items within a project',
          columns: [
            { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
            { name: 'project_id', type: 'UUID', constraints: 'FOREIGN KEY → projects(id)' },
            { name: 'title', type: 'VARCHAR(200)', constraints: 'NOT NULL' },
            { name: 'description', type: 'TEXT', constraints: 'NULLABLE' },
            { name: 'priority', type: 'ENUM', constraints: "DEFAULT 'medium'" },
            { name: 'status', type: 'ENUM', constraints: "DEFAULT 'pending'" },
            { name: 'due_date', type: 'DATE', constraints: 'NULLABLE' },
            { name: 'assigned_to', type: 'UUID', constraints: 'FOREIGN KEY → users(id)' },
          ],
        },
        {
          name: 'activity_logs',
          description: 'Audit trail for all user actions',
          columns: [
            { name: 'id', type: 'BIGSERIAL', constraints: 'PRIMARY KEY' },
            { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY → users(id)' },
            { name: 'action', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
            { name: 'entity_type', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
            { name: 'entity_id', type: 'UUID', constraints: 'NOT NULL' },
            { name: 'metadata', type: 'JSONB', constraints: 'DEFAULT {}' },
            { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()' },
          ],
        },
      ],
      indexes: [
        'CREATE INDEX idx_projects_user ON projects(user_id);',
        'CREATE INDEX idx_tasks_project ON tasks(project_id);',
        'CREATE INDEX idx_tasks_status ON tasks(status);',
        'CREATE INDEX idx_activity_user ON activity_logs(user_id, created_at DESC);',
      ],
    },

    // 9. API Design
    apiDesign: {
      title: 'API Design',
      baseUrl: '/api/v1',
      groups: [
        {
          name: 'Authentication',
          endpoints: [
            { method: 'POST', path: '/auth/register', description: 'Register a new user account', body: '{ email, password, full_name }', response: '{ user, token }' },
            { method: 'POST', path: '/auth/login', description: 'Authenticate and receive JWT', body: '{ email, password }', response: '{ user, token, refreshToken }' },
            { method: 'POST', path: '/auth/refresh', description: 'Refresh access token', body: '{ refreshToken }', response: '{ token }' },
            { method: 'POST', path: '/auth/forgot-password', description: 'Send password reset email', body: '{ email }', response: '{ message }' },
          ],
        },
        {
          name: 'Users',
          endpoints: [
            { method: 'GET', path: '/users/me', description: 'Get current user profile', body: null, response: '{ user }' },
            { method: 'PATCH', path: '/users/me', description: 'Update current user profile', body: '{ full_name?, avatar_url? }', response: '{ user }' },
            { method: 'DELETE', path: '/users/me', description: 'Delete user account', body: null, response: '{ message }' },
          ],
        },
        {
          name: 'Projects',
          endpoints: [
            { method: 'GET', path: '/projects', description: 'List all projects (paginated)', body: null, response: '{ projects[], total, page }' },
            { method: 'POST', path: '/projects', description: 'Create a new project', body: '{ title, description }', response: '{ project }' },
            { method: 'GET', path: '/projects/:id', description: 'Get project details', body: null, response: '{ project }' },
            { method: 'PATCH', path: '/projects/:id', description: 'Update project', body: '{ title?, description?, status? }', response: '{ project }' },
            { method: 'DELETE', path: '/projects/:id', description: 'Delete project', body: null, response: '{ message }' },
          ],
        },
        {
          name: 'Tasks',
          endpoints: [
            { method: 'GET', path: '/projects/:id/tasks', description: 'List tasks in a project', body: null, response: '{ tasks[], total }' },
            { method: 'POST', path: '/projects/:id/tasks', description: 'Create a new task', body: '{ title, description, priority }', response: '{ task }' },
            { method: 'PATCH', path: '/tasks/:id', description: 'Update task', body: '{ title?, status?, priority? }', response: '{ task }' },
            { method: 'DELETE', path: '/tasks/:id', description: 'Delete task', body: null, response: '{ message }' },
          ],
        },
      ],
      authentication: 'Bearer JWT token in Authorization header. Tokens expire after 24 hours with refresh capability.',
      errorFormat: '{ error: { code: string, message: string, details?: object } }',
    },

    // 10. Frontend Pages
    frontendPages: {
      title: 'Frontend Pages',
      pages: [
        { name: 'Landing / Home', route: '/', description: 'Marketing page with hero, features, CTA', components: ['Hero', 'FeatureGrid', 'Testimonials', 'CTA'] },
        { name: 'Login', route: '/login', description: 'Authentication form with social login options', components: ['LoginForm', 'SocialAuth', 'ForgotPasswordLink'] },
        { name: 'Register', route: '/register', description: 'User registration with multi-step form', components: ['RegisterForm', 'TermsCheckbox', 'PasswordStrength'] },
        { name: 'Dashboard', route: '/dashboard', description: 'Main overview with KPIs, charts, recent activity', components: ['StatCards', 'ActivityFeed', 'QuickActions', 'Charts'] },
        { name: 'Project List', route: '/projects', description: 'Grid/list view of all projects with search and filters', components: ['ProjectCard', 'SearchBar', 'FilterPanel', 'Pagination'] },
        { name: 'Project Detail', route: '/projects/:id', description: 'Full project view with tasks, timeline, members', components: ['TaskBoard', 'Timeline', 'MemberList', 'Comments'] },
        { name: 'Settings', route: '/settings', description: 'User preferences, profile editing, account management', components: ['ProfileForm', 'PreferencesPanel', 'DangerZone'] },
        { name: 'Not Found', route: '/404', description: 'Custom 404 page with navigation suggestions', components: ['ErrorIllustration', 'SuggestionLinks'] },
      ],
    },

    // 11. Backend Modules
    backendModules: {
      title: 'Backend Modules',
      modules: [
        { name: 'Auth Module', path: '/modules/auth', description: 'User registration, login, JWT issuance, password reset, session management', files: ['auth.controller.js', 'auth.service.js', 'auth.middleware.js', 'auth.validator.js'] },
        { name: 'User Module', path: '/modules/users', description: 'Profile CRUD, avatar uploads, preference management', files: ['user.controller.js', 'user.service.js', 'user.model.js'] },
        { name: 'Project Module', path: '/modules/projects', description: 'Project CRUD, member management, status transitions', files: ['project.controller.js', 'project.service.js', 'project.model.js'] },
        { name: 'Task Module', path: '/modules/tasks', description: 'Task CRUD, assignment, priority sorting, status updates', files: ['task.controller.js', 'task.service.js', 'task.model.js'] },
        { name: 'Notification Module', path: '/modules/notifications', description: 'In-app and email notifications, event-driven alerts', files: ['notification.controller.js', 'notification.service.js', 'email.service.js'] },
        { name: 'Upload Module', path: '/modules/uploads', description: 'File upload handling, image processing, cloud storage integration', files: ['upload.controller.js', 'upload.service.js', 'storage.adapter.js'] },
        { name: 'Analytics Module', path: '/modules/analytics', description: 'Usage tracking, reporting, data aggregation', files: ['analytics.controller.js', 'analytics.service.js'] },
        { name: 'Common Module', path: '/modules/common', description: 'Shared utilities, error handlers, logger, config', files: ['error-handler.js', 'logger.js', 'config.js', 'validators.js'] },
      ],
    },

    // 12. AI Integration
    aiIntegration: {
      title: 'AI Integration',
      overview: aiml.length > 0
        ? `Leverage ${aiml.join(', ')} for intelligent features that enhance the user experience and automate repetitive tasks.`
        : 'Integrate AI capabilities to add smart features and automation to the project.',
      features: [
        { name: 'Smart Suggestions', description: 'AI-powered auto-complete and content suggestions based on user behavior patterns.', complexity: 'Medium' },
        { name: 'Natural Language Search', description: 'Allow users to search using natural language queries converted to structured filters.', complexity: 'High' },
        { name: 'Automated Categorization', description: 'Auto-tag and categorize content using text classification models.', complexity: 'Medium' },
        { name: 'Anomaly Detection', description: 'Identify unusual patterns in user data and generate alerts.', complexity: 'High' },
        { name: 'Content Summarization', description: 'Generate concise summaries of long-form content using LLM APIs.', complexity: 'Low' },
        { name: 'Personalized Recommendations', description: 'Suggest relevant items based on user history and collaborative filtering.', complexity: 'High' },
      ],
      implementation: {
        approach: aiml.length > 0
          ? `Use ${aiml[0]} for core ML features and REST APIs for real-time inference.`
          : 'Use OpenAI/Gemini API for NLP features and scikit-learn for basic ML models.',
        pipeline: ['Data Collection → Preprocessing → Model Training / API Call → Post-processing → Response'],
      },
    },

    // 13. Testing
    testing: {
      title: 'Testing Strategy',
      levels: [
        {
          name: 'Unit Testing',
          tool: 'Jest / Vitest',
          coverage: '> 80%',
          focus: [
            'Individual functions and utility helpers',
            'Component rendering and props validation',
            'Service layer business logic',
            'Data transformations and validators',
          ],
        },
        {
          name: 'Integration Testing',
          tool: 'Testing Library + Supertest',
          coverage: '> 60%',
          focus: [
            'API endpoint request-response cycles',
            'Database operations with test fixtures',
            'Authentication flow end-to-end',
            'Component interactions with state',
          ],
        },
        {
          name: 'End-to-End Testing',
          tool: 'Cypress / Playwright',
          coverage: 'Critical paths',
          focus: [
            'User registration and login flow',
            'Core CRUD workflows',
            'Navigation and routing',
            'Error handling and edge cases',
          ],
        },
        {
          name: 'Performance Testing',
          tool: 'k6 / Artillery',
          coverage: 'API endpoints',
          focus: [
            'Load testing under concurrent users',
            'Response time benchmarks',
            'Memory and CPU profiling',
            'Database query performance',
          ],
        },
      ],
    },

    // 14. Deployment
    deployment: {
      title: 'Deployment Strategy',
      environments: [
        { name: 'Development', url: 'localhost:3000 / localhost:8000', purpose: 'Local development with hot reload', branch: 'feature/*' },
        { name: 'Staging', url: 'staging.yourapp.com', purpose: 'Pre-production testing and QA', branch: 'develop' },
        { name: 'Production', url: 'yourapp.com', purpose: 'Live user-facing environment', branch: 'main' },
      ],
      pipeline: [
        { step: 'Code Push', description: 'Developer pushes code to feature branch' },
        { step: 'CI Checks', description: 'Automated linting, type checking, and unit tests' },
        { step: 'Build', description: 'Production build with optimization and bundling' },
        { step: 'Integration Tests', description: 'Run integration and E2E test suites' },
        { step: 'Deploy to Staging', description: 'Auto-deploy on develop branch merge' },
        { step: 'QA Review', description: 'Manual testing and stakeholder review' },
        { step: 'Deploy to Production', description: 'Auto-deploy on main branch merge with rollback capability' },
        { step: 'Monitor', description: 'Post-deploy health checks, error tracking, performance monitoring' },
      ],
      infrastructure: {
        frontend: clouds.includes('AWS') ? 'AWS S3 + CloudFront CDN' : clouds.includes('Google Cloud') ? 'Google Cloud Storage + Cloud CDN' : 'Vercel (auto-scaling, edge network)',
        backend: clouds.includes('AWS') ? 'AWS ECS / Lambda' : clouds.includes('Google Cloud') ? 'Google Cloud Run' : 'Railway / Render (managed containers)',
        database: clouds.includes('AWS') ? 'AWS RDS' : clouds.includes('Google Cloud') ? 'Cloud SQL' : 'Managed database (Supabase / PlanetScale)',
        monitoring: 'Sentry (errors) + Datadog or New Relic (APM) + UptimeRobot (uptime)',
      },
    },
  }
}

// ─── Timetable Generator ─────────────────────────────────────
export async function generateTimetable(inputs) {
  await delay(800 + Math.random() * 500)

  const { deadline, dailyHours, teamType, teamSize, skillLevel } = inputs
  const days = daysUntilDeadline(deadline)
  const weeks = weeksFromDays(days)
  const effectiveTeam = teamType === 'team' ? teamSize : 1
  const totalHours = days * dailyHours * effectiveTeam

  // Skill level multiplier (beginners need more time)
  const multiplier = skillLevel === 'Beginner' ? 1.4 : skillLevel === 'Intermediate' ? 1.0 : 0.8

  // Phase distribution
  const phases = [
    { name: 'Planning & Setup', percentage: 0.10, color: '#6366f1', tasks: ['Project scaffolding', 'Dev environment setup', 'Architecture design', 'Database schema design', 'Git repo and CI/CD setup'] },
    { name: 'Core Backend', percentage: 0.20, color: '#8b5cf6', tasks: ['Auth module implementation', 'Core API endpoints', 'Database models and migrations', 'Input validation and error handling', 'API documentation'] },
    { name: 'Core Frontend', percentage: 0.20, color: '#d946ef', tasks: ['Component library setup', 'Page layouts and routing', 'State management implementation', 'API integration layer', 'Form handling and validation'] },
    { name: 'Feature Development', percentage: 0.20, color: '#ec4899', tasks: ['Search and filtering', 'User profile and settings', 'Notification system', 'File upload handling', 'Dashboard and analytics'] },
    { name: 'AI Integration', percentage: 0.10, color: '#f97316', tasks: ['AI service integration', 'Prompt engineering', 'Response processing', 'Caching and optimization', 'Fallback handling'] },
    { name: 'Testing', percentage: 0.10, color: '#22c55e', tasks: ['Unit test suite', 'Integration tests', 'E2E test scenarios', 'Performance testing', 'Bug fixing and polish'] },
    { name: 'Deployment & Launch', percentage: 0.10, color: '#3b82f6', tasks: ['Production environment setup', 'CI/CD pipeline finalization', 'Security audit', 'Performance optimization', 'Launch checklist and go-live'] },
  ]

  // Distribute weeks across phases
  const schedule = []
  let currentWeek = 1

  for (const phase of phases) {
    const phaseWeeks = Math.max(Math.round(weeks * phase.percentage), 1)
    const phaseHours = Math.round(totalHours * phase.percentage / multiplier)
    const weeklyHours = Math.round(phaseHours / phaseWeeks)

    for (let w = 0; w < phaseWeeks && currentWeek <= weeks; w++) {
      const startDay = (currentWeek - 1) * 7
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + startDay)

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)

      const tasksForWeek = phase.tasks.slice(
        Math.floor(w * phase.tasks.length / phaseWeeks),
        Math.floor((w + 1) * phase.tasks.length / phaseWeeks) + 1
      )

      schedule.push({
        week: currentWeek,
        phase: phase.name,
        color: phase.color,
        startDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weeklyHours,
        dailyHours: Math.round(weeklyHours / 5),
        tasks: tasksForWeek.length > 0 ? tasksForWeek : [phase.tasks[0]],
        milestone: w === phaseWeeks - 1 ? `${phase.name} Complete ✓` : null,
      })

      currentWeek++
    }
  }

  return {
    totalWeeks: weeks,
    totalDays: days,
    totalHours,
    dailyHours,
    teamSize: effectiveTeam,
    skillLevel,
    schedule,
    summary: {
      planningHours: Math.round(totalHours * 0.10),
      developmentHours: Math.round(totalHours * 0.60),
      testingHours: Math.round(totalHours * 0.10),
      deploymentHours: Math.round(totalHours * 0.10),
      bufferHours: Math.round(totalHours * 0.10),
    },
  }
}

// ─── Chat Response Generator ─────────────────────────────────
const CHAT_RESPONSES = {
  debug: [
    {
      triggers: ['debug', 'bug', 'error', 'fix', 'broken', 'not working', 'crash'],
      responses: [
        `Here's a systematic debugging approach:\n\n**1. Reproduce the Issue**\n- Identify exact steps to trigger the bug\n- Check if it's consistent or intermittent\n\n**2. Check the Console**\n- Look for error messages, stack traces\n- Check network tab for failed API calls\n\n**3. Isolate the Problem**\n- Comment out sections to narrow down\n- Use \`console.log\` or debugger breakpoints\n- Check if the issue is in frontend or backend\n\n**4. Common Fixes**\n- Null/undefined checks on data\n- Async/await error handling\n- State management race conditions\n- Missing dependency in useEffect\n\n**5. If Stuck**\n- Search the exact error message online\n- Check GitHub issues for the library\n- Add try-catch blocks around suspicious code`,
      ],
    },
  ],
  error: [
    {
      triggers: ['explain error', 'what does this error mean', 'error message', 'stack trace', 'exception'],
      responses: [
        `To help explain your error, here's what to look for:\n\n**Reading Error Messages**\n- The error *type* tells you the category (TypeError, ReferenceError, SyntaxError, etc.)\n- The *message* explains what went wrong specifically\n- The *stack trace* shows where it happened (read top to bottom)\n\n**Common JavaScript Errors:**\n- \`TypeError: Cannot read properties of undefined\` → You're accessing a property on something that doesn't exist yet. Add optional chaining (\`?.\`) or null checks.\n- \`ReferenceError: X is not defined\` → Variable doesn't exist in scope. Check imports and variable declarations.\n- \`SyntaxError\` → Invalid code syntax. Check for missing brackets, quotes, or semicolons.\n- \`CORS Error\` → Backend isn't configured to accept requests from your frontend origin. Add CORS middleware.\n- \`429 Too Many Requests\` → You're hitting rate limits. Add request throttling or debouncing.\n\nShare the exact error message for a more specific explanation.`,
      ],
    },
  ],
  architecture: [
    {
      triggers: ['architecture', 'structure', 'design pattern', 'organize', 'folder structure', 'scalable'],
      responses: [
        `Here are architecture recommendations for your project:\n\n**Recommended Folder Structure:**\n\`\`\`\nsrc/\n├── components/     # Reusable UI components\n│   ├── ui/         # Base components (Button, Card, Input)\n│   └── features/   # Feature-specific components\n├── pages/          # Route-level page components\n├── hooks/          # Custom React hooks\n├── services/       # API calls and business logic\n├── store/          # State management (Zustand/Redux)\n├── utils/          # Pure utility functions\n├── types/          # TypeScript type definitions\n├── constants/      # App-wide constants\n└── assets/         # Images, fonts, icons\n\`\`\`\n\n**Key Design Patterns:**\n- **Separation of Concerns** — UI, logic, and data in separate layers\n- **Custom Hooks** — Extract reusable logic from components\n- **Service Layer** — Abstract API calls away from components\n- **Composition over Inheritance** — Build complex UIs from simple parts\n- **Error Boundaries** — Catch rendering errors gracefully\n\n**Scalability Tips:**\n- Use code splitting with lazy loading for routes\n- Implement proper caching strategy (React Query / SWR)\n- Design database indexes for common query patterns\n- Use environment variables for configuration`,
      ],
    },
  ],
  implementation: [
    {
      triggers: ['how to implement', 'how do i', 'build', 'create', 'code', 'implement', 'example'],
      responses: [
        `Here's a general implementation guide for common features:\n\n**Authentication:**\n1. Use JWT tokens with httpOnly cookies for security\n2. Implement refresh token rotation\n3. Store user state in a global store\n4. Create a ProtectedRoute wrapper component\n\n**API Integration:**\n1. Create an API client with axios/fetch with base URL config\n2. Add request/response interceptors for auth tokens\n3. Use custom hooks for data fetching (useQuery pattern)\n4. Handle loading, error, and success states\n\n**State Management:**\n1. Local state (useState) for component-specific data\n2. Global store (Zustand/Redux) for shared app state\n3. Server state (React Query) for API data with caching\n4. URL state (search params) for shareable views\n\n**Forms:**\n1. Controlled components with validation\n2. Real-time validation feedback\n3. Debounced API calls for uniqueness checks\n4. Optimistic updates for better UX\n\nAsk me about a specific feature for detailed implementation code.`,
      ],
    },
  ],
  testing: [
    {
      triggers: ['test', 'testing', 'jest', 'cypress', 'unit test', 'e2e', 'coverage'],
      responses: [
        `Here's a testing strategy for your project:\n\n**Unit Tests (Jest/Vitest):**\n\`\`\`javascript\n// Example: Testing a utility function\ndescribe('calculateTotal', () => {\n  it('should sum items correctly', () => {\n    const items = [{ price: 10 }, { price: 20 }]\n    expect(calculateTotal(items)).toBe(30)\n  })\n  it('should return 0 for empty array', () => {\n    expect(calculateTotal([])).toBe(0)\n  })\n})\n\`\`\`\n\n**Component Tests (Testing Library):**\n\`\`\`javascript\nit('renders button with correct text', () => {\n  render(<Button>Click me</Button>)\n  expect(screen.getByText('Click me')).toBeInTheDocument()\n})\n\`\`\`\n\n**E2E Tests (Cypress):**\n\`\`\`javascript\nit('should complete login flow', () => {\n  cy.visit('/login')\n  cy.get('[data-testid=email]').type('user@test.com')\n  cy.get('[data-testid=password]').type('password123')\n  cy.get('[data-testid=submit]').click()\n  cy.url().should('include', '/dashboard')\n})\n\`\`\`\n\n**Best Practices:**\n- Test behavior, not implementation\n- Use data-testid attributes for reliable selectors\n- Mock external APIs in unit tests\n- Run tests in CI before every merge`,
      ],
    },
  ],
  deployment: [
    {
      triggers: ['deploy', 'hosting', 'production', 'ci/cd', 'pipeline', 'docker', 'server'],
      responses: [
        `Here's a deployment guide for your project:\n\n**Quick Deployment Options:**\n\n*Frontend:*\n- **Vercel** — Zero config, connect GitHub repo, auto-deploys\n- **Netlify** — Similar to Vercel, great for static sites\n- **AWS S3 + CloudFront** — More control, CDN distribution\n\n*Backend:*\n- **Railway** — Simple container deployment from GitHub\n- **Render** — Free tier, auto-deploys from Git\n- **AWS ECS / Google Cloud Run** — Production-grade containers\n\n**Docker Setup:**\n\`\`\`dockerfile\n# Example Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n\`\`\`\n\n**CI/CD with GitHub Actions:**\n\`\`\`yaml\nname: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n      # Deploy step here\n\`\`\`\n\n**Pre-Launch Checklist:**\n- [ ] Environment variables configured\n- [ ] Database migrations run\n- [ ] SSL certificate active\n- [ ] Error tracking (Sentry) configured\n- [ ] Performance monitoring enabled\n- [ ] Backup strategy in place`,
      ],
    },
  ],
}

export async function generateChatResponse(userMessage, projectContext) {
  await delay(600 + Math.random() * 800)

  const lower = userMessage.toLowerCase()

  // Find matching category
  for (const [, patterns] of Object.entries(CHAT_RESPONSES)) {
    for (const pattern of patterns) {
      if (pattern.triggers.some((t) => lower.includes(t))) {
        const response = pattern.responses[Math.floor(Math.random() * pattern.responses.length)]
        return {
          text: response,
          category: 'technical',
        }
      }
    }
  }

  // Contextual fallback using project info
  if (projectContext) {
    return {
      text: `I can help you with your project **${projectContext.projectName || 'project'}**. Here's what I can assist with:\n\n🐛 **Debug Code** — Paste your error or describe the issue\n❓ **Explain Errors** — Share an error message for a clear explanation\n🏗️ **Architecture** — Get design pattern and structure recommendations\n💡 **Implementation** — Step-by-step guidance for features\n🧪 **Testing** — Testing strategies and example test code\n🚀 **Deployment** — Hosting, CI/CD, and launch guidance\n📸 **Screenshot Analysis** — Upload a screenshot of an error or UI issue\n\nTry asking something like:\n- "How do I implement authentication?"\n- "Explain this error: TypeError Cannot read properties of undefined"\n- "What's the best architecture for my project?"\n- "How do I deploy to production?"`,
      category: 'help',
    }
  }

  return {
    text: `I'm your Project Assistant. I can help with:\n\n• **Code Debugging** — Describe your issue or paste error messages\n• **Error Explanation** — Share error text for a clear breakdown\n• **Architecture Suggestions** — Design patterns and project structure\n• **Implementation Guidance** — Step-by-step feature implementation\n• **Testing Suggestions** — Testing strategies and example tests\n• **Deployment Help** — Hosting, CI/CD, and production setup\n• **Screenshot Analysis** — Upload screenshots of errors or UI issues\n\nWhat would you like help with?`,
    category: 'help',
  }
}

// ─── Screenshot Analyzer ─────────────────────────────────────
export async function analyzeScreenshot(description) {
  await delay(1000 + Math.random() * 500)

  const lower = description.toLowerCase()

  if (lower.includes('console') || lower.includes('error') || lower.includes('red')) {
    return {
      issueType: 'Console Error',
      severity: 'High',
      analysis: `Based on your description, this appears to be a **console error** in the browser developer tools.\n\n**Common causes:**\n- Undefined variables or null references\n- Failed API calls (network errors or CORS issues)\n- Missing imports or broken module resolution\n- Syntax errors in JavaScript/JSX\n\n**Recommended steps:**\n1. Read the error message carefully — it usually points to the exact file and line number\n2. Check if the error is in your code or a third-party library\n3. Look at the network tab for any failed HTTP requests\n4. Add error boundaries around suspicious components\n5. Use try-catch blocks for async operations`,
      suggestions: [
        'Add null checks before accessing nested properties',
        'Verify all API endpoints are correct and accessible',
        'Check that environment variables are properly set',
        'Clear browser cache and node_modules if seeing stale errors',
      ],
    }
  }

  if (lower.includes('layout') || lower.includes('ui') || lower.includes('css') || lower.includes('style') || lower.includes('overflow') || lower.includes('alignment')) {
    return {
      issueType: 'UI / Layout Issue',
      severity: 'Medium',
      analysis: `This appears to be a **UI/layout problem**.\n\n**Common CSS/layout issues:**\n- Overflow causing horizontal scrollbar\n- Flexbox/Grid misalignment\n- Z-index stacking context problems\n- Responsive breakpoint issues\n- Missing or conflicting styles\n\n**Debugging approach:**\n1. Open DevTools → Elements tab → inspect the misaligned element\n2. Check the computed styles panel for unexpected values\n3. Look for conflicting CSS rules (strikethrough in styles)\n4. Test at different viewport sizes using device toolbar\n5. Check if a parent container has overflow: hidden cutting off content`,
      suggestions: [
        'Use CSS DevTools to identify computed values vs expected',
        'Check for missing flex-shrink: 0 on items that shouldn\'t shrink',
        'Verify responsive breakpoints in your framework',
        'Look for absolute/fixed positioning conflicts',
      ],
    }
  }

  if (lower.includes('white') || lower.includes('blank') || lower.includes('nothing') || lower.includes('empty')) {
    return {
      issueType: 'Blank Screen / White Page',
      severity: 'Critical',
      analysis: `A **blank/white screen** usually indicates a JavaScript error preventing React from rendering.\n\n**Common causes:**\n- Uncaught error in a component (missing Error Boundary)\n- Failed import or circular dependency\n- Invalid JSX syntax\n- Missing return statement in a component\n- Router misconfiguration\n\n**Debugging steps:**\n1. Open the browser console (F12) — there's likely a red error\n2. Check if the root element (#root) is empty in the DOM\n3. Wrap your app in an Error Boundary component\n4. Try commenting out recently added code\n5. Check that your entry point (main.jsx) is rendering correctly`,
      suggestions: [
        'Add a React Error Boundary at the top level',
        'Check for circular imports between modules',
        'Verify the router configuration matches your URLs',
        'Ensure all components have a valid return statement',
      ],
    }
  }

  // Generic analysis
  return {
    issueType: 'General Issue',
    severity: 'Medium',
    analysis: `Based on your description: "${description}"\n\n**General debugging approach:**\n1. **Reproduce** — Can you consistently trigger this issue?\n2. **Console** — Check browser DevTools for errors or warnings\n3. **Network** — Inspect API calls in the Network tab\n4. **State** — Use React DevTools to inspect component state\n5. **Bisect** — Comment out code sections to isolate the problem\n\n**If it's a visual issue:** Use the Elements tab to inspect CSS\n**If it's a data issue:** Log the data at each transformation step\n**If it's a performance issue:** Use the Performance tab to record and analyze`,
    suggestions: [
      'Check the browser console for errors or warnings',
      'Verify API responses match expected data shape',
      'Test in an incognito window to rule out extensions',
      'Try a hard refresh (Ctrl+Shift+R) to clear cache',
    ],
  }
}
