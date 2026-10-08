import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileCode2,
  Sparkles,
  Columns,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Layers,
  Terminal,
} from 'lucide-react'
import { usePracticeStore } from '../../store/usePracticeStore'
import { CodeEditorEnvironment } from './CodeEditorEnvironment'
import toast from 'react-hot-toast'

export function ActiveTestScreen() {
  const {
    testSession,
    currentIndex,
    userAnswers,
    timeRemaining,
    isTimerActive,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    jumpToQuestion,
    submitTest,
    tickTimer,
    attemptExit,
    isExitWarningOpen,
    confirmExit,
    cancelExit,
    isLoading,
  } = usePracticeStore()

  // View Mode: 'split' (HackerRank IDE View) | 'standard' (Question Card View)
  const [viewMode, setViewMode] = useState('split')
  const [copiedInput, setCopiedInput] = useState(false)

  // Live countdown timer
  useEffect(() => {
    if (!isTimerActive) return
    const interval = setInterval(() => {
      tickTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerActive, tickTimer])

  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  if (!testSession) return null

  const questions = testSession.questions
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalQuestions - 1

  // Format time remaining
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isLowTime = timeRemaining < 120

  const selectedAnswer = userAnswers[currentIndex]
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100)
  const answeredCount = Object.keys(userAnswers).length

  // Check if current question is a HackerRank / CodeChef coding question
  const isCoding = currentQuestion.isCoding || currentQuestion.type === 'Code Output' || currentQuestion.type === 'HackerRank Problem' || currentQuestion.code

  const copySampleInput = (inputVal) => {
    navigator.clipboard.writeText(inputVal)
    setCopiedInput(true)
    setTimeout(() => setCopiedInput(false), 2000)
    toast.success('Sample input copied to clipboard')
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto text-slate-800 font-sans">
      {/* ── Top Status Bar: Timer, Progress, View Mode & Exit ── */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => attemptExit()}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quit</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                {testSession.technology.toUpperCase()} {testSession.mode === 'codechef' ? 'CodeChef Challenge' : 'Assessment'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                testSession.mode === 'codechef'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {testSession.mode === 'codechef' ? '⚡ CodeChef IDE Mode' : '📋 Standard MCQ Mode'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {testSession.difficulty} • Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* View Toggle + Countdown Timer */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'split' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              <span>HackerRank IDE View</span>
            </button>
            <button
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'standard' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Standard View</span>
            </button>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              isLowTime
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>

          {/* Question Dots Dropdown / Jump */}
          <div className="hidden lg:flex items-center gap-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex
              const isAnswered = userAnswers[idx] !== undefined
              return (
                <button
                  key={idx}
                  onClick={() => jumpToQuestion(idx)}
                  className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 px-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Overall Test Progress</span>
          <span>{answeredCount} / {totalQuestions} Solved ({progressPercentage}%)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
          />
        </div>
      </div>

      {/* ── HackerRank / CodeChef Split IDE View ── */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Problem Description & Constraints (5 cols) ── */}
          <motion.div
            key={`problem-${currentQuestion.id}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5 max-h-[780px] overflow-y-auto"
          >
            {/* Problem Header */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
                  {currentQuestion.type || 'HackerRank Problem'}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  100 Max Score
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                Problem {currentIndex + 1}: {currentQuestion.topic || 'Algorithm Challenge'}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap pt-1">
                <span>Difficulty: <strong className="text-slate-900">{testSession.difficulty}</strong></span>
                <span>•</span>
                <span>Time Limit: <strong className="text-slate-900">1.0 sec</strong></span>
                <span>•</span>
                <span>Memory: <strong className="text-slate-900">256 MB</strong></span>
              </div>
            </div>

            {/* Problem Statement Box */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-blue-600" />
                Problem Statement
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 font-normal">
                {currentQuestion.problemStatement || currentQuestion.question}
              </p>
            </div>

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Input Format:</span>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                  {currentQuestion.inputFormat || 'First line contains integer N. Second line contains space-separated element array.'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Output Format:</span>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                  {currentQuestion.outputFormat || 'Print the target calculated output integer or string array.'}
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Constraints:</span>
              <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 font-mono whitespace-pre-line">
                {currentQuestion.constraints || '1 <= N <= 10^5\n-1000 <= Elements <= 1000'}
              </div>
            </div>

            {/* Sample Test Case Card */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Sample Case 0
                </span>
                <button
                  onClick={() => copySampleInput(currentQuestion.expectedOutput || '1 2 3 4 5')}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Sample</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Sample Input 0:</span>
                  <div className="text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {currentQuestion.sampleInput || currentQuestion.questionText || 'nums = [1, 2, 3], k = 3'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Sample Output 0:</span>
                  <div className="text-amber-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {currentQuestion.expectedOutput || '2'}
                  </div>
                </div>
                {currentQuestion.explanation && (
                  <div className="pt-1 text-[11px] text-slate-400 font-sans leading-relaxed border-t border-slate-800">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Choices if MC Question in Split Mode */}
            {currentQuestion.options && currentQuestion.options.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900">Select Predicted Option Answer:</span>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx
                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectAnswer(optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + optIdx)}. {option}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Right Column: VS Code Editor Environment (7 cols) ── */}
          <motion.div
            key={`editor-${currentQuestion.id}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-7"
          >
            <CodeEditorEnvironment
              initialCode={currentQuestion.starterCode || currentQuestion.code || ''}
              language={testSession.technology.toLowerCase()}
              filename={`solution.${testSession.technology.toLowerCase() === 'python' ? 'py' : testSession.technology.toLowerCase() === 'react' ? 'jsx' : 'js'}`}
              questionText={currentQuestion.question}
              expectedOutput={currentQuestion.expectedOutput}
              sampleTestCases={currentQuestion.sampleTestCases || [
                { input: currentQuestion.sampleInput || 'nums = [1, 2, 3]', output: currentQuestion.expectedOutput || 'Passed' }
              ]}
              onSubmitAnswer={(result) => {
                selectAnswer(0)
                if (isLast) submitTest()
                else nextQuestion()
              }}
            />
          </motion.div>
        </div>
      ) : (
        /* ── Standard View Mode (Card layout) ── */
        <motion.div
          key={`standard-${currentQuestion.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 border border-blue-100 text-blue-700">
              {currentQuestion.type}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Topic: <strong className="text-slate-800">{currentQuestion.topic}</strong>
            </span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Show VS Code Editor for coding questions */}
          {(currentQuestion.isCoding || currentQuestion.type === 'CodeChef Challenge') ? (
            <div className="pt-2">
              <CodeEditorEnvironment
                initialCode={currentQuestion.starterCode || currentQuestion.code || ''}
                language={testSession.technology.toLowerCase()}
                questionText={currentQuestion.question}
                expectedOutput={currentQuestion.expectedOutput}
                sampleTestCases={currentQuestion.sampleTestCases || [
                  { input: currentQuestion.sampleInput || 'Sample Input', output: currentQuestion.expectedOutput || 'Passed' }
                ]}
                onSubmitAnswer={() => {
                  selectAnswer(0)
                  if (isLast) submitTest()
                  else nextQuestion()
                }}
              />
            </div>
          ) : (
            <>
              {/* Code block for non-coding questions that have code snippets */}
              {currentQuestion.code && (
                <pre className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{currentQuestion.code}</code>
                </pre>
              )}

              {/* Multiple choice options */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx
                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectAnswer(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-400 text-blue-900 shadow-xs ring-1 ring-blue-400/40 font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 border border-slate-200 text-slate-600 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm font-medium leading-relaxed flex-1">{option}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* ── Bottom Controls & Submit Bar ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 md:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={prevQuestion}
            disabled={isFirst}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <button
            onClick={skipQuestion}
            disabled={isLast}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs disabled:opacity-40 transition-all"
          >
            Skip
          </button>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          {isLast ? (
            <button
              onClick={submitTest}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Grading HackerRank Test...' : 'Finish & Submit Test'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Exit Modal */}
      <AnimatePresence>
        {isExitWarningOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            onClick={cancelExit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">Quit Assessment?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you exit now, your current HackerRank coding session progress will be lost. Are you sure you want to quit?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={cancelExit}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Continue Test
                </button>
                <button
                  onClick={confirmExit}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Yes, Quit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ActiveTestScreen
