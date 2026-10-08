import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  FileText, Target, Sparkles, CheckSquare, ShieldCheck,
  Cpu, Layers, Database, Globe, Layout, Server,
  Brain, TestTube, Rocket, Calendar, Camera,
  Copy, Check, Download, RotateCcw, MessageSquare,
  ChevronRight, ExternalLink, Code2, AlertCircle,
  Clock, Users, Award, HardDrive, Terminal
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'
import { TimetableView } from './TimetableView'
import { ScreenshotAnalyzer } from './ScreenshotAnalyzer'

// Tab definitions with category grouping
const TABS = [
  { id: 'problemStatement', label: 'Problem Statement', icon: FileText, category: 'Overview' },
  { id: 'objectives', label: 'Objectives', icon: Target, category: 'Overview' },
  { id: 'features', label: 'Features', icon: Sparkles, category: 'Product' },
  { id: 'functionalRequirements', label: 'Functional Req.', icon: CheckSquare, category: 'Product' },
  { id: 'nonFunctionalRequirements', label: 'Non-functional Req.', icon: ShieldCheck, category: 'Product' },
  { id: 'technologyStack', label: 'Tech Stack', icon: Cpu, category: 'Architecture' },
  { id: 'architecture', label: 'Architecture', icon: Layers, category: 'Architecture' },
  { id: 'database', label: 'Database Design', icon: Database, category: 'Technical' },
  { id: 'apiDesign', label: 'API Design', icon: Globe, category: 'Technical' },
  { id: 'frontendPages', label: 'Frontend Pages', icon: Layout, category: 'Technical' },
  { id: 'backendModules', label: 'Backend Modules', icon: Server, category: 'Technical' },
  { id: 'aiIntegration', label: 'AI Integration', icon: Brain, category: 'Advanced' },
  { id: 'testing', label: 'Testing Strategy', icon: TestTube, category: 'Quality' },
  { id: 'deployment', label: 'Deployment', icon: Rocket, category: 'DevOps' },
  { id: 'timetable', label: 'Timetable', icon: Calendar, category: 'Planning', highlight: true },
  { id: 'screenshot', label: 'Screenshot & Errors', icon: Camera, category: 'Tools', highlight: true },
]

export function BlueprintDashboard() {
  const {
    inputs,
    blueprint,
    timetable,
    activeTab,
    setActiveTab,
    setGenerated,
    toggleChat,
  } = useProjectAssistantStore()

  const [copied, setCopied] = useState(false)

  if (!blueprint) {
    return (
      <div className="p-8 text-center text-dark-text-muted">
        No blueprint data found. Please complete the wizard.
      </div>
    )
  }

  // Copy current tab content to clipboard
  const handleCopyTabContent = () => {
    const data = blueprint[activeTab] || (activeTab === 'timetable' ? timetable : inputs)
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Export full blueprint as Markdown file
  const handleExportMarkdown = () => {
    let md = `# Project Blueprint: ${inputs.projectName || 'Project'}\n\n`
    md += `**Deadline:** ${inputs.deadline || 'Flexible'} | **Skill Level:** ${inputs.skillLevel || 'Intermediate'} | **Team:** ${inputs.teamType === 'team' ? `Team of ${inputs.teamSize}` : 'Individual'}\n\n`
    md += `---\n\n`

    // Iterate through sections
    Object.entries(blueprint).forEach(([key, section]) => {
      if (!section) return
      md += `## ${section.title || key}\n\n`
      if (typeof section.content === 'string') {
        md += `${section.content}\n\n`
      }
      if (Array.isArray(section.keyPoints)) {
        section.keyPoints.forEach((pt) => { md += `- ${pt}\n` })
        md += '\n'
      }
    })

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(inputs.projectName || 'project').toLowerCase().replace(/\s+/g, '-')}-blueprint.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-card via-dark-card/90 to-brand-950/20 border border-dark-border shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="brand" className="px-2.5 py-1 text-xs">
                Generated Blueprint
              </Badge>
              <Badge variant="outline" className="text-xs">
                {inputs.skillLevel || 'Intermediate'} Level
              </Badge>
              <Badge variant="info" className="text-xs">
                {inputs.teamType === 'team' ? `Team (${inputs.teamSize} devs)` : 'Individual'}
              </Badge>
              {inputs.deadline && (
                <span className="text-xs text-dark-text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-warning-400" />
                  Due {inputs.deadline}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
              {inputs.projectName || 'Project Blueprint'}
            </h1>
            <p className="text-sm text-dark-text-muted max-w-3xl line-clamp-2">
              {inputs.projectIdea}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export MD</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setGenerated(false)}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Edit Inputs</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={toggleChat}
              className="gap-1.5 shadow-lg shadow-brand-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabbed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="p-2.5 rounded-2xl bg-dark-card border border-dark-border sticky top-20 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-dark-text-muted uppercase tracking-wider">
              Blueprint Sections (14)
            </div>

            <div className="space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group',
                      isActive
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                        : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg/60 border border-transparent',
                      tab.highlight && !isActive && 'text-accent-400 hover:text-accent-300'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-400' : 'text-dark-text-muted group-hover:text-dark-text-primary')} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* Render Timetable View */}
              {activeTab === 'timetable' && (
                <TimetableView timetable={timetable} />
              )}

              {/* Render Screenshot Analyzer View */}
              {activeTab === 'screenshot' && (
                <ScreenshotAnalyzer />
              )}

              {/* 1. Problem Statement */}
              {activeTab === 'problemStatement' && blueprint.problemStatement && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Problem Statement</h2>
                        <p className="text-xs text-dark-text-muted">Clear definition of the problem and target audience value</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border text-sm leading-relaxed text-dark-text-secondary">
                    {blueprint.problemStatement.content}
                  </div>

                  {blueprint.problemStatement.keyPoints && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Key Problem Vectors</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {blueprint.problemStatement.keyPoints.map((pt, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-dark-bg/40 border border-dark-border text-xs text-dark-text-secondary flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* 2. Objectives */}
              {activeTab === 'objectives' && blueprint.objectives && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Project Objectives</h2>
                        <p className="text-xs text-dark-text-muted">Target outcomes, benchmarks, and success criteria</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.objectives.items.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="brand" className="text-[11px] font-semibold">
                            {item.label}
                          </Badge>
                          <span className="text-[11px] text-dark-text-muted">Objective #{i + 1}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-dark-text-secondary leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 3. Features */}
              {activeTab === 'features' && blueprint.features && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-warning-500/10 text-warning-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Features & Scope</h2>
                        <p className="text-xs text-dark-text-muted">Prioritized roadmap breakdown (MVP vs Enhanced vs Future)</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {blueprint.features.categories.map((cat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-dark-text-primary">{cat.name}</span>
                            <Badge
                              variant={cat.priority === 'P0' ? 'error' : cat.priority === 'P1' ? 'warning' : 'info'}
                              className="text-[10px]"
                            >
                              {cat.priority}
                            </Badge>
                          </div>
                          <span className="text-xs text-dark-text-muted">{cat.items.length} features</span>
                        </div>

                        <div className="space-y-2">
                          {cat.items.map((feat, fi) => (
                            <div key={fi} className="flex items-start gap-2.5 text-xs sm:text-sm text-dark-text-secondary">
                              <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 4. Functional Requirements */}
              {activeTab === 'functionalRequirements' && blueprint.functionalRequirements && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-info-500/10 text-info-400">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Functional Requirements</h2>
                        <p className="text-xs text-dark-text-muted">Detailed functional behavior specifications by domain</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.functionalRequirements.sections.map((sec, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-3">
                        <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{sec.area}</h4>
                        <div className="space-y-2">
                          {sec.requirements.map((req, ri) => (
                            <div key={ri} className="text-xs text-dark-text-secondary p-2 rounded bg-dark-card/60 border border-dark-border/40 font-mono">
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 5. Non-functional Requirements */}
              {activeTab === 'nonFunctionalRequirements' && blueprint.nonFunctionalRequirements && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-success-500/10 text-success-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Non-functional Requirements</h2>
                        <p className="text-xs text-dark-text-muted">Performance, security, accessibility, and reliability standards</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {blueprint.nonFunctionalRequirements.items.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {item.category}
                        </Badge>
                        <p className="text-xs sm:text-sm text-dark-text-secondary leading-relaxed">
                          {item.requirement}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 6. Technology Stack */}
              {activeTab === 'technologyStack' && blueprint.technologyStack && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Technology Stack Architecture</h2>
                        <p className="text-xs text-dark-text-muted">Selected technologies per architectural layer with technical rationale</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.technologyStack.layers.map((layer, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{layer.layer}</span>
                          <div className="flex flex-wrap gap-1">
                            {layer.technologies.map((t, ti) => (
                              <Badge key={ti} variant="brand" className="text-[10px]">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-dark-text-secondary">
                          {layer.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 7. Architecture */}
              {activeTab === 'architecture' && blueprint.architecture && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">System Architecture</h2>
                        <p className="text-xs text-dark-text-muted">Pattern: {blueprint.architecture.pattern}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <p className="text-sm text-dark-text-secondary leading-relaxed">
                    {blueprint.architecture.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Architectural Layers</h4>
                    <div className="space-y-2">
                      {blueprint.architecture.layers.map((lay, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-dark-bg/50 border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-dark-text-primary">{lay.name}</span>
                          <span className="text-xs text-dark-text-secondary">{lay.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {blueprint.architecture.diagram && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Component Diagram</h4>
                      <pre className="p-4 rounded-xl bg-dark-bg border border-dark-border text-emerald-400 font-mono text-[11px] sm:text-xs overflow-x-auto">
                        {blueprint.architecture.diagram}
                      </pre>
                    </div>
                  )}
                </Card>
              )}

              {/* 8. Database */}
              {activeTab === 'database' && blueprint.database && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-warning-500/10 text-warning-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Database Schema Design</h2>
                        <p className="text-xs text-dark-text-muted">Target DB: {blueprint.database.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {blueprint.database.tables.map((tbl, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-brand-400">table: {tbl.name}</span>
                            <Badge variant="outline" className="text-[10px]">{tbl.columns.length} columns</Badge>
                          </div>
                          <span className="text-xs text-dark-text-muted">{tbl.description}</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-dark-border text-dark-text-muted">
                                <th className="py-2 px-2">Column</th>
                                <th className="py-2 px-2">Type</th>
                                <th className="py-2 px-2">Constraints</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tbl.columns.map((col, ci) => (
                                <tr key={ci} className="border-b border-dark-border/40 font-mono">
                                  <td className="py-2 px-2 text-dark-text-primary font-semibold">{col.name}</td>
                                  <td className="py-2 px-2 text-info-400">{col.type}</td>
                                  <td className="py-2 px-2 text-dark-text-muted text-[11px]">{col.constraints}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}

                    {blueprint.database.indexes && (
                      <div className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2">
                        <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Performance Indexes</h4>
                        <div className="space-y-1.5 font-mono text-xs text-emerald-400">
                          {blueprint.database.indexes.map((idx, ii) => (
                            <div key={ii} className="p-2 rounded bg-dark-bg/80 border border-dark-border/40">
                              {idx}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* 9. API Design */}
              {activeTab === 'apiDesign' && blueprint.apiDesign && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-info-500/10 text-info-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">RESTful API Design</h2>
                        <p className="text-xs text-dark-text-muted">Base URL: {blueprint.apiDesign.baseUrl}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {blueprint.apiDesign.groups.map((group, gi) => (
                      <div key={gi} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-3">
                        <h3 className="font-semibold text-sm text-dark-text-primary">{group.name} Endpoints</h3>
                        <div className="space-y-2">
                          {group.endpoints.map((ep, ei) => (
                            <div key={ei} className="p-3 rounded-lg bg-dark-bg/80 border border-dark-border text-xs space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={clsx(
                                  'px-2 py-0.5 rounded text-[10px] font-bold font-mono',
                                  ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                                  ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                  ep.method === 'PATCH' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-red-500/20 text-red-400'
                                )}>
                                  {ep.method}
                                </span>
                                <span className="font-mono text-dark-text-primary font-semibold">{ep.path}</span>
                                <span className="text-dark-text-muted">— {ep.description}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-dark-text-muted pt-1">
                                {ep.body && <div><span className="text-brand-400">Body:</span> {ep.body}</div>}
                                <div><span className="text-emerald-400">Response:</span> {ep.response}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 10. Frontend Pages */}
              {activeTab === 'frontendPages' && blueprint.frontendPages && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Frontend Page Specifications</h2>
                        <p className="text-xs text-dark-text-muted">Routes, descriptions, and component breakdown</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.frontendPages.pages.map((pg, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-dark-text-primary">{pg.name}</span>
                          <span className="font-mono text-xs text-brand-400">{pg.route}</span>
                        </div>
                        <p className="text-xs text-dark-text-secondary">{pg.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {pg.components.map((c, ci) => (
                            <Badge key={ci} variant="outline" className="text-[10px]">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 11. Backend Modules */}
              {activeTab === 'backendModules' && blueprint.backendModules && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Backend Modules & Services</h2>
                        <p className="text-xs text-dark-text-muted">Modular architecture files and responsibilities</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.backendModules.modules.map((mod, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-dark-text-primary">{mod.name}</span>
                          <span className="font-mono text-xs text-dark-text-muted">{mod.path}</span>
                        </div>
                        <p className="text-xs text-dark-text-secondary">{mod.description}</p>
                        <div className="flex flex-wrap gap-1 font-mono text-[10px] text-brand-400">
                          {mod.files.map((f, fi) => (
                            <span key={fi} className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 12. AI Integration */}
              {activeTab === 'aiIntegration' && blueprint.aiIntegration && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">AI Integration Strategy</h2>
                        <p className="text-xs text-dark-text-muted">{blueprint.aiIntegration.overview}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.aiIntegration.features.map((feat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-dark-text-primary">{feat.name}</span>
                          <Badge variant={feat.complexity === 'Low' ? 'success' : feat.complexity === 'Medium' ? 'warning' : 'brand'} className="text-[10px]">
                            {feat.complexity} Complexity
                          </Badge>
                        </div>
                        <p className="text-xs text-dark-text-secondary leading-relaxed">{feat.description}</p>
                      </div>
                    ))}
                  </div>

                  {blueprint.aiIntegration.implementation && (
                    <div className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2">
                      <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Implementation Pipeline</h4>
                      <p className="text-xs text-dark-text-secondary">{blueprint.aiIntegration.implementation.approach}</p>
                      <div className="p-2.5 rounded bg-dark-bg border border-dark-border font-mono text-xs text-emerald-400">
                        {blueprint.aiIntegration.implementation.pipeline}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* 13. Testing */}
              {activeTab === 'testing' && blueprint.testing && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-success-500/10 text-success-400">
                        <TestTube className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Testing Strategy & QA</h2>
                        <p className="text-xs text-dark-text-muted">Multi-tiered verification approach</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.testing.levels.map((lvl, i) => (
                      <div key={i} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-dark-text-primary">{lvl.name}</span>
                          <Badge variant="success" className="text-[10px]">{lvl.coverage}</Badge>
                        </div>
                        <div className="text-xs text-brand-400 font-mono">Tools: {lvl.tool}</div>
                        <div className="space-y-1">
                          {lvl.focus.map((f, fi) => (
                            <div key={fi} className="text-xs text-dark-text-secondary flex items-start gap-2">
                              <span className="text-success-400">•</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 14. Deployment */}
              {activeTab === 'deployment' && blueprint.deployment && (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-dark-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-info-500/10 text-info-400">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-dark-text-primary">Deployment & CI/CD Strategy</h2>
                        <p className="text-xs text-dark-text-muted">Environments, pipeline steps, and infrastructure</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyTabContent}>
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Environments */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Environments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {blueprint.deployment.environments.map((env, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-dark-bg/50 border border-dark-border space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-dark-text-primary">{env.name}</span>
                            <Badge variant="outline" className="text-[10px] font-mono">{env.branch}</Badge>
                          </div>
                          <div className="font-mono text-[11px] text-brand-400 truncate">{env.url}</div>
                          <p className="text-xs text-dark-text-muted">{env.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pipeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">CI/CD Pipeline Stages</h4>
                    <div className="space-y-2">
                      {blueprint.deployment.pipeline.map((step, i) => (
                        <div key={i} className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-info-500/20 text-info-400 flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <span className="font-semibold text-dark-text-primary">{step.step}</span>
                          </div>
                          <span className="text-dark-text-secondary">{step.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Infrastructure */}
                  {blueprint.deployment.infrastructure && (
                    <div className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border space-y-2">
                      <h4 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Recommended Infrastructure</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div><span className="text-dark-text-muted">Frontend:</span> <span className="text-dark-text-primary font-medium">{blueprint.deployment.infrastructure.frontend}</span></div>
                        <div><span className="text-dark-text-muted">Backend:</span> <span className="text-dark-text-primary font-medium">{blueprint.deployment.infrastructure.backend}</span></div>
                        <div><span className="text-dark-text-muted">Database:</span> <span className="text-dark-text-primary font-medium">{blueprint.deployment.infrastructure.database}</span></div>
                        <div><span className="text-dark-text-muted">Monitoring:</span> <span className="text-dark-text-primary font-medium">{blueprint.deployment.infrastructure.monitoring}</span></div>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
