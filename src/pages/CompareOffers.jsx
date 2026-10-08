import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GitCompare, ShieldCheck, DollarSign, Briefcase, MapPin,
  Laptop, TrendingUp, Code2, Clock, AlertTriangle, CheckCircle2,
  Info, ArrowRight, RefreshCw, Scale
} from 'lucide-react'
import { useCompareOffersStore } from '../store/useCompareOffersStore'
import { PRESET_OFFER_COMPARISONS } from '../api/compareOffersApi'

export function CompareOffers() {
  const {
    offerA,
    offerB,
    comparisonResult,
    isComparing,
    setOfferAField,
    setOfferBField,
    loadPreset,
    runComparison,
  } = useCompareOffersStore()

  useEffect(() => {
    if (!comparisonResult) {
      runComparison()
    }
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 pb-16 text-slate-800 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            Decision Support &amp; Trade-Off Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Job Offers</h1>
          <p className="text-sm text-slate-500">
            Compare 2 offers side-by-side across 12 dimensions to evaluate trade-offs beyond basic salary numbers.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPreset('standardVsStartup')}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            Load Sample Comparison
          </button>
        </div>
      </div>

      {/* Inputs Header — Offer A vs Offer B Quick Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offer A Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
              OFFER A
            </span>
            <span className="text-xs text-slate-500 font-medium">Primary Offer</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Company Name</label>
              <input
                type="text"
                value={offerA.company || ''}
                onChange={(e) => setOfferAField('company', e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Role</label>
                <input
                  type="text"
                  value={offerA.role || ''}
                  onChange={(e) => setOfferAField('role', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                  placeholder="e.g. Sr. Engineer"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Salary / CTC</label>
                <input
                  type="text"
                  value={offerA.salary || ''}
                  onChange={(e) => setOfferAField('salary', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                  placeholder="e.g. $140,000 / year"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Offer B Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
              OFFER B
            </span>
            <span className="text-xs text-slate-500 font-medium">Alternative Offer</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Company Name</label>
              <input
                type="text"
                value={offerB.company || ''}
                onChange={(e) => setOfferBField('company', e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400"
                placeholder="e.g. Nexus AI"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Role</label>
                <input
                  type="text"
                  value={offerB.role || ''}
                  onChange={(e) => setOfferBField('role', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  placeholder="e.g. Full Stack Engineer"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Salary / CTC</label>
                <input
                  type="text"
                  value={offerB.salary || ''}
                  onChange={(e) => setOfferBField('salary', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  placeholder="e.g. $165,000 / year"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runComparison}
          disabled={isComparing}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Scale className="w-4 h-4" />
          {isComparing ? 'Comparing Offers...' : 'Re-Run Side-by-Side Analysis'}
        </button>
      </div>

      {/* 12-Dimension Side-by-Side Comparison Matrix */}
      {comparisonResult && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-500" />
            12-Dimension Side-by-Side Matrix
          </h2>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 p-4">
              <div className="col-span-4">Evaluation Dimension</div>
              <div className="col-span-4 text-indigo-700 font-extrabold">{offerA.company || 'Offer A'}</div>
              <div className="col-span-4 text-purple-700 font-extrabold">{offerB.company || 'Offer B'}</div>
            </div>

            {/* Table Body (12 Rows) */}
            <div className="divide-y divide-slate-100">
              {comparisonResult.dimensions.map((dim, index) => (
                <div key={dim.key} className="grid grid-cols-12 p-4 text-xs items-start hover:bg-slate-50/70 transition-colors">
                  {/* Dimension Label */}
                  <div className="col-span-4 pr-4">
                    <span className="font-bold text-slate-900 text-xs block">{dim.label}</span>
                    <p className="text-[11px] text-slate-500 mt-1 italic">{dim.tradeOffAnalysis}</p>
                  </div>

                  {/* Offer A Value */}
                  <div className="col-span-4 pr-4 font-medium text-slate-700">
                    {dim.key === 'safetyAssessment' ? (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        {dim.offerAValue}
                      </span>
                    ) : (
                      dim.offerAValue
                    )}
                  </div>

                  {/* Offer B Value */}
                  <div className="col-span-4 font-medium text-slate-700">
                    {dim.key === 'safetyAssessment' ? (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        {dim.offerBValue}
                      </span>
                    ) : (
                      dim.offerBValue
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Prescriptive AI Decision Support Summary */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              Decision-Support Analysis &amp; Trade-Offs
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {comparisonResult.decisionSupport.summaryText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {comparisonResult.decisionSupport.keyTradeOffs.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-bold text-indigo-600">{t.title}</h4>
                  <p className="text-xs text-slate-500 leading-normal">{t.detail}</p>
                </div>
              ))}
            </div>

            {/* Mandatory Non-Prescriptive Guidelines & Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Decision Support Guidance
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                {comparisonResult.decisionSupport.guidelinesNotice.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
