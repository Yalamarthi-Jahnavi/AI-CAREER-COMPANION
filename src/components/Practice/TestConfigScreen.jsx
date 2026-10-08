import React from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  Code2,
  FileQuestion,
  ChevronRight,
  ShieldCheck,
  Zap,
  Terminal,
  ListChecks,
} from 'lucide-react'
import {
  TECHNOLOGIES_LIST,
  DIFFICULTIES,
  QUESTION_COUNTS,
  DURATIONS,
} from '../../api/practiceApi'
import { usePracticeStore } from '../../store/usePracticeStore'

export function TestConfigScreen() {
  const {
    selectedTech,
    selectedDifficulty,
    selectedCount,
    selectedDuration,
    practiceMode,
    setTech,
    setDifficulty,
    setCount,
    setDuration,
    setPracticeMode,
    startTest,
    isLoading,
  } = usePracticeStore()

  const activeTechObj = TECHNOLOGIES_LIST.find((t) => t.id === selectedTech) || TECHNOLOGIES_LIST[0]

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-800 font-sans">
      {/* ─── Hero Header ────────────────────────────────────────── */}
      <div className="text-center space-y-1.5 py-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200/80 text-blue-700 mb-1 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Interactive Technical Assessment
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Current Technology Practice
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          Test your knowledge • Track your progress • Build real software engineering confidence
        </p>
      </div>

      {/* ─── 2-Column Split: Vertical Tech List (Left) + Test Configuration (Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Clean Vertical List of Technologies (Requirement 5) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                Select Technology / Language
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choose a stack to evaluate code output, debugging & algorithms
              </p>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
              {activeTechObj.name} Active
            </span>
          </div>

          {/* Vertical Stack: Python ↓ JavaScript ↓ React ↓ Java ↓ C/C++ ↓ SQL ↓ AWS ↓ Docker ↓ ML ↓ AI/LLM */}
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {TECHNOLOGIES_LIST.map((tech) => {
              const isSelected = selectedTech === tech.id
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setTech(tech.id)}
                  className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-1 ring-blue-400/40'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Tech Icon Box */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected ? 'bg-white shadow-xs border border-blue-200' : 'bg-slate-100'
                    }`}>
                      <span>{tech.icon}</span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {tech.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tech.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {tech.desc || 'Comprehensive code output and architectural problem solving'}
                      </p>
                    </div>
                  </div>

                  {/* Active Radio Indicator */}
                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Test Configuration Settings */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Configure Assessment
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Customize difficulty, duration, and question count
            </p>
          </div>

          {/* 0. Practice Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Assessment Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPracticeMode('standard')}
                className={`py-3 px-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  practiceMode === 'standard'
                    ? 'bg-indigo-50 border-indigo-400 shadow-xs ring-1 ring-indigo-400/40'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ListChecks className={`w-3.5 h-3.5 ${practiceMode === 'standard' ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className={`text-xs font-bold ${practiceMode === 'standard' ? 'text-indigo-900' : 'text-slate-700'}`}>Standard MCQ</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">Multiple choice questions &amp; concept testing</span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeMode('codechef')}
                className={`py-3 px-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  practiceMode === 'codechef'
                    ? 'bg-blue-50 border-blue-400 shadow-xs ring-1 ring-blue-400/40'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Terminal className={`w-3.5 h-3.5 ${practiceMode === 'codechef' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`text-xs font-bold ${practiceMode === 'codechef' ? 'text-blue-900' : 'text-slate-700'}`}>CodeChef IDE</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">Live coding with VS Code environment</span>
              </button>
            </div>
          </div>

          {/* 1. Difficulty Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDifficulty === diff
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Question Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Question Count
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((count) => {
                const isSelected = selectedCount === count
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setCount(count)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {count} Qs
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Time Limit
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map((dur) => {
                const isSelected = selectedDuration === dur.minutes
                return (
                  <button
                    key={dur.minutes}
                    type="button"
                    onClick={() => setDuration(dur.minutes)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{dur.minutes} Minutes</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {dur.label.split('(')[1]?.replace(')', '') || 'Timed'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Selected Technology:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <span>{activeTechObj.icon}</span> {activeTechObj.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mode:</span>
              <span className={`font-bold ${practiceMode === 'codechef' ? 'text-blue-600' : 'text-indigo-600'}`}>
                {practiceMode === 'codechef' ? '⚡ CodeChef IDE' : '📋 Standard MCQ'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Includes:</span>
              <span className="font-semibold text-blue-600">{practiceMode === 'codechef' ? 'Live Editor + Test Cases' : 'Code Output, Debugging & DSA'}</span>
            </div>
          </div>

          {/* Start Test Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={startTest}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 ${
              practiceMode === 'codechef'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{practiceMode === 'codechef' ? 'Start CodeChef Challenge' : 'Start MCQ Assessment'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestConfigScreen
