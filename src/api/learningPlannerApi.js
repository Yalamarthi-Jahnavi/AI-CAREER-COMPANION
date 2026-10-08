/**
 * Learning Planner API & Roadmap Generator Engine
 * Generates structured, personalized learning roadmaps across 7 stages:
 * FOUNDATION -> CORE CONCEPTS -> INTERMEDIATE -> ADVANCED -> PROJECTS -> PRACTICE -> INTERVIEW PREPARATION
 *
 * CRITICAL RULE:
 * Timetable strictly respects user's daily hours (never generates 4h for a 1h user).
 */

export const KNOWLEDGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', timeRange: '6:00 AM – 7:30 AM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', timeRange: '1:00 PM – 2:30 PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', timeRange: '6:30 PM – 8:00 PM', icon: '🌆' },
  { id: 'night', label: 'Night', timeRange: '9:30 PM – 11:00 PM', icon: '🌙' },
  { id: 'weekends', label: 'Weekends', timeRange: 'Saturday & Sunday (Flexible)', icon: '📅' },
]

export const ROADMAP_STAGES = [
  { id: 'foundation', label: 'Foundation', description: 'Syntax, environment, tooling & basics' },
  { id: 'core', label: 'Core Concepts', description: 'Primary architecture, idioms & data flow' },
  { id: 'intermediate', label: 'Intermediate', description: 'Concurrency, state, APIs & integrations' },
  { id: 'advanced', label: 'Advanced', description: 'Performance, internals, security & scaling' },
  { id: 'projects', label: 'Projects', description: 'Production-grade portfolio builds' },
  { id: 'practice', label: 'Practice', description: 'Targeted code challenges & algorithmic drills' },
  { id: 'interview', label: 'Interview Prep', description: 'System design, behavioral & live coding' },
]

/**
 * Stage content blueprints by technology
 */
const TECH_BLUEPRINTS = {
  python: {
    name: 'Python',
    color: '#38bdf8',
    topics: {
      foundation: ['Language Syntax & Data Types', 'Control Flow & Functions', 'Virtual Environments & Poetry'],
      core: ['OOP & Class Architecture', 'File I/O & Exception Handling', 'Iterators, Generators & Comprehensions'],
      intermediate: ['AsyncIO & Event Loops', 'Decorators & Context Managers', 'FastAPI & Relational ORMs'],
      advanced: ['GIL Internals & CPython C-extensions', 'Memory Profiling & GC Tuning', 'Metaprogramming & Typing'],
      projects: ['Async Web Scraper & Pipeline', 'High-throughput REST API with Redis', 'Real-time Event Streaming Worker'],
      practice: ['LeetCode Top 75 Python Solutions', 'Data Structures Implementation', 'Concurrency Bug Hunting'],
      interview: ['GIL mechanics & Multiprocessing tradeoffs', 'Python 3.12+ features & Perf', 'System Design with Python Services'],
    },
  },
  react: {
    name: 'React',
    color: '#60a5fa',
    topics: {
      foundation: ['JSX Syntax & Component Tree', 'Props vs State & Event Handling', 'Vite / Next.js Setup'],
      core: ['Hooks (useState, useEffect, useRef)', 'Conditional Rendering & Lists', 'Context API & Composition'],
      intermediate: ['Custom Hooks & Component Patterns', 'TanStack Query & Data Fetching', 'React 19 Actions & Forms'],
      advanced: ['Fiber Reconciliation & Concurrent Mode', 'Server Components (RSC) Architecture', 'Rendering Optimization & Profiler'],
      projects: ['Full-stack SaaS Dashboard', 'Real-time Multiplayer Collaboration Canvas', 'E-commerce with Optimistic Updates'],
      practice: ['React Component Design Challenges', 'State Machine Implementations', 'Performance Refactoring Drills'],
      interview: ['Fiber Tree vs Virtual DOM', 'Server Actions security & cache invalidation', 'System Design for Frontend Scale'],
    },
  },
  docker: {
    name: 'Docker',
    color: '#0ea5e9',
    topics: {
      foundation: ['Containers vs Virtual Machines', 'CLI Commands (run, build, stop)', 'Docker Hub & Base Images'],
      core: ['Dockerfile Syntax & Instructions', 'Image Layering & Caching', 'Port Forwarding & Volumes'],
      intermediate: ['Multi-stage Builds for Tiny Images', 'Docker Compose for Multi-service', 'Custom Bridge & Overlay Networks'],
      advanced: ['Rootless Containers & Security Scanning', 'cgroups & Kernel Namespaces', 'Container Healthchecks & Daemon Tuning'],
      projects: ['Production Microservice Compose Stack', 'CI/CD Containerized Build Pipeline', 'Observability Stack (Prometheus/Grafana)'],
      practice: ['Dockerfile Optimization Quizzes', 'Compose Networking Debugging', 'Vulnerability Remediation Drills'],
      interview: ['How Docker works under the hood (namespaces)', 'Layer caching invalidation rules', 'Docker security best practices'],
    },
  },
  sql: {
    name: 'SQL',
    color: '#a855f7',
    topics: {
      foundation: ['Relational Model & Schemas', 'SELECT, WHERE, ORDER BY, LIMIT', 'Aggregate Functions & GROUP BY'],
      core: ['INNER, LEFT, RIGHT, FULL OUTER JOINs', 'Subqueries & Common Table Expressions (CTEs)', 'Data Modification (INSERT, UPDATE, DELETE)'],
      intermediate: ['Window Functions (ROW_NUMBER, RANK, DENSE_RANK)', 'B-Tree & Hash Indexing', 'Transactions & ACID Guarantees'],
      advanced: ['Query Planner (EXPLAIN ANALYZE)', 'Partitioning & Sharding Strategies', 'Concurrency Control & Deadlock Prevention'],
      projects: ['Double-entry Financial Ledger Database', 'E-commerce Inventory Schema with Optimistic Locking', 'Real-time Analytics Reporting Store'],
      practice: ['LeetCode SQL 50 Challenges', 'Complex Aggregation Drills', 'Query Optimization Tuning Lab'],
      interview: ['Index structure & Index scans vs Sequential scans', 'Transaction Isolation Levels & Anomalies', 'Database Sharding vs Replication'],
    },
  },
  default: {
    name: 'Technology',
    color: '#6366f1',
    topics: {
      foundation: ['Syntax & Environment Setup', 'Basic Paradigms & Data Structures', 'Tooling, CLI & Package Manager'],
      core: ['Core Architecture & Principles', 'Standard Libraries & Best Practices', 'Error Handling & Validation'],
      intermediate: ['API Integration & Concurrency', 'State Management & Storage', 'Testing Frameworks & Modularity'],
      advanced: ['Performance Tuning & Profiling', 'Internal Engine & Deep Architecture', 'Security Guardrails & Hardening'],
      projects: ['Modular Production Service', 'High-throughput Pipeline Build', 'Full-stack Integrated Portfolio App'],
      practice: ['Algorithmic Drills & Coding Quizzes', 'Refactoring & Bug Fix Labs', 'Timed Assessment Tests'],
      interview: ['Core Architectural Decisions', 'Tradeoffs & Edge Cases', 'System Design & Scalability Patterns'],
    },
  },
}

/**
 * Generate personalized schedule respecting exact daily time constraint
 */
export function generatePersonalizedRoadmap({
  technology = 'React',
  level = 'Intermediate',
  freeTimeSlots = ['evening'],
  dailyHours = 1.5,
  targetCareer = 'AI Engineer',
  durationDays = 90,
}) {
  const techKey = technology.toLowerCase().replace(/[^a-z]/g, '')
  const blueprint = TECH_BLUEPRINTS[techKey] || {
    ...TECH_BLUEPRINTS.default,
    name: technology,
  }

  // Calculate realistic task durations that fit exactly into dailyHours
  const totalDailyMinutes = Math.round(dailyHours * 60)
  const studyMinutes = Math.round(totalDailyMinutes * 0.55) // ~55% learning
  const practiceMinutes = Math.round(totalDailyMinutes * 0.3) // ~30% practice
  const revisionMinutes = totalDailyMinutes - studyMinutes - practiceMinutes // ~15% recap

  const slotLabel = freeTimeSlots
    .map((s) => TIME_SLOTS.find((t) => t.id === s)?.timeRange || s)
    .join(', ')

  const weeksCount = Math.round(durationDays / 7)
  const scheduleWeeks = []

  // Assign stages across weeks proportionally
  const stageWeights = {
    foundation: level === 'Beginner' ? 0.2 : 0.08,
    core: level === 'Beginner' ? 0.22 : 0.15,
    intermediate: 0.2,
    advanced: 0.18,
    projects: 0.15,
    practice: 0.1,
    interview: 0.09,
  }

  let currentWeekNum = 1

  ROADMAP_STAGES.forEach((stage) => {
    const stageAllocatedWeeks = Math.max(1, Math.round(weeksCount * (stageWeights[stage.id] || 0.14)))
    const stageTopics = blueprint.topics[stage.id] || blueprint.topics.core

    for (let w = 0; w < stageAllocatedWeeks && currentWeekNum <= weeksCount; w++) {
      const topicIndex = w % stageTopics.length
      const topicName = stageTopics[topicIndex]

      const days = []
      // 5 active study days per week + 1 project/test day + 1 rest/buffer day
      for (let d = 1; d <= 5; d++) {
        const dayNumber = (currentWeekNum - 1) * 7 + d
        if (dayNumber > durationDays) break

        days.push({
          id: `day-${dayNumber}`,
          dayNumber,
          date: `Day ${dayNumber}`,
          topic: `${topicName} — Part ${d}`,
          stage: stage.label,
          stageId: stage.id,
          timeSlot: slotLabel,
          learningDuration: `${studyMinutes} min`,
          practiceDuration: `${practiceMinutes} min`,
          practice: `Hands-on exercise: Implement ${topicName} pattern`,
          miniTask: `Code snippet: write 3 test cases for ${topicName}`,
          projectTask: `Integrate ${topicName} into ${targetCareer} project module`,
          revision: `5-minute flash recap of yesterday's concepts (${revisionMinutes} min)`,
          test: d === 5 ? `Weekly Assessment Quiz (15 questions)` : null,
          totalDailyHours: `${dailyHours} hr`,
          completed: dayNumber <= 7, // Demo: first week marked completed
          skipped: false,
          rescheduledDate: null,
          notes: '',
        })
      }

      scheduleWeeks.push({
        weekNumber: currentWeekNum,
        stage: stage.label,
        stageId: stage.id,
        stageDescription: stage.description,
        primaryTopic: topicName,
        days,
      })

      currentWeekNum++
    }
  })

  // Flatten days for linear tracking
  const allDays = scheduleWeeks.flatMap((w) => w.days)
  const completedCount = allDays.filter((d) => d.completed).length
  const progressPercentage = Math.round((completedCount / (allDays.length || 1)) * 100)

  return {
    technology: blueprint.name,
    color: blueprint.color,
    level,
    targetCareer,
    durationDays,
    dailyHours,
    freeTimeSlots,
    slotLabel,
    totalPlannedHours: Math.round(allDays.length * dailyHours),
    completedHours: Math.round(completedCount * dailyHours),
    totalTasks: allDays.length,
    completedTasks: completedCount,
    progressPercentage,
    currentStageId: allDays.find((d) => !d.completed)?.stageId || 'foundation',
    stages: ROADMAP_STAGES,
    weeks: scheduleWeeks,
    days: allDays,
  }
}

/**
 * Fetch or generate roadmap via API
 */
export async function fetchUserRoadmap(config) {
  await new Promise((r) => setTimeout(r, 350))

  const saved = localStorage.getItem(`roadmap_${config.technology}_${config.durationDays}`)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      // fallback
    }
  }

  const generated = generatePersonalizedRoadmap(config)
  localStorage.setItem(`roadmap_${config.technology}_${config.durationDays}`, JSON.stringify(generated))
  return generated
}

/**
 * Persist roadmap state changes
 */
export async function saveRoadmapState(roadmap) {
  await new Promise((r) => setTimeout(r, 100))
  localStorage.setItem(`roadmap_${roadmap.technology}_${roadmap.durationDays}`, JSON.stringify(roadmap))
  return roadmap
}
