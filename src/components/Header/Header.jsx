import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Menu, Search, Bell, Settings, LogOut, User, ChevronDown,
  Sun, Moon, Shield, CreditCard, HelpCircle, X
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import { useUserStore } from '../../store/useUserStore'
import { useClickOutside, useKeyPress } from '../../hooks/usePageData'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import toast from 'react-hot-toast'

// ─── Search Modal ─────────────────────────────────────────────
function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const QUICK_LINKS = [
    { label: 'Dashboard',                   to: '/app/dashboard',          icon: '⚡' },
    { label: 'Technology Practice',         to: '/app/current-technology-practice', icon: '💻' },
    { label: 'Technology Roadmap',          to: '/app/technology-roadmap', icon: '🗺️' },
    { label: 'Learning Planner',            to: '/app/learning-planner',   icon: '📖' },
    { label: 'Mock Interview',              to: '/app/mock-interview',     icon: '🎤' },
    { label: 'Resume Builder',              to: '/app/resume-builder',     icon: '📄' },
    { label: 'Skill Gap Analyzer',          to: '/app/skill-gap-analyzer', icon: '📊' },
    { label: 'AI Career Chat',              to: '/app/ai-career-chat',     icon: '🤖' },
  ]

  const filtered = query
    ? QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
    : QUICK_LINKS

  const go = (to) => { navigate(to); onClose(); setQuery('') }

  useKeyPress('Escape', onClose)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search technologies, practice tests, roadmaps..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-2 max-h-72 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.to}
                onClick={() => go(item.to)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ─── Notification Panel ───────────────────────────────────────
function NotificationPanel({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
  const navigate = useNavigate()
  const ref = useRef(null)
  useClickOutside(ref, isOpen ? onClose : () => {})

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-slate-800"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-900">Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">All caught up!</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id)
                    if (n.action?.href) { navigate(n.action.href); onClose() }
                  }}
                  className={clsx(
                    'p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs',
                    !n.read && 'bg-blue-50/40'
                  )}
                >
                  <p className="font-semibold text-slate-900">{n.title}</p>
                  <p className="text-slate-500 mt-0.5">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── User Profile Menu ─────────────────────────────────────────
function UserMenu({ isOpen, onClose }) {
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const ref = useRef(null)
  useClickOutside(ref, isOpen ? onClose : () => {})

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  const displayName = user?.name || 'Rahul Sharma'
  const displayRole = user?.role || 'Software Engineer'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-slate-800"
        >
          <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{displayRole}</p>
          </div>

          <div className="p-1.5 space-y-0.5 text-xs">
            <button
              onClick={() => { navigate('/app/profile'); onClose() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Your Profile</span>
            </button>
            <button
              onClick={() => { navigate('/app/feedback'); onClose() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Help & Feedback</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main Header Component ─────────────────────────────────────
export function Header() {
  const { toggleMobileSidebar } = useAppStore()
  const { notifications } = useNotificationStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const { user } = useUserStore()
  const unreadCount = 3 // Matching screenshot badge

  const closeAll = () => { setNotifOpen(false); setUserOpen(false) }
  useKeyPress('k', () => setSearchOpen(true), { ctrl: true })

  const displayName = user?.name || 'Yalamarthijahnavi9'
  const displayRole = user?.role || 'Software Engineer'
  const initials = user?.initials || 'RS'

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 md:px-7 shrink-0 sticky top-0 z-30 shadow-xs">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Search input matching reference screenshot */}
        <div className="flex-1 max-w-xl mx-2 md:mx-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/70 text-slate-400 hover:text-slate-600 transition-all text-xs group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            <span className="truncate">Search anything... (e.g. React, Python, interviews, offers)</span>
          </button>
        </div>

        {/* Right tools: notification, theme icon, user card */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Notification bell with red badge (3) */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setNotifOpen(!notifOpen) }}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>
            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* Theme sun/moon icon */}
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode)
              toast('Switched to optimized SaaS view', { icon: '☀️' })
            }}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Toggle theme mode"
          >
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          </button>

          {/* User profile dropdown matching reference screenshot */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setUserOpen(!userOpen) }}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all"
            >
              {/* Blue Avatar circle with photo or initials */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RS
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-800">{displayName}</span>
                <span className="text-[10px] text-slate-400 font-medium">{displayRole}</span>
              </div>
            </button>
            <UserMenu isOpen={userOpen} onClose={() => setUserOpen(false)} />
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

export default Header
