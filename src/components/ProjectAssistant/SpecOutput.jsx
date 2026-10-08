import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Target,
  Layers,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Workflow,
  Database,
  Globe,
  Layout,
  Server,
  Sparkles,
  TestTube,
  Rocket,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { TimetableView } from './TimetableView'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'
import toast from 'react-hot-toast'

export function SpecOutput() {
  const { spec, activeTab, setActiveTab, resetIntake, openChat } = useProjectAssistantStore()
  const [copied, setCopied] = useState(false)

  if (!spec) return null

  const tabs = [
    { id: 'problem', label: 'Problem Statement', icon: FileText },
    { id: 'objectives', label: 'Objectives', icon: Target },
    { id: 'features', label: 'Features', icon: Layers },
    { id: 'functional', label: 'Functional Req.', icon: CheckCircle2 },
    { id: 'nonfunctional', label: 'Non-Functional Req.', icon: ShieldAlert },
    { id: 'techstack', label: 'Technology Stack', icon: Cpu },
    { id: 'architecture', label: 'Architecture', icon: Workflow },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API Design', icon: Globe },
    { id: 'frontend', label: 'Frontend Pages', icon: Layout },
    { id: 'backend', label: 'Backend Modules', icon: Server },
    { id: 'ai', label: 'AI Integration', icon: Sparkles },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'deployment', label: 'Deployment', icon: Rocket },
    { id: 'timetable', label: 'Development Timetable', icon: Calendar, highlight: true },
  ]

  const copySpecJson = () => {
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2))
    setCopied(true)
    toast.success('Project specification copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Banner - Dashboard Look */}
      <div className="bg-white border border-slate-200/90 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {spec.overview.projectName}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {spec.overview.skillLevel} Developer
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {spec.overview.teamType}
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {spec.overview.ideaSummary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={resetIntake}
            icon={<RotateCcw className="w-4 h-4" />}
            className="border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            New Project
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={copySpecJson}
            icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            className="border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {copied ? 'Copied!' : 'Export Spec JSON'}
          </Button>
          <Button
            size="sm"
            onClick={openChat}
            icon={<MessageSquare className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
          >
            Ask Technical AI
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : tab.highlight
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-700' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content Box */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-slate-200/90 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs min-h-[400px]"
      >
        {/* 1. Problem Statement */}
        {activeTab === 'problem' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. Problem Statement
            </h3>
            <div className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {spec.problemStatement}
            </div>
          </div>
        )}

        {/* 2. Objectives */}
        {activeTab === 'objectives' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              2. Core Objectives
            </h3>
            <div className="space-y-3">
              {spec.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Features */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              3. Key Features Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.features.map((f, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Functional Requirements */}
        {activeTab === 'functional' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              4. Functional Requirements
            </h3>
            <div className="space-y-2.5">
              {spec.functionalRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-blue-200">
                    FR{i + 1}
                  </span>
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Non-functional Requirements */}
        {activeTab === 'nonfunctional' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-sky-600" />
              5. Non-Functional Requirements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spec.nonFunctionalRequirements.map((item, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{item.aspect}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Technology Stack */}
        {activeTab === 'techstack' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              6. Technology Stack Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(spec.technologyStack).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-600" />
              7. System Architecture
            </h3>
            <p className="text-xs text-slate-600 font-medium">{spec.architecture.pattern}</p>
            <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-5 rounded-2xl border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed shadow-xs">
              {spec.architecture.diagram}
            </div>
          </div>
        )}

        {/* 8. Database */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              8. Database Schema Design
            </h3>
            <p className="text-xs text-slate-600">{spec.database.schemaSummary}</p>
            <div className="space-y-3">
              {spec.database.tables.map((tbl, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-blue-700 text-sm font-mono">{tbl.name}</span>
                  <span className="text-xs font-mono text-slate-600">{tbl.fields}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. API Design */}
        {activeTab === 'api' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-600" />
              9. RESTful API Endpoints
            </h3>
            <div className="space-y-3">
              {spec.apiDesign.map((api, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] border ${
                      api.method === 'POST' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      api.method === 'GET' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {api.method}
                    </span>
                    <span className="text-slate-900 font-bold">{api.path}</span>
                  </div>
                  <span className="text-xs text-slate-600">{api.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. Frontend Pages */}
        {activeTab === 'frontend' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-600" />
              10. Frontend Application Views
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.frontendPages.map((pg, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{pg.name}</span>
                    <span className="text-[11px] font-mono text-blue-600 font-semibold">{pg.route}</span>
                  </div>
                  <p className="text-xs text-slate-600">{pg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. Backend Modules */}
        {activeTab === 'backend' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              11. Backend Service Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.backendModules.map((mod, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 text-sm font-mono">{mod.module}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{mod.responsibility}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. AI Integration */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              12. AI Integration Strategy
            </h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">System Prompt Persona Context</span>
              <p className="text-xs font-mono text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                {spec.aiIntegration.promptContext}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">AI Features & Multi-Modal Vision:</span>
              {spec.aiIntegration.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. Testing */}
        {activeTab === 'testing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-emerald-600" />
              13. Automated Testing Strategy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.testing.map((t, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{t.type}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.tools}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.coverage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. Deployment */}
        {activeTab === 'deployment' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-sky-600" />
              14. Deployment & Infrastructure Setup
            </h3>
            <div className="space-y-3">
              {spec.deployment.map((dep, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-sky-700 text-xs">{dep.phase}</span>
                  <span className="text-xs text-slate-700 font-medium">{dep.setup}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <TimetableView overview={spec.overview} timetable={spec.timetable} />
        )}
      </motion.div>
    </div>
  )
}
