import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Lock, ArrowLeft, KeyRound, Sparkles, UserCheck } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'
import toast from 'react-hot-toast'

export function AdminRoute({ children }) {
  const { user, updateProfile } = useUserStore()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'

  const handleGrantAdminForTesting = () => {
    updateProfile({ role: 'admin' })
    toast.success('Elevated role to Administrator! Access granted.', { icon: '🛡️' })
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500" />

          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" /> 403 Forbidden
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Access Denied
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              The <strong>/admin</strong> dashboard is protected by Role-Based Access Control (RBAC). Your current account does not have administrator privileges.
            </p>
          </div>

          {/* Current User Role Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current User:</span>
              <span className="font-bold text-slate-900">{user?.name || 'Guest'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium text-slate-700">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active Role:</span>
              <span className="font-bold text-blue-600 uppercase text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {user?.role || 'user'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Required Role:</span>
              <span className="font-bold text-rose-600 uppercase text-[10px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                admin
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleGrantAdminForTesting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>Elevate to Admin Role (Developer 1-Click)</span>
            </button>

            <Link
              to="/app/dashboard"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to User Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
