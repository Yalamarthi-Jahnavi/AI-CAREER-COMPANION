import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Trash2,
  Play,
  BookOpen,
  Map,
  CheckCircle2,
  Clock,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Check,
  Circle,
} from 'lucide-react'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { TechDetailModal } from '../components/Roadmap/TechDetailModal'
import { AddTechModal } from '../components/Roadmap/AddTechModal'
import { PracticeTestModal } from '../components/Dashboard/PracticeTestModal'
import toast from 'react-hot-toast'

// ── Interactive Career Tracks for the Workable Roadmap ──────────
const CAREER_TRACKS = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    icon: '⚛️',
    description: 'Master modern responsive interfaces, component architectures, and web performance.',
    phases: [
      {
        phaseName: 'Phase 1: Foundations & Semantics',
        duration: 'Weeks 1–3',
        milestones: [
          { id: 'fe-1', title: 'HTML5 Semantic Structure & Web Accessibility (WCAG)', tech: 'HTML/CSS', done: true },
          { id: 'fe-2', title: 'Modern CSS3, Flexbox, Grid, & Responsive Layouts', tech: 'CSS3', done: true },
          { id: 'fe-3', title: 'JavaScript ES6+ Syntax, Scopes, Closures, & Event Loop', tech: 'JavaScript', done: true },
        ],
      },
      {
        phaseName: 'Phase 2: Modern Framework & Tooling',
        duration: 'Weeks 4–7',
        milestones: [
          { id: 'fe-4', title: 'React 19 Hooks, Component Lifecycle, & Context API', tech: 'React', done: true },
          { id: 'fe-5', title: 'TypeScript for Type-Safe Component Contracts', tech: 'TypeScript', done: false },
          { id: 'fe-6', title: 'TailwindCSS Design Systems & Component Tokens', tech: 'TailwindCSS', done: true },
        ],
      },
      {
        phaseName: 'Phase 3: State & Architecture',
        duration: 'Weeks 8–10',
        milestones: [
          { id: 'fe-7', title: 'Global State Management (Zustand / Redux Toolkit)', tech: 'Zustand', done: false },
          { id: 'fe-8', title: 'Data Fetching & Cache Synchronization (TanStack Query)', tech: 'React Query', done: false },
          { id: 'fe-9', title: 'Next.js App Router, SSR, & Server Components', tech: 'Next.js', done: false },
        ],
      },
      {
        phaseName: 'Phase 4: Testing & Production Optimization',
        duration: 'Weeks 11–12',
        milestones: [
          { id: 'fe-10', title: 'Unit & Integration Testing with Vitest & React Testing Library', tech: 'Vitest', done: false },
          { id: 'fe-11', title: 'Core Web Vitals Profiling (LCP, INP, CLS)', tech: 'Performance', done: false },
        ],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Systems Architect',
    icon: '🛡️',
    description: 'Architect scalable distributed APIs, reliable database models, and async workers.',
    phases: [
      {
        phaseName: 'Phase 1: Backend Language Core',
        duration: 'Weeks 1–3',
        milestones: [
          { id: 'be-1', title: 'Python AsyncIO / Node.js Runtime Architecture', tech: 'Python', done: true },
          { id: 'be-2', title: 'OOP Principles, Clean Architecture & SOLID Patterns', tech: 'Software Design', done: true },
        ],
      },
      {
        phaseName: 'Phase 2: Relational & Document Data Stores',
        duration: 'Weeks 4–6',
        milestones: [
          { id: 'be-3', title: 'PostgreSQL Indexing, Query Plans & Transactions (ACID)', tech: 'SQL', done: true },
          { id: 'be-4', title: 'Redis In-Memory Caching & Distributed Locks', tech: 'Redis', done: false },
        ],
      },
      {
        phaseName: 'Phase 3: Microservice APIs & Message Brokers',
        duration: 'Weeks 7–9',
        milestones: [
          { id: 'be-5', title: 'RESTful API & GraphQL Service Contracts', tech: 'FastAPI', done: false },
          { id: 'be-6', title: 'Event-Driven Architectures with Apache Kafka & RabbitMQ', tech: 'Kafka', done: false },
        ],
      },
      {
        phaseName: 'Phase 4: Security & Container Deployment',
        duration: 'Weeks 10–12',
        milestones: [
          { id: 'be-7', title: 'Docker Containerization & Multi-Stage Builds', tech: 'Docker', done: false },
          { id: 'be-8', title: 'OAuth2, JWT Authentication & API Rate Limiting', tech: 'Security', done: false },
        ],
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Specialist',
    icon: '🧠',
    description: 'Train models, fine-tune LLMs, engineer RAG pipelines, and deploy MLOps systems.',
    phases: [
      {
        phaseName: 'Phase 1: Numerical Foundations & Data Prep',
        duration: 'Weeks 1–3',
        milestones: [
          { id: 'ai-1', title: 'Advanced Python, NumPy Arrays & Vectorized Math', tech: 'Python', done: true },
          { id: 'ai-2', title: 'Pandas Data Wrangling, Cleaning & EDA Pipelines', tech: 'Pandas', done: true },
        ],
      },
      {
        phaseName: 'Phase 2: Classical ML & Deep Learning',
        duration: 'Weeks 4–7',
        milestones: [
          { id: 'ai-3', title: 'Scikit-Learn Classification, Regression & Cross-Validation', tech: 'ML', done: false },
          { id: 'ai-4', title: 'PyTorch Tensors, Autograd & Neural Network Layers', tech: 'PyTorch', done: false },
        ],
      },
      {
        phaseName: 'Phase 3: GenAI, LLMs & Vector Search',
        duration: 'Weeks 8–10',
        milestones: [
          { id: 'ai-5', title: 'Hugging Face Transformers & Embedding Vectors', tech: 'Transformers', done: false },
          { id: 'ai-6', title: 'Retrieval Augmented Generation (RAG) with Pinecone/Chroma', tech: 'LangChain', done: false },
        ],
      },
      {
        phaseName: 'Phase 4: Production MLOps',
        duration: 'Weeks 11–12',
        milestones: [
          { id: 'ai-7', title: 'FastAPI Model Serving & Quantization (vLLM / ONNX)', tech: 'MLOps', done: false },
          { id: 'ai-8', title: 'Model Monitoring, Drift Detection & CI/CD Pipelines', tech: 'Docker', done: false },
        ],
      },
    ],
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps Architect',
    icon: '☁️',
    description: 'Automate deployments, orchestrate Kubernetes clusters, and manage infrastructure as code.',
    phases: [
      {
        phaseName: 'Phase 1: Linux & Networking Fundamentals',
        duration: 'Weeks 1–3',
        milestones: [
          { id: 'do-1', title: 'Linux Bash Scripting, Permissions, & Systemd Daemons', tech: 'Linux', done: true },
          { id: 'do-2', title: 'TCP/IP, DNS, SSL/TLS, & HTTP Reverse Proxies', tech: 'Networking', done: true },
        ],
      },
      {
        phaseName: 'Phase 2: Containers & CI/CD Pipelines',
        duration: 'Weeks 4–6',
        milestones: [
          { id: 'do-3', title: 'Docker Orchestration, Networks & Multi-Stage Builds', tech: 'Docker', done: true },
          { id: 'do-4', title: 'GitHub Actions / GitLab CI Automated Test & Deploy Pipelines', tech: 'CI/CD', done: false },
        ],
      },
      {
        phaseName: 'Phase 3: Cloud Infrastructure & Kubernetes',
        duration: 'Weeks 7–10',
        milestones: [
          { id: 'do-5', title: 'Terraform Infrastructure as Code (IaC) Modules', tech: 'Terraform', done: false },
          { id: 'do-6', title: 'Kubernetes Pods, Deployments, Ingress & Helm Charts', tech: 'Kubernetes', done: false },
        ],
      },
      {
        phaseName: 'Phase 4: Observability & SRE',
        duration: 'Weeks 11–12',
        milestones: [
          { id: 'do-7', title: 'Prometheus Metrics & Grafana Dashboards', tech: 'Observability', done: false },
          { id: 'do-8', title: 'Log Aggregation with ELK/Loki & Incident Playbooks', tech: 'SRE', done: false },
        ],
      },
    ],
  },
]

export function TechnologyRoadmap() {
  const navigate = useNavigate()
  const {
    categories,
    relevanceFilters,
    technologies,
    myCurrentTechnologies,
    selectedCategory,
    selectedRelevance,
    searchQuery,
    loadRoadmap,
    setCategory,
    setRelevance,
    setSearchQuery,
    removeCurrentTech,
    activeTechDetail,
    openTechDetail,
    closeTechDetail,
    activePracticeModal,
    openPracticeModal,
    closePracticeModal,
    isAddTechModalOpen,
    openAddTechModal,
    closeAddTechModal,
  } = useRoadmapStore()

  // Active view toggle: 'interactive' (workable roadmap) | 'mystack' (practice cards) | 'directory' (all 30+ techs)
  const [activeView, setActiveView] = useState('interactive')

  // Selected career track for Interactive Roadmap
  const [selectedTrackId, setSelectedTrackId] = useState('frontend')

  // Local interactive milestone states
  const [trackMilestones, setTrackMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem('career_roadmap_milestones')
      if (saved) return JSON.parse(saved)
    } catch {}
    // Initial defaults from CAREER_TRACKS
    const initial = {}
    CAREER_TRACKS.forEach((track) => {
      track.phases.forEach((p) => {
        p.milestones.forEach((m) => {
          initial[m.id] = m.done
        })
      })
    })
    return initial
  })

  useEffect(() => {
    loadRoadmap()
  }, [loadRoadmap])

  const toggleMilestone = (mId) => {
    setTrackMilestones((prev) => {
      const nextState = !prev[mId]
      const updated = { ...prev, [mId]: nextState }
      try {
        localStorage.setItem('career_roadmap_milestones', JSON.stringify(updated))
      } catch {}
      if (nextState) {
        toast.success('Milestone achieved! Track progress updated 🎉')
      }
      return updated
    })
  }

  const activeTrack = CAREER_TRACKS.find((t) => t.id === selectedTrackId) || CAREER_TRACKS[0]

  // Calculate track progress
  const allTrackMilestones = activeTrack.phases.flatMap((p) => p.milestones)
  const completedTrackCount = allTrackMilestones.filter((m) => trackMilestones[m.id]).length
  const trackProgressPercent = Math.round((completedTrackCount / (allTrackMilestones.length || 1)) * 100)

  // Filter technologies for Directory
  const filteredTechnologies = technologies.filter((tech) => {
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory
    const matchesRelevance =
      selectedRelevance === 'All Relevance' || tech.relevance?.status === selectedRelevance
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.skillsRequired?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesRelevance && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-800 font-sans">
      {/* ─── Hero Banner with Dashboard Aesthetics ──────────────── */}
      <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-100/60 border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Map className="w-4.5 h-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              Workable Career Pathways
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Technology Roadmap & Skill Matrix
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
            Follow verified step-by-step career trajectories, calibrate hands-on practice, and monitor industry demand across software engineering disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap relative z-10">
          <button
            onClick={openAddTechModal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Technology</span>
          </button>
          <button
            onClick={() => openPracticeModal()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start Practice Test</span>
          </button>
        </div>
      </div>

      {/* ─── Top View Switcher Navigation ───────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'interactive', label: '🗺️ Interactive Career Roadmaps', count: `${trackProgressPercent}% Complete` },
            { id: 'mystack', label: '⚡ My Practice Stack', count: `${myCurrentTechnologies.length} Active` },
            { id: 'directory', label: '🔍 Market Demand Directory', count: `${technologies.length} Technologies` },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === view.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <span>{view.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeView === view.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {view.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/app/learning-planner')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          <span>Open 30-Day Learning Planner</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          VIEW 1: WORKABLE INTERACTIVE CAREER ROADMAP (Default)
          ═══════════════════════════════════════════════════════════ */}
      {activeView === 'interactive' && (
        <section className="space-y-6">
          {/* Career Track Selector Pills */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Select Target Specialization Track</span>
                <span className="text-[11px] text-slate-500">
                  Step-by-step milestones curated by principal architects & hiring managers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Track Mastery:</span>
                <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {trackProgressPercent}% Completed ({completedTrackCount}/{allTrackMilestones.length})
                </span>
              </div>
            </div>

            {/* Track Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {CAREER_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTrackId === track.id
                      ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500/40 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{track.icon}</span>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{track.title}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{track.description}</p>
                </button>
              ))}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60 mt-2">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${trackProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Sequential Roadmap Phases */}
          <div className="space-y-6">
            {activeTrack.phases.map((phase, pIdx) => {
              const phaseMilestones = phase.milestones
              const phaseDoneCount = phaseMilestones.filter((m) => trackMilestones[m.id]).length
              const phaseDone = phaseDoneCount === phaseMilestones.length

              return (
                <div
                  key={pIdx}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          phaseDone
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-blue-50 border border-blue-100 text-blue-700'
                        }`}
                      >
                        {phaseDone ? <Check className="w-4 h-4 stroke-[3]" /> : `0${pIdx + 1}`}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm md:text-base">
                          {phase.phaseName}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Estimated timeline: {phase.duration} • {phaseDoneCount} of {phaseMilestones.length} Milestones Achieved
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        phaseDone
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {Math.round((phaseDoneCount / (phaseMilestones.length || 1)) * 100)}% Complete
                    </span>
                  </div>

                  {/* Milestones inside Phase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {phaseMilestones.map((m) => {
                      const isCompleted = trackMilestones[m.id]

                      return (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                            isCompleted
                              ? 'bg-emerald-50/30 border-emerald-200/80 shadow-2xs'
                              : 'bg-slate-50/70 border-slate-200/90 hover:border-blue-300 hover:bg-white shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                {m.tech}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleMilestone(m.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                                }`}
                              >
                                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <Circle className="w-3 h-3" />}
                                <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                              </button>
                            </div>

                            <h4
                              className={`text-xs font-bold leading-relaxed ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {m.title}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                const found = technologies.find(
                                  (t) => t.name.toLowerCase() === m.tech.toLowerCase()
                                )
                                if (found) openTechDetail(found)
                                else openPracticeModal({ id: m.tech.toLowerCase(), name: m.tech })
                              }}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <span>Explore Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => {
                                openPracticeModal({ id: m.tech.toLowerCase(), name: m.tech })
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                            >
                              <Play className="w-2.5 h-2.5" />
                              <span>Quiz</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VIEW 2: MY PRACTICE STACK ("Current Technology Practice")
          ═══════════════════════════════════════════════════════════ */}
      {activeView === 'mystack' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xl font-bold text-slate-900">Active Practice Stack</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 border border-blue-200 text-blue-700">
                  {myCurrentTechnologies.length} Technologies
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Technologies currently in your daily hands-on practice curriculum. Complete test drills to level up.
              </p>
            </div>

            <button
              onClick={openAddTechModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Technology</span>
            </button>
          </div>

          {/* Cards Grid */}
          {myCurrentTechnologies.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Flame className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No active practice technologies yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Add technologies from the Market Demand directory to begin tracking test scores and progress.
              </p>
              <button
                onClick={openAddTechModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Browse Technologies
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {myCurrentTechnologies.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Top line with tech name, category, and remove icon */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs border"
                          style={{
                            backgroundColor: `${item.color}15`,
                            borderColor: `${item.color}30`,
                            color: item.color,
                          }}
                        >
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-[11px] text-slate-400">{item.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeCurrentTech(item.id)}
                        title="Remove technology"
                        className="text-slate-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Level & Stars */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">{item.currentLevel}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            fill={i < item.starsEarned ? 'currentColor' : 'none'}
                            stroke="currentColor"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Mastery Progress</span>
                        <span className="font-bold text-slate-800">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>

                    {/* Stats Box */}
                    <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Score</span>
                        <span className="text-xs font-black text-slate-900">{item.practiceScore}/100</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tests</span>
                        <span className="text-xs font-black text-slate-900">{item.testsCompleted}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Best</span>
                        <span className="text-xs font-black text-emerald-600">{item.bestScore}%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-4">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Last test: <strong className="text-slate-700">{item.lastTest}</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openPracticeModal({ id: item.id, name: item.name })}
                        className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                      >
                        <Play className="w-3 h-3" />
                        <span>Practice</span>
                      </button>
                      <button
                        onClick={() => navigate(`/app/learning-planner?tech=${encodeURIComponent(item.name)}`)}
                        className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span>Plan</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const match = technologies.find(
                          (t) => t.id === item.id || t.name.toLowerCase() === item.name.toLowerCase()
                        )
                        if (match) openTechDetail(match)
                        else toast.success('Roadmap detail view')
                      }}
                      className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Map className="w-3 h-3 text-slate-500" />
                      <span>View Roadmap</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VIEW 3: MARKET DEMAND DIRECTORY (All 30+ Technologies)
          ═══════════════════════════════════════════════════════════ */}
      {activeView === 'directory' && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Industry Demand & Technology Catalog
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Prerequisite maps, interview questions, and verified demand metrics across 10 engineering domains.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by technology or skill..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="bg-white border border-slate-200/90 p-4 rounded-3xl space-y-3 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Domain Categories
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Relevance Status Filter */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Relevance:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {relevanceFilters.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => setRelevance(rel)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                        selectedRelevance === rel
                          ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-800">{filteredTechnologies.length}</strong> technologies
              </span>
            </div>
          </div>

          {/* Cards Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTechnologies.map((tech) => {
              const isInPractice = myCurrentTechnologies.some(
                (t) => t.id === tech.id || t.name.toLowerCase() === tech.name.toLowerCase()
              )

              return (
                <div
                  key={tech.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs border"
                          style={{
                            backgroundColor: `${tech.color}15`,
                            borderColor: `${tech.color}30`,
                            color: tech.color,
                          }}
                        >
                          {tech.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {tech.name}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 border border-slate-200 text-slate-600">
                              {tech.level}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{tech.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-1 justify-end">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          {tech.relevance?.score}
                          <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 block">
                          {tech.relevance?.growth}
                        </span>
                      </div>
                    </div>

                    {/* Status Tag */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 border border-blue-200 text-blue-700">
                        {tech.relevance?.status}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        {tech.relevance?.openings}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {tech.careerRelevance}
                    </p>

                    {/* Prerequisites */}
                    <div className="mb-3 text-[11px]">
                      <span className="font-bold text-slate-500 block mb-1">Prerequisites:</span>
                      <div className="flex flex-wrap gap-1">
                        {tech.prerequisites?.slice(0, 2).map((prereq) => (
                          <span
                            key={prereq}
                            className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[10px]"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills required */}
                    <div className="mb-3 text-[11px]">
                      <span className="font-bold text-slate-500 block mb-1">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {tech.skillsRequired?.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[10px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openTechDetail(tech)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>View Roadmap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      {isInPractice ? (
                        <span className="text-[11px] font-bold text-emerald-700 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stack
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const { addCurrentTech } = useRoadmapStore.getState()
                            addCurrentTech(tech)
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-blue-600" />
                          <span>Add to Stack</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── Deep Dive Tech Detail Modal ──────────────────────────── */}
      <TechDetailModal
        tech={activeTechDetail}
        isOpen={Boolean(activeTechDetail)}
        onClose={closeTechDetail}
      />

      {/* ─── Add Technology Modal ─────────────────────────────────── */}
      <AddTechModal
        isOpen={isAddTechModalOpen}
        onClose={closeAddTechModal}
      />

      {/* ─── Practice Test Modal ──────────────────────────────────── */}
      <PracticeTestModal
        isOpen={Boolean(activePracticeModal)}
        onClose={closePracticeModal}
        initialTech={activePracticeModal}
      />
    </div>
  )
}
