import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Mail, Upload, FileText, Sparkles, CheckCircle2, AlertTriangle,
  XCircle, ShieldCheck, Building2, Briefcase, DollarSign, Calendar,
  MapPin, HelpCircle, Copy, Check, RotateCcw, Trash2, ArrowUp,
  ArrowDown, Image, Camera, AlertCircle, History, CheckSquare,
  FileCheck, Shield, ChevronDown, ChevronUp, Info
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useOfferAnalyzerStore } from '../store/useOfferAnalyzerStore'
import {
  processOfferInput,
  analyzeOfferLetter,
  SAMPLE_OFFER_LETTERS
} from '../api/offerAnalyzerApi'

export function OfferLetterAnalyzer() {
  const {
    inputType,
    uploadedFile,
    rawText,
    screenshots,
    isAnalyzing,
    analysisResult,
    history,
    setInputType,
    setUploadedFile,
    setRawText,
    addScreenshot,
    removeScreenshot,
    reorderScreenshots,
    setIsAnalyzing,
    setAnalysisResult,
    toggleChecklistItem,
    clearActiveInput,
    deleteHistoryItem,
  } = useOfferAnalyzerStore()

  const [viewTab, setViewTab] = useState('analyzer') // 'analyzer' | 'history'
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedQuestionId, setCopiedQuestionId] = useState(null)
  const [expandedClauseId, setExpandedClauseId] = useState(null)

  // 1. Single File Upload Handler (PDF or Image)
  const handleSingleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorMessage('')

    const name = file.name.toLowerCase()
    const isValidPdf = inputType === 'pdf' && name.endsWith('.pdf')
    const isValidImg = inputType === 'image' && (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp'))

    if (!isValidPdf && !isValidImg && inputType !== 'text') {
      setErrorMessage(`Invalid file format for ${inputType.toUpperCase()}. Please upload a supported document.`)
      return
    }

    setUploadedFile({ file, name: file.name, size: file.size, type: file.type })
  }

  // 2. Multi-Screenshot Upload Handler
  const handleMultiScreenshotUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setErrorMessage('')

    files.forEach((file, i) => {
      const url = URL.createObjectURL(file)
      addScreenshot({
        id: 'sc-' + Date.now() + '-' + i,
        file,
        name: file.name,
        url,
        order: screenshots.length + i + 1,
        extractedText: `Extracted text excerpt from screenshot "${file.name}": "...employment conditional upon background verification and 60 days notice period..."`,
      })
    })
  }

  // Screenshot Reordering Helpers
  const handleMoveScreenshot = (index, direction) => {
    const newSc = [...screenshots]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSc.length) return
    const temp = newSc[index]
    newSc[index] = newSc[targetIndex]
    newSc[targetIndex] = temp
    // Update order props
    const reordered = newSc.map((item, idx) => ({ ...item, order: idx + 1 }))
    reorderScreenshots(reordered)
  }

  // 3. Load Sample Offer Letter
  const handleLoadSample = (sampleKey) => {
    const sample = SAMPLE_OFFER_LETTERS[sampleKey]
    if (!sample) return
    clearActiveInput()
    setErrorMessage('')
    setInputType(sample.type)

    if (sample.type === 'pdf' || sample.type === 'text') {
      setUploadedFile({ name: sample.name + '.pdf', size: sample.text.length * 2, type: 'application/pdf' })
      setRawText(sample.text)
      runAnalysis({ inputType: sample.type, uploadedFile: { name: sample.name }, rawText: sample.text, screenshots: [] })
    } else if (sample.type === 'screenshots') {
      addScreenshot({
        id: 'sc-sample-1',
        name: 'Screenshot_Page2.png',
        url: '',
        order: 1,
        extractedText: sample.text,
      })
      runAnalysis({ inputType: 'screenshots', screenshots: [{ id: 'sc-sample-1', name: 'Screenshot_Page2.png', extractedText: sample.text }] })
    }
  }

  // 4. Run Analysis
  const runAnalysis = async (customState = null) => {
    const stateToUse = customState || { inputType, uploadedFile, rawText, screenshots }
    setErrorMessage('')
    setIsAnalyzing(true)

    try {
      const processed = await processOfferInput(stateToUse)
      const result = await analyzeOfferLetter(processed.text, processed.metadata)
      setAnalysisResult(result)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to analyze offer letter. Please check input.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyQuestion = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedQuestionId(id)
    setTimeout(() => setCopiedQuestionId(null), 2000)
  }

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-info-500/10 text-info-400 border border-info-500/20">
              <Mail className="w-4 h-4" />
            </span>
            <Badge variant="info" className="text-xs font-semibold uppercase tracking-wider">
              Employment Contract Decision Support
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            Offer Letter Analyzer
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Upload an employment offer as a PDF, image, single or multiple screenshots, or paste text to audit 31 key terms,
            identify potential concerns objectively, and generate HR verification questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={viewTab === 'analyzer' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewTab('analyzer')}
            className="gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Analyzer</span>
          </Button>

          <Button
            variant={viewTab === 'history' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewTab('history')}
            className="gap-1.5"
          >
            <History className="w-4 h-4" />
            <span>Analyses History ({history.length})</span>
          </Button>
        </div>
      </div>

      {/* Quick Sample Presets */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Quick Samples for Testing:
        </span>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="xs" onClick={() => handleLoadSample('standard')}>
            Standard MNC Offer (Low Concern)
          </Button>
          <Button variant="outline" size="xs" onClick={() => handleLoadSample('startup')}>
            Startup Offer (Notice & Variable Pay)
          </Button>
          <Button variant="outline" size="xs" onClick={() => handleLoadSample('screenshot')}>
            Screenshot Excerpt Demo
          </Button>
          {analysisResult && (
            <Button variant="ghost" size="xs" onClick={clearActiveInput} className="text-error-400">
              Clear Input
            </Button>
          )}
        </div>
      </Card>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-500/10 border border-error-500/30 text-error-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ─── TAB: HISTORY ────────────────────────────────────────── */}
      {viewTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-dark-text-primary">Saved Offer Letter Analyses</h3>

          <div className="space-y-3">
            {history.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-dark-text-primary">{item.companyName}</span>
                    <Badge variant="outline" className="text-[10px]">{item.jobTitle}</Badge>
                    <Badge
                      variant={item.safetyLevel === 'LOW' ? 'success' : item.safetyLevel === 'MEDIUM' ? 'warning' : 'error'}
                      className="text-[10px]"
                    >
                      {item.safetyLevel} Concern
                    </Badge>
                  </div>
                  <p className="text-xs text-dark-text-muted">
                    Salary: <span className="text-dark-text-secondary">{item.salary}</span> • Joining: {item.joiningDate} • Date: {new Date(item.dateAnalyzed).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-dark-text-muted font-mono text-[11px]">
                    Source: {item.fileName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 text-dark-text-muted hover:text-error-400"
                    title="Delete saved analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: ANALYZER WORKSPACE ────────────────────────────── */}
      {viewTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Input Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-dark-card border border-dark-border rounded-xl text-center text-xs">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'image', label: 'Image', icon: Image },
                { id: 'screenshots', label: 'Screenshots', icon: Camera },
                { id: 'text', label: 'Paste Text', icon: FileCheck },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInputType(tab.id)}
                    className={clsx(
                      'py-2 rounded-lg font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px]',
                      inputType === tab.id
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-dark-text-muted hover:text-dark-text-primary'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <Card className="p-5 space-y-4">
              {/* Option 1: PDF Upload */}
              {inputType === 'pdf' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-dark-text-primary uppercase tracking-wider">Upload Offer PDF</h3>
                  <label className="border-2 border-dashed border-dark-border hover:border-brand-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-bg/40 transition-colors">
                    <input type="file" accept=".pdf" onChange={handleSingleFileUpload} className="hidden" />
                    <FileText className="w-8 h-8 text-brand-400" />
                    <span className="text-xs font-semibold text-dark-text-primary">Select or Drop PDF File</span>
                    <span className="text-[10px] text-dark-text-muted">Extracts structured clauses and text</span>
                  </label>
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-dark-bg/60 border border-dark-border flex items-center justify-between text-xs">
                      <span className="font-semibold truncate text-dark-text-primary">{uploadedFile.name}</span>
                      <Badge variant="success" className="text-[10px]">{(uploadedFile.size / 1024).toFixed(0)} KB</Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Option 2: Image Upload */}
              {inputType === 'image' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-dark-text-primary uppercase tracking-wider">Upload Offer Image</h3>
                  <label className="border-2 border-dashed border-dark-border hover:border-brand-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-bg/40 transition-colors">
                    <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleSingleFileUpload} className="hidden" />
                    <Image className="w-8 h-8 text-brand-400" />
                    <span className="text-xs font-semibold text-dark-text-primary">Upload Single Image / Offer Letter Scan</span>
                    <span className="text-[10px] text-dark-text-muted">JPG, JPEG, PNG, WEBP</span>
                  </label>
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-dark-bg/60 border border-dark-border flex items-center justify-between text-xs">
                      <span className="font-semibold truncate text-dark-text-primary">{uploadedFile.name}</span>
                      <Badge variant="success" className="text-[10px]">Loaded</Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Option 3: Multiple Screenshots with Reordering */}
              {inputType === 'screenshots' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-dark-text-primary uppercase tracking-wider">Upload Multiple Screenshots</h3>
                    <span className="text-[11px] text-dark-text-muted">{screenshots.length} Screenshots</span>
                  </div>

                  <label className="border-2 border-dashed border-dark-border hover:border-brand-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-dark-bg/40 transition-colors text-center">
                    <input type="file" multiple accept="image/*" onChange={handleMultiScreenshotUpload} className="hidden" />
                    <Camera className="w-6 h-6 text-brand-400" />
                    <span className="text-xs font-semibold text-dark-text-primary">Add Screenshots (Select multiple)</span>
                    <span className="text-[10px] text-dark-text-muted">Order is preserved for multi-page offers</span>
                  </label>

                  {/* Screenshots Thumbnail & Order Grid */}
                  <div className="space-y-2">
                    {screenshots.map((sc, index) => (
                      <div key={sc.id} className="p-2.5 rounded-xl bg-dark-bg/60 border border-dark-border flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-bold">
                            #{index + 1}
                          </span>
                          <span className="truncate font-medium text-dark-text-primary">{sc.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveScreenshot(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-dark-text-muted hover:text-dark-text-primary disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveScreenshot(index, 'down')}
                            disabled={index === screenshots.length - 1}
                            className="p-1 text-dark-text-muted hover:text-dark-text-primary disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeScreenshot(sc.id)}
                            className="p-1 text-dark-text-muted hover:text-error-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 4: Paste Text */}
              {inputType === 'text' && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-dark-text-primary uppercase tracking-wider">Paste Offer Letter Text</h3>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste the full text or clauses of your offer letter here..."
                    className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-dark-text-primary focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                onClick={() => runAnalysis()}
                disabled={isAnalyzing}
                className="w-full shadow-lg shadow-brand-500/20 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Offer Terms...' : 'Analyze Offer Letter'}</span>
              </Button>
            </Card>
          </div>

          {/* Right Column: Analysis Dashboard & Results */}
          <div className="lg:col-span-7 space-y-5">
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  {/* Safety & Clarity Assessment Banner */}
                  <Card className="p-6 bg-gradient-to-br from-dark-card via-dark-card/90 to-brand-950/20 border-brand-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              analysisResult.safetyAssessment.level === 'LOW'
                                ? 'success'
                                : analysisResult.safetyAssessment.level === 'MEDIUM'
                                ? 'warning'
                                : analysisResult.safetyAssessment.level === 'HIGH'
                                ? 'error'
                                : 'outline'
                            }
                            className="text-xs font-bold px-2.5 py-1"
                          >
                            {analysisResult.safetyAssessment.level} CONCERN
                          </Badge>
                          <span className="text-xs text-dark-text-muted">Evidence-Based Assessment</span>
                        </div>
                        <h2 className="text-xl font-bold text-dark-text-primary">
                          {analysisResult.safetyAssessment.label}
                        </h2>
                      </div>

                      <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black shadow-lg"
                        style={{
                          borderColor:
                            analysisResult.safetyAssessment.level === 'LOW' ? '#10b981' : analysisResult.safetyAssessment.level === 'MEDIUM' ? '#f59e0b' : '#ef4444',
                          backgroundColor: 'rgba(15, 23, 42, 0.6)'
                        }}
                      >
                        {analysisResult.transitionSafety?.isInsufficient ? 'N/A' : (analysisResult.transitionSafety?.score || analysisResult.safetyAssessment.score)}
                      </div>
                    </div>

                    {/* Transition Safety Quick Summary */}
                    {analysisResult.transitionSafety && (
                      <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-brand-400 uppercase tracking-wider block text-[10px]">Transition Safety Score:</span>
                          <span className="text-dark-text-primary font-bold text-sm">
                            {analysisResult.transitionSafety.scoreText}
                          </span>
                          <span className="text-dark-text-muted text-[11px] block">{analysisResult.transitionSafety.riskLabel}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <a
                            href="/app/job-switch-readiness"
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] transition-colors"
                          >
                            View Job Switch Readiness
                          </a>
                          <a
                            href="/app/compare-offers"
                            className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:bg-dark-hover text-surface-200 font-bold text-[11px] transition-colors"
                          >
                            Compare Offers
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-dark-bg/60 border border-dark-border text-xs text-dark-text-secondary space-y-1">
                      <span className="font-semibold text-dark-text-primary">Assessment Rationale:</span>
                      <ul className="list-disc ml-4 space-y-0.5">
                        {analysisResult.safetyAssessment.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  {/* Summary Overview Grid */}
                  <Card className="p-5 space-y-4">
                    <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-400" /> Extracted Offer Summary
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Employer</span>
                        <div className="font-semibold text-dark-text-primary truncate">{analysisResult.summary.company}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Role</span>
                        <div className="font-semibold text-dark-text-primary truncate">{analysisResult.summary.role}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Salary / CTC</span>
                        <div className="font-semibold text-emerald-400 truncate">{analysisResult.summary.salary}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Joining Date</span>
                        <div className="font-semibold text-dark-text-primary truncate">{analysisResult.summary.joiningDate}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Work Mode</span>
                        <div className="font-semibold text-dark-text-primary truncate">{analysisResult.summary.workMode}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border space-y-0.5">
                        <span className="text-dark-text-muted">Probation</span>
                        <div className="font-semibold text-dark-text-primary truncate">{analysisResult.summary.probation}</div>
                      </div>
                    </div>
                  </Card>

                  {/* Missing Information Matrix */}
                  <Card className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-warning-400" /> Information & Disclosure Status
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {analysisResult.missingInfo.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-dark-bg/60 border border-dark-border flex items-center justify-between gap-2">
                          <span className="font-medium text-dark-text-secondary">{item.category}</span>
                          <Badge
                            variant={item.status === 'mentioned' ? 'success' : item.status === 'clarification' ? 'warning' : 'outline'}
                            className="text-[10px]"
                          >
                            {item.status === 'mentioned' ? '✓ Mentioned' : item.status === 'clarification' ? '⚠ Clarification' : '? Not Mentioned'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Clause-by-Clause Analysis Cards (6 Fields Per Card) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-dark-text-primary uppercase tracking-wider">
                      Clause-by-Clause Analysis ({analysisResult.clauses.length} Clauses Identified)
                    </h3>

                    {analysisResult.clauses.map((c) => (
                      <Card key={c.id} className="p-5 space-y-3 border-dark-border">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="brand" className="text-[10px] font-semibold">{c.category}</Badge>
                          <Badge
                            variant={c.concernLevel === 'HIGH' ? 'error' : c.concernLevel === 'MEDIUM' ? 'warning' : 'success'}
                            className="text-[10px]"
                          >
                            {c.concern}
                          </Badge>
                        </div>

                        {/* 1. Clause Excerpt */}
                        <div className="p-3 rounded-xl bg-dark-bg border border-dark-border/60 text-xs font-mono text-emerald-400">
                          <strong className="text-dark-text-muted block text-[10px] uppercase tracking-wider mb-1">Clause Excerpt:</strong>
                          "{c.clause}"
                        </div>

                        {/* 2. Simple Explanation */}
                        <div className="text-xs text-dark-text-secondary space-y-1">
                          <strong className="text-dark-text-primary block font-semibold">Simple Explanation:</strong>
                          <p>{c.explanation}</p>
                        </div>

                        {/* 3. Why It Matters & 4. Potential Concern */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border space-y-1">
                            <strong className="text-info-400 block text-[11px]">Why It Matters:</strong>
                            <p className="text-dark-text-secondary">{c.whyItMatters}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border space-y-1">
                            <strong className="text-amber-400 block text-[11px]">Potential Concern:</strong>
                            <p className="text-dark-text-secondary">{c.concern}</p>
                          </div>
                        </div>

                        {/* 5. What to Verify & 6. HR Question */}
                        <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs space-y-2">
                          <div>
                            <strong className="text-brand-400 block mb-0.5">What To Verify:</strong>
                            <p className="text-dark-text-secondary">{c.verify}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-500/20">
                            <div className="space-y-0.5 flex-1">
                              <strong className="text-dark-text-primary block text-[11px]">Question To Ask HR:</strong>
                              <p className="text-brand-300 italic font-sans">"{c.hrQuestion}"</p>
                            </div>
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => handleCopyQuestion(c.hrQuestion, c.id)}
                              className="flex-shrink-0"
                            >
                              {copiedQuestionId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* HR Question Generator */}
                  <Card className="p-5 space-y-4">
                    <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-brand-400" /> Auto-Generated Questions for HR
                    </h3>

                    <div className="space-y-2.5">
                      {analysisResult.hrQuestions.map((q) => (
                        <div key={q.id} className="p-3.5 rounded-xl bg-dark-bg/60 border border-dark-border flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-brand-400">{q.topic}</span>
                            <p className="text-dark-text-primary font-medium">"{q.question}"</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleCopyQuestion(q.question, q.id)}
                            className="flex-shrink-0"
                          >
                            {copiedQuestionId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Verification Checklist */}
                  <Card className="p-5 space-y-4">
                    <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-success-400" /> Offer Verification Checklist
                    </h3>

                    <div className="space-y-2 text-xs">
                      {analysisResult.checklist.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-dark-bg/60 border border-dark-border cursor-pointer hover:bg-dark-bg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id)}
                            className="mt-0.5 rounded border-dark-border text-brand-500 focus:ring-brand-500"
                          />
                          <span className={clsx('flex-1 text-dark-text-primary', item.completed && 'line-through text-dark-text-muted')}>
                            {item.title}
                          </span>
                          <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        </label>
                      ))}
                    </div>
                  </Card>

                  {/* Legal Disclaimer */}
                  <div className="p-4 rounded-xl bg-dark-card border border-dark-border text-dark-text-muted text-[11px] leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Disclaimer:</strong> This tool provides document analysis and general informational guidance.
                      It does not provide legal advice or guarantee that an offer is safe, genuine, or legally valid. Verify important employment
                      terms directly with the employer and consult a qualified professional when appropriate.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <Card className="p-12 text-center text-dark-text-muted space-y-3">
                  <Mail className="w-12 h-12 mx-auto text-dark-text-muted opacity-40" />
                  <h3 className="text-base font-bold text-dark-text-primary">No Offer Letter Analyzed Yet</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Upload a PDF, image, multiple screenshots, or paste text on the left, or click a quick sample preset above to run the 31-dimension offer contract audit.
                  </p>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
