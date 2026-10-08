import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  Star,
  Sparkles,
  ShieldAlert,
  Check,
  Lock,
  Compass,
  Code2,
  BarChart3,
  Lightbulb,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAssessmentHistoryStore } from '../store/useAssessmentHistoryStore'
import { usePracticeStore } from '../store/usePracticeStore'

export function TechnologyProgressTracking() {
  const navigate = useNavigate()
  const { getTechnologyProgress, getAchievementBadges, getStreakData } =
    useAssessmentHistoryStore()
  const { startTest } = usePracticeStore()

  const technologies = getTechnologyProgress()
  const badges = getAchievementBadges()
  const streakData = getStreakData()

  // Selected technology for the improvement graph
  const [selectedGraphTech, setSelectedGraphTech] = useState('react')

  const activeTechData = useMemo(() => {
    return (
      technologies.find((t) => t.id === selectedGraphTech) ||
      technologies[0] ||
      null
    )
  }, [technologies, selectedGraphTech])

  // Handle direct test launch
  const handleStartPractice = (tech) => {
    startTest({
      technology: tech.id,
      difficulty: tech.currentLevel || 'Intermediate',
      questionCount: 5,
      durationMinutes: 10,
    })
    navigate('/app/current-technology-practice')
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* ─── 1. Page Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Skill Mastery & Progress
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Technology Progress Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor your continuous learning progression, test improvement curves, and verified practice milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/app/history')}
            icon={Calendar}
          >
            Assessment History
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/app/current-technology-practice')}
            icon={Sparkles}
          >
            Start Practice Test
          </Button>
        </div>
      </div>

      {/* ─── 2. Learning Streak Banner ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-200 relative overflow-hidden shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold tracking-wide">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
              🔥 7 Day Practice Streak
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Consistency Builds Real Technical Fluency
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {streakData.encouragementMessage}
            </p>
          </div>

          {/* Streak Week Tracker */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Streak:
              </span>
              <span className="text-lg font-extrabold text-amber-600">
                {streakData.currentStreakDays} Days
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Best: {streakData.longestStreakDays} Days
              </span>
            </div>

            {/* Days dots */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              {streakData.weeklyDays.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 px-1.5">
                  <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-amber-100 border border-amber-300 text-amber-600'
                        : 'bg-slate-100 border border-slate-200 text-slate-400'
                    }`}
                  >
                    {item.completed ? (
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── 3. Improvement Graph Section ─────────────────────── */}
      <motion.div
        id="improvement-graph-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Score Progression Over Time
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Improvement Trajectory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual proof of continuous skill acquisition across consecutive practice sessions
            </p>
          </div>

          {/* Technology filter selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {technologies.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedGraphTech(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedGraphTech === t.id
                    ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Technology Progression Detail */}
        {activeTechData && activeTechData.rawAttempts.length > 0 ? (
          <div className="space-y-6">
            {/* Explicit Learning Trajectory Milestone Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center font-black text-base">
                  📈
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span>Target Learning Progression</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                      Demonstrated Growth
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    Consecutive assessment trajectory showing continuous skill development:
                  </div>
                </div>
              </div>

              {/* Explicit Sequence: Test 1 → 62 ➔ Test 2 → 71 ➔ Test 3 → 78 ➔ Test 4 → 92 */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm font-bold bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Test 1</span>
                  <span className="text-amber-600">→ 62</span>
                </div>
                <span className="text-slate-400 font-sans">➔</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Test 2</span>
                  <span className="text-amber-500">→ 71</span>
                </div>
                <span className="text-slate-400 font-sans">➔</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Test 3</span>
                  <span className="text-blue-600">→ 78</span>
                </div>
                <span className="text-slate-400 font-sans">➔</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Test 4</span>
                  <span className="text-emerald-600">→ 92</span>
                </div>
              </div>
            </div>

            {/* Step-by-step score cards */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Attempt Sequence: {activeTechData.name} ({activeTechData.rawAttempts.length} Tests)</span>
                <span className="text-emerald-600 font-bold">
                  {activeTechData.rawAttempts.length > 1 &&
                    `+${
                      activeTechData.rawAttempts[activeTechData.rawAttempts.length - 1].score -
                      activeTechData.rawAttempts[0].score
                    } pts Overall Growth`}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
                {activeTechData.rawAttempts.map((att, idx) => {
                  const isLast = idx === activeTechData.rawAttempts.length - 1
                  const isFirst = idx === 0

                  return (
                    <div key={idx} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div
                        className={`p-3 rounded-2xl border text-center min-w-[110px] transition-all ${
                          isLast
                            ? 'bg-blue-50 border-blue-400 shadow-xs'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          {att.label}
                        </div>
                        <div
                          className={`text-2xl font-black my-0.5 ${
                            att.score >= 90
                              ? 'text-emerald-600'
                              : att.score >= 75
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {att.score}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {att.difficulty}
                        </div>
                      </div>

                      {/* Arrow between tests */}
                      {!isLast && (
                        <div className="text-slate-400 flex items-center font-bold text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Visual Bar Chart (light background) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Score Curve (0–100%)</span>
                <span>Verified Attempts</span>
              </div>

              {/* Chart */}
              <div className="relative h-44 w-full flex items-end">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-slate-600 w-full" />
                  <div className="border-b border-slate-600 w-full" />
                  <div className="border-b border-slate-600 w-full" />
                  <div className="border-b border-slate-600 w-full" />
                </div>

                {/* Bars & Points */}
                <div className="w-full flex items-end justify-around h-full relative z-10 px-4">
                  {activeTechData.rawAttempts.map((att, i) => {
                    const heightPercent = Math.max(15, att.score)
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 group">
                        <span className="text-xs font-extrabold text-white opacity-90 group-hover:scale-110 transition-transform">
                          {att.score}%
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className={`w-10 sm:w-14 rounded-t-xl transition-all ${
                            att.score >= 90
                              ? 'bg-gradient-to-t from-emerald-600/30 to-emerald-400 border-t-2 border-emerald-300'
                              : att.score >= 75
                              ? 'bg-gradient-to-t from-blue-600/30 to-blue-400 border-t-2 border-blue-300'
                              : 'bg-gradient-to-t from-amber-600/30 to-amber-400 border-t-2 border-amber-300'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-slate-400 mt-1">
                          {att.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
            No assessment attempts recorded for {activeTechData?.name} yet. Take a test to start tracking!
          </div>
        )}
      </motion.div>

      {/* ─── 4. For Every Technology Cards ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Technology Skill Profiles
            </h2>
            <p className="text-xs text-slate-500">
              Verified level, progress, best score, tests completed, and star ratings per technology
            </p>
          </div>
          <Badge variant="brand" size="sm">
            {technologies.length} Technologies
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technologies.map((tech) => (
            <motion.div
              key={tech.id}
              whileHover={{ y: -2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all space-y-4 shadow-sm relative overflow-hidden"
            >
              {/* Card Top: Icon, Name, Level, Stars, Progress */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {tech.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {tech.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                        {tech.currentLevel}
                      </span>
                      <span className="text-xs text-amber-500 font-bold tracking-tight">
                        {tech.stars}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress % Display */}
                <div className="text-right">
                  <span className="text-base sm:text-lg font-extrabold text-blue-600 tracking-tight block">
                    {tech.progress}% Progress
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                    {tech.testsCompleted} Tests Completed
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                <div
                  style={{ width: `${tech.progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                />
              </div>

              {/* Stats Row: Best Score, Average Score, Tests Completed, Last Practice */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">
                    Best Score
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700">
                    Best: {tech.bestScoreFormatted}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">
                    Average Score
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-blue-700">
                    Avg: {tech.avgScoreFormatted}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">
                    Tests Completed
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Tests: {tech.testsCompleted}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">
                    Last Practice
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate block">
                    {tech.lastPractice}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGraphTech(tech.id)
                    const el = document.getElementById('improvement-graph-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  icon={TrendingUp}
                >
                  View Graph
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStartPractice(tech)}
                  icon={RotateCcw}
                >
                  Start Practice Test
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── 5. Achievement Badges ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Achievement Badges
            </h2>
            <p className="text-xs text-slate-500">
              Milestone accomplishments recognizing consistent dedication and technical progress
            </p>
          </div>
          <Badge variant="warning" size="sm">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 shadow-sm ${
                badge.unlocked
                  ? 'bg-white border-amber-300 shadow-amber-100'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                  {badge.icon}
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    badge.unlocked
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {badge.unlocked ? 'Unlocked' : 'In Progress'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{badge.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Requirement</span>
                <span
                  className={`font-bold ${
                    badge.unlocked ? 'text-amber-700' : 'text-slate-500'
                  }`}
                >
                  {badge.progress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── 6. Ethical Learning Transparency Notice ──────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start gap-4 shadow-xs"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block text-sm">
            Ethical Learning Transparency Notice
          </strong>
          <p>
            The purpose of progress percentages, stars, and achievement badges is to encourage
            continuous learning and personal study discipline.
          </p>
          <p className="text-slate-500">
            These metrics reflect sandbox test performance and problem-solving practice within the AI Career Companion platform.
            They are motivational progress indicators only and <strong>must not be interpreted as guaranteeing employment outcomes, interview selections, or job offers</strong>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
