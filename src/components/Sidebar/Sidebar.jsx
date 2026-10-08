import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { useAppStore } from '../../store/useAppStore'
import { Logo } from '../ui/Logo'
import {
  LayoutDashboard,
  Briefcase,
  AlertTriangle,
  Calendar,
  Map,
  BookOpen,
  Code2,
  FolderKanban,
  BarChart3,
  FileText,
  FileScan,
  MicVocal,
  MessageSquare,
  HelpCircle,
  ArrowRightLeft,
  Mail,
  GitCompare,
  ClipboardList,
  Bot,
  History,
  LineChart,
  ThumbsUp,
  User,
  ChevronLeft,
  Zap,
  X,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Career Hub',
    items: [
      { to: '/app/dashboard',          icon: LayoutDashboard,  label: 'Dashboard' },
      { to: '/app/current-job',         icon: Briefcase,        label: 'Current Job' },
      { to: '/app/work-pressure',       icon: AlertTriangle,    label: 'Work Pressure' },
      { to: '/app/deadline-planner',    icon: Calendar,         label: 'Deadline Planner' },
      { to: '/app/technology-roadmap',  icon: Map,              label: 'Technology Roadmap' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { to: '/app/learning-planner',             icon: BookOpen,     label: 'Learning Planner' },
      { to: '/app/current-technology-practice',  icon: Code2,        label: 'Current Technology Practice', shortLabel: 'Tech Practice', badge: 'New' },
      { to: '/app/technology-progress',          icon: LineChart,    label: 'Technology Progress', shortLabel: 'Progress' },
      { to: '/app/project-assistant',            icon: FolderKanban, label: 'Project Assistant' },
    ],
  },
  {
    label: 'Assessment',
    items: [
      { to: '/app/skill-gap-analyzer', icon: BarChart3, label: 'Skill Gap Analyzer' },
      { to: '/app/resume-builder',     icon: FileText,  label: 'Resume Builder' },
      { to: '/app/resume-analyzer',    icon: FileScan,  label: 'Resume Analyzer' },
    ],
  },
  {
    label: 'Interview',
    items: [
      { to: '/app/interview-preparation', icon: MicVocal,     label: 'Interview Preparation', shortLabel: 'Interview Prep' },
      { to: '/app/mock-interview',        icon: MessageSquare, label: 'Mock Interview' },
      { to: '/app/hr-questions',          icon: HelpCircle,    label: 'HR Questions' },
    ],
  },
  {
    label: 'Job Transition',
    items: [
      { to: '/app/job-switch-readiness',  icon: ArrowRightLeft, label: 'Job Switch Readiness', shortLabel: 'Job Switch' },
      { to: '/app/offer-letter-analyzer', icon: Mail,           label: 'Offer Letter Analyzer', shortLabel: 'Offer Analyzer' },
      { to: '/app/compare-offers',        icon: GitCompare,     label: 'Compare Offers' },
      { to: '/app/resignation-checklist', icon: ClipboardList,  label: 'Resignation Checklist', shortLabel: 'Resignation' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/app/ai-career-chat', icon: Bot,     label: 'AI Career Chat' },
      { to: '/app/history',        icon: History,  label: 'History' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/app/reports',  icon: LineChart, label: 'Reports' },
      { to: '/app/feedback', icon: ThumbsUp,  label: 'Feedback' },
      { to: '/app/profile',  icon: User,      label: 'Profile' },
    ],
  },
]

function NavItem({ to, icon: Icon, label, shortLabel, badge, collapsed }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium',
          'transition-all duration-150 cursor-pointer relative group',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'text-blue-600 bg-white border border-slate-900 font-semibold shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={clsx(
              'w-4.5 h-4.5 shrink-0 transition-colors',
              isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
            )}
            size={18}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-xs flex-1"
              >
                {shortLabel || label}
              </motion.span>
            )}
          </AnimatePresence>

          {!collapsed && badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold leading-none">
              {badge}
            </span>
          )}

          {/* Tooltip on collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, closeMobileSidebar } = useAppStore()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Logo Area */}
      <div className={clsx(
        'flex items-center border-b border-slate-100 py-4.5 shrink-0',
        sidebarCollapsed ? 'px-3 justify-center' : 'px-5 gap-3 justify-between'
      )}>
        <Logo collapsed={sidebarCollapsed} showTagline={false} />

        <button
          onClick={toggleSidebar}
          className={clsx(
            'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all',
            sidebarCollapsed && 'hidden'
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-3 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom — Plan Info */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="m-3 p-3.5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 shrink-0"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                  <Zap className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs font-bold text-slate-900">Pro Active</span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/80 px-2 py-0.5 rounded-full">
                75/100
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Full AI Practice & Analysis Unlocked
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 248 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden md:flex flex-col bg-white border-r border-slate-200/90 h-full overflow-hidden shrink-0 z-30 shadow-xs"
        style={{ minWidth: sidebarCollapsed ? 72 : 248 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
              onClick={closeMobileSidebar}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-[248px] bg-white border-r border-slate-200 z-50 md:hidden shadow-xl"
            >
              <button
                onClick={closeMobileSidebar}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
