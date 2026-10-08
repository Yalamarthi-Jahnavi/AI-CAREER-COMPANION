import { motion } from 'framer-motion'
import {
  Lightbulb,
  Cpu,
  GraduationCap,
  Calendar,
  Clock,
  Users,
  User,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'

export function IntakeForm() {
  const { intake, setIntakeField, generateSpec, isGenerating } = useProjectAssistantStore()

  const skillOptions = [
    { value: 'Beginner', label: 'Beginner', desc: 'Learning basics, guided structure & starter blueprints' },
    { value: 'Intermediate', label: 'Intermediate', desc: 'Comfortable with full-stack architectures & APIs' },
    { value: 'Advanced', label: 'Advanced', desc: 'Enterprise microservices, scalability & deep performance' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    generateSpec()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 font-sans text-slate-800"
    >
      {/* Header Banner - Dashboard Match */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-100/60 border border-blue-100 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Project Blueprint Assistant
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Describe Your Vision
            </h1>
            <p className="text-slate-600 mt-2 max-w-xl text-sm leading-relaxed">
              Provide your project details below. Our AI assistant will formulate a complete software specification, 14 architectural blueprints, and a realistic development timetable.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white/90 border border-blue-100 px-4 py-3 rounded-2xl shadow-xs shrink-0">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Instant 14-Section Spec & Timeline</span>
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-7 shadow-xs">
        {/* Project Idea */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Project Idea & Vision
          </label>
          <p className="text-xs text-slate-500">
            Briefly describe what your app does, who it serves, and key capabilities.
          </p>
          <textarea
            rows={4}
            value={intake.idea}
            onChange={(e) => setIntakeField('idea', e.target.value)}
            placeholder="e.g. An AI-powered SaaS dashboard for freelancing software engineers to manage client deadlines, generate invoices, and analyze code repositories..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed transition-all shadow-xs"
            required
          />
        </div>

        {/* Technology Stack & Skill Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technology */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Cpu className="w-4 h-4 text-blue-600" />
              Target Technology Stack
            </label>
            <p className="text-xs text-slate-500">
              Comma-separated list of frameworks, databases & tools.
            </p>
            <input
              type="text"
              value={intake.technology}
              onChange={(e) => setIntakeField('technology', e.target.value)}
              placeholder="e.g. React, Node.js, Express, PostgreSQL, TailwindCSS"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              required
            />
          </div>

          {/* Team / Individual */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Users className="w-4 h-4 text-indigo-600" />
              Development Setup
            </label>
            <p className="text-xs text-slate-500">
              Select whether this project is built solo or with a team.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              {[
                { type: 'Individual', icon: User, label: 'Solo Developer' },
                { type: 'Team', icon: Users, label: 'Team Project' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIntakeField('teamType', type)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                    intake.teamType === type
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Level Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            Developer Skill Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {skillOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => setIntakeField('skillLevel', opt.value)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  intake.skillLevel === opt.value
                    ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${intake.skillLevel === opt.value ? 'text-blue-900' : 'text-slate-900'}`}>{opt.label}</span>
                  {intake.skillLevel === opt.value && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline & Available Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Deadline */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-sky-600" />
              Target Deadline
            </label>
            <input
              type="date"
              value={intake.deadline}
              onChange={(e) => setIntakeField('deadline', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              required
            />
          </div>

          {/* Available Hours Per Day */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="w-4 h-4 text-amber-500" />
                Available Hours / Day
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {intake.availableHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={intake.availableHours}
              onChange={(e) => setIntakeField('availableHours', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>1 hr/day (Casual)</span>
              <span>4 hrs/day (Part-time)</span>
              <span>8+ hrs/day (Full-time)</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            type="submit"
            size="lg"
            loading={isGenerating}
            iconRight={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Generate Project Assistant Blueprint
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
