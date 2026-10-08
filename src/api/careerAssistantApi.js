/**
 * Unified AI Career Assistant Engine
 * 
 * Provides intelligent, contextual decision support and advice across:
 * - Current job problems & workplace dynamics
 * - Work pressure, stress & burnout management
 * - Deadlines & triage prioritization
 * - Time management & high-impact 1-hour practice sessions
 * - Learning pathways & skill mastery
 * - Current technology practice & score diagnosis
 * - Technology roadmaps & career transitions
 * - Project architecture & blueprint guidance
 * - Debugging & systematic problem isolation
 * - Technical & professional communication (teammates, stakeholders)
 * - Critical technical answers & explanations
 * - Resume bullet-point optimization & ATS scoring
 * - Technical & behavioral interview preparation
 * - HR questions & salary negotiation strategies
 * - Job switch readiness & transition safety
 * - Offer letter analysis & contract clause breakdown
 * - Long-term career planning (Staff+ / Engineering Management)
 *
 * Fully client-side offline execution without exposing API keys or provider details.
 */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Classify user intent and extract contextual keywords
 */
export function classifyCareerIntent(prompt) {
  const p = prompt.toLowerCase()

  if (p.includes('deadline') || p.includes('prioritize') || p.includes('urgent') || p.includes('due tomorrow') || p.includes('crunch')) {
    return 'deadlines_prioritization'
  }
  if (p.includes('one hour') || p.includes('1 hour') || p.includes('short time') || p.includes('what should i practice') || p.includes('quick practice')) {
    return 'time_constrained_practice'
  }
  if ((p.includes('score') || p.includes('test') || p.includes('assessment') || p.includes('improve')) && (p.includes('react') || p.includes('python') || p.includes('javascript') || p.includes('sql') || p.includes('aws') || p.includes('62') || p.includes('70') || p.includes('80'))) {
    return 'score_improvement'
  }
  if (p.includes('teammate') || p.includes('colleague') || p.includes('asked me') || p.includes('quick answer') || p.includes('how to explain') || p.includes('technical question')) {
    return 'teammate_communication'
  }
  if (p.includes('offer') || p.includes('joining') || p.includes('compensation') || p.includes('ctc') || p.includes('variable pay') || p.includes('analyze this offer') || p.includes('bond')) {
    return 'offer_letter_analysis'
  }
  if (p.includes('hr') || p.includes('human resources') || p.includes('questions to ask') || p.includes('negotiate') || p.includes('benefits')) {
    return 'hr_questions'
  }
  if (p.includes('pressure') || p.includes('stress') || p.includes('burnout') || p.includes('overwhelmed') || p.includes('workload')) {
    return 'work_pressure'
  }
  if (p.includes('switch') || p.includes('resign') || p.includes('leave job') || p.includes('notice period') || p.includes('market readiness')) {
    return 'job_switch'
  }
  if (p.includes('resume') || p.includes('cv') || p.includes('ats') || p.includes('bullet point')) {
    return 'resume_optimization'
  }
  if (p.includes('interview') || p.includes('mock') || p.includes('star method') || p.includes('behavioral')) {
    return 'interview_prep'
  }
  if (p.includes('project') || p.includes('architecture') || p.includes('blueprint') || p.includes('stack')) {
    return 'project_guidance'
  }
  if (p.includes('debug') || p.includes('bug') || p.includes('error') || p.includes('exception') || p.includes('memory leak') || p.includes('crash')) {
    return 'debugging'
  }
  if (p.includes('roadmap') || p.includes('career plan') || p.includes('staff') || p.includes('principal') || p.includes('lead')) {
    return 'career_planning'
  }
  return 'general_career'
}

/**
 * Generate rich, context-aware markdown response based on intent and optional user context
 */
export async function generateAssistantResponse(userPrompt, userContext = null) {
  // Realistic simulated delay
  await delay(900 + Math.random() * 600)

  const intent = classifyCareerIntent(userPrompt)
  const hasContext = Boolean(userContext && userContext.enabled)

  // Extract relevant context fields safely
  const userName = userContext?.user?.name || 'Alex'
  const currentStack = userContext?.user?.currentStack || ['React', 'TypeScript', 'Node.js', 'AWS']
  const targetGoal = userContext?.user?.careerGoal || 'Staff Engineer'
  const lastScore = userContext?.assessmentHistory?.recentScore || 62
  const recentTech = userContext?.assessmentHistory?.recentTech || 'React'
  const pendingDeadlines = userContext?.deadlines?.activeList || []
  const activeOffer = userContext?.offerAnalyzer?.activeOffer || null

  let responseMarkdown = ''
  let actionLinks = []
  let categoryTag = 'General Guidance'

  switch (intent) {
    case 'deadlines_prioritization': {
      categoryTag = 'Deadlines & Prioritization'
      actionLinks = [
        { label: 'Open Deadline Planner', path: '/app/deadline-planner', icon: 'Calendar' },
        { label: 'Work Pressure Manager', path: '/app/work-pressure', icon: 'AlertTriangle' },
      ]

      const deadlineNote = pendingDeadlines.length > 0 && hasContext
        ? `\n> 📌 **Active Deadlines Detected in your Workspace:**\n` +
          pendingDeadlines.slice(0, 2).map((d) => `> • **${d.title}** (Due: ${d.deadline || 'Soon'}) — *${d.urgency || 'High Priority'}*`).join('\n') +
          `\n`
        : ''

      responseMarkdown = `### 🎯 Rapid Triage Plan: Handling Urgent Deadlines

When facing an immediate deadline, your primary goal is **Scope Defense** and **Critical Path Execution**.

${deadlineNote}
#### 1. The 4-Hour Eisenhower Execution Triage
* **Must Ship (P0 - Non-negotiable):** Isolate the minimum core flow that satisfies the business commitment. Cut nice-to-haves (animations, secondary edge-case validations).
* **Defer to V1.1 (P1):** Complex styling refinements, full test coverage for secondary branches, or non-critical refactors.
* **Drop Immediately (P2):** Any feature or enhancement requested outside the original acceptance criteria.

#### 2. Practical Time Blocks for Today
1. **0:00 - 0:30 | Scope Lock & Alignment:** Send a 2-sentence update to your lead/stakeholder:
   > *"Focused on delivering core functional criteria for [Feature]. Deferring non-blocking Polish items to tomorrow morning's follow-up PR to ensure stable deployment."*
2. **0:30 - 3:00 | Deep Focus Block:** Turn off notifications. Write zero exploratory code. Solve the critical blocker directly.
3. **3:00 - 3:45 | End-to-End Sanity Testing:** Manually verify happy path + primary error boundaries.
4. **3:45 - 4:00 | PR & Rollback Plan:** Create clear deployment instructions and a safe rollback toggling mechanism.

💡 **Pro-Tip:** Stakeholders respect predictable scope reductions far more than last-minute surprise delays.`
      break
    }

    case 'time_constrained_practice': {
      categoryTag = 'High-Impact Practice'
      actionLinks = [
        { label: 'Launch 10-Min Practice Test', path: '/app/current-technology-practice', icon: 'Code2' },
        { label: 'View Tech Roadmap', path: '/app/technology-roadmap', icon: 'Map' },
      ]

      const primaryTech = hasContext ? currentStack[0] || 'React' : 'React'
      const secondaryTech = hasContext ? currentStack[1] || 'TypeScript' : 'TypeScript'

      responseMarkdown = `### ⚡ 60-Minute High-Yield Practice Routine

With only one hour available, avoid reading long documentation. Focus strictly on **Active Recall** and **Targeted Debugging Drills**.

#### 🎯 Recommended Focus: **${primaryTech} & ${secondaryTech}** (Core Stack)

| Time Window | Activity | Target Outcome |
|:---|:---|:---|
| **00 - 15 mins** | **Timed Concept Diagnostic** | Take a 5-10 question mock test to locate weak knowledge boundaries. |
| **15 - 45 mins** | **Hands-On Drill (Write Code)** | Implement 1 specific pattern from scratch without copying boilerplates. |
| **45 - 60 mins** | **Edge-Case & Performance Review** | Analyze time/space complexity, memory cleanup, or error handling. |

#### 🔥 Pick 1 Concrete 30-Min Challenge Today:
* **Option A (${primaryTech}):** Build a custom debounce/throttle hook with proper cleanup and generic type safety in ${secondaryTech}.
* **Option B (Data Fetching):** Implement an abortable \`fetch\` with automatic retry exponential backoff using modern AbortController.
* **Option C (State Management):** Write a lightweight pub/sub event store with batching state updates.

Would you like me to generate a 5-question targeted quiz right now to kickstart your session?`
      break
    }

    case 'score_improvement': {
      categoryTag = 'Assessment Diagnosis'
      actionLinks = [
        { label: 'View Assessment History', path: '/app/history', icon: 'History' },
        { label: 'Retake Diagnostic Test', path: '/app/current-technology-practice', icon: 'Code2' },
        { label: 'Learning Planner', path: '/app/learning-planner', icon: 'BookOpen' },
      ]

      const scoreNum = userPrompt.match(/\b\d{2}\b/) ? userPrompt.match(/\b\d{2}\b/)[0] : lastScore
      const techName = userPrompt.toLowerCase().includes('python') ? 'Python' : (userPrompt.toLowerCase().includes('react') ? 'React' : recentTech)

      responseMarkdown = `### 📊 Diagnostic Analysis: Overcoming the ${scoreNum}% Plateau in ${techName}

A score of **${scoreNum}%** indicates solid foundational comprehension with identifiable gaps in **advanced execution patterns**, **edge-case handling**, and **runtime lifecycle nuances**.

${hasContext ? `> 📈 *Tracking against your career goal: **${targetGoal}***. Closing these specific gaps is key to advancing past intermediate screening.*` : ''}

#### 🔍 The 3 Typical Culprits for a ~${scoreNum}% Score in ${techName}:
1. **Hook Dependency & Closure Stale State:**
   * *Problem:* Missing dependencies or incorrect use of \`useCallback\` / \`useMemo\` causing stale closures during async operations.
   * *Fix:* Study the exact timing of rendering passes and synthetic event batching.
2. **Asynchronous Lifecycle & Cleanup:**
   * *Problem:* Unhandled unmount race conditions in \`useEffect\` or un-cancelled promises.
   * *Fix:* Implement \`AbortController\` signals and explicit cleanup routines.
3. **Component Decomposition & Re-rendering Triggers:**
   * *Problem:* Passing inline object/array literals to memoized children breaking shallow equality comparisons.
   * *Fix:* Use memoized selectors or separate high-frequency state into localized sub-trees.

#### 🚀 Immediate Action Plan to Reach 85%+
* **Step 1:** Review your test breakdown in [Assessment History](/app/history) to see exact questions missed.
* **Step 2:** Spend 20 minutes building a minimal reproduction of the missed concept.
* **Step 3:** Retake an Intermediate 10-question test tomorrow at the same time.`
      break
    }

    case 'teammate_communication': {
      categoryTag = 'Technical Communication'
      actionLinks = [
        { label: 'HR & Technical Qs', path: '/app/hr-questions', icon: 'HelpCircle' },
        { label: 'Project Assistant', path: '/app/project-assistant', icon: 'FolderKanban' },
      ]

      responseMarkdown = `### 💬 Professional Technical Response Template

When responding to technical inquiries from peers, follow the **BLUF (Bottom Line Up Front)** framework to deliver clarity and authority without being condescending.

#### 💡 The 3-Part Communication Framework:
1. **Direct Answer (1 sentence):** Give the recommendation immediately.
2. **Technical Rationale (2-3 bullets):** Trade-offs, performance impact, or maintainability.
3. **Actionable Next Step:** Code snippet or link to documentation.

---

#### 📋 Example Slack/Teams Response:
> *"Hey! For this use case, **Option A (using a centralized hook with memoized cache)** is the best fit.*
> 
> *Here is why:*
> * **Performance:** Avoids redundant network round-trips across unmounted route transitions.
> * **Maintainability:** Isolates error handling and token refresh logic in a single file.
> * **Testability:** Easily mockable in component unit tests.
> 
> *I've pushed a minimal example branch or PR ref if you want to inspect the pattern. Let me know if you want to hop on a 5-min huddle!"*

---

If you paste your teammate's exact question or code snippet here, I will draft a tailored, ready-to-send technical answer for you!`
      break
    }

    case 'offer_letter_analysis': {
      categoryTag = 'Offer & Contract Analysis'
      actionLinks = [
        { label: 'Offer Letter Analyzer', path: '/app/offer-letter-analyzer', icon: 'Mail' },
        { label: 'Compare Job Offers', path: '/app/compare-offers', icon: 'GitCompare' },
        { label: 'Job Switch Readiness', path: '/app/job-switch-readiness', icon: 'ArrowRightLeft' },
      ]

      const offerInfo = hasContext && activeOffer
        ? `\n> 📄 **Current Analyzed Offer:** **${activeOffer.companyName}** (${activeOffer.jobTitle}) — Safety Level: **${activeOffer.safetyLevel}**\n`
        : ''

      responseMarkdown = `### 📑 Offer Letter & Employment Terms Review

Evaluating an employment offer requires looking beyond the headline CTC or base salary number.

${offerInfo}
#### 🔍 The 6 Critical Clauses You Must Verify:
1. **Fixed vs. Variable Split:** Is the bonus discretionary, KPI-driven, or guaranteed? What is the payout cycle (quarterly vs annual)?
2. **Notice Period & Buyout Conditions:** Is the notice period 30, 60, or 90 days? Is there an employer-mandated buyout fee if you leave early?
3. **Non-Compete & Restrictive Covenants:** Does the contract restrict working in the same domain or geography for 6-12 months post-exit? (Often legally unenforceable in many jurisdictions, but creates friction).
4. **IP & Inventions Assignment:** Does the agreement claim ownership of personal side projects built outside work hours on personal hardware?
5. **Probation Period & Termination Terms:** What is the notice period *during* probation vs *after* confirmation?
6. **Relocation & Clawback Clauses:** If joining bonus or relocation assistance is provided, what is the clawback duration (usually 12-24 months)?

👉 **Next Step:** Upload your PDF or screenshot in the [Offer Letter Analyzer](/app/offer-letter-analyzer) for a 31-dimension clause-by-clause breakdown.`
      break
    }

    case 'hr_questions': {
      categoryTag = 'HR & Negotiation Strategy'
      actionLinks = [
        { label: 'HR Questions Trainer', path: '/app/hr-questions', icon: 'HelpCircle' },
        { label: 'Mock Interview Simulator', path: '/app/mock-interview', icon: 'MessageSquare' },
      ]

      responseMarkdown = `### 🤝 Strategic Questions to Ask HR / Recruiters

Asking sharp, structured questions signals executive maturity and helps uncover potential red flags early.

#### 1. Compensation & Evaluation Clarity
* *"How is variable compensation evaluated, and what percentage of the engineering team achieved their full bonus target last cycle?"*
* *"What is the standard appraisal and promotion cycle for this role, and what are the key performance indicators for the first 6 months?"*

#### 2. Team Culture & Work Environment
* *"What are the standard core working hours and expectations regarding on-call rotations or weekend deployments?"*
* *"What is the company policy on remote/hybrid flexibility, and has that policy changed over the last 12 months?"*

#### 3. Verification & Offer Formalities
* *"What third-party background check agency is used, and what specific documents are required prior to Day 1?"*
* *"Is the employment confirmation conditional upon specific client clearances or background verification sign-offs?"*

Would you like negotiation scripts for counter-offering on base salary, joining bonus, or notice period flexibility?`
      break
    }

    case 'work_pressure': {
      categoryTag = 'Work Pressure & Burnout Prevention'
      actionLinks = [
        { label: 'Work Pressure Manager', path: '/app/work-pressure', icon: 'AlertTriangle' },
        { label: 'Deadline Planner', path: '/app/deadline-planner', icon: 'Calendar' },
      ]

      responseMarkdown = `### 🛡️ Managing High Work Pressure & Preventing Burnout

Sustained engineering pressure leads to cognitive fatigue, increased bugs, and decision paralysis. Here is a tactical framework to regain control:

#### 1. The Engineering Cognitive Firewall
* **Protect the Golden 3 Hours:** Reserve your highest-energy 3-hour window daily strictly for deep coding without Slack or meetings.
* **Stop Async Multitasking:** Context switching consumes up to 20% of cognitive bandwidth per switch. Batch communication to 2 specific windows (e.g. 11:30 AM & 4:30 PM).

#### 2. Boundary Setting Script for Sudden Requests
> *"I understand this is high priority. Currently, my active capacity is fully allocated to [P0 Project]. If we need to pull in this new item today, which of the existing commitments should I push to next sprint?"*

#### 3. Recognize False Emergencies
90% of "urgent" requests are poor planning by upstream teams. Clarify business impact before sacrificing personal hours:
* *"What breaks for the customer if this deploys on Thursday instead of tonight?"*`
      break
    }

    case 'job_switch': {
      categoryTag = 'Job Transition & Switch Readiness'
      actionLinks = [
        { label: 'Job Switch Readiness Calculator', path: '/app/job-switch-readiness', icon: 'ArrowRightLeft' },
        { label: 'Resume Analyzer', path: '/app/resume-analyzer', icon: 'FileScan' },
      ]

      responseMarkdown = `### 🚀 Evidence-Based Job Switch Readiness

Switching jobs successfully requires synchronizing **Market Timing**, **Skill Alignment**, and **Financial Safety**.

#### 🔑 5-Point Transition Safety Checklist:
1. **Emergency Runway:** Minimum 4-6 months of living expenses liquid and accessible.
2. **Market Validation:** At least 2-3 interview pipelines active before submitting formal resignation.
3. **Notice Period Strategy:** Know your company's policy on buyout and early release negotiations.
4. **Proof of Work:** Updated portfolio/GitHub and 3 quantified impact bullet points on your resume.
5. **Signed Formal Offer:** Never resign on a verbal promise or email draft; ensure an unconditional written contract is received.

Check your complete [Job Switch Readiness Score](/app/job-switch-readiness) to review your personalized transition safety rating.`
      break
    }

    case 'resume_optimization': {
      categoryTag = 'Resume & ATS Optimization'
      actionLinks = [
        { label: 'Open Resume Analyzer', path: '/app/resume-analyzer', icon: 'FileScan' },
        { label: 'Resume Builder', path: '/app/resume-builder', icon: 'FileText' },
      ]

      responseMarkdown = `### 📄 High-Impact Resume Optimization (Google X-Y-Z Formula)

The most effective engineering resumes use the formula:
> **"Accomplished [X], as measured by [Y], by doing [Z]"**

#### ❌ Weak Example:
* *"Worked on React frontend performance and fixed slow API calls."*

#### ✅ High-Impact ATS Example:
* *"Reduced page load latency by **42%** (from 2.8s to 1.6s) across 500K+ monthly active users by implementing TanStack Query caching, code splitting, and memoized selector trees in **React & TypeScript**."*

#### 🎯 Key Sections to Audit:
1. **Action Verbs:** Led, Architected, Reduced, Accelerated, Engineered, Automated.
2. **Metrics:** Latency (ms), Throughput (RPS), Cost ($ savings), Test Coverage (%), Adoption Rate.
3. **Keyword Density:** Align technology names with top target job descriptions.

Upload your resume to [Resume Analyzer](/app/resume-analyzer) for a line-by-line ATS score!`
      break
    }

    case 'debugging': {
      categoryTag = 'Debugging & Systematic Problem Isolation'
      actionLinks = [
        { label: 'Project Assistant', path: '/app/project-assistant', icon: 'FolderKanban' },
      ]

      responseMarkdown = `### 🛠️ Systematic Debugging & Root-Cause Protocol

When a bug resists standard print statements, use the **Scientific Isolation Protocol**:

\`\`\`
[Observe Symptom] ──> [Formulate Hypothesis] ──> [Isolate Boundary] ──> [Reproduce in Test] ──> [Fix & Verify]
\`\`\`

#### 5-Step Isolation Checklist:
1. **Bisect State Changes:** Determine if the issue is deterministic (reproducible with exact input) or non-deterministic (concurrency / network race conditions).
2. **Check Payload Boundaries:** Validate serialization/deserialization at network boundaries (missing fields, unexpected nulls, date timezone conversions).
3. **Inspect Closures & Lifecycle:** In modern frameworks, check if stale props are locked inside callbacks or async closures.
4. **Environment Divergence:** Verify Node version, bundle tree differences, or environment variables between local vs production.
5. **Create a Minimal Reproduction (MRE):** Strip away 80% of adjacent code until only the failing 15 lines remain.

Paste the error message or stack trace here and I will dissect the root cause with you!`
      break
    }

    default: {
      categoryTag = 'Career Strategy'
      actionLinks = [
        { label: 'Technology Roadmap', path: '/app/technology-roadmap', icon: 'Map' },
        { label: 'Interview Preparation', path: '/app/interview-preparation', icon: 'MicVocal' },
        { label: 'Dashboard', path: '/app/dashboard', icon: 'BarChart3' },
      ]

      responseMarkdown = `### 💡 AI Career Assistant Insight

Hello ${hasContext ? userName : 'there'}! I am your unified career decision-support companion. 

${hasContext ? `> 🎯 *Currently synchronized with your profile: **${targetGoal}** track | Stack: **${currentStack.join(', ')}***` : ''}

I can assist you immediately with:
* **Current Job & Workplace:** Navigating team dynamics, high workload, and manager conversations.
* **Urgent Deadlines:** Triage frameworks and emergency scope management.
* **Practice & Learning:** Diagnostic assessments, 1-hour practice routines, and roadmap progression.
* **Interview & Negotiation:** Technical STAR answers, HR questions, and compensation breakdowns.
* **Offer Letters:** 31-dimension risk analysis and contract safety scores.

What challenge are you tackling today? Select a quick prompt below or type your question directly!`
      break
    }
  }

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender: 'assistant',
    text: responseMarkdown,
    category: categoryTag,
    actionLinks,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    contextUsed: hasContext,
  }
}
