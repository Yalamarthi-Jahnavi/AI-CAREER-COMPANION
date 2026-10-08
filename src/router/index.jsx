import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { Dashboard }   from '../pages/Dashboard'
import { TechnologyRoadmap } from '../pages/TechnologyRoadmap'
import { LearningPlanner } from '../pages/LearningPlanner'
import { TechnologyPractice } from '../pages/TechnologyPractice'
import { AssessmentHistory } from '../pages/AssessmentHistory'
import { TechnologyProgressTracking } from '../pages/TechnologyProgressTracking'
import { DeadlinePlanner } from '../pages/DeadlinePlanner'
import { ProjectAssistant } from '../pages/ProjectAssistant'
import { ResumeBuilder } from '../pages/ResumeBuilder'
import { ResumeAnalyzer } from '../pages/ResumeAnalyzer'
import { InterviewPreparation } from '../pages/InterviewPreparation'
import { MockInterview } from '../pages/MockInterview'
import { HRQuestions } from '../pages/HRQuestions'
import { OfferLetterAnalyzer } from '../pages/OfferLetterAnalyzer'
import { JobSwitchReadiness } from '../pages/JobSwitchReadiness'
import { CompareOffers } from '../pages/CompareOffers'
import { AICareerChat } from '../pages/AICareerChat'
import { Profile } from '../pages/Profile'
import { CurrentJob } from '../pages/CurrentJob'
import { WorkPressure } from '../pages/WorkPressure'
import { ResignationChecklist } from '../pages/ResignationChecklist'
import { Feedback } from '../pages/Feedback'
import { SkillGapAnalyzer } from '../pages/SkillGapAnalyzer'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AdminRoute } from '../components/Admin/AdminRoute'
import {
  Briefcase, AlertTriangle, Calendar, Map, BookOpen, Code2,
  FolderKanban, BarChart3, FileText, FileScan, MicVocal,
  MessageSquare, HelpCircle, ArrowRightLeft, Mail, GitCompare,
  ClipboardList, Bot, History, LineChart, ThumbsUp, User,
} from 'lucide-react'

// ─── Typed page configs — avoids per-page component boilerplate ─
const PAGE_CONFIGS = {
  'current-job': {
    title: 'Current Job Tracker',
    icon: Briefcase,
    color: 'brand',
    description: 'Track your current role, responsibilities, performance metrics, and growth opportunities. Get AI insights on how to excel in your position.',
    features: ['Role & responsibility mapping', 'Performance goal tracking', 'AI career advice for your role', '1:1 meeting prep', 'Skills used on the job'],
  },
  'work-pressure': {
    title: 'Work Pressure Manager',
    icon: AlertTriangle,
    color: 'warning',
    description: 'Balance your workload intelligently. Get AI-powered strategies to manage stress, prioritize tasks, and maintain a healthy work-life balance.',
    features: ['Workload capacity tracker', 'Stress level monitoring', 'Smart task prioritization', 'Burnout prevention tips', 'Work-life balance insights'],
  },
  'deadline-planner': {
    title: 'Deadline Planner',
    icon: Calendar,
    color: 'info',
    description: 'Never miss a deadline again. AI-powered project and learning deadline management with smart reminders and progress tracking.',
    features: ['Project milestone tracking', 'Smart reminder system', 'Priority matrix view', 'Time estimation AI', 'Progress visualization'],
  },
  'technology-roadmap': {
    title: 'Technology Roadmap',
    icon: Map,
    color: 'accent',
    description: 'Get AI-curated technology learning roadmaps based on your career goals and current stack. Stay ahead of the curve.',
    features: ['Role-based tech roadmaps', 'Learning path builder', 'Market demand analysis', 'Resource recommendations', 'Progress milestones'],
  },
  'learning-planner': {
    title: 'Learning Planner',
    icon: BookOpen,
    color: 'success',
    description: 'Build a structured, personalized learning plan. Track courses, books, tutorials, and your daily learning streaks.',
    features: ['Personalized schedule builder', 'Course & resource tracker', 'Daily learning goals', 'Progress analytics', 'Certification roadmap'],
  },
  'current-technology-practice': {
    title: 'Technology Practice',
    icon: Code2,
    color: 'brand',
    description: 'Daily coding practice tailored to your stack. Track what you\'ve practiced, identify weak areas, and improve consistently.',
    features: ['Daily practice tracker', 'Concept mastery tracking', 'Code snippet library', 'Weak area detection', 'Practice streaks'],
  },
  'project-assistant': {
    title: 'Project Assistant',
    icon: FolderKanban,
    color: 'accent',
    description: 'AI-powered assistance for managing projects end-to-end. Planning, architecture suggestions, code review, and delivery tracking.',
    features: ['Project planning AI', 'Architecture suggestions', 'Task breakdown', 'Risk identification', 'Delivery timeline builder'],
  },
  'skill-gap-analyzer': {
    title: 'Skill Gap Analyzer',
    icon: BarChart3,
    color: 'warning',
    description: 'Compare your skills against top job descriptions for your target role. Get a precise gap analysis and action plan.',
    features: ['JD comparison engine', 'Gap heat map', 'Prioritized upskilling plan', 'Salary impact analysis', 'Peer benchmarking'],
  },
  'resume-builder': {
    title: 'Resume Builder',
    icon: FileText,
    color: 'success',
    description: 'Build ATS-optimized resumes with AI assistance. Choose from professional templates and get real-time improvement suggestions.',
    features: ['ATS optimization', 'AI content suggestions', 'Multiple templates', 'Impact metrics helper', 'Export PDF / DOCX'],
  },
  'resume-analyzer': {
    title: 'Resume Analyzer',
    icon: FileScan,
    color: 'info',
    description: 'Upload your resume and get a detailed AI analysis with score, ATS compatibility check, and specific improvement suggestions.',
    features: ['ATS compatibility score', 'Section-by-section analysis', 'Keyword optimization', 'Impact statement review', 'Comparison with top candidates'],
  },
  'interview-preparation': {
    title: 'Interview Preparation',
    icon: MicVocal,
    color: 'brand',
    description: 'Comprehensive interview preparation with role-specific questions, company research guides, and AI coaching.',
    features: ['Role-specific question bank', 'Company research guides', 'STAR method practice', 'Technical topic briefs', 'Confidence scoring'],
  },
  'mock-interview': {
    title: 'Mock Interview',
    icon: MessageSquare,
    color: 'accent',
    description: 'Practice with a realistic AI interviewer. Get scored answers, detailed feedback, and track your improvement over time.',
    features: ['Realistic AI interviewer', 'Technical & behavioral rounds', 'Answer scoring engine', 'Detailed feedback report', 'Progress tracking'],
  },
  'hr-questions': {
    title: 'HR Questions Trainer',
    icon: HelpCircle,
    color: 'success',
    description: 'Master behavioral and HR interview questions with curated question banks and AI-evaluated practice answers.',
    features: ['500+ HR question bank', 'STAR method coach', 'Company-specific prep', 'Answer evaluation AI', 'Salary negotiation guide'],
  },
  'job-switch-readiness': {
    title: 'Job Switch Readiness',
    icon: ArrowRightLeft,
    color: 'warning',
    description: 'Assess if you\'re ready to switch jobs. Get a comprehensive readiness score based on skills, resume, market conditions, and more.',
    features: ['Readiness score engine', 'Market timing analysis', 'Skill matching check', 'Notice period planning', 'Job search strategy'],
  },
  'offer-letter-analyzer': {
    title: 'Offer Letter Analyzer',
    icon: Mail,
    color: 'info',
    description: 'Upload any offer letter and get an AI analysis of compensation, benefits, clauses, red flags, and negotiation opportunities.',
    features: ['Compensation breakdown', 'Benefits valuation', 'Red flag detection', 'Negotiation points', 'Market rate comparison'],
  },
  'compare-offers': {
    title: 'Compare Offers',
    icon: GitCompare,
    color: 'brand',
    description: 'Compare multiple job offers side-by-side across salary, benefits, growth, culture, and location with AI recommendations.',
    features: ['Side-by-side comparison', 'Total comp calculator', 'Growth potential scoring', 'Culture analysis', 'AI recommendation'],
  },
  'resignation-checklist': {
    title: 'Resignation Checklist',
    icon: ClipboardList,
    color: 'accent',
    description: 'Exit professionally with a comprehensive AI-generated checklist. Ensure smooth handover, protect your reputation, and leave on good terms.',
    features: ['Legal requirements checker', 'Knowledge transfer guide', 'Notice period calendar', 'Exit conversation guide', 'Professional reference tips'],
  },
  'ai-career-chat': {
    title: 'AI Career Chat',
    icon: Bot,
    color: 'success',
    description: 'Your personal AI career mentor, available 24/7. Ask anything about career strategy, salary negotiation, learning paths, or job switching.',
    features: ['Contextual career advice', 'Multi-turn conversation', 'History & bookmarks', 'Specialized career agents', 'Export chat summaries'],
  },
  'history': {
    title: 'Activity History',
    icon: History,
    color: 'muted',
    description: 'Review your complete career journey on the platform. Access past analyses, interviews, resumes, and AI conversations.',
    features: ['Full activity timeline', 'Session recordings', 'Progress milestones', 'Export history', 'Searchable logs'],
  },
  'reports': {
    title: 'Career Reports',
    icon: LineChart,
    color: 'info',
    description: 'Comprehensive analytics and progress reports across all career dimensions. Track your growth over time with visual dashboards.',
    features: ['Weekly progress report', 'Skill growth chart', 'Interview success rate', 'Resume performance', 'Goal completion tracking'],
  },
  'feedback': {
    title: 'Share Feedback',
    icon: ThumbsUp,
    color: 'success',
    description: 'Help us build the best career platform. Share your feedback, report bugs, suggest features, and rate your experience.',
    features: ['Feature requests', 'Bug reporting', 'Experience rating', 'Beta feature voting', 'Community suggestions'],
  },
  'profile': {
    title: 'Your Profile',
    icon: User,
    color: 'brand',
    description: 'Manage your account, career goals, preferences, and subscription. Keep your profile up to date for better AI recommendations.',
    features: ['Career goal setting', 'Tech stack management', 'Notification preferences', 'Subscription management', 'Privacy settings'],
  },
}

import { useUserStore } from '../store/useUserStore'

function RootRoute() {
  const { isAuthenticated } = useUserStore()
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }
  return <LoginPage initialMode="login" />
}

// ─── Router ───────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Opening / Login Page as the primary entry point
  { path: '/', element: <RootRoute /> },
  { path: '/login', element: <LoginPage initialMode="login" /> },
  { path: '/register', element: <LoginPage initialMode="register" /> },

  // Product Showcase / Landing Page
  { path: '/landing', element: <LandingPage /> },

  // Dedicated Admin Command Center (Protected by RBAC AdminRoute)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },

  // App shell
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      // Index redirect
      { index: true, element: <Navigate to="/app/dashboard" replace /> },

      // Dashboard
      { path: 'dashboard', element: <Dashboard /> },

      // Technology Roadmap
      { path: 'technology-roadmap', element: <TechnologyRoadmap /> },

      // Learning Planner (Personalized Technology Roadmap)
      { path: 'learning-planner', element: <LearningPlanner /> },

      // Deadline & Practice Planner
      { path: 'deadline-planner', element: <DeadlinePlanner /> },

      // Current Technology Practice System
      { path: 'current-technology-practice', element: <TechnologyPractice /> },

      // Assessment History
      { path: 'history', element: <AssessmentHistory /> },

      // Technology Progress Tracking & Reports
      { path: 'reports', element: <TechnologyProgressTracking /> },
      { path: 'technology-progress', element: <TechnologyProgressTracking /> },

      // Project Assistant
      { path: 'project-assistant', element: <ProjectAssistant /> },

      // Assessment & Skills
      { path: 'skill-gap-analyzer', element: <SkillGapAnalyzer /> },
      { path: 'resume-builder', element: <ResumeBuilder /> },
      { path: 'resume-analyzer', element: <ResumeAnalyzer /> },

      // Interview Suite
      { path: 'interview-preparation', element: <InterviewPreparation /> },
      { path: 'mock-interview', element: <MockInterview /> },
      { path: 'hr-questions', element: <HRQuestions /> },

      // Offer Letter & Job Transition Suite
      { path: 'offer-letter-analyzer', element: <OfferLetterAnalyzer /> },
      { path: 'job-switch-readiness', element: <JobSwitchReadiness /> },
      { path: 'compare-offers', element: <CompareOffers /> },
      { path: 'resignation-checklist', element: <ResignationChecklist /> },

      // AI Career Assistant / Chat
      { path: 'ai-career-chat', element: <AICareerChat /> },
      { path: 'career-assistant', element: <AICareerChat /> },

      // Work & Career Dynamics
      { path: 'current-job', element: <CurrentJob /> },
      { path: 'work-pressure', element: <WorkPressure /> },
      { path: 'profile', element: <Profile /> },
      { path: 'feedback', element: <Feedback /> },

      // All other routes — rendered from config
      ...Object.entries(PAGE_CONFIGS)
        .filter(
          ([slug]) =>
            slug !== 'technology-roadmap' &&
            slug !== 'learning-planner' &&
            slug !== 'deadline-planner' &&
            slug !== 'current-technology-practice' &&
            slug !== 'history' &&
            slug !== 'reports' &&
            slug !== 'project-assistant' &&
            slug !== 'resume-builder' &&
            slug !== 'resume-analyzer' &&
            slug !== 'interview-preparation' &&
            slug !== 'mock-interview' &&
            slug !== 'hr-questions' &&
            slug !== 'offer-letter-analyzer' &&
            slug !== 'job-switch-readiness' &&
            slug !== 'compare-offers' &&
            slug !== 'ai-career-chat' &&
            slug !== 'current-job' &&
            slug !== 'work-pressure' &&
            slug !== 'resignation-checklist' &&
            slug !== 'profile' &&
            slug !== 'feedback' &&
            slug !== 'skill-gap-analyzer'
        )
        .map(([slug, config]) => ({
          path: slug,
          element: (
            <PlaceholderPage
              title={config.title}
              icon={config.icon}
              color={config.color}
              description={config.description}
              features={config.features}
            />
          ),
        })),
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <PlaceholderPage
          title="Page Not Found"
          description="The page you're looking for doesn't exist."
          color="error"
        />
      </div>
    ),
  },
])
