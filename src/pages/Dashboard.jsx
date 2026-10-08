import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Code2,
  BookOpen,
  FolderKanban,
  Briefcase,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Star,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  Bot,
  ExternalLink,
  Check,
  Sparkles,
} from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import { usePracticeStore } from '../store/usePracticeStore'
import toast from 'react-hot-toast'

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { startTest, setTech } = usePracticeStore()

  // Selected tech pill in Dashboard practice test
  const [selectedDashboardTech, setSelectedDashboardTech] = useState('python')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate')
  const [selectedCount, setSelectedCount] = useState('10 Questions')
  const [selectedDuration, setSelectedDuration] = useState('10 Minutes')

  // Interactive Question in center pane
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)

  const displayName = user?.name || 'Yalamarthijahnavi9'

  const technologies = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'javascript', name: 'JavaScript', icon: '💛' },
    { id: 'sql', name: 'SQL', icon: '🗄️' },
    { id: 'aws', name: 'AWS', icon: '☁️' },
    { id: 'docker', name: 'Docker', icon: '🐳' },
    { id: 'machine-learning', name: 'Machine Learning', icon: '🧠' },
  ]

  const handleStartPractice = () => {
    setTech(selectedDashboardTech)
    navigate(`/app/current-technology-practice?tech=${selectedDashboardTech}`)
  }

  const handleOptionClick = (idx) => {
    setSelectedOption(idx)
    setIsAnswerChecked(true)
    if (idx === 0) {
      toast.success('Correct! Output is 9.')
    } else {
      toast.error('Incorrect. In this array [3, 7, 1, 9, 4], the maximum value is 9.')
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto text-slate-800 font-sans">
      
      {/* ── ROW 1: Greeting Hero Banner (Left) + Your Career Health (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Top Greeting Banner */}
        <div className="lg:col-span-8 rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-100/60 border border-blue-100 shadow-xs flex flex-col justify-between">
          {/* Subtle Background Mountain Climbing Art */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 pointer-events-none opacity-40 md:opacity-75 overflow-hidden flex items-end justify-end">
            <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
              <path d="M160 240 L280 80 L320 140 L400 30 L460 240 Z" fill="#93c5fd" fillOpacity="0.3" />
              <path d="M220 240 L310 110 L370 240 Z" fill="#60a5fa" fillOpacity="0.4" />
              <path d="M280 240 L340 130 L400 240 Z" fill="#3b82f6" fillOpacity="0.5" />
              {/* Climber with flag on peak */}
              <circle cx="340" cy="122" r="4" fill="#1e3a8a" />
              <path d="M340 126 L340 138 M336 130 L344 130 M338 138 L335 146 M342 138 L345 146" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
              <path d="M345 120 L358 116 L345 112 Z" fill="#ef4444" />
              <line x1="345" y1="112" x2="345" y2="135" stroke="#1e3a8a" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Good Morning, {displayName}! <span className="inline-block animate-wave">👏</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
              Your AI-powered career companion is here to help you learn new skills, complete projects, prepare for interviews and achieve your career goals.
            </p>
          </div>

          {/* 4 Action Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
            <Link
              to="/app/learning-planner"
              className="p-3.5 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold text-slate-900 block">Learn</span>
                <span className="text-[10px] text-slate-400 truncate block">New Techno...</span>
              </div>
            </Link>

            <Link
              to="/app/project-assistant"
              className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Code2 className="w-4.5 h-4.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold text-slate-900 block">Build</span>
                <span className="text-[10px] text-slate-400 truncate block">Real Projects</span>
              </div>
            </Link>

            <Link
              to="/app/interview-preparation"
              className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold text-slate-900 block">Prepare</span>
                <span className="text-[10px] text-slate-400 truncate block">For Interviews</span>
              </div>
            </Link>

            <Link
              to="/app/job-switch-readiness"
              className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold text-slate-900 block">Grow</span>
                <span className="text-[10px] text-slate-400 truncate block">Your Career</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Your Career Health (Top Right) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Your Career Health</h2>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              Overall Score
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center my-auto py-2">
            {/* Circular Gauge 78/100 */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.78)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">78</span>
                  <span className="text-[10px] text-slate-400 font-medium">/100</span>
                  <span className="text-[10px] font-bold text-emerald-600 mt-0.5">Good</span>
                </div>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="col-span-7 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Technical Skills</span>
                </div>
                <span className="font-bold text-slate-900">80</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Interview</span>
                </div>
                <span className="font-bold text-slate-900">82</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Resume</span>
                </div>
                <span className="font-bold text-slate-900">88</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Job Switch</span>
                </div>
                <span className="font-bold text-slate-900">76</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Learning</span>
                </div>
                <span className="font-bold text-slate-900">70</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Projects</span>
                </div>
                <span className="font-bold text-slate-900">75</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Current Technology Practice Test (Left) + Right Column Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Center-Left: Current Technology Practice Test Section */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900">
                  Current Technology Practice Test
                </h2>
                <p className="text-xs text-slate-500">
                  Test your knowledge • Track your progress • Build confidence
                </p>
              </div>
            </div>

            <Link
              to="/app/current-technology-practice"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              View All Tests
            </Link>
          </div>

          {/* Technology Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {technologies.map((t) => {
              const isSelected = selectedDashboardTech === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedDashboardTech(t.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <span className="text-sm">{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              )
            })}
          </div>

          {/* Sub-Panels: Configuration & Code Output Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            
            {/* 1. SELECT TEST CONFIGURATION */}
            <div className="md:col-span-12 xl:col-span-3 lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Select Test Configuration
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Question Count
                    </label>
                    <select
                      value={selectedCount}
                      onChange={(e) => setSelectedCount(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value="5 Questions">5 Questions</option>
                      <option value="10 Questions">10 Questions</option>
                      <option value="15 Questions">15 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Test Duration
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value="5 Minutes">5 Minutes</option>
                      <option value="10 Minutes">10 Minutes</option>
                      <option value="20 Minutes">20 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartPractice}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 mt-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Practice Test</span>
              </button>
            </div>

            {/* 2. Dark VS Code Style Box */}
            <div className="md:col-span-12 xl:col-span-5 lg:col-span-5 rounded-2xl bg-[#0f172a] border border-slate-800 p-4 font-mono text-xs text-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2.5">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 font-sans">
                  <span>🐍</span> Python Practice
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase font-sans font-semibold tracking-wider">
                  VS CODE STYLE
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] leading-relaxed py-1.5">
                <div><span className="text-purple-400">def</span> <span className="text-blue-400">find_maximum</span>(<span className="text-orange-300">numbers</span>):</div>
                <div className="pl-4 text-slate-400"><span className="text-purple-400">if not</span> numbers:</div>
                <div className="pl-8 text-purple-400">return <span className="text-amber-300">None</span></div>
                <div className="pl-4 text-slate-300">max_num = numbers[<span className="text-cyan-300">0</span>]</div>
                <div className="pl-4"><span className="text-purple-400">for</span> <span className="text-slate-200">num</span> <span className="text-purple-400">in</span> numbers:</div>
                <div className="pl-8 text-slate-400"><span className="text-purple-400">if</span> num &gt; max_num:</div>
                <div className="pl-12 text-slate-200">max_num = num</div>
                <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-slate-200">max_num</span></div>
                <div className="pt-2 text-slate-400">print(<span className="text-blue-400">find_maximum</span>([<span className="text-cyan-300">3, 7, 1, 9, 4</span>]))</div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                <span>UTF-8</span>
                <span>Python 3.12</span>
              </div>
            </div>

            {/* 3. Question & Options */}
            <div className="md:col-span-12 xl:col-span-4 lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="font-semibold text-slate-800">Question 1 of 10</span>
                  <span className="flex items-center gap-1 text-slate-600 font-mono font-semibold">
                    <Clock className="w-3 h-3 text-blue-600" /> 09:45
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 leading-snug mb-3">
                  What will be the output of the following code?
                </p>

                <div className="space-y-2">
                  {[
                    { label: 'A', value: '9', correct: true },
                    { label: 'B', value: '7', correct: false },
                    { label: 'C', value: '4', correct: false },
                    { label: 'D', value: '1', correct: false },
                  ].map((opt, idx) => {
                    const isSelected = selectedOption === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
                          isSelected
                            ? opt.correct
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0 text-slate-900">
                          {opt.label}
                        </span>
                        <span className="font-bold text-slate-900">{opt.value}</span>
                        {isSelected && opt.correct && (
                          <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setSelectedOption(null); toast('Question skipped') }}
                  className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleStartPractice}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Today's Plan + Upcoming Deadlines + Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Today's Plan */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Today's Plan</h3>
              </div>
              <Link to="/app/deadline-planner" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { time: '06:00 - 07:00', title: 'React Learning', sub: '(Concepts & Practice)', color: 'bg-blue-500' },
                { time: '07:00 - 08:00', title: 'Project Development', sub: '(AI Resume Analyzer)', color: 'bg-amber-500' },
                { time: '08:00 - 08:30', title: 'Tech Practice Test', sub: '(Python - Intermediate)', color: 'bg-emerald-500' },
                { time: '10:00 - 11:00', title: 'DSA Practice', sub: '(Arrays & Strings)', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="font-mono text-[10px] text-slate-500 w-20 shrink-0 pt-0.5">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 leading-snug truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Upcoming Deadlines */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900">Upcoming Deadlines</h3>
              </div>
              <Link to="/app/deadline-planner" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'AI Resume Analyzer Project', days: '3 days', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: Code2 },
                { title: 'React Learning (60 days)', days: '12 days', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: BookOpen },
                { title: 'Mock Interview', days: '18 days', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Briefcase },
                { title: 'System Design Practice', days: '25 days', color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Layers },
              ].map((d, i) => {
                const Icon = d.icon
                return (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{d.title}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${d.color}`}>
                      {d.days}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. Quick Actions */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/app/current-technology-practice"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Code2 className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Practice Test</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/app/technology-roadmap"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">Roadmap</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link
                to="/app/project-assistant"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/70 hover:border-purple-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FolderKanban className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600">Project AI</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>

              <Link
                to="/app/ai-career-chat"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">Career Chat</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Your Progress Chart (Left) + Learning Progress Gauge (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Your Progress */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Progress</h3>
                <p className="text-[11px] text-slate-400">Your skills are growing every day!</p>
              </div>
            </div>

            <span className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-xl border border-slate-200 font-semibold">
              Last 7 Days
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center pt-2">
            {/* Smooth SVG Line Chart */}
            <div className="col-span-7">
              <div className="h-36 w-full relative flex items-end">
                <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Area fill */}
                  <path
                    d="M 10 100 Q 50 85, 90 90 T 170 70 T 250 40 T 310 25 L 310 100 L 10 100 Z"
                    fill="url(#chartGrad)"
                  />
                  {/* Curve stroke */}
                  <path
                    d="M 10 100 Q 50 85, 90 90 T 170 70 T 250 40 T 310 25"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Data Points */}
                  {[[10, 100], [60, 88], [110, 92], [160, 72], [210, 55], [260, 38], [310, 25]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Metrics cards on right */}
            <div className="col-span-5 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Tests Completed</span>
                <span className="font-bold text-slate-900">12</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Average Score</span>
                <span className="font-bold text-emerald-600">82%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Study Streak</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 7 days
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Stars Earned</span>
                <span className="font-bold text-yellow-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 20
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress (Right) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Learning Progress</h3>
            </div>
            <Link to="/app/learning-planner" className="text-[11px] font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Radial 68% */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#06b6d4"
                    strokeWidth="7"
                    strokeDasharray="238.6"
                    strokeDashoffset={238.6 * (1 - 0.68)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900">68%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                <span>⚛️</span> React
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">Intermediate</span>
            </div>

            {/* Info details */}
            <div className="col-span-7 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Topic</span>
                <p className="font-bold text-slate-800">Hooks & State</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Time Spent</span>
                <p className="font-bold text-slate-800">12 / 18 hours</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Next Task</span>
                <p className="font-bold text-slate-800">Practice Test</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Date</span>
                <p className="text-slate-600 font-medium">Apr 25, 2026</p>
              </div>
            </div>
          </div>

          <Link
            to="/app/learning-planner"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Continue Learning</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── ROW 4: Motivational Bottom Banner matching screenshot ── */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-emerald-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="text-base">🚀</span>
          <span>Small steps every day lead to big career dreams! 🚀</span>
        </div>
        <p className="text-[11px] text-slate-500 italic">
          "Learn continuously, build consistently, grow forever."
        </p>
      </div>

    </div>
  )
}

export default Dashboard
