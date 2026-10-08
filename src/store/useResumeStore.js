import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_RESUME = {
  personalInfo: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.dev',
    jobTitle: 'Senior Full Stack Engineer',
  },
  summary:
    'Results-driven Full Stack Engineer with 5+ years of experience designing, developing, and scaling high-performance web applications. Specialized in React, Node.js, and cloud architectures, with a proven track record of reducing latency by 40% and increasing team velocity.',
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected and deployed microservices handling 2M+ daily active requests with 99.98% uptime SLA.',
        'Spearheaded frontend migration from legacy monolith to React & TypeScript, slashing initial load time by 45%.',
        'Mentored 6 junior engineers and instituted automated CI/CD code quality gates with Jest and Cypress.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Full Stack Developer',
      company: 'Innovate Labs',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Built real-time analytics dashboard with React, WebSocket, and PostgreSQL, increasing user engagement by 32%.',
        'Implemented Redis caching layer across critical API endpoints, reducing database query load by 60%.',
        'Collaborated with product designers to create an accessible component library compliant with WCAG 2.1 AA.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevCollab — Real-time Code Workspace',
      technologies: 'React, Node.js, Socket.io, Docker',
      link: 'github.com/alexmorgan/devcollab',
      bullets: [
        'Designed real-time collaborative code editor with operational transformation supporting 50+ concurrent typers.',
        'Integrated WebAssembly syntax highlighter achieving 60fps rendering during large file parsing.',
      ],
    },
    {
      id: 'proj-2',
      title: 'CloudMetrics — Distributed Telemetry Agent',
      technologies: 'Go, Prometheus, Grafana, AWS',
      link: 'github.com/alexmorgan/cloudmetrics',
      bullets: [
        'Engineered lightweight system daemon collecting CPU/memory metrics across 500+ AWS EC2 instances.',
        'Achieved sub-5ms metric transmission latency using gRPC binary serialization.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      graduationYear: '2019',
      gpa: '3.8/4.0',
    },
  ],
  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL', 'HTML5/CSS3'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    tools: ['Docker', 'Kubernetes', 'AWS (S3, ECS, Lambda)', 'Git', 'Jest', 'CI/CD'],
    softSkills: ['System Design', 'Technical Leadership', 'Agile/Scrum', 'Cross-functional Collaboration'],
  },
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-04',
      url: 'aws.amazon.com/verification',
    },
  ],
  achievements: [
    '1st Place Winner at Bay Area Hackathon 2023 out of 120 participating teams.',
    'Authored tech blog post on distributed tracing read by 40,000+ engineers on Dev.to.',
  ],
}

export const useResumeStore = create(
  persist(
    (set, get) => ({
      // ── Builder State ──────────────────────────────────────────
      resume: DEFAULT_RESUME,
      activeTemplate: 'modern', // 'modern' | 'tech' | 'minimal' | 'executive'
      selectedColor: '#6366f1', // brand accent color in resume

      // ── Analyzer State ─────────────────────────────────────────
      uploadedFile: null,
      rawResumeText: '',
      targetRole: 'Full Stack Engineer',
      targetJd: '',
      isAnalyzing: false,
      analysis: null,
      jdMatchResult: null,

      // ── Builder Actions ────────────────────────────────────────
      setTemplate: (tpl) => set({ activeTemplate: tpl }),
      setColor: (col) => set({ selectedColor: col }),

      updatePersonalInfo: (patch) =>
        set((s) => ({
          resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...patch } },
        })),

      setSummary: (summary) =>
        set((s) => ({
          resume: { ...s.resume, summary },
        })),

      // Experience
      addExperience: (item) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: [
              ...s.resume.experience,
              { id: 'exp-' + Date.now(), role: '', company: '', bullets: [''], ...item },
            ],
          },
        })),

      updateExperience: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),

      deleteExperience: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.filter((e) => e.id !== id),
          },
        })),

      // Projects
      addProject: (item) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: [
              ...s.resume.projects,
              { id: 'proj-' + Date.now(), title: '', technologies: '', bullets: [''], ...item },
            ],
          },
        })),

      updateProject: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),

      deleteProject: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: s.resume.projects.filter((p) => p.id !== id),
          },
        })),

      // Education
      addEducation: (item) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: [
              ...s.resume.education,
              { id: 'edu-' + Date.now(), degree: '', institution: '', graduationYear: '', ...item },
            ],
          },
        })),

      updateEducation: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),

      deleteEducation: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.filter((e) => e.id !== id),
          },
        })),

      // Skills
      updateSkills: (category, items) =>
        set((s) => ({
          resume: {
            ...s.resume,
            skills: { ...s.resume.skills, [category]: items },
          },
        })),

      // Certifications
      addCertification: (item) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: [
              ...s.resume.certifications,
              { id: 'cert-' + Date.now(), name: '', issuer: '', date: '', ...item },
            ],
          },
        })),

      deleteCertification: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: s.resume.certifications.filter((c) => c.id !== id),
          },
        })),

      // Achievements
      addAchievement: (text) =>
        set((s) => ({
          resume: {
            ...s.resume,
            achievements: [...s.resume.achievements, text],
          },
        })),

      deleteAchievement: (index) =>
        set((s) => ({
          resume: {
            ...s.resume,
            achievements: s.resume.achievements.filter((_, i) => i !== index),
          },
        })),

      loadSampleResume: () => set({ resume: DEFAULT_RESUME }),

      resetResume: () =>
        set({
          resume: {
            personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', jobTitle: '' },
            summary: '',
            experience: [],
            projects: [],
            education: [],
            skills: { languages: [], frameworks: [], databases: [], tools: [], softSkills: [] },
            certifications: [],
            achievements: [],
          },
        }),

      // ── Analyzer Actions ───────────────────────────────────────
      setUploadedFile: (fileMeta) => set({ uploadedFile: fileMeta }),
      setRawResumeText: (text) => set({ rawResumeText: text }),
      setTargetRole: (role) => set({ targetRole: role }),
      setTargetJd: (jd) => set({ targetJd: jd }),
      setIsAnalyzing: (val) => set({ isAnalyzing: val }),
      setAnalysis: (analysis) => set({ analysis }),
      setJdMatchResult: (res) => set({ jdMatchResult: res }),
      clearAnalysis: () => set({ uploadedFile: null, rawResumeText: '', analysis: null, jdMatchResult: null }),
    }),
    {
      name: 'ai-career-resume-store',
      partialize: (s) => ({
        resume: s.resume,
        activeTemplate: s.activeTemplate,
        selectedColor: s.selectedColor,
        analysis: s.analysis,
        targetRole: s.targetRole,
        targetJd: s.targetJd,
      }),
    }
  )
)
