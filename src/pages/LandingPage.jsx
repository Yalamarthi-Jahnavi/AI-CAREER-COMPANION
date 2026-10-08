import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, BarChart3, FileText, MicVocal, Map,
  Bot, Star, Users, TrendingUp, CheckCircle, Shield,
  Sparkles, ChevronRight, BookOpen, Code2, Briefcase
} from 'lucide-react'

// ─── Animation Variants ───────────────────────────────────────
const fadeUp = {
  initial:   { opacity: 0, y: 30 },
  animate:   { opacity: 1, y: 0 },
  transition:{ duration: 0.6, ease: [0.4, 0, 0.2, 1] },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

// ─── Data ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Map,
    title: 'Technology Roadmap',
    description: 'AI-curated learning paths for any tech stack. From beginner to staff engineer.',
    color: 'brand',
    badge: 'Popular',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analyzer',
    description: 'Compare your skills against top job descriptions and get a personalized action plan.',
    color: 'accent',
    badge: null,
  },
  {
    icon: FileText,
    title: 'Resume Builder & Analyzer',
    description: 'Build ATS-optimized resumes and get AI feedback to maximize your interview rate.',
    color: 'success',
    badge: 'AI-Powered',
  },
  {
    icon: MicVocal,
    title: 'Mock Interview',
    description: 'Practice with an AI interviewer. Get scored answers, feedback, and improvement tips.',
    color: 'warning',
    badge: null,
  },
  {
    icon: Bot,
    title: 'AI Career Chat',
    description: 'Ask anything career-related. Your personal AI mentor, available 24/7.',
    color: 'info',
    badge: 'New',
  },
  {
    icon: Briefcase,
    title: 'Job Switch Assistant',
    description: 'Analyze offers, compare compensation, check readiness, and exit professionally.',
    color: 'error',
    badge: null,
  },
]

const STATS = [
  { value: '50K+', label: 'Engineers Helped' },
  { value: '92%',  label: 'Interview Success Rate' },
  { value: '3.2x', label: 'Avg. Salary Increase' },
  { value: '4.9★', label: 'User Rating' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'SDE-2 at Google',
    avatar: 'PS',
    content: 'AI Career Companion helped me crack my Google interview after 3 failed attempts. The mock interviews were incredibly realistic.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Senior Engineer at Flipkart',
    avatar: 'RV',
    content: 'The resume analyzer highlighted gaps I never noticed. Got 5x more interview calls after updating my resume using its suggestions.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Staff Engineer at Stripe',
    avatar: 'SC',
    content: 'The technology roadmap feature saved me months of research. I had a clear learning path for system design in one click.',
    rating: 5,
  },
]

const NAV_LINKS = ['Features', 'How it works', 'Pricing', 'Blog']

// ─── Feature Card ─────────────────────────────────────────────
const colorMap = {
  brand:   { bg: 'bg-brand-500/10',   icon: 'text-brand-400',   border: 'border-brand-500/20',   glow: 'rgba(99,102,241,0.2)' },
  accent:  { bg: 'bg-accent-500/10',  icon: 'text-accent-400',  border: 'border-accent-500/20',  glow: 'rgba(217,70,239,0.2)' },
  success: { bg: 'bg-success-500/10', icon: 'text-success-400', border: 'border-success-500/20', glow: 'rgba(34,197,94,0.2)' },
  warning: { bg: 'bg-warning-500/10', icon: 'text-warning-400', border: 'border-warning-500/20', glow: 'rgba(234,179,8,0.2)' },
  info:    { bg: 'bg-info-500/10',    icon: 'text-info-400',    border: 'border-info-500/20',    glow: 'rgba(59,130,246,0.2)' },
  error:   { bg: 'bg-error-500/10',   icon: 'text-error-400',   border: 'border-error-500/20',   glow: 'rgba(239,68,68,0.2)' },
}

function FeatureCard({ icon: Icon, title, description, color, badge }) {
  const c = colorMap[color] || colorMap.brand
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-brand-500/30 transition-all cursor-pointer relative overflow-hidden"
      style={{ '--glow': c.glow }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${c.glow} 0%, transparent 60%)` }} />

      <div className="relative">
        {badge && (
          <span className="absolute -top-1 right-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            {badge}
          </span>
        )}
        <div className={`inline-flex p-3 rounded-xl ${c.bg} border ${c.border} mb-4`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <h3 className="text-white font-semibold text-base mb-2 group-hover:text-brand-200 transition-colors">{title}</h3>
        <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
        <div className="flex items-center gap-1 mt-4 text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────
function TestimonialCard({ name, role, avatar, content, rating }) {
  return (
    <motion.div variants={fadeUp} className="bg-dark-card border border-dark-border rounded-2xl p-6">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-warning-400 fill-warning-400" />
        ))}
      </div>
      <p className="text-surface-300 text-sm leading-relaxed mb-5">"{content}"</p>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
        >
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-surface-500">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Landing Page ─────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* ── Navbar ────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}>
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">AI Career Companion</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button key={link} className="text-sm text-surface-400 hover:text-white transition-colors">
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-surface-400 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/login?mode=register')}
            className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.12) 0%, transparent 50%), #0b0d1a'
      }}>
        {/* Background decoration */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }} />

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Advanced AI
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            <span className="hero-title block">Your AI Career</span>
            <span className="hero-title block">Companion</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Learn new technologies, manage work pressure, complete projects on time,
            prepare for interviews, improve your resume and{' '}
            <span className="text-brand-300 font-medium">switch jobs with confidence.</span>
          </motion.p>

          {/* Sub-tagline */}
          <motion.p variants={fadeUp} className="text-sm text-surface-500 mb-10 font-medium tracking-widest uppercase">
            Learn • Build • Prepare • Grow
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2 px-7 py-4 text-base font-bold text-white rounded-2xl shadow-[0_8px_32px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
              id="hero-get-started"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-4 text-base font-semibold text-surface-300 hover:text-white border border-dark-border hover:border-brand-500/40 rounded-2xl transition-all bg-dark-card hover:bg-dark-hover"
              id="hero-explore-features"
            >
              Explore Features
            </button>

            <button
              onClick={() => navigate('/app/skill-gap-analyzer')}
              className="flex items-center gap-2 px-7 py-4 text-base font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              id="hero-start-assessment"
            >
              Start Career Assessment →
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mt-10">
            <div className="flex -space-x-2">
              {['AS', 'MK', 'RD', 'PJ', 'TL'].map((init, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-dark-bg flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: `hsl(${220 + i * 30}, 70%, 50%)` }}
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-sm text-surface-400">
              <span className="text-white font-semibold">50,000+</span> engineers already growing their careers
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ─────────────────────── */}
      <section className="border-y border-dark-border bg-dark-surface/50">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-black text-white mb-1" style={{
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{stat.value}</p>
              <p className="text-sm text-surface-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────── */}
      <section id="features" className="py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Everything You Need</p>
            <h2 className="text-4xl font-black text-white mb-4">
              One platform for your entire career journey
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto">
              From fresher to staff engineer — every stage of your career is covered.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ──────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-dark-surface/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-white mb-4">Start in 3 minutes</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Users,       title: 'Create Your Profile', desc: 'Tell us about your current role, skills, and career goals.' },
              { step: '02', icon: BarChart3,   title: 'Get AI Analysis',     desc: 'Our AI analyzes your profile against top industry benchmarks.' },
              { step: '03', icon: TrendingUp,  title: 'Grow Your Career',    desc: 'Follow your personalized roadmap and track your progress daily.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(217,70,239,0.15))', border: '1px solid rgba(99,102,241,0.25)' }}>
                    <item.icon className="w-7 h-7 text-brand-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Success Stories</p>
            <h2 className="text-4xl font-black text-white mb-4">Engineers who leveled up</h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────── */}
      <section className="py-24 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-12 border border-brand-500/20 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(217,70,239,0.08) 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

          <div className="relative">
            <div className="inline-flex p-3 rounded-2xl mb-6"
              style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}>
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to accelerate your career?
            </h2>
            <p className="text-surface-400 mb-8 text-lg">
              Join 50,000+ engineers using AI to land better jobs, learn faster, and grow smarter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl shadow-[0_8px_32px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
                id="cta-get-started"
              >
                Start for Free <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-sm text-surface-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success-400" />
                No credit card required
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────── */}
      <footer className="border-t border-dark-border py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}>
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AI Career Companion</p>
                <p className="text-[10px] text-surface-500">Learn • Build • Prepare • Grow</p>
              </div>
            </div>

            <div className="flex items-center gap-8 flex-wrap justify-center">
              {['Privacy', 'Terms', 'Careers', 'Contact'].map((link) => (
                <button key={link} className="text-sm text-surface-500 hover:text-white transition-colors">
                  {link}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button aria-label="Twitter / X" className="p-2 rounded-lg text-surface-500 hover:text-white hover:bg-dark-hover transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button aria-label="LinkedIn" className="p-2 rounded-lg text-surface-500 hover:text-white hover:bg-dark-hover transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61 0 .89.72 1.61 1.61 1.61.89 0 1.61-.72 1.61-1.61 0-.89-.72-1.61-1.61-1.61z"/></svg>
              </button>
              <button aria-label="GitHub" className="p-2 rounded-lg text-surface-500 hover:text-white hover:bg-dark-hover transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-surface-600 mt-8">
            © 2025 AI Career Companion. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
