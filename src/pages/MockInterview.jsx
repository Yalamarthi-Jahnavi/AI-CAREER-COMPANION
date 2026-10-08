import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  MessageSquare, Play, Sparkles, Award, RotateCcw,
  CheckCircle2, Clock, BarChart3, Star, AlertCircle,
  HelpCircle, ArrowRight, User, Bot, Send, Loader2,
  ChevronRight, History, Zap, ShieldCheck
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useInterviewStore } from '../store/useInterviewStore'
import {
  getQuestionsForRole,
  evaluateAnswer,
  calculateFinalReport,
} from '../api/interviewApi'

const ROLES = ['Full Stack Developer', 'Frontend Engineer', 'Backend Engineer']
const ROUND_TYPES = [
  { id: 'mixed', label: 'Mixed (Tech + HR)', description: '3 Technical + 2 Behavioral questions' },
  { id: 'technical', label: 'Technical Deep Dive', description: 'Architecture, algorithms & frameworks' },
  { id: 'hr', label: 'Behavioral & HR Round', description: 'STAR leadership & culture fit questions' },
]

export function MockInterview() {
  const {
    activeSession,
    isEvaluatingAnswer,
    finalReport,
    history,
    startSession,
    setEvaluating,
    recordAnswer,
    nextQuestion,
    finishSession,
    clearActiveSession,
  } = useInterviewStore()

  // Setup state
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer')
  const [selectedRoundType, setSelectedRoundType] = useState('mixed')
  const [questionCount, setQuestionCount] = useState(5)
  const [viewTab, setViewTab] = useState('interview') // 'interview' | 'history'

  // Live answer input
  const [userAnswerInput, setUserAnswerInput] = useState('')
  const [interimFeedback, setInterimFeedback] = useState(null)

  // 1. Start a new session
  const handleStartSession = () => {
    const questions = getQuestionsForRole(selectedRole, selectedRoundType, questionCount)
    startSession({
      role: selectedRole,
      roundType: selectedRoundType,
      questions,
    })
    setUserAnswerInput('')
    setInterimFeedback(null)
  }

  // 2. Submit current answer (One at a time)
  const handleSubmitAnswer = async () => {
    if (!userAnswerInput.trim() || isEvaluatingAnswer || !activeSession) return

    const currentQ = activeSession.questions[activeSession.currentIndex]
    setEvaluating(true)

    try {
      const evaluation = await evaluateAnswer(currentQ, userAnswerInput, activeSession.role)
      const recorded = {
        questionId: currentQ.id,
        questionText: currentQ.question,
        category: currentQ.category,
        userAnswer: userAnswerInput,
        evaluated: evaluation,
      }

      recordAnswer(recorded)
      setInterimFeedback(evaluation)

      // Check if this was the last question
      const isLast = activeSession.currentIndex === activeSession.questions.length - 1

      if (isLast) {
        // Calculate and finish
        const updatedAnswers = [...activeSession.answers, recorded]
        const report = calculateFinalReport({
          ...activeSession,
          answers: updatedAnswers,
        })
        finishSession(report)
      } else {
        // Move to next question after brief review
        setTimeout(() => {
          nextQuestion()
          setUserAnswerInput('')
          setInterimFeedback(null)
        }, 1200)
      }
    } catch (err) {
      console.error('Evaluation error:', err)
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <MessageSquare className="w-4 h-4" />
            </span>
            <Badge variant="accent" className="text-xs font-semibold uppercase tracking-wider">
              Interactive AI Mock Interview
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            Mock Interview Simulator
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Simulate a real-time engineering interview with one-by-one sequential questions,
            6-dimension multi-score evaluation, encouragement stars, and longitudinal improvement tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewTab === 'interview' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewTab('interview')}
            className="gap-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Interview Session</span>
          </Button>

          <Button
            variant={viewTab === 'history' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewTab('history')}
            className="gap-1.5"
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </Button>
        </div>
      </div>

      {/* ─── TAB: INTERVIEW HISTORY & IMPROVEMENT ───────────────── */}
      {viewTab === 'history' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-dark-text-primary">Interview Performance Trajectory</h3>
                <p className="text-xs text-dark-text-muted">
                  Score improvement tracked across your mock interview sessions.
                </p>
              </div>
              <Badge variant="success" className="text-xs px-3 py-1 font-semibold">
                {history.length} Completed Interviews
              </Badge>
            </div>

            {/* Improvement Trend Bar Graph */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dark-border">
              {history.slice(0, 3).map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-text-muted">Session {history.length - idx}</span>
                    <span className="text-sm">{item.starsString || '⭐⭐⭐'}</span>
                  </div>
                  <div className="text-2xl font-black text-dark-text-primary">
                    {item.scores?.interviewScore || 75}<span className="text-xs font-normal text-dark-text-muted">/100</span>
                  </div>
                  <p className="text-xs text-dark-text-secondary line-clamp-2">
                    {item.summary || item.encouragement}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Historical Sessions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-dark-text-muted uppercase tracking-wider">
              Past Interview Sessions
            </h4>
            {history.map((sess) => (
              <Card key={sess.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-dark-text-primary">{sess.role}</span>
                    <Badge variant="brand" className="text-[10px] capitalize">{sess.roundType}</Badge>
                    <span className="text-xs">{sess.starsString}</span>
                  </div>
                  <p className="text-xs text-dark-text-muted">
                    {new Date(sess.date).toLocaleDateString()} • {sess.answersCount || 5} questions answered • Duration: {sess.duration || '15m'}
                  </p>
                  <p className="text-xs text-dark-text-secondary pt-1 italic">
                    "{sess.encouragement}"
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-400">{sess.scores?.interviewScore}/100</div>
                    <div className="text-[10px] text-dark-text-muted">Composite Score</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: ACTIVE INTERVIEW / SETUP / RESULTS ───────────── */}
      {viewTab === 'interview' && (
        <div>
          {/* SCREEN 1: RESULTS REPORT SCREEN */}
          {finalReport ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Encouragement & Star Celebration Banner */}
              <Card className="p-8 text-center bg-gradient-to-br from-dark-card via-brand-950/30 to-dark-card border-brand-500/40 space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-500/20 text-brand-400 mb-1 shadow-lg shadow-brand-500/20">
                  <Award className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl">{finalReport.starsString}</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-dark-text-primary">
                    Interview Completed!
                  </h2>
                  <p className="text-sm sm:text-base text-brand-300 font-medium max-w-xl mx-auto leading-relaxed">
                    {finalReport.encouragement}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Badge variant="success" className="text-xs px-3 py-1 font-semibold">
                    {finalReport.stars} of 5 Stars Awarded
                  </Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    Time: {finalReport.timeTaken}
                  </Badge>
                </div>
              </Card>

              {/* The 6 Explicit Required Scores */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-dark-text-primary uppercase tracking-wider">
                  Official 6-Dimension Score Breakdown
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Interview Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-brand-500/10 to-transparent border-brand-500/30">
                    <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">
                      1. Interview Score
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.interviewScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Overall Composite</span>
                  </Card>

                  {/* 2. Technical Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-info-500/10 to-transparent border-info-500/30">
                    <span className="text-[11px] font-semibold text-info-400 uppercase tracking-wider">
                      2. Technical Score
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.technicalScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Core Principles</span>
                  </Card>

                  {/* 3. Communication Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-accent-500/10 to-transparent border-accent-500/30">
                    <span className="text-[11px] font-semibold text-accent-400 uppercase tracking-wider">
                      3. Communication
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.communicationScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Clarity & Articulation</span>
                  </Card>

                  {/* 4. Confidence Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-warning-500/10 to-transparent border-warning-500/30">
                    <span className="text-[11px] font-semibold text-warning-400 uppercase tracking-wider">
                      4. Confidence Score
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.confidenceScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Delivery Conviction</span>
                  </Card>

                  {/* 5. HR Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-success-500/10 to-transparent border-success-500/30">
                    <span className="text-[11px] font-semibold text-success-400 uppercase tracking-wider">
                      5. HR Score
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.hrScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Culture & EQ Fit</span>
                  </Card>

                  {/* 6. Problem Solving Score */}
                  <Card className="p-4 text-center space-y-1 bg-gradient-to-b from-rose-500/10 to-transparent border-rose-500/30">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                      6. Problem Solving
                    </span>
                    <div className="text-2xl font-black text-dark-text-primary">
                      {finalReport.problemSolvingScore}%
                    </div>
                    <span className="text-[10px] text-dark-text-muted">Analytical Depth</span>
                  </Card>
                </div>
              </div>

              {/* Question Review Accordion */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-dark-text-primary uppercase tracking-wider">
                  Detailed Answer Review ({activeSession?.answers?.length || 0} Questions)
                </h3>

                <div className="space-y-3">
                  {(activeSession?.answers || []).map((ans, i) => (
                    <Card key={i} className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-brand-400">
                            Question #{i + 1} • {ans.category}
                          </span>
                          <h4 className="text-sm font-bold text-dark-text-primary">{ans.questionText}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {ans.evaluated?.scores?.technicalAccuracy || 75}% Accuracy
                        </Badge>
                      </div>

                      <div className="p-3.5 rounded-xl bg-dark-bg/60 border border-dark-border text-xs text-dark-text-secondary leading-relaxed">
                        <strong className="text-dark-text-primary block mb-1">Your Answer:</strong>
                        {ans.userAnswer}
                      </div>

                      <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 space-y-1">
                        <strong className="text-dark-text-primary block">Evaluator Feedback:</strong>
                        <p>{ans.evaluated?.feedback}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={clearActiveSession}
                  className="gap-2 shadow-lg shadow-brand-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Practice Another Round</span>
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setViewTab('history')}
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  <span>View Full History</span>
                </Button>
              </div>
            </motion.div>
          ) : activeSession ? (
            /* SCREEN 2: ACTIVE INTERVIEW — ASK QUESTIONS ONE AT A TIME */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Progress Stepper */}
              <div className="flex items-center justify-between text-xs text-dark-text-muted">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-400">Question {activeSession.currentIndex + 1}</span>
                  <span>of {activeSession.questions.length}</span>
                </div>
                <Badge variant="brand" className="text-[10px] capitalize">
                  {activeSession.roundType} Round • {activeSession.role}
                </Badge>
              </div>

              <div className="w-full h-1.5 rounded-full bg-dark-card overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                  style={{
                    width: `${((activeSession.currentIndex + 1) / activeSession.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question Card */}
              <Card className="p-6 space-y-4 border-brand-500/30 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-dark-text-muted uppercase tracking-wider">
                      Interviewer Question #{activeSession.currentIndex + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-dark-text-primary leading-snug">
                      {activeSession.questions[activeSession.currentIndex]?.question}
                    </h2>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-dark-bg/60 border border-dark-border text-xs text-dark-text-muted">
                  💡 <strong>Interviewer Tip:</strong> Structure your answer clearly. Explain trade-offs, mention specific technologies, and quantify your real-world outcomes.
                </div>
              </Card>

              {/* User Answer Input Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-dark-text-primary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-400" /> Your Spoken or Typed Response
                  </label>
                  <span className="text-dark-text-muted">
                    {userAnswerInput.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={userAnswerInput}
                  onChange={(e) => setUserAnswerInput(e.target.value)}
                  placeholder="Type your answer clearly. Explain your thought process, architecture, and examples..."
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-xs sm:text-sm text-dark-text-primary focus:border-brand-500 focus:outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearActiveSession}
                    className="text-error-400"
                  >
                    Cancel Session
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswerInput.trim() || isEvaluatingAnswer}
                    className="gap-2 shadow-lg shadow-brand-500/20"
                  >
                    {isEvaluatingAnswer ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {activeSession.currentIndex === activeSession.questions.length - 1
                            ? 'Submit Final Answer'
                            : 'Submit & Next Question'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* SCREEN 3: SETUP SCREEN */
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-text-primary">
                    Configure Your Mock Interview
                  </h2>
                  <p className="text-xs sm:text-sm text-dark-text-muted">
                    Questions are asked one at a time. Your answers will be analyzed across 6 critical dimensions.
                  </p>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">
                    Target Role:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={clsx(
                          'p-3 rounded-xl border text-left text-xs font-semibold transition-all',
                          selectedRole === r
                            ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-sm'
                            : 'bg-dark-bg/60 border-dark-border text-dark-text-secondary hover:text-dark-text-primary'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Round Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">
                    Round Type:
                  </label>
                  <div className="space-y-2">
                    {ROUND_TYPES.map((rt) => (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => setSelectedRoundType(rt.id)}
                        className={clsx(
                          'w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all',
                          selectedRoundType === rt.id
                            ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-sm'
                            : 'bg-dark-bg/60 border-dark-border text-dark-text-secondary hover:text-dark-text-primary'
                        )}
                      >
                        <div>
                          <div className="text-xs font-bold text-dark-text-primary">{rt.label}</div>
                          <div className="text-[11px] text-dark-text-muted">{rt.description}</div>
                        </div>
                        {selectedRoundType === rt.id && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Questions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-dark-text-muted uppercase tracking-wider">Question Count:</span>
                    <span className="font-bold text-dark-text-primary">{questionCount} Questions</span>
                  </div>
                  <div className="flex gap-2">
                    {[3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={clsx(
                          'flex-1 py-2 rounded-lg text-xs font-bold transition-all border',
                          questionCount === cnt
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-dark-bg border-dark-border text-dark-text-muted hover:text-dark-text-primary'
                        )}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Launch Button */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartSession}
                  className="w-full shadow-lg shadow-brand-500/25 gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Interview Now</span>
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
