import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Lightbulb, Code2, Gauge, CalendarClock, Users,
  ArrowRight, ArrowLeft, Sparkles, Check, Plus, X,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'
import { TECH_OPTIONS, SKILL_LEVELS } from '../../api/projectAssistantApi'

const STEPS = [
  { label: 'Project Info', icon: Lightbulb, description: 'Describe your project idea' },
  { label: 'Technology',   icon: Code2,     description: 'Choose your tech stack' },
  { label: 'Experience',   icon: Gauge,     description: 'Your skill level' },
  { label: 'Timeline',     icon: CalendarClock, description: 'Deadline & availability' },
  { label: 'Team',         icon: Users,     description: 'Team or solo?' },
]

const TECH_CATEGORIES = [...new Set(TECH_OPTIONS.map((t) => t.category))]

// ─── Step Progress Bar ────────────────────────────────────────
function StepProgress({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0',
              i < current
                ? 'bg-brand-600 text-white shadow-glow'
                : i === current
                  ? 'bg-brand-500/20 text-brand-400 border-2 border-brand-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-dark-surface text-surface-500 border border-dark-border'
            )}
          >
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-0.5 rounded-full bg-dark-border overflow-hidden">
              <motion.div
                className="h-full bg-brand-gradient rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: i < current ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Project Info ─────────────────────────────────────
function StepProjectInfo({ inputs, setInputs }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Project Name <span className="text-error-400">*</span>
        </label>
        <input
          type="text"
          value={inputs.projectName}
          onChange={(e) => setInputs({ projectName: e.target.value })}
          placeholder="e.g., TaskFlow Pro, HealthTracker AI, CodeCollab..."
          className="input"
          maxLength={80}
          id="wizard-project-name"
        />
        <p className="text-xs text-surface-500 mt-1">{inputs.projectName.length}/80 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Project Idea / Description <span className="text-error-400">*</span>
        </label>
        <textarea
          value={inputs.projectIdea}
          onChange={(e) => setInputs({ projectIdea: e.target.value })}
          placeholder="Describe what your project does, the problem it solves, who the target users are, and any key features you envision..."
          className="input min-h-[160px] resize-y"
          maxLength={1000}
          id="wizard-project-idea"
        />
        <p className="text-xs text-surface-500 mt-1">{inputs.projectIdea.length}/1000 characters</p>
      </div>
    </div>
  )
}

// ─── Step 2: Technology ───────────────────────────────────────
function StepTechnology({ inputs, setInputs }) {
  const [showOther, setShowOther] = useState(!!inputs.otherTech)

  const toggleTech = (id) => {
    const current = inputs.technologies
    if (current.includes(id)) {
      setInputs({ technologies: current.filter((t) => t !== id) })
    } else {
      setInputs({ technologies: [...current, id] })
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-400">
        Select the technologies you plan to use. You can pick multiple.
      </p>

      {TECH_CATEGORIES.map((category) => (
        <div key={category}>
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">{category}</p>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.filter((t) => t.category === category).map((tech) => {
              const selected = inputs.technologies.includes(tech.id)
              return (
                <button
                  key={tech.id}
                  onClick={() => toggleTech(tech.id)}
                  className={clsx(
                    'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    selected
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                      : 'bg-dark-surface text-surface-400 border border-dark-border hover:border-surface-500 hover:text-surface-200'
                  )}
                  id={`wizard-tech-${tech.id}`}
                >
                  <span className="text-base">{tech.icon}</span>
                  {tech.name}
                  {selected && <Check className="w-3.5 h-3.5 text-brand-400" />}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Other tech */}
      <div>
        {!showOther ? (
          <button
            onClick={() => setShowOther(true)}
            className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-brand-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add other technology
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputs.otherTech}
              onChange={(e) => setInputs({ otherTech: e.target.value })}
              placeholder="e.g., GraphQL, Supabase, Kafka..."
              className="input flex-1"
              id="wizard-other-tech"
            />
            <button
              onClick={() => { setInputs({ otherTech: '' }); setShowOther(false) }}
              className="p-2.5 rounded-xl text-surface-500 hover:text-error-400 hover:bg-dark-hover transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {inputs.technologies.length > 0 && (
        <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
          <p className="text-xs font-medium text-brand-300">
            Selected: {inputs.technologies.map((id) => TECH_OPTIONS.find((t) => t.id === id)?.name || id).join(', ')}
            {inputs.otherTech ? `, ${inputs.otherTech}` : ''}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Experience ───────────────────────────────────────
function StepExperience({ inputs, setInputs }) {
  const levels = [
    { id: 'Beginner', label: 'Beginner', description: 'Learning the basics, first projects', icon: '🌱', detail: '0–1 years of experience' },
    { id: 'Intermediate', label: 'Intermediate', description: 'Comfortable with core concepts', icon: '🚀', detail: '1–3 years of experience' },
    { id: 'Advanced', label: 'Advanced', description: 'Deep expertise, production apps', icon: '⚡', detail: '3+ years of experience' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-surface-400">
        This helps generate a realistic timeline and appropriate complexity.
      </p>

      <div className="grid gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setInputs({ skillLevel: level.id })}
            className={clsx(
              'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left',
              inputs.skillLevel === level.id
                ? 'bg-brand-600/15 border-brand-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                : 'bg-dark-surface border-dark-border hover:border-surface-500 hover:bg-dark-hover'
            )}
            id={`wizard-level-${level.id.toLowerCase()}`}
          >
            <span className="text-3xl">{level.icon}</span>
            <div className="flex-1">
              <p className={clsx(
                'text-sm font-semibold',
                inputs.skillLevel === level.id ? 'text-brand-300' : 'text-surface-200'
              )}>
                {level.label}
              </p>
              <p className="text-xs text-surface-400 mt-0.5">{level.description}</p>
              <p className="text-[10px] text-surface-500 mt-1">{level.detail}</p>
            </div>
            {inputs.skillLevel === level.id && (
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 4: Timeline ─────────────────────────────────────────
function StepTimeline({ inputs, setInputs }) {
  // Default to 30 days from today if no deadline set
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Project Deadline <span className="text-error-400">*</span>
        </label>
        <input
          type="date"
          value={inputs.deadline}
          onChange={(e) => setInputs({ deadline: e.target.value })}
          min={minDate}
          className="input"
          id="wizard-deadline"
        />
        {inputs.deadline && (
          <p className="text-xs text-surface-400 mt-1.5">
            {Math.ceil((new Date(inputs.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days from today
            ({Math.ceil(Math.ceil((new Date(inputs.deadline) - new Date()) / (1000 * 60 * 60 * 24)) / 7)} weeks)
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Available Hours Per Day: <span className="text-brand-400 font-bold">{inputs.dailyHours}h</span>
        </label>
        <input
          type="range"
          min={1}
          max={12}
          step={0.5}
          value={inputs.dailyHours}
          onChange={(e) => setInputs({ dailyHours: parseFloat(e.target.value) })}
          className="w-full accent-brand-500 h-2 rounded-full bg-dark-border appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
            [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-pointer"
          id="wizard-daily-hours"
        />
        <div className="flex justify-between text-[10px] text-surface-500 mt-1">
          <span>1h</span>
          <span>4h</span>
          <span>8h</span>
          <span>12h</span>
        </div>
      </div>

      {inputs.deadline && (
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/15">
          <p className="text-xs font-medium text-brand-300 mb-1">Total Available Hours</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(
              Math.ceil((new Date(inputs.deadline) - new Date()) / (1000 * 60 * 60 * 24)) *
              inputs.dailyHours
            )} hours
          </p>
          <p className="text-xs text-surface-400 mt-1">
            Based on {inputs.dailyHours}h/day for {Math.ceil((new Date(inputs.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Step 5: Team ─────────────────────────────────────────────
function StepTeam({ inputs, setInputs }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-surface-400 mb-4">Working solo or with a team?</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'individual', label: 'Individual', icon: '🧑‍💻', desc: 'Working solo on this project' },
            { id: 'team', label: 'Team', icon: '👥', desc: 'Working with other developers' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setInputs({ teamType: option.id })}
              className={clsx(
                'p-4 rounded-xl border text-center transition-all duration-200',
                inputs.teamType === option.id
                  ? 'bg-brand-600/15 border-brand-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'bg-dark-surface border-dark-border hover:border-surface-500 hover:bg-dark-hover'
              )}
              id={`wizard-team-${option.id}`}
            >
              <span className="text-3xl block mb-2">{option.icon}</span>
              <p className={clsx(
                'text-sm font-semibold',
                inputs.teamType === option.id ? 'text-brand-300' : 'text-surface-200'
              )}>
                {option.label}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {inputs.teamType === 'team' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Team Size: <span className="text-brand-400 font-bold">{inputs.teamSize} developers</span>
            </label>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={inputs.teamSize}
              onChange={(e) => setInputs({ teamSize: parseInt(e.target.value) })}
              className="w-full accent-brand-500 h-2 rounded-full bg-dark-border appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
                [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-pointer"
              id="wizard-team-size"
            />
            <div className="flex justify-between text-[10px] text-surface-500 mt-1">
              <span>2</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────
export function WizardForm({ onGenerate }) {
  const { inputs, currentStep, setInputs, setStep, nextStep, prevStep } = useProjectAssistantStore()

  const stepValid = () => {
    switch (currentStep) {
      case 0: return inputs.projectName.trim().length > 0 && inputs.projectIdea.trim().length > 0
      case 1: return inputs.technologies.length > 0 || inputs.otherTech.trim().length > 0
      case 2: return inputs.skillLevel.length > 0
      case 3: return inputs.deadline.length > 0
      case 4: return true
      default: return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepProjectInfo inputs={inputs} setInputs={setInputs} />
      case 1: return <StepTechnology inputs={inputs} setInputs={setInputs} />
      case 2: return <StepExperience inputs={inputs} setInputs={setInputs} />
      case 3: return <StepTimeline inputs={inputs} setInputs={setInputs} />
      case 4: return <StepTeam inputs={inputs} setInputs={setInputs} />
      default: return null
    }
  }

  const StepIcon = STEPS[currentStep].icon

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <StepProgress current={currentStep} total={STEPS.length} />

      {/* Step Labels */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        {STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => i <= currentStep && setStep(i)}
            className={clsx(
              'text-xs font-medium transition-colors',
              i <= currentStep ? 'text-surface-300 cursor-pointer hover:text-brand-400' : 'text-surface-600 cursor-default'
            )}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{STEPS[currentStep].label}</h3>
            <p className="text-xs text-surface-400">{STEPS[currentStep].description}</p>
          </div>
          <span className="ml-auto text-xs text-surface-500 font-mono">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* Animated Step Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              onClick={nextStep}
              disabled={!stepValid()}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={onGenerate}
              disabled={!stepValid()}
              className="shadow-glow"
            >
              Generate Blueprint
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
