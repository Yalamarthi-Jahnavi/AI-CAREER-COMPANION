import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  BatteryCharging,
  Sliders,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function WorkPressure() {
  const [stressLevel, setStressLevel] = useState(38) // 0 - 100
  const [copiedScript, setCopiedScript] = useState(null)

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(id)
    toast.success('Script copied to clipboard')
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const scripts = [
    {
      id: 'script-1',
      title: 'Boundary Setting for Urgent Ad-Hoc Requests',
      scenario: 'When a manager or stakeholder asks for an unplanned feature due today',
      text: `"I understand this is high priority. Currently, my active capacity is fully allocated to [P0 Deliverable]. If we need to pull in this new item today, which of the existing sprint commitments should I deprioritize or push to next sprint?"`,
    },
    {
      id: 'script-2',
      title: 'Pushing Back on Unrealistic Deadlines',
      scenario: 'When scope exceeds available engineering hours',
      text: `"To deliver this by [Date] without compromising code stability or security, we have two options: 1) Ship the core happy path (Feature A & B) and defer polish/secondary filters to V1.1, or 2) Move the launch date by 3 days to complete full integration testing."`,
    },
    {
      id: 'script-3',
      title: 'Declining Non-Essential Meetings During Crunch Time',
      scenario: 'To protect 3-hour deep focus coding blocks',
      text: `"Hey! I'm in a deep coding focus block to hit our [Milestone] deadline today. Could you send the agenda asynchronously over Slack, or can I review the meeting recording/notes afterward?"`,
    },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 font-sans">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-amber-500" />
              Work Pressure &amp; Work-Life Balance Manager
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            AI-driven cognitive triage, burnout prevention strategies, and professional boundary-setting scripts.
          </p>
        </div>
      </div>

      {/* ── Workload & Burnout Capacity Gauge ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Current Workload Index</span>
            <span className="text-xs font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              Optimal (65%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: '65%' }} />
          </div>
          <p className="text-[11px] text-slate-500">6.5 hours of active deep coding per day without overload.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Cognitive Fatigue Risk</span>
            <span className="text-xs font-bold text-cyan-700 px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200">
              Low (28%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: '28%' }} />
          </div>
          <p className="text-[11px] text-slate-500">Context switching kept below 3 switches/hour.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Work-Life Balance Health</span>
            <span className="text-xs font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
              Healthy (88%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: '88%' }} />
          </div>
          <p className="text-[11px] text-slate-500">No late-night commit spikes detected this sprint.</p>
        </div>
      </div>

      {/* ── 4-Quadrant Eisenhower Triage Framework ──────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          4-Quadrant Engineering Priority Triage Matrix
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider">🔥 Q1: Urgent &amp; Critical (Do Now)</h3>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">P0</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc ml-4">
              <li>Production outage or critical security patch</li>
              <li>Core milestone blocking tomorrow's client launch</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">🎯 Q2: Important, Not Urgent (Schedule)</h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">High ROI</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc ml-4">
              <li>System architecture refactoring &amp; automated testing</li>
              <li>1-Hour daily technology practice &amp; career roadmap</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">⚡ Q3: Urgent, Not Important (Delegate/Batch)</h3>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">Batch</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc ml-4">
              <li>Ad-hoc Slack questions (batch to 11:30 AM &amp; 4:30 PM)</li>
              <li>Non-critical status report formatting</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">🗑️ Q4: Neither (Eliminate / Defer)</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Drop</span>
            </div>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc ml-4">
              <li>Endless exploratory refactoring without user impact</li>
              <li>Optional meetings with no clear decision agenda</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Ready-to-Send Boundary Setting Scripts ─────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Ready-to-Use Professional Boundary Scripts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scripts.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{s.title}</h3>
                <span className="text-[10px] text-slate-500 block mb-2">{s.scenario}</span>
                <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                  {s.text}
                </p>
              </div>

              <button
                onClick={() => copyText(s.text, s.id)}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                {copiedScript === s.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
export default WorkPressure
