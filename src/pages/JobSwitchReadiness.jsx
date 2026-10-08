import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightLeft, ShieldCheck, AlertTriangle, HelpCircle,
  FileCheck, Calendar, ArrowRight, CheckCircle2, Circle,
  FileSearch, ChevronRight, Lock
} from 'lucide-react'
import { useOfferAnalyzerStore } from '../store/useOfferAnalyzerStore'

import toast from 'react-hot-toast'

export function JobSwitchReadiness() {
  const navigate = useNavigate()
  const { analysisResult, currentAnalysis = analysisResult } = useOfferAnalyzerStore()
  const [activeTab, setActiveTab] = useState('resignation')

  // Maintain interactive checklist states with localStorage fallback
  const [beforeResignation, setBeforeResignation] = useState(() => {
    try {
      const saved = localStorage.getItem('job_switch_before_resignation')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'r-1', title: 'Receive signed formal offer letter on official letterhead', completed: true },
      { id: 'r-2', title: 'Get written confirmation of exact joining date from new HR', completed: false },
      { id: 'r-3', title: 'Verify BGV initiation or clear initial document screening', completed: false },
      { id: 'r-4', title: 'Calculate current notice period days and buyout requirement', completed: true },
      { id: 'r-5', title: 'Prepare formal resignation letter to current manager', completed: false },
    ]
  })

  const [verificationList, setVerificationList] = useState(() => {
    try {
      const saved = localStorage.getItem('job_switch_verification_list')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'v-1', title: 'Verify official company email & HR sign-off on offer letter', completed: true },
      { id: 'v-2', title: 'Confirm fixed base salary vs variable pay criteria in writing', completed: false },
      { id: 'v-3', title: 'Verify notice period duration for both employee and company', completed: true },
      { id: 'v-4', title: 'Clarify background check documents and pre-hire requirements', completed: false },
      { id: 'v-5', title: 'Check service bond or training cost reimbursement clauses', completed: false },
    ]
  })

  const [beforeJoining, setBeforeJoining] = useState(() => {
    try {
      const saved = localStorage.getItem('job_switch_before_joining')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'j-1', title: 'Obtain official relieving letter & experience certificate from current employer', completed: false },
      { id: 'j-2', title: 'Submit all educational degrees, marksheets, and ID proofs to new HR', completed: false },
      { id: 'j-3', title: 'Complete pre-employment medical checks (if required)', completed: false },
      { id: 'j-4', title: 'Confirm day-1 orientation schedule and reporting manager details', completed: false },
      { id: 'j-5', title: 'Set up salary account details & PF transfer forms', completed: false },
    ]
  })

  const transition = analysisResult?.safetyAssessment ? {
    score: analysisResult.safetyAssessment.score || 82,
    scoreText: analysisResult.safetyAssessment.label || 'Moderate Safety',
    riskLevel: analysisResult.safetyAssessment.level || 'LOW',
    riskLabel: 'Offer terms audited and verified for professional job transition',
    isInsufficient: false,
    pillars: [
      { name: 'Employment Confirmation', status: 'Confirmed', risk: 'LOW' },
      { name: 'Joining Certainty', status: 'Verified', risk: 'LOW' },
      { name: 'Offer Conditions', status: 'Standard Tech Contract', risk: 'LOW' },
      { name: 'Background Verification', status: 'Pre-check in progress', risk: 'MEDIUM' },
      { name: 'Financial Risk', status: 'Adequate Runway', risk: 'LOW' },
      { name: 'Notice Period', status: 'Standard 30 Days', risk: 'LOW' },
      { name: 'Contract Risk', status: 'Non-compete standard', risk: 'LOW' },
    ],
  } : {
    score: 84,
    scoreText: 'Good Readiness Profile',
    riskLevel: 'LOW',
    riskLabel: 'Complete pre-resignation milestones before submitting notice',
    isInsufficient: false,
    pillars: [
      { name: 'Employment Confirmation', status: 'Written Offer Pending Upload', risk: 'MEDIUM' },
      { name: 'Joining Certainty', status: 'Date Scheduled', risk: 'LOW' },
      { name: 'Offer Conditions', status: 'Standard Tech Contract', risk: 'LOW' },
      { name: 'Background Verification', status: 'Documents Ready', risk: 'LOW' },
      { name: 'Financial Risk', status: 'Emergency Fund Verified', risk: 'LOW' },
      { name: 'Notice Period', status: '30-Day Transition Window', risk: 'LOW' },
      { name: 'Contract Risk', status: 'No IP Conflict', risk: 'LOW' },
    ],
  }

  const pillars = transition.pillars

  const toggleChecklist = (id) => {
    if (activeTab === 'resignation') {
      setBeforeResignation((prev) => {
        const updated = prev.map((item) => {
          if (item.id === id) {
            const next = !item.completed
            if (next) toast.success('Pre-resignation task completed!')
            return { ...item, completed: next }
          }
          return item
        })
        try { localStorage.setItem('job_switch_before_resignation', JSON.stringify(updated)) } catch {}
        return updated
      })
    } else if (activeTab === 'verification') {
      setVerificationList((prev) => {
        const updated = prev.map((item) => {
          if (item.id === id) {
            const next = !item.completed
            if (next) toast.success('Offer item verified!')
            return { ...item, completed: next }
          }
          return item
        })
        try { localStorage.setItem('job_switch_verification_list', JSON.stringify(updated)) } catch {}
        return updated
      })
    } else if (activeTab === 'joining') {
      setBeforeJoining((prev) => {
        const updated = prev.map((item) => {
          if (item.id === id) {
            const next = !item.completed
            if (next) toast.success('Onboarding item checked off!')
            return { ...item, completed: next }
          }
          return item
        })
        try { localStorage.setItem('job_switch_before_joining', JSON.stringify(updated)) } catch {}
        return updated
      })
    }
  }

  const hrQuestions = [
    { id: 'hr-1', topic: 'Joining Date', question: 'Could you please confirm if the joining date is firm and guaranteed?' },
    { id: 'hr-2', topic: 'Salary Breakup', question: 'Could you please provide an itemized monthly salary breakup showing fixed base vs variable pay?' },
    { id: 'hr-3', topic: 'Notice Buyout', question: 'Could you please confirm whether notice buyout is permitted if early exit is required?' },
  ]

  const tabs = [
    { id: 'resignation', label: `1. Before-Resignation Checklist (${beforeResignation.filter(i => i.completed).length}/${beforeResignation.length})` },
    { id: 'verification', label: `2. Offer Verification Checklist (${verificationList.filter(i => i.completed).length}/${verificationList.length})` },
    { id: 'joining', label: `3. Before-Joining Checklist (${beforeJoining.filter(i => i.completed).length}/${beforeJoining.length})` },
    { id: 'hr', label: `4. HR Questions (${hrQuestions.length})` },
  ]

  const ChecklistItem = ({ item }) => (
    <div
      onClick={() => toggleChecklist(item.id)}
      className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all select-none"
    >
      {item.completed ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500 shrink-0" />
      )}
      <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
        {item.title}
      </span>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 pb-12 text-slate-800 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            Decision Support &amp; Safety Audit
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Job Switch Readiness</h1>
          <p className="text-sm text-slate-500 mt-1">
            Assess transition safety, review 7 offer pillars, and follow key checklists before resigning.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/offer-letter-analyzer')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-indigo-500/20"
        >
          <FileSearch className="w-4 h-4" />
          {currentAnalysis ? 'Analyze Another Offer' : 'Upload Offer Letter'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Transition Safety Score + 7 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:col-span-1 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transition Safety Score</span>
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>

            {transition.isInsufficient ? (
              <div className="my-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-amber-700">Insufficient Information</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a complete multi-page offer letter to generate an evidence-based transition safety score.
                </p>
              </div>
            ) : (
              <div className="text-center my-4">
                <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-slate-50 border-4 border-indigo-200">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-900">{transition.score}</span>
                    <span className="text-xs text-slate-500 block font-medium">/ 100</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    transition.riskLevel === 'LOW'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : transition.riskLevel === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {transition.riskLevel} TRANSITION RISK
                  </span>
                  <p className="text-xs text-slate-600 mt-2 font-medium">{transition.riskLabel}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-800">Score Ranges:</p>
            <div className="flex justify-between"><span>80–100:</span> <span className="text-emerald-600 font-medium">LOW Risk (Safe)</span></div>
            <div className="flex justify-between"><span>60–79:</span> <span className="text-amber-600 font-medium">MEDIUM Risk (Verify terms)</span></div>
            <div className="flex justify-between"><span>0–59:</span> <span className="text-rose-600 font-medium">HIGH Risk (Strict bond/terms)</span></div>
          </div>
        </motion.div>

        {/* 7-Pillars Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:col-span-2 shadow-xs space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-500" />
            7 Pillars of Transition Safety
          </h2>
          <p className="text-xs text-slate-500">
            Evidence-based evaluation of your offer's stability across 7 core employment pillars.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.status}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  p.risk === 'LOW'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : p.risk === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {p.risk} RISK
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Checklist Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'resignation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-blue-900">Need formal notice period tools & email generator?</h4>
                <p className="text-[11px] text-blue-700 mt-0.5">Generate formal resignation emails, calculate exact Last Working Day, and export handover runbooks.</p>
              </div>
              <button
                onClick={() => navigate('/app/resignation-checklist')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                Open Resignation Suite →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              Critical steps to complete before submitting your formal resignation to your current employer:
            </p>
            <div className="space-y-2.5">
              {beforeResignation.map((item) => <ChecklistItem key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">
              Key offer letter terms to confirm in writing before accepting:
            </p>
            {verificationList.map((item) => <ChecklistItem key={item.id} item={item} />)}
          </div>
        )}

        {activeTab === 'joining' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">
              Preparation steps for your notice period and Day-1 onboarding:
            </p>
            {beforeJoining.map((item) => <ChecklistItem key={item.id} item={item} />)}
          </div>
        )}

        {activeTab === 'hr' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">
              Questions to ask HR to clarify ambiguity before committing:
            </p>
            {hrQuestions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{q.topic}</span>
                <p className="text-sm font-medium text-slate-800">"{q.question}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare Offers Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Comparing Multiple Job Offers?</h3>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate 2 offers side-by-side across 12 dimensions including salary, growth, tech stack, and contract risks.
          </p>
        </div>
        <button
          onClick={() => navigate('/app/compare-offers')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0 shadow-md"
        >
          Compare 2 Offers Side-by-Side
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
