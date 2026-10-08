import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

// ─── 4 Supported User Personas ─────────────────────────────────
export const USER_PERSONAS = {
  EXPERIENCED: {
    id: 'user-exp-01',
    personaKey: 'EXPERIENCED',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Senior Software Engineer',
    experienceLevel: 'Experienced (6+ Years)',
    careerGoal: 'Staff Engineer',
    targetSalary: '$165k - $190k',
    plan: 'Pro Tier',
    joinedAt: '2024-01-15',
    dailyLearningHours: 1, // 1 hour/day
    stats: {
      resumeScore: 88,
      interviewReadiness: 82,
      technicalSkillsScore: 90,
      skillsLearned: 24,
      daysStreak: 14,
    },
    currentStack: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    targetStack: ['React', 'TypeScript', 'Go', 'Kubernetes', 'System Design'],
    bio: 'Senior engineer focused on distributed systems, high-scale web performance, and staff-level architecture leadership.',
  },

  FRESHER: {
    id: 'user-fresh-02',
    personaKey: 'FRESHER',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    role: 'Associate Software Engineer (Graduate)',
    experienceLevel: 'Fresher (0-1 Years)',
    careerGoal: 'Junior / Mid Frontend Developer',
    targetSalary: '$70k - $85k',
    plan: 'Starter Tier',
    joinedAt: '2026-06-01',
    dailyLearningHours: 2, // 2 hours/day
    stats: {
      resumeScore: 72,
      interviewReadiness: 68,
      technicalSkillsScore: 75,
      skillsLearned: 8,
      daysStreak: 5,
    },
    currentStack: ['JavaScript', 'HTML/CSS', 'React Basics', 'Git'],
    targetStack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    bio: 'Recent computer science graduate eager to secure a full-time frontend developer position at a high-growth tech startup.',
  },

  STUDENT: {
    id: 'user-stud-03',
    personaKey: 'STUDENT',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    role: 'Computer Science Undergraduate (Junior Year)',
    experienceLevel: 'Student',
    careerGoal: 'Software Engineering Summer Intern',
    targetSalary: '$45/hr Intern Stipend',
    plan: 'Student Tier',
    joinedAt: '2026-08-10',
    dailyLearningHours: 0.5, // 30 mins/day (tight academic schedule)
    stats: {
      resumeScore: 65,
      interviewReadiness: 60,
      technicalSkillsScore: 70,
      skillsLearned: 6,
      daysStreak: 9,
    },
    currentStack: ['Python', 'C++', 'Data Structures', 'SQL Basics'],
    targetStack: ['Python', 'Algorithms', 'FastAPI', 'Docker', 'System Fundamentals'],
    bio: 'Junior year CS student balancing university coursework with competitive programming and summer internship prep.',
  },

  INTERN: {
    id: 'user-intern-04',
    personaKey: 'INTERN',
    name: 'Liam Chen',
    email: 'liam.chen@techstartup.io',
    role: 'Frontend Engineering Intern',
    experienceLevel: 'Intern (3 Months Active)',
    careerGoal: 'Full-Time Return Offer Conversion',
    targetSalary: '$90k - $105k Base',
    plan: 'Pro Tier',
    joinedAt: '2026-07-01',
    dailyLearningHours: 1, // 1 hour/day
    stats: {
      resumeScore: 80,
      interviewReadiness: 76,
      technicalSkillsScore: 82,
      skillsLearned: 14,
      daysStreak: 12,
    },
    currentStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Jest'],
    targetStack: ['React', 'GraphQL', 'Next.js', 'E2E Testing (Playwright)', 'CI/CD'],
    bio: 'Software intern optimizing frontend performance and aiming for full-time conversion through high engineering velocity.',
  },
}

export const DEFAULT_USER = {
  id: 'user-01',
  personaKey: 'EXPERIENCED',
  name: 'Yalamarthijahnavi9',
  email: 'yalamarthijahnavi9@gmail.com',
  role: 'Software Engineer',
  initials: 'RS',
  experienceLevel: 'Experienced (3+ Years)',
  careerGoal: 'Senior Software Engineer',
  targetSalary: '$140k - $175k',
  plan: 'Pro Active',
  joinedAt: '2024-01-15',
  dailyLearningHours: 1,
  stats: {
    careerHealthScore: 78,
    resumeScore: 88,
    interviewReadiness: 82,
    technicalSkillsScore: 80,
    jobSwitchScore: 76,
    learningScore: 70,
    projectsScore: 75,
    skillsLearned: 24,
    daysStreak: 7,
  },
  currentStack: ['Python', 'React', 'JavaScript', 'SQL', 'AWS', 'Docker'],
  targetStack: ['React', 'TypeScript', 'System Design', 'Cloud Architecture'],
  bio: 'Software engineer passionate about building high-impact products and mastering modern full-stack technologies.',
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      isAuthenticated: true,
      isLoading: false,
      isAuthModalOpen: false,
      authMode: 'login', // 'login' | 'register'

      // Actions
      setUser: (user) => set({ user }),

      // Switch persona with cross-app synchronization
      switchPersona: (personaKey) => {
        const target = USER_PERSONAS[personaKey]
        if (target) {
          set({ user: target, isAuthenticated: true })
          toast.success(`Switched active profile to ${target.name} (${target.experienceLevel})`)
        }
      },

      updateProfile: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      setDailyLearningHours: (hours) => {
        set((state) => ({
          user: { ...state.user, dailyLearningHours: hours },
        }))
        if (hours === 0) {
          toast('Learning schedule paused (0 hrs/day). You can resume anytime.', { icon: '⏸️' })
        } else if (hours === 0.5) {
          toast.success('Micro-learning schedule set: 30 minutes/day!')
        } else {
          toast.success(`Daily learning target updated: ${hours} hour(s)/day!`)
        }
      },

      // Auth modal toggles
      openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      // User Login with entered credentials
      login: async (email, password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 500))

        const cleanEmail = email ? email.trim() : 'user@example.com'
        const usernamePart = cleanEmail.split('@')[0] || 'User'
        const derivedName = usernamePart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())

        const userObj = {
          id: `user-${Date.now()}`,
          name: derivedName,
          email: cleanEmail,
          role: 'Software Engineer',
          experienceLevel: 'Professional',
          careerGoal: 'Senior Engineer',
          targetSalary: '$140k - $170k',
          plan: 'Pro Tier',
          joinedAt: new Date().toISOString().split('T')[0],
          dailyLearningHours: 1,
          stats: {
            resumeScore: 85,
            interviewReadiness: 80,
            technicalSkillsScore: 88,
            skillsLearned: 18,
            daysStreak: 7,
          },
          currentStack: ['React', 'JavaScript', 'Node.js', 'Git', 'REST APIs'],
          targetStack: ['React', 'TypeScript', 'System Design', 'Cloud Architecture'],
          bio: 'Software engineer focused on mastering technical challenges and accelerating career growth.',
        }

        set({
          user: userObj,
          isAuthenticated: true,
          isLoading: false,
          isAuthModalOpen: false,
        })
        toast.success(`Signed in as ${userObj.email}`)
      },

      // User Registration with entered credentials
      register: async (email, password, name = '') => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 600))

        const cleanEmail = email ? email.trim() : 'user@example.com'
        const usernamePart = cleanEmail.split('@')[0] || 'User'
        const derivedName = name?.trim() || usernamePart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())

        const newUser = {
          id: `user-${Date.now()}`,
          name: derivedName,
          email: cleanEmail,
          role: 'Software Engineer',
          experienceLevel: 'Professional',
          careerGoal: 'Senior Engineer',
          targetSalary: '$130k - $160k',
          plan: 'Starter Tier',
          joinedAt: new Date().toISOString().split('T')[0],
          dailyLearningHours: 1,
          stats: {
            resumeScore: 78,
            interviewReadiness: 72,
            technicalSkillsScore: 80,
            skillsLearned: 8,
            daysStreak: 1,
          },
          currentStack: ['React', 'JavaScript', 'CSS', 'Git'],
          targetStack: ['React', 'TypeScript', 'Node.js', 'Next.js'],
          bio: 'Driven engineer focused on leveling up skills and career opportunities.',
        }

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          isAuthModalOpen: false,
        })
        toast.success(`Account created for ${newUser.email}!`)
      },

      logout: () => {
        set({ isAuthenticated: false, user: null })
        toast.success('Logged out successfully.')
      },
    }),
    {
      name: 'ai_career_user_store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.user || !state?.isAuthenticated) {
          if (state) {
            state.user = DEFAULT_USER
            state.isAuthenticated = true
          }
        }
      },
    }
  )
)
