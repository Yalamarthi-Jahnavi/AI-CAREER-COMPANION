import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  FileScan, Upload, FileText, CheckCircle2, AlertTriangle,
  XCircle, Sparkles, Target, ArrowRight, ShieldCheck,
  Building2, Layers, Cpu, Award, BookOpen, Briefcase,
  Copy, RotateCcw, Search, BarChart3, ChevronRight, Check
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useResumeStore } from '../store/useResumeStore'
import {
  extractTextFromFile,
  analyzeResume,
  matchJobDescription,
  ROLE_KEYWORDS
} from '../api/resumeApi'

const SAMPLE_RESUMES = {
  senior: {
    title: 'Senior Full Stack Engineer (High ATS)',
    role: 'Full Stack Developer',
    text: `Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA | github.com/alexmorgan | linkedin.com/in/alexmorgan

SUMMARY
Results-driven Full Stack Engineer with 5+ years of experience designing, developing, and scaling high-performance web applications. Specialized in React, Node.js, and cloud architectures, with a proven track record of reducing latency by 45% and increasing team velocity.

WORK EXPERIENCE
Senior Software Engineer | TechCorp Solutions | 2022 - Present
• Architected and deployed microservices handling 2M+ daily active requests with 99.98% uptime SLA.
• Spearheaded frontend migration from legacy monolith to React & TypeScript, slashing initial load time by 45%.
• Mentored 6 junior engineers and instituted automated CI/CD code quality gates with Jest and Cypress.

Full Stack Developer | Innovate Labs | 2019 - 2022
• Built real-time analytics dashboard with React, WebSocket, and PostgreSQL, increasing user engagement by 32%.
• Implemented Redis caching layer across critical API endpoints, reducing database query load by 60%.
• Collaborated with product designers to create an accessible component library compliant with WCAG 2.1 AA.

PROJECTS
• DevCollab: Real-time collaborative code editor supporting 50+ concurrent typers using React, Node.js, Socket.io, and Docker.
• CloudMetrics: Lightweight telemetry daemon collecting CPU/memory metrics across 500+ AWS EC2 instances with sub-5ms latency.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Go, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, GraphQL
Databases: PostgreSQL, MongoDB, Redis
DevOps & Cloud: Docker, Kubernetes, AWS (S3, ECS, Lambda), Git, CI/CD, Jest

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2019 | GPA: 3.8/4.0

CERTIFICATIONS & ACHIEVEMENTS
• AWS Certified Solutions Architect – Associate (2023)
• 1st Place Winner at Bay Area Hackathon 2023 out of 120 participating teams`,
  },
  junior: {
    title: 'Junior Frontend Developer (Needs Metrics)',
    role: 'Frontend Engineer',
    text: `Jordan Smith
jordan.smith@example.com | New York, NY | github.com/jordansmith

SUMMARY
Frontend developer passionate about building clean interfaces using React, JavaScript, and CSS. Looking for junior engineering roles.

EXPERIENCE
Frontend Intern | Web Agency NYC | 2023 - 2024
• Worked on company client websites using React and HTML/CSS.
• Fixed UI bugs and responsive design layout issues across mobile viewports.
• Participated in weekly standups and sprint planning.

PROJECTS
• Portfolio Website: Built personal site with React and Tailwind CSS to showcase web projects.
• Weather App: Simple weather search tool using OpenWeather API and JavaScript.

SKILLS
React, JavaScript, HTML, CSS, Git, Figma

EDUCATION
B.A. in Digital Media | NYU | 2023`,
  },
}

const SAMPLE_JDS = {
  fullstack: `Senior Full Stack Engineer
We are seeking a Full Stack Developer with deep experience in React, Node.js, TypeScript, PostgreSQL, and AWS.
Responsibilities:
- Architect, build, and deploy high-availability web services.
- Design database schemas in PostgreSQL and manage caching with Redis.
- Collaborate with frontend teams to build responsive, accessible React and Tailwind CSS interfaces.
- Lead CI/CD automation with Docker and GitHub Actions.
- Optimize web vitals, latency, and system security.
Requirements:
- 4+ years of professional fullstack engineering experience.
- Strong knowledge of microservices, REST APIs, and GraphQL.
- Demonstrated experience mentoring team members and driving architectural decisions.`,
}

export function ResumeAnalyzer() {
  const {
    uploadedFile,
    rawResumeText,
    targetRole,
    targetJd,
    isAnalyzing,
    analysis,
    jdMatchResult,
    setUploadedFile,
    setRawResumeText,
    setTargetRole,
    setTargetJd,
    setIsAnalyzing,
    setAnalysis,
    setJdMatchResult,
    clearAnalysis,
  } = useResumeStore()

  const [activeTab, setActiveTab] = useState('ats') // 'ats' | 'jd' | 'text'
  const [isMatchingJd, setIsMatchingJd] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorMessage('')
    setUploadedFile({ name: file.name, size: file.size, type: file.type })

    try {
      const extracted = await extractTextFromFile(file)
      setRawResumeText(extracted)
      // Auto analyze
      handleAnalyze(extracted, targetRole)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract text from file.')
    }
  }

  const handleLoadSample = (key) => {
    const sample = SAMPLE_RESUMES[key]
    if (!sample) return
    setUploadedFile({ name: `${key}-sample.txt`, size: sample.text.length, type: 'text/plain' })
    setRawResumeText(sample.text)
    setTargetRole(sample.role)
    handleAnalyze(sample.text, sample.role)
  }

  const handleAnalyze = async (text = rawResumeText, role = targetRole) => {
    if (!text.trim()) {
      setErrorMessage('Please upload a resume or paste text first.')
      return
    }
    setErrorMessage('')
    setIsAnalyzing(true)
    try {
      const result = await analyzeResume(text, role)
      setAnalysis(result)
    } catch (err) {
      setErrorMessage(err.message || 'Error analyzing resume.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRunJdMatch = async () => {
    if (!rawResumeText.trim() || !targetJd.trim()) {
      setErrorMessage('Please ensure both Resume Text and Job Description are provided.')
      return
    }
    setIsMatchingJd(true)
    setErrorMessage('')
    try {
      const match = await matchJobDescription(rawResumeText, targetJd)
      setJdMatchResult(match)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to match job description.')
    } finally {
      setIsMatchingJd(false)
    }
  }

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-info-500/10 text-info-400 border border-info-500/20">
              <FileScan className="w-4 h-4" />
            </span>
            <Badge variant="info" className="text-xs font-semibold uppercase tracking-wider">
              AI Resume & ATS Analyzer
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            Resume & ATS Scoring System
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Upload your resume in PDF or DOCX format for an in-depth 8-dimension ATS audit,
            authentic experience verification, and Job Description keyword matching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadSample('senior')}
            className="gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Senior Resume (92 ATS)</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleLoadSample('junior')}
            className="gap-1.5"
          >
            <span>Junior Resume (68 ATS)</span>
          </Button>
          {analysis && (
            <Button variant="ghost" size="sm" onClick={clearAnalysis} className="gap-1.5 text-error-400">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-500/10 border border-error-500/30 text-error-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Zone & Role Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Dropzone & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-400" /> Upload Resume (PDF / DOCX)
            </h3>

            {/* Drag & Drop File Input */}
            <label className="border-2 border-dashed border-dark-border hover:border-brand-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-dark-bg/40 transition-colors group">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-dark-text-primary">
                  Click to browse or drop your resume
                </p>
                <p className="text-[11px] text-dark-text-muted">
                  Supports PDF, DOCX, DOC, and TXT files
                </p>
              </div>
            </label>

            {/* Uploaded File Info */}
            {uploadedFile && (
              <div className="p-3 rounded-xl bg-dark-bg/60 border border-dark-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="truncate font-medium text-dark-text-primary">{uploadedFile.name}</span>
                </div>
                <Badge variant="success" className="text-[10px]">Loaded</Badge>
              </div>
            )}

            {/* Target Role Selector */}
            <div className="space-y-1.5 pt-2 border-t border-dark-border">
              <label className="block text-xs font-semibold text-dark-text-muted">
                Target Role for Keyword Benchmarking
              </label>
              <select
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value)
                  if (rawResumeText) handleAnalyze(rawResumeText, e.target.value)
                }}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-dark-text-primary focus:border-brand-500 focus:outline-none"
              >
                {Object.keys(ROLE_KEYWORDS).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Analyze Action */}
            <Button
              variant="primary"
              size="md"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !rawResumeText.trim()}
              className="w-full shadow-lg shadow-brand-500/20 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume (ATS)'}</span>
            </Button>
          </Card>

          {/* Raw Text Preview Card */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-dark-text-primary">Parsed Text Preview</span>
              <span className="text-dark-text-muted">{rawResumeText.length} chars</span>
            </div>
            <textarea
              rows={6}
              value={rawResumeText}
              onChange={(e) => setRawResumeText(e.target.value)}
              placeholder="Extracted resume text will appear here. You can also paste text directly..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs font-mono text-dark-text-secondary focus:border-brand-500 focus:outline-none"
            />
          </Card>
        </div>

        {/* Right Column: Analysis Output & Tabs */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-dark-card border border-dark-border rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('ats')}
              className={clsx(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
                activeTab === 'ats'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-dark-text-muted hover:text-dark-text-primary'
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ATS Analysis (8 Dimensions)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jd')}
              className={clsx(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
                activeTab === 'jd'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-dark-text-muted hover:text-dark-text-primary'
              )}
            >
              <Target className="w-4 h-4" />
              <span>Job Description Match</span>
            </button>
          </div>

          {/* TAB 1: ATS ANALYSIS */}
          {activeTab === 'ats' && (
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Score Hero Card */}
                  <Card className="p-6 bg-gradient-to-br from-dark-card via-dark-card/90 to-brand-950/20 border-brand-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={analysis.atsScore >= 80 ? 'success' : analysis.atsScore >= 65 ? 'warning' : 'error'}
                            className="text-xs font-bold px-2.5 py-1"
                          >
                            {analysis.atsScore >= 80 ? 'High ATS Pass' : analysis.atsScore >= 65 ? 'Moderate ATS Fit' : 'High Rejection Risk'}
                          </Badge>
                          <span className="text-xs text-dark-text-muted">Target: {analysis.targetRole}</span>
                        </div>
                        <h2 className="text-xl font-bold text-dark-text-primary">
                          ATS Optimization Score: {analysis.atsScore}/100
                        </h2>
                        <p className="text-xs text-dark-text-muted">
                          Calculated from 8 core ATS dimensions without inventing experience.
                        </p>
                      </div>

                      {/* Score Gauge Circle */}
                      <div className="flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center text-center shadow-lg"
                          style={{
                            borderColor: analysis.atsScore >= 80 ? '#10b981' : analysis.atsScore >= 65 ? '#f59e0b' : '#ef4444',
                            backgroundColor: 'rgba(15, 23, 42, 0.6)'
                          }}
                        >
                          <span className="text-2xl font-black text-dark-text-primary">{analysis.atsScore}</span>
                          <span className="text-[9px] text-dark-text-muted uppercase tracking-wider font-semibold">/ 100</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-dark-bg mt-5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${analysis.atsScore}%`,
                          backgroundColor: analysis.atsScore >= 80 ? '#10b981' : analysis.atsScore >= 65 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </Card>

                  {/* 8 Dimensions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Skills */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" /> 1. Skills Found
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.skills}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.skills.note}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {analysis.breakdown.skills.found.slice(0, 5).map((s) => (
                          <Badge key={s} variant="brand" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* 2. Experience */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent-400 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" /> 2. Work Experience
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.experience}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.experience.note}</p>
                      <div className="text-[11px] text-dark-text-muted">
                        Metrics detected: <strong className="text-dark-text-primary">{analysis.breakdown.experience.metricsCount}</strong> | Verbs: <strong className="text-dark-text-primary">{analysis.breakdown.experience.actionVerbsCount}</strong>
                      </div>
                    </div>

                    {/* 3. Projects */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-warning-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> 3. Projects & Code
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.projects}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.projects.note}</p>
                    </div>

                    {/* 4. Education */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-info-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> 4. Education
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.education}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.education.note}</p>
                    </div>

                    {/* 5. Certifications */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-success-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> 5. Certifications
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.certifications}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.certifications.note}</p>
                    </div>

                    {/* 6. Achievements */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-warning-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> 6. Achievements
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.achievements}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.achievements.note}</p>
                    </div>

                    {/* 7. Keywords */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-400 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5" /> 7. Keyword Density
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.keywords}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">
                        Matched {analysis.breakdown.keywords.found.length} keywords for {targetRole}.
                      </p>
                    </div>

                    {/* 8. ATS Structure */}
                    <div className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 8. ATS Layout
                        </span>
                        <span className="text-xs font-bold text-dark-text-primary">{analysis.sectionScores.atsStructure}%</span>
                      </div>
                      <p className="text-xs text-dark-text-secondary">{analysis.breakdown.atsStructure.note}</p>
                    </div>
                  </div>

                  {/* Issues & High-Impact Recommendations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-4 space-y-3">
                      <h4 className="text-xs font-bold text-error-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Detected ATS Issues ({analysis.criticalIssues.length})
                      </h4>
                      <ul className="space-y-1.5 text-xs text-dark-text-secondary">
                        {analysis.criticalIssues.map((iss, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-error-400">•</span>
                            <span>{iss}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <h4 className="text-xs font-bold text-success-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Action Recommendations
                      </h4>
                      <ul className="space-y-1.5 text-xs text-dark-text-secondary">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-success-400">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                <Card className="p-12 text-center text-dark-text-muted space-y-3">
                  <FileScan className="w-12 h-12 mx-auto text-dark-text-muted opacity-40" />
                  <h3 className="text-base font-bold text-dark-text-primary">No Analysis Yet</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Upload a resume file (PDF or DOCX) or click "Senior Resume" above to test the 8-dimension ATS analyzer immediately.
                  </p>
                </Card>
              )}
            </AnimatePresence>
          )}

          {/* TAB 2: JOB DESCRIPTION MATCHING */}
          {activeTab === 'jd' && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-dark-text-primary">Target Job Description Matching</h3>
                  <p className="text-xs text-dark-text-muted">Compare your resume against a specific job posting</p>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setTargetJd(SAMPLE_JDS.fullstack)}
                  className="text-brand-400 text-xs"
                >
                  Load Sample Fullstack JD
                </Button>
              </div>

              <textarea
                rows={5}
                value={targetJd}
                onChange={(e) => setTargetJd(e.target.value)}
                placeholder="Paste the job description or requirements here..."
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-dark-text-primary focus:border-brand-500 focus:outline-none"
              />

              <Button
                variant="primary"
                size="md"
                onClick={handleRunJdMatch}
                disabled={isMatchingJd || !targetJd.trim() || !rawResumeText.trim()}
                className="gap-2"
              >
                <Target className="w-4 h-4" />
                <span>{isMatchingJd ? 'Matching against JD...' : 'Calculate JD Match Score'}</span>
              </Button>

              {jdMatchResult && (
                <div className="p-5 rounded-2xl bg-dark-bg/60 border border-dark-border space-y-4 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-dark-text-muted">Job Match Percentage</span>
                      <div className="text-2xl font-black text-dark-text-primary">{jdMatchResult.matchScore}% Match</div>
                    </div>
                    <Badge variant={jdMatchResult.matchScore >= 75 ? 'success' : 'warning'} className="text-xs px-2.5 py-1">
                      {jdMatchResult.matchedCount} of {jdMatchResult.totalJdKeywords} Keywords Found
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border space-y-1.5">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Matched Skills ({jdMatchResult.matchedSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {jdMatchResult.matchedSkills.map((s) => (
                          <Badge key={s} variant="success" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border space-y-1.5">
                      <div className="font-semibold text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Missing Skills to Add ({jdMatchResult.missingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {jdMatchResult.missingSkills.map((s) => (
                          <Badge key={s} variant="warning" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-dark-text-primary">Tailoring Guidance:</span>
                    <ul className="space-y-1 text-dark-text-secondary">
                      {jdMatchResult.advice.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-400">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
