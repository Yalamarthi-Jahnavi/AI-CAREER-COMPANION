import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { useUserStore, USER_PERSONAS } from '../../store/useUserStore'

export function AuthModal() {
  const {
    isAuthModalOpen,
    authMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    switchPersona,
    isLoading,
  } = useUserStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState('FRESHER')

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (authMode === 'login') {
      await login(email || 'alex.johnson@example.com', password || 'password123')
    } else {
      await register(
        fullName || 'Alex Johnson',
        email || 'alex.johnson@example.com',
        USER_PERSONAS[selectedRole]?.role || 'Software Engineer',
        selectedRole
      )
    }
  }

  const handleQuickPersona = (personaKey) => {
    switchPersona(personaKey)
    closeAuthModal()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-[#111726] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-slate-100"
        >
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-300 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create Your Career Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'login'
                ? 'Sign in to access your synchronized career companion dashboard'
                : 'Join AI Career Companion for personalized learning, roadmaps & offer support'}
            </p>
          </div>

          {/* ── 1-Click Persona Quick Login (For E2E Testing) ─────── */}
          <div className="mb-6 p-4 rounded-2xl bg-[#162136] border border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                1-Click Quick Testing Personas
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Instant Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('FRESHER')}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-brand-300">🌱 Fresher</div>
                <div className="text-[10px] text-slate-400">Rohan • Junior React Dev</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('STUDENT')}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-300">🎓 Student</div>
                <div className="text-[10px] text-slate-400">Priya • CS Undergrad</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('INTERN')}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-purple-300">💼 Intern</div>
                <div className="text-[10px] text-slate-400">Liam • Return Offer Prep</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('EXPERIENCED')}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">🚀 Senior Dev</div>
                <div className="text-[10px] text-slate-400">Alex • Staff Engineer Track</div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-white/10" />
            <span className="text-[11px] text-slate-500 font-medium">OR CONTINUE WITH FORM</span>
            <hr className="flex-1 border-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#182238] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#182238] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#182238] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Career Stage Persona</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#182238] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-400"
                >
                  <option value="FRESHER">Fresher (0-1 Yrs Experience)</option>
                  <option value="STUDENT">Student (Undergrad / College)</option>
                  <option value="INTERN">Intern (Active Internship)</option>
                  <option value="EXPERIENCED">Experienced Software Engineer (Senior / Lead)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-brand-400 font-bold hover:underline"
                >
                  Sign Up Free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-brand-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
