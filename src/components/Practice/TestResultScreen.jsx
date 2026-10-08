import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Clock,
  Check,
  X,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Star,
  Target,
  Compass,
  AlertTriangle,
  Sparkles,
  Code,
  History,
  Calendar,
  Lightbulb,
  CheckSquare,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { usePracticeStore } from '../../store/usePracticeStore'
import { useDeadlinePlannerStore } from '../../store/useDeadlinePlannerStore'

export function TestResultScreen() {
  const navigate = useNavigate()
  const {
    results,
    retakeTest,
    resetToConfig,
    practiceWeakTopics,
    selectedTech,
    selectedDifficulty,
  } = usePracticeStore()

  const {
    proposedChange,
    acceptProposedChange,
    declineProposedChange,
  } = useDeadlinePlannerStore()

  if (!results) return null

  const minutesSpent = Math.floor((results.timeSpentSeconds || 0) / 60)
  const secondsSpent = (results.timeSpentSeconds || 0) % 60
  const formattedTimeSpent = `${minutesSpent}m ${secondsSpent}s`

  const techTitle = selectedTech.charAt(0).toUpperCase() + selectedTech.slice(1)
  const scoreDisplay = results.scoreOutOf100 || `${results.scorePercentage}/100`
  const starCount = results.starsCount || 1

  // 5 score breakdown categories
  const breakdownCategories = [
    {
      key: 'conceptUnderstanding',
      label: 'Concept Understanding',
      score: results.breakdown?.conceptUnderstanding ?? results.scorePercentage,
      icon: Lightbulb,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      key: 'practicalApplication',
      label: 'Practical Application',
      score: results.breakdown?.practicalApplication ?? results.scorePercentage,
      icon: Code,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'problemSolving',
      label: 'Problem Solving',
      score: results.breakdown?.problemSolving ?? results.scorePercentage,
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      key: 'codeQuality',
      label: 'Code Quality',
      score: results.breakdown?.codeQuality ?? results.scorePercentage,
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
    },
    {
      key: 'bestPractices',
      label: 'Best Practices',
      score: results.breakdown?.bestPractices ?? results.scorePercentage,
      icon: Award,
      color: 'from-rose-500 to-pink-500',
    },
  ]

  const starLegend = [
    { range: '90–100', stars: '⭐⭐⭐⭐⭐', tier: 'Mastery' },
    { range: '80–89', stars: '⭐⭐⭐⭐', tier: 'Proficient' },
    { range: '70–79', stars: '⭐⭐⭐', tier: 'Competent' },
    { range: '60–69', stars: '⭐⭐', tier: 'Developing' },
    { range: 'Below 60', stars: '⭐', tier: 'Foundation' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 text-slate-800 font-sans">
      {/* ─── 1. Header Banner & Score Display ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Test Completed!
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {techTitle}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {selectedDifficulty}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Technology: <strong className="text-slate-900">{techTitle}</strong> • Difficulty:{' '}
              <strong className="text-slate-900">{selectedDifficulty}</strong> • Time Taken:{' '}
              <strong className="text-slate-900">{formattedTimeSpent}</strong>
            </p>
          </div>

          {/* Primary Score & Star Display */}
          <div className="flex flex-col items-center md:items-end justify-center bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5">
            <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Final Score
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600">
              {scoreDisplay}
            </div>

            {/* Stars visual display */}
            <div className="flex items-center gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map((index) => {
                const isFilled = index <= starCount
                return (
                  <Star
                    key={index}
                    className={`w-5 h-5 transition-transform ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs scale-110'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                )
              })}
            </div>
            <div className="text-xs font-bold text-amber-600 mt-1.5">
              {results.starString || '⭐⭐⭐⭐⭐'}
            </div>
          </div>
        </div>

        {/* ─── IMPORTANT Motivational Disclaimer ──────────────── */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong className="text-amber-900 font-semibold block mb-0.5">Notice:</strong>
              Stars and metrics are motivational progress indicators. They reflect performance on this specific assessment set.
            </div>
          </div>
        </div>

        {/* Star system tiers legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {starLegend.map((tier) => {
            const isCurrent =
              (tier.range === '90–100' && results.scorePercentage >= 90) ||
              (tier.range === '80–89' && results.scorePercentage >= 80 && results.scorePercentage < 90) ||
              (tier.range === '70–79' && results.scorePercentage >= 70 && results.scorePercentage < 80) ||
              (tier.range === '60–69' && results.scorePercentage >= 60 && results.scorePercentage < 70) ||
              (tier.range === 'Below 60' && results.scorePercentage < 60)

            return (
              <div
                key={tier.range}
                className={`p-2.5 rounded-xl text-center border transition-all ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200/70 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-bold">{tier.range}</div>
                <div className="text-xs my-0.5">{tier.stars}</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold opacity-90">
                  {tier.tier}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ─── PROPOSED SCHEDULE ADAPTATION BANNER ──────────────── */}
      <AnimatePresence>
        {proposedChange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`p-6 rounded-2xl border shadow-xs relative overflow-hidden ${
              proposedChange.type === 'level_up'
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      proposedChange.type === 'level_up'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Proposed Schedule Adaptation (Requires Your Approval)
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {proposedChange.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {proposedChange.reason}
                </p>

                {/* Proposed vs Current summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Current Plan
                    </span>
                    <span className="text-slate-700">
                      {proposedChange.currentPlanSummary}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl text-xs border ${
                      proposedChange.type === 'level_up'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block mb-1">
                      Proposed Adaptive Adjustment
                    </span>
                    <span className="font-semibold">
                      {proposedChange.proposedPlanSummary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 flex-shrink-0">
                <Button
                  variant={proposedChange.type === 'level_up' ? 'success' : 'primary'}
                  size="md"
                  onClick={acceptProposedChange}
                  icon={Check}
                >
                  Accept & Update Schedule
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={declineProposedChange}
                  icon={X}
                >
                  Keep Current Schedule
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/app/deadline-planner')}
                  icon={Compass}
                >
                  Open in Deadline Planner
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. SHOW SCORE BREAKDOWN ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">
              Score Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Deterministic competency rating calculated from your actual responses
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            5 Core Dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdownCategories.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.key}
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {item.score}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ─── 3. DETAILED FEEDBACK ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">
              Detailed Feedback
            </h2>
            <p className="text-xs text-slate-500">
              Personalized strengths, weaknesses, and study recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What you did well */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What You Did Well
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              {results.feedback?.whatYouDidWell}
            </p>
          </div>

          {/* What you need to improve */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-600" />
              What You Need to Improve
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {results.feedback?.whatYouNeedToImprove}
            </p>
          </div>
        </div>

        {/* Topics you got wrong */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            Topics You Got Wrong
          </div>

          {results.feedback?.topicsWrong && results.feedback.topicsWrong.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {results.feedback.topicsWrong.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              🎉 Excellent! You answered every tested topic correctly.
            </div>
          )}
        </div>

        {/* Recommended Learning Topics & Practice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recommended learning topics */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Recommended Learning Topics
            </div>
            <ul className="space-y-2">
              {results.feedback?.recommendedLearningTopics?.map((topic, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended practice */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              Recommended Practice
            </div>
            <ul className="space-y-2">
              {results.feedback?.recommendedPractice?.map((drill, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <span>{drill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ─── 4. RECOMMENDED NEXT STEPS ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border border-blue-100 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Recommended Next Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.nextSteps?.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs"
            >
              <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── 5. ACTION BUTTONS ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={retakeTest}
            icon={RotateCcw}
          >
            Retake Test
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={practiceWeakTopics}
            icon={Target}
          >
            Practice Weak Topics
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/app/technology-progress')}
            icon={TrendingUp}
          >
            Technology Progress
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/app/learning-planner')}
            icon={Compass}
          >
            View Learning Roadmap
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/deadline-planner')}
            icon={Calendar}
          >
            Deadline Planner
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/history')}
            icon={History}
          >
            Assessment History
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetToConfig}
            icon={Plus}
          >
            New Test
          </Button>
        </div>
      </div>

      {/* ─── 6. Question-by-Question Solution Review ──────────── */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Detailed Solution Review ({results.review?.length || 0} Questions)
          </h3>
          <span className="text-xs text-slate-500">
            Answers & Verified Explanations
          </span>
        </div>

        <div className="space-y-4">
          {results.review?.map((item, idx) => {
            const isCorrect = item.isCorrect
            const optionLetters = ['A', 'B', 'C', 'D', 'E']

            return (
              <motion.div
                key={item.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`p-5 rounded-2xl border bg-white shadow-xs space-y-4 ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      Q{idx + 1}.
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-500">{item.topic}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-700 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                        <X className="w-3.5 h-3.5 stroke-[3] text-rose-600" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <h4 className="font-semibold text-slate-900 text-sm leading-relaxed">
                  {item.question}
                </h4>

                {/* Code block if any - Dark VS code styling */}
                {item.code && (
                  <pre className="p-3.5 rounded-xl bg-[#181825] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                    <code>{item.code}</code>
                  </pre>
                )}

                {/* Answer Options Breakdown */}
                <div className="space-y-2 pt-1">
                  {item.options?.map((opt, optIdx) => {
                    const isUserChoice = item.selectedAnswer === optIdx
                    const isTheCorrectAnswer = item.correctAnswer === optIdx

                    let borderClass =
                      'border-slate-200 bg-slate-50/50 text-slate-700'
                    if (isTheCorrectAnswer) {
                      borderClass =
                        'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                    } else if (isUserChoice && !isCorrect) {
                      borderClass =
                        'border-rose-300 bg-rose-50 text-rose-900 font-semibold'
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${borderClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                            {optionLetters[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                          {isUserChoice && (
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              Your Choice
                            </span>
                          )}
                          {isTheCorrectAnswer && (
                            <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-blue-900 block mb-0.5">Explanation:</strong>
                  {item.explanation}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
