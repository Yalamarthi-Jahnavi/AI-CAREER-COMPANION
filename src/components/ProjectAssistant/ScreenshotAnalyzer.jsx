import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Upload, Image, X, AlertTriangle, CheckCircle2,
  Lightbulb, Search, Loader2,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'
import { analyzeScreenshot } from '../../api/projectAssistantApi'

const SEVERITY_MAP = {
  Critical: { color: 'error', icon: AlertTriangle },
  High:     { color: 'warning', icon: AlertTriangle },
  Medium:   { color: 'info', icon: Lightbulb },
  Low:      { color: 'success', icon: CheckCircle2 },
}

export function ScreenshotAnalyzer() {
  const {
    uploadedImage, screenshotAnalysis, isAnalyzing,
    setUploadedImage, setScreenshotAnalysis, setAnalyzing, clearScreenshot,
  } = useProjectAssistantStore()

  const [description, setDescription] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target.result)
      setScreenshotAnalysis(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleAnalyze = async () => {
    if (!description.trim() && !uploadedImage) return
    setAnalyzing(true)
    try {
      const result = await analyzeScreenshot(description || 'General screenshot analysis')
      setScreenshotAnalysis(result)
    } finally {
      setAnalyzing(false)
    }
  }

  const severityInfo = screenshotAnalysis ? SEVERITY_MAP[screenshotAnalysis.severity] || SEVERITY_MAP.Medium : null

  const colorMap = {
    error:   { bg: 'bg-error-500/10', border: 'border-error-500/25', text: 'text-error-400' },
    warning: { bg: 'bg-warning-500/10', border: 'border-warning-500/25', text: 'text-warning-400' },
    info:    { bg: 'bg-info-500/10', border: 'border-info-500/25', text: 'text-info-400' },
    success: { bg: 'bg-success-500/10', border: 'border-success-500/25', text: 'text-success-400' },
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            dragActive
              ? 'border-brand-500 bg-brand-500/5'
              : 'border-dark-border hover:border-surface-500 hover:bg-dark-hover/50'
          )}
          id="screenshot-dropzone"
        >
          <Upload className={clsx('w-8 h-8 mx-auto mb-3', dragActive ? 'text-brand-400' : 'text-surface-500')} />
          <p className="text-sm text-surface-300 font-medium">
            {dragActive ? 'Drop your screenshot here' : 'Drag & drop a screenshot or click to upload'}
          </p>
          <p className="text-xs text-surface-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
            id="screenshot-input"
          />
        </div>
      ) : (
        <div className="relative">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-dark-border">
            <img
              src={uploadedImage}
              alt="Uploaded screenshot"
              className="w-full max-h-[300px] object-contain bg-dark-surface"
            />
            <button
              onClick={clearScreenshot}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-bg/80 backdrop-blur text-surface-400 hover:text-error-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Description Input */}
      <div>
        <label className="block text-xs font-medium text-surface-400 mb-1.5">
          Describe the issue (optional but helpful)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 'Console showing red error after clicking submit button' or 'Layout breaks on mobile view'..."
          className="input min-h-[80px] resize-y text-sm"
          id="screenshot-description"
        />
      </div>

      {/* Analyze Button */}
      <Button
        variant="primary"
        size="md"
        icon={isAnalyzing ? Loader2 : Search}
        onClick={handleAnalyze}
        loading={isAnalyzing}
        disabled={!description.trim() && !uploadedImage}
        fullWidth
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Screenshot'}
      </Button>

      {/* Analysis Result */}
      <AnimatePresence>
        {screenshotAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {/* Severity Badge */}
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                  colorMap[severityInfo.color].bg,
                  colorMap[severityInfo.color].border,
                  colorMap[severityInfo.color].text,
                )}
              >
                <severityInfo.icon className="w-3 h-3" />
                {screenshotAnalysis.severity} Severity
              </span>
              <span className="text-xs text-surface-400">
                Issue Type: <strong className="text-surface-200">{screenshotAnalysis.issueType}</strong>
              </span>
            </div>

            {/* Analysis Content */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-2">Analysis</p>
              <div className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
                {screenshotAnalysis.analysis}
              </div>
            </div>

            {/* Suggestions */}
            {screenshotAnalysis.suggestions?.length > 0 && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-4">
                <p className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-warning-400" />
                  Suggestions
                </p>
                <ul className="space-y-2">
                  {screenshotAnalysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success-400 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
