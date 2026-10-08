import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  History,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  Eye,
  RotateCcw,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  Sparkles,
  X,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Code,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAssessmentHistoryStore } from '../store/useAssessmentHistoryStore'
import { usePracticeStore } from '../store/usePracticeStore'

const TECH_ICONS = {
  React: '⚛️',
  Python: '🐍',
  JavaScript: '💛',
  SQL: '🗄️',
  AWS: '☁️',
  Docker: '🐳',
  'Machine Learning': '🧠',
  RAG: '🔍',
}

export function AssessmentHistory() {
  const navigate = useNavigate()
  const { history, deleteAssessment, clearHistory } = useAssessmentHistoryStore()
  const { startTest } = usePracticeStore()

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTechFilter, setSelectedTechFilter] = useState('all')
  const [selectedDiffFilter, setSelectedDiffFilter] = useState('all')
  const [selectedDetail, setSelectedDetail] = useState(null)

  // Aggregated Stats
  const stats = useMemo(() => {
    if (history.length === 0) {
      return { total: 0, avgScore: 0, fiveStars: 0, topTech: 'None' }
    }
    const total = history.length
    const totalScore = history.reduce((acc, curr) => acc + (curr.score || 0), 0)
    const avgScore = Math.round(totalScore / total)
    const fiveStars = history.filter((h) => (h.stars || 0) >= 5).length

    // Most frequent or highest scoring tech
    const techCounts = {}
    history.forEach((h) => {
      techCounts[h.technology] = (techCounts[h.technology] || 0) + 1
    })
    const topTech =
      Object.keys(techCounts).sort((a, b) => techCounts[b] - techCounts[a])[0] ||
      'None'

    return { total, avgScore, fiveStars, topTech }
  }, [history])

  // Filtered List
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesTech =
        selectedTechFilter === 'all' ||
        item.technology.toLowerCase() === selectedTechFilter.toLowerCase()

      const matchesDiff =
        selectedDiffFilter === 'all' ||
        item.difficulty.toLowerCase() === selectedDiffFilter.toLowerCase()

      const matchesSearch =
        !searchQuery ||
        item.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.feedback?.topicsWrong &&
          item.feedback.topicsWrong.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          ))

      return matchesTech && matchesDiff && matchesSearch
    })
  }, [history, selectedTechFilter, selectedDiffFilter, searchQuery])

  // Handle Retake from History
  const handleRetake = (item) => {
    startTest({
      technology: item.technology.toLowerCase(),
      difficulty: item.difficulty,
      questionCount: item.questions || 5,
      durationMinutes: 10,
    })
    navigate('/app/current-technology-practice')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ─── Page Header ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            Performance Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past test results, score breakdowns, stars earned, and verified skill progressions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/reports')}
            icon={TrendingUp}
          >
            Progress & Streaks
          </Button>

          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your assessment history?')) {
                  clearHistory()
                }
              }}
              icon={Trash2}
            >
              Clear
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/app/current-technology-practice')}
            icon={Sparkles}
          >
            Take New Test
          </Button>
        </div>
      </div>

      {/* ─── Stats Overview ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Tests Taken</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-500">Total completed assessments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.avgScore}%
          </div>
          <p className="text-[11px] text-slate-500">Across all tech assessments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>5-Star Badges</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
            {stats.fiveStars}
          </div>
          <p className="text-[11px] text-slate-500">Score ≥ 90/100 (Mastery)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Top Technology</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 truncate">
            {stats.topTech}
          </div>
          <p className="text-[11px] text-slate-500">Most practiced subject</p>
        </div>
      </div>

      {/* ─── Search & Filters Bar ──────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by technology, difficulty, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTechFilter}
            onChange={(e) => setSelectedTechFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-400"
          >
            <option value="all">All Technologies</option>
            <option value="react">React</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="sql">SQL</option>
            <option value="aws">AWS</option>
            <option value="docker">Docker</option>
            <option value="machine learning">Machine Learning</option>
            <option value="rag">RAG & GenAI</option>
          </select>

          <select
            value={selectedDiffFilter}
            onChange={(e) => setSelectedDiffFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-400"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* ─── Assessment History List ───────────────────────────── */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Assessments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedTechFilter !== 'all' || selectedDiffFilter !== 'all'
                ? 'No assessments match your filter criteria. Try resetting filters.'
                : 'You have not taken any practice tests yet. Start testing your knowledge today!'}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/app/current-technology-practice')}
          >
            Start Practice Test
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            const icon = TECH_ICONS[item.technology] || '💻'
            const isHigh = item.score >= 80

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm"
              >
                {/* Left info: Tech, difficulty, date */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{item.technology}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.difficulty}
                      </span>
                      <span className="text-xs text-amber-500 font-semibold">
                        {item.starString}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.timeTaken}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">
                        {item.questions} Questions ({item.correctAnswers} Correct,{' '}
                        {item.incorrectAnswers} Incorrect)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right info: Score badge & actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right pr-2">
                    <div
                      className={`text-xl font-extrabold ${
                        isHigh ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {item.scoreOutOf100 || `${item.score}/100`}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">
                      Score
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDetail(item)}
                      icon={Eye}
                    >
                      View Report
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRetake(item)}
                      icon={RotateCcw}
                    >
                      Retake
                    </Button>

                    <button
                      onClick={() => deleteAssessment(item.id)}
                      title="Delete attempt"
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ─── Detail Modal (Full historical breakdown & review) ─── */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {TECH_ICONS[selectedDetail.technology] || '💻'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedDetail.technology} Assessment Report
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedDetail.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completed on{' '}
                      {new Date(selectedDetail.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      • Time Taken: {selectedDetail.timeTaken}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Score & Stars callout */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-bold text-slate-500">
                    Final Result
                  </div>
                  <div className="text-3xl font-extrabold text-blue-600">
                    {selectedDetail.scoreOutOf100 || `${selectedDetail.score}/100`}
                  </div>
                  <div className="text-xs text-amber-600 mt-1 font-semibold">
                    {selectedDetail.starString}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 text-center sm:text-right">
                  <div>
                    Total Questions: <strong className="text-slate-900">{selectedDetail.questions}</strong>
                  </div>
                  <div className="text-emerald-600">
                    Correct Answers: <strong>{selectedDetail.correctAnswers}</strong>
                  </div>
                  <div className="text-rose-600">
                    Incorrect / Skipped: <strong>{selectedDetail.incorrectAnswers}</strong>
                  </div>
                </div>
              </div>

              {/* Score Breakdown (5 dimensions) */}
              {selectedDetail.breakdown && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Score Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                      <span className="text-slate-600">Concept Understanding</span>
                      <strong className="text-slate-900">
                        {selectedDetail.breakdown.conceptUnderstanding}/100
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                      <span className="text-slate-600">Practical Application</span>
                      <strong className="text-slate-900">
                        {selectedDetail.breakdown.practicalApplication}/100
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                      <span className="text-slate-600">Problem Solving</span>
                      <strong className="text-slate-900">
                        {selectedDetail.breakdown.problemSolving}/100
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                      <span className="text-slate-600">Code Quality</span>
                      <strong className="text-slate-900">
                        {selectedDetail.breakdown.codeQuality}/100
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between sm:col-span-2">
                      <span className="text-slate-600">Best Practices</span>
                      <strong className="text-slate-900">
                        {selectedDetail.breakdown.bestPractices}/100
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Feedback */}
              {selectedDetail.feedback && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Feedback & Recommendations
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                      <strong className="text-emerald-800 block mb-0.5">What you did well:</strong>
                      {selectedDetail.feedback.whatYouDidWell}
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                      <strong className="text-amber-800 block mb-0.5">What you need to improve:</strong>
                      {selectedDetail.feedback.whatYouNeedToImprove}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal footer actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <Button variant="ghost" size="md" onClick={() => setSelectedDetail(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleRetake(selectedDetail)
                    setSelectedDetail(null)
                  }}
                  icon={RotateCcw}
                >
                  Retake Test Now
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
