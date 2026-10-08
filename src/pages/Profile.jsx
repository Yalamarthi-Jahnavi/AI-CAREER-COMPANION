import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  ShieldCheck,
  Briefcase,
  Target,
  Clock,
  Flame,
  Award,
  BookOpen,
  Code2,
  Download,
  Trash2,
  Check,
  Sparkles,
  Zap,
  DollarSign,
  GraduationCap,
  Layers,
  Save,
} from 'lucide-react'
import { useUserStore, USER_PERSONAS } from '../store/useUserStore'
import toast from 'react-hot-toast'

export function Profile() {
  const {
    user,
    switchPersona,
    updateProfile,
    setDailyLearningHours,
    openAuthModal,
    logout,
  } = useUserStore()

  const [name, setName] = useState(user?.name || '')
  const [role, setRole] = useState(user?.role || '')
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || '')
  const [targetSalary, setTargetSalary] = useState(user?.targetSalary || '')
  const [dailyHours, setDailyHours] = useState(user?.dailyLearningHours ?? 1)
  const [bio, setBio] = useState(user?.bio || '')

  // Sync state when active persona changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || '')
      setRole(user.role || '')
      setCareerGoal(user.careerGoal || '')
      setTargetSalary(user.targetSalary || '')
      setDailyHours(user.dailyLearningHours ?? 1)
      setBio(user.bio || '')
    }
  }, [user])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfile({
      name,
      role,
      careerGoal,
      targetSalary,
      bio,
    })
    setDailyLearningHours(Number(dailyHours))
    toast.success('Career Profile updated successfully!')
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(user, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AI_Career_Profile_${user?.name?.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Profile export downloaded!')
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" />
            Your Career Profile & Personas
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Switch between testing personas or customize your real career targets and daily learning capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
          >
            Switch Account / Login
          </button>
          <button
            onClick={handleExportData}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Export Profile JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 1. 1-Click User Persona Switcher ──────────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Active Career Persona Testing Switcher</h2>
          </div>
          <span className="text-xs text-slate-500">Current: <strong className="text-emerald-600">{user?.experienceLevel || 'Senior'}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.entries(USER_PERSONAS).map(([key, p]) => {
            const isSelected = user?.personaKey === key

            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                onClick={() => switchPersona(key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 shadow-md'
                    : 'bg-slate-50/80 border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                      {key === 'FRESHER' ? '🌱 Fresher' : key === 'STUDENT' ? '🎓 Student' : key === 'INTERN' ? '💼 Intern' : '🚀 Senior'}
                    </span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{p.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{p.role}</p>
                  <p className="text-[11px] text-blue-600 mt-2 font-medium">Goal: {p.careerGoal}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>⏱️ {p.dailyLearningHours} hr/day</span>
                  <span className="text-emerald-600 font-semibold">{p.stats.technicalSkillsScore}% Score</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── 2. Profile Details & Learning Capacity Controls ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Profile Metadata */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            Career Goals & Custom Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Job Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Goal / Next Role</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Staff Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Compensation Bracket</label>
                <input
                  type="text"
                  value={targetSalary}
                  onChange={(e) => setTargetSalary(e.target.value)}
                  placeholder="e.g. $160k - $185k Base"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Edge-Case 1: Daily Learning Time Allocation */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Daily Available Learning Capacity (Edge Case Handler)
                </label>
                <span className="text-xs font-extrabold text-amber-800 px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300">
                  {dailyHours === 0 ? '0 mins (Paused)' : dailyHours === 0.5 ? '30 mins/day' : `${dailyHours} hr(s)/day`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Adjusts your learning schedule, mock quiz lengths, and daily timetable recommendations.
              </p>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { label: '0 mins', value: 0, desc: 'Pause goals' },
                  { label: '30 mins', value: 0.5, desc: 'Micro-drills' },
                  { label: '1 hour', value: 1, desc: 'Standard' },
                  { label: '2+ hours', value: 2, desc: 'Fast-track' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDailyHours(opt.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      dailyHours === opt.value
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:border-amber-200'
                    }`}
                  >
                    <div className="text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Career Bio & Focus Area</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Career Preferences
            </button>
          </form>
        </div>

        {/* Right Card: Stacks & Readiness Snapshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              Current Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user?.currentStack?.map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
                  {tech}
                </span>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-2 border-t border-slate-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Target Upskilling Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user?.targetStack?.map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-800 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Candidate Verified Metrics
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">ATS Resume Score:</span>
                <strong className="text-slate-900 font-bold">{user?.stats?.resumeScore || 88}%</strong>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Interview Readiness:</span>
                <strong className="text-slate-900 font-bold">{user?.stats?.interviewReadiness || 82}%</strong>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Technical Diagnostic:</span>
                <strong className="text-slate-900 font-bold">{user?.stats?.technicalSkillsScore || 90}%</strong>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-600">Active Learning Streak:</span>
                <strong className="text-amber-600 font-semibold">{user?.stats?.daysStreak || 14} Days 🔥</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile
