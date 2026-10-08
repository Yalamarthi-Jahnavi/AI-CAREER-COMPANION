import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  FileText, Download, Printer, Sparkles, Plus, Trash2,
  ExternalLink, Mail, Phone, MapPin, Globe,
  Briefcase, GraduationCap, Code2, Award, ShieldCheck, Check,
  ChevronRight, RotateCcw, Eye, Layout, Palette
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useResumeStore } from '../store/useResumeStore'
import { enhanceBulletPoint } from '../api/resumeApi'

const TEMPLATES = [
  { id: 'modern', name: 'Modern Clean', description: 'Two-tone header with clean sidebar' },
  { id: 'tech', name: 'Tech Pro', description: 'Monospace touches for engineering roles' },
  { id: 'minimal', name: 'Minimalist', description: 'Single column elegant layout' },
  { id: 'executive', name: 'Executive', description: 'Serif accent, traditional structure' },
]

const ACCENT_COLORS = [
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'blue', hex: '#3b82f6', label: 'Blue' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
  { id: 'slate', hex: '#475569', label: 'Slate' },
]

export function ResumeBuilder() {
  const {
    resume,
    activeTemplate,
    selectedColor,
    setTemplate,
    setColor,
    updatePersonalInfo,
    setSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    addCertification,
    deleteCertification,
    addAchievement,
    deleteAchievement,
    loadSampleResume,
    resetResume,
  } = useResumeStore()

  const [activeTab, setActiveTab] = useState('contact')
  const [previewMode, setPreviewMode] = useState('split') // 'split' | 'preview-only' | 'edit-only'
  const [newSkillText, setNewSkillText] = useState({ languages: '', frameworks: '', databases: '', tools: '', softSkills: '' })
  const [newAchievement, setNewAchievement] = useState('')
  const resumePrintRef = useRef(null)

  const handlePrint = () => {
    window.print()
  }

  const handleEnhanceBullet = (expId, bulletIdx, currentText) => {
    const enhanced = enhanceBulletPoint(currentText)
    const exp = resume.experience.find((e) => e.id === expId)
    if (!exp) return
    const newBullets = [...exp.bullets]
    newBullets[bulletIdx] = enhanced
    updateExperience(expId, { bullets: newBullets })
  }

  const handleAddBulletToExp = (expId) => {
    const exp = resume.experience.find((e) => e.id === expId)
    if (!exp) return
    updateExperience(expId, { bullets: [...exp.bullets, ''] })
  }

  const handleRemoveBulletFromExp = (expId, bulletIdx) => {
    const exp = resume.experience.find((e) => e.id === expId)
    if (!exp) return
    updateExperience(expId, { bullets: exp.bullets.filter((_, i) => i !== bulletIdx) })
  }

  const handleAddSkill = (cat) => {
    const val = (newSkillText[cat] || '').trim()
    if (!val) return
    const current = resume.skills[cat] || []
    if (!current.includes(val)) {
      updateSkills(cat, [...current, val])
    }
    setNewSkillText((p) => ({ ...p, [cat]: '' }))
  }

  const handleRemoveSkill = (cat, skillName) => {
    const current = resume.skills[cat] || []
    updateSkills(cat, current.filter((s) => s !== skillName))
  }

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return
    addAchievement(newAchievement.trim())
    setNewAchievement('')
  }

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-success-500/10 text-success-400 border border-success-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <Badge variant="success" className="text-xs font-semibold uppercase tracking-wider">
              ATS Resume Builder
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            Resume Builder & Preview
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Design an ATS-friendly, high-impact resume with live real-time preview, bullet enhancers,
            and one-click clean PDF export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadSampleResume} className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Load Sample</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={resetResume} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 shadow-lg shadow-brand-500/20">
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Templates & Palette */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5" /> Template:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeTemplate === t.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-dark-bg/60 text-dark-text-secondary hover:text-dark-text-primary border border-dark-border'
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Accent:
          </span>
          <div className="flex items-center gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={clsx(
                  'w-5 h-5 rounded-full transition-transform hover:scale-110 shadow-sm',
                  selectedColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-card scale-110' : ''
                )}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Main Workspace: Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none p-1.5 bg-dark-card border border-dark-border rounded-xl">
            {[
              { id: 'contact', label: 'Contact' },
              { id: 'summary', label: 'Summary' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'certs', label: 'Certifications' },
              { id: 'achievements', label: 'Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                    : 'text-dark-text-muted hover:text-dark-text-primary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="p-5 space-y-5">
            {/* 1. Contact / Personal Info */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-dark-text-primary">Personal & Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-dark-text-muted mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={resume.personalInfo.jobTitle}
                      onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-text-muted mb-1">Portfolio Website</label>
                    <input
                      type="text"
                      value={resume.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Professional Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark-text-primary">Professional Summary</h3>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                      setSummary(
                        'Dynamic software engineer with deep expertise in full-lifecycle product development, scalable distributed architectures, and modern cloud deployment. Proven impact optimizing system throughput and mentoring agile engineering squads.'
                      )
                    }
                    className="gap-1 text-brand-400"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Suggest</span>
                  </Button>
                </div>
                <textarea
                  rows={5}
                  value={resume.summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize your professional background, key technical strengths, and measurable achievements..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs sm:text-sm text-dark-text-primary focus:border-brand-500 focus:outline-none"
                />
              </div>
            )}

            {/* 3. Work Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark-text-primary">Work Experience</h3>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Plus}
                    onClick={() => addExperience({ role: 'Software Engineer', company: 'Company Name', location: 'Remote', startDate: '2023-01', endDate: 'Present', current: true, bullets: ['Architected core platform services with high availability.'] })}
                  >
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-5">
                  {resume.experience.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-brand-400">Position #{expIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => deleteExperience(exp.id)}
                          className="text-dark-text-muted hover:text-error-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div>
                          <label className="block text-dark-text-muted mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-dark-text-muted mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-dark-text-muted mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-dark-text-muted mb-1">Start</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                              className="w-full bg-dark-card border border-dark-border rounded px-2 py-1.5 text-dark-text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-dark-text-muted mb-1">End</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                              className="w-full bg-dark-card border border-dark-border rounded px-2 py-1.5 text-dark-text-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2 pt-2 border-t border-dark-border/40">
                        <div className="flex items-center justify-between text-xs text-dark-text-muted">
                          <span>Key Accomplishments & Bullet Points</span>
                          <button
                            type="button"
                            onClick={() => handleAddBulletToExp(exp.id)}
                            className="text-brand-400 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const newB = [...exp.bullets]
                                newB[bi] = e.target.value
                                updateExperience(exp.id, { bullets: newB })
                              }}
                              placeholder="Action verb + task + quantifiable metric outcome..."
                              className="flex-1 bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-xs text-dark-text-primary"
                            />
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleEnhanceBullet(exp.id, bi, bullet)}
                              title="Enhance with metrics and power verbs"
                              className="text-brand-400 p-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBulletFromExp(exp.id, bi)}
                              className="text-dark-text-muted hover:text-error-400 p-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark-text-primary">Featured Projects</h3>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Plus}
                    onClick={() => addProject({ title: 'New Project', technologies: 'React, Node.js', link: 'github.com/user/project', bullets: ['Engineered scalable microservice.'] })}
                  >
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {resume.projects.map((proj, pi) => (
                    <div key={proj.id || pi} className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-brand-400">Project #{pi + 1}</span>
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="text-dark-text-muted hover:text-error-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-dark-text-muted mb-1">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-dark-text-muted mb-1">Tech Stack</label>
                          <input
                            type="text"
                            value={proj.technologies}
                            onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-dark-text-muted mb-1">Project Link / Repo</label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                            className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark-text-primary">Education</h3>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Plus}
                    onClick={() => addEducation({ degree: 'B.S. in Software Engineering', institution: 'University', graduationYear: '2022', gpa: '3.7/4.0' })}
                  >
                    Add Education
                  </Button>
                </div>

                <div className="space-y-3">
                  {resume.education.map((edu, ei) => (
                    <div key={edu.id || ei} className="p-3.5 rounded-xl bg-dark-bg/60 border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1 flex-1">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="Degree (e.g. B.S. in Computer Science)"
                          className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-dark-text-primary font-semibold"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                            placeholder="Institution"
                            className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-dark-text-secondary"
                          />
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) => updateEducation(edu.id, { graduationYear: e.target.value })}
                            placeholder="Graduation Year"
                            className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-dark-text-muted"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteEducation(edu.id)}
                        className="text-dark-text-muted hover:text-error-400 self-end sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-dark-text-primary">Skills by Category</h3>

                {['languages', 'frameworks', 'databases', 'tools', 'softSkills'].map((cat) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-400 capitalize">{cat.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-[10px] text-dark-text-muted">{(resume.skills[cat] || []).length} items</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(resume.skills[cat] || []).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-dark-bg border border-dark-border text-dark-text-primary"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(cat, skill)}
                            className="text-dark-text-muted hover:text-error-400 text-xs ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newSkillText[cat] || ''}
                        onChange={(e) => setNewSkillText({ ...newSkillText, [cat]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(cat)}
                        placeholder={`Add ${cat}... (press Enter)`}
                        className="flex-1 bg-dark-bg border border-dark-border rounded px-2.5 py-1 text-xs text-dark-text-primary"
                      />
                      <Button variant="secondary" size="xs" onClick={() => handleAddSkill(cat)}>
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications */}
            {activeTab === 'certs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark-text-primary">Certifications</h3>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Plus}
                    onClick={() => addCertification({ name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2023', url: '' })}
                  >
                    Add Certification
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 flex-1">
                        <div className="font-semibold text-dark-text-primary">{cert.name}</div>
                        <div className="text-dark-text-muted">{cert.issuer} • {cert.date}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCertification(cert.id)}
                        className="text-dark-text-muted hover:text-error-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Achievements */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-dark-text-primary">Honors & Key Achievements</h3>

                <div className="space-y-2">
                  {resume.achievements.map((ach, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border flex items-start justify-between gap-2 text-xs">
                      <span className="text-dark-text-secondary">{ach}</span>
                      <button
                        type="button"
                        onClick={() => deleteAchievement(idx)}
                        className="text-dark-text-muted hover:text-error-400 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement()}
                    placeholder="E.g. Winner of 2023 Hackathon out of 100+ teams..."
                    className="flex-1 bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-xs text-dark-text-primary"
                  />
                  <Button variant="secondary" size="xs" onClick={handleAddAchievement}>
                    Add
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Live Resume Sheet Preview Column */}
        <div className="lg:col-span-6">
          <div className="sticky top-20">
            <div className="flex items-center justify-between px-2 py-1.5 mb-2 text-xs text-dark-text-muted">
              <span className="font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-400" /> Live Resume Sheet ({activeTemplate})
              </span>
              <span className="text-[11px] text-dark-text-muted">Ready for A4 / Letter Print</span>
            </div>

            {/* The Printable Resume Paper Container */}
            <div
              ref={resumePrintRef}
              className={clsx(
                'bg-white text-slate-900 rounded-xl shadow-2xl p-8 border border-slate-200 min-h-[780px]',
                'print:p-0 print:shadow-none print:border-none print:m-0 print:w-full font-sans text-xs'
              )}
            >
              {/* Header */}
              <div className="border-b pb-4 mb-4" style={{ borderColor: selectedColor }}>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {resume.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-sm font-semibold mt-0.5" style={{ color: selectedColor }}>
                  {resume.personalInfo.jobTitle || 'Target Job Title'}
                </p>

                {/* Contact Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[11px] text-slate-600">
                  {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                  {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                  {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
                  {resume.personalInfo.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
                  {resume.personalInfo.github && <span>• {resume.personalInfo.github}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                    Professional Summary
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-[11.5px]">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resume.experience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {resume.experience.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-baseline font-semibold text-slate-900 text-[11.5px]">
                          <span>{exp.role} — <span className="text-slate-700 font-normal">{exp.company}</span></span>
                          <span className="text-slate-500 text-[10.5px] font-normal">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <ul className="list-disc ml-4 space-y-0.5 text-slate-700 text-[11px] leading-relaxed">
                          {exp.bullets.filter(Boolean).map((bullet, bi) => (
                            <li key={bi}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                    Key Projects
                  </h2>
                  <div className="space-y-2">
                    {resume.projects.map((proj, i) => (
                      <div key={i} className="text-[11px]">
                        <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span>{proj.title} <span className="font-normal text-slate-500">({proj.technologies})</span></span>
                          {proj.link && <span className="text-slate-500 text-[10px]">{proj.link}</span>}
                        </div>
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-0.5">
                            {proj.bullets.filter(Boolean).map((b, bi) => (
                              <li key={bi}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                  Technical Skills
                </h2>
                <div className="space-y-1 text-[11px] text-slate-700">
                  {resume.skills.languages?.length > 0 && (
                    <div><strong className="text-slate-900">Languages:</strong> {resume.skills.languages.join(', ')}</div>
                  )}
                  {resume.skills.frameworks?.length > 0 && (
                    <div><strong className="text-slate-900">Frameworks & Libraries:</strong> {resume.skills.frameworks.join(', ')}</div>
                  )}
                  {resume.skills.databases?.length > 0 && (
                    <div><strong className="text-slate-900">Databases:</strong> {resume.skills.databases.join(', ')}</div>
                  )}
                  {resume.skills.tools?.length > 0 && (
                    <div><strong className="text-slate-900">Tools & Cloud:</strong> {resume.skills.tools.join(', ')}</div>
                  )}
                </div>
              </div>

              {/* Education */}
              {resume.education.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                    Education
                  </h2>
                  <div className="space-y-1 text-[11px]">
                    {resume.education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-baseline text-slate-800">
                        <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                        <span className="text-slate-500 text-[10px]">{edu.graduationYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications & Achievements */}
              {(resume.certifications.length > 0 || resume.achievements.length > 0) && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b" style={{ color: selectedColor, borderColor: '#e2e8f0' }}>
                    Certifications & Honors
                  </h2>
                  <ul className="list-disc ml-4 text-[11px] text-slate-700 space-y-0.5">
                    {resume.certifications.map((c, i) => (
                      <li key={`c-${i}`}><strong>{c.name}</strong> — {c.issuer} ({c.date})</li>
                    ))}
                    {resume.achievements.map((a, i) => (
                      <li key={`a-${i}`}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
