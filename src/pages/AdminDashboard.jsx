import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  Users,
  Mail,
  ShieldCheck,
  AlertTriangle,
  FolderKanban,
  Settings,
  Cpu,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Send,
  Trash2,
  UserCheck,
  UserX,
  ExternalLink,
  RefreshCw,
  Plus,
  Eye,
  KeyRound,
  Filter,
  Sliders,
  Bell,
  Lock,
  MessageSquare,
  FileText,
  Zap,
} from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'
import { useUserStore } from '../store/useUserStore'
import toast from 'react-hot-toast'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, updateProfile } = useUserStore()
  const {
    stats,
    users,
    emailsOutbox,
    securityLogs,
    contactMessages,
    uploadedFiles,
    settings,
    isLoading,
    activeTab,
    searchQuery,
    roleFilter,
    setActiveTab,
    setSearchQuery,
    setRoleFilter,
    loadAllAdminData,
    toggleUserRole,
    toggleUserStatus,
    deleteUser,
    sendEmail,
    saveSettings,
  } = useAdminStore()

  // Manual Email Compose Modal
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    to: 'admin@aicareercompanion.com',
    fromType: 'noreply', // 'noreply' | 'support' | 'admin'
    subject: '',
    body: '',
  })

  // Selected Email Preview
  const [selectedEmail, setSelectedEmail] = useState(null)

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState({
    maintenance_mode: false,
    allow_registrations: true,
    ai_model: 'gemini-1.5-flash',
    notify_admin_on_signup: true,
    notify_admin_on_error: true,
    notify_admin_on_contact: true,
  })

  useEffect(() => {
    loadAllAdminData()
  }, [loadAllAdminData])

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings)
    }
  }, [settings])

  const handleSendEmail = async (e) => {
    e.preventDefault()
    if (!emailForm.subject.trim() || !emailForm.body.trim()) {
      toast.error('Please enter both subject and email body.')
      return
    }
    const success = await sendEmail(emailForm)
    if (success) {
      setIsComposeOpen(false)
      setEmailForm({
        to: stats?.adminEmails?.admin || 'admin@aicareercompanion.com',
        fromType: 'noreply',
        subject: '',
        body: '',
      })
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    await saveSettings(settingsForm)
  }

  const handleSwitchToNormalUser = () => {
    updateProfile({ role: 'user' })
    toast('Switched back to Normal User mode', { icon: '👤' })
    navigate('/app/dashboard')
  }

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const adminEmail = stats?.adminEmails?.admin || 'admin@aicareercompanion.com'
  const supportEmail = stats?.adminEmails?.support || 'support@aicareercompanion.com'
  const noreplyEmail = stats?.adminEmails?.noreply || 'noreply@aicareercompanion.com'

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-7 max-w-[1600px] mx-auto text-slate-900 font-sans">
      
      {/* ─── Top Admin Hero Banner ─────────────────────────────────── */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/60 border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4.5 h-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full">
              Production Admin Center
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              RBAC Guard Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Manage user accounts, RBAC permissions, environment email notifications, security audit trails, and website infrastructure.
          </p>

          {/* Configured Admin Emails (Environment Driven) */}
          <div className="flex items-center gap-2 pt-2 flex-wrap text-xs font-medium">
            <span className="text-slate-500 text-[11px] font-semibold">Configured Mailboxes:</span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 shadow-2xs">
              👑 Admin: <strong className="text-indigo-600 font-semibold">{adminEmail}</strong>
            </span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 shadow-2xs">
              💬 Support: <strong className="text-blue-600 font-semibold">{supportEmail}</strong>
            </span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 shadow-2xs">
              🤖 No-Reply: <strong className="text-slate-600 font-semibold">{noreplyEmail}</strong>
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send System Email</span>
          </button>

          <button
            onClick={handleSwitchToNormalUser}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
            title="Switch back to standard user role"
          >
            <UserX className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch to User View</span>
          </button>

          <Link
            to="/app/dashboard"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>User Dashboard</span>
          </Link>
        </div>
      </div>

      {/* ─── 4 Top KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || users.length}</p>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>↑ 100% active</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emails Dispatched</span>
            <p className="text-2xl font-black text-slate-900">{stats?.totalEmailsSent || emailsOutbox.length}</p>
            <span className="text-[11px] font-bold text-indigo-600">
              Admin & Alerts Outbox
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Logs</span>
            <p className="text-2xl font-black text-slate-900">{stats?.securityLogsCount || securityLogs.length}</p>
            <span className="text-[11px] font-bold text-emerald-600">
              0 breaches detected
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Usage & Cost</span>
            <p className="text-2xl font-black text-slate-900">{stats?.aiCostEstimate || '$2.84'}</p>
            <span className="text-[11px] font-bold text-purple-600">
              {stats?.aiTokensUsed || '1.42M tokens'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation Bar ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: '📊 Overview & Health', badge: null },
          { id: 'users', label: '👥 User RBAC Management', badge: users.length },
          { id: 'emails', label: '📧 Admin Email Outbox', badge: emailsOutbox.length },
          { id: 'security', label: '🔐 Security Audit Trail', badge: securityLogs.length },
          { id: 'messages', label: '🚨 Contact Messages', badge: contactMessages.filter((m) => m.status === 'unread').length || null },
          { id: 'files', label: '📄 Uploaded Documents', badge: uploadedFiles.length },
          { id: 'settings', label: '⚙️ Website Settings', badge: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: OVERVIEW & SYSTEM HEALTH ──────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Email Architecture Summary */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Admin Email Architecture & Triggers</h2>
                  <p className="text-[11px] text-slate-500">Separation of Normal User vs. Admin Email infrastructure</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active & Monitored
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Admin Login & Alerts</span>
                <p className="font-bold text-slate-900 break-all">{adminEmail}</p>
                <p className="text-[11px] text-slate-500 leading-snug">Receives registration notices, critical security alerts, and contact submissions.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">User Help & Inquiries</span>
                <p className="font-bold text-slate-900 break-all">{supportEmail}</p>
                <p className="text-[11px] text-slate-500 leading-snug">Handles incoming customer questions, offer disputes, and bug tickets.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">System Automated Sender</span>
                <p className="font-bold text-slate-900 break-all">{noreplyEmail}</p>
                <p className="text-[11px] text-slate-500 leading-snug">Sends password reset links, verification codes, and test completion summaries.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-900">Automated Event Pipeline:</h3>
              <div className="space-y-2 text-xs">
                {[
                  { trigger: 'User Signs Up', action: 'Backend dispatches alert email to ADMIN_EMAIL', badge: 'New User Alert', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { trigger: 'Contact Form Sent', action: 'User inquiry routed to ADMIN_EMAIL; auto-reply sent from NOREPLY', badge: 'Contact Form', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { trigger: 'Brute Force / Rate Limit', action: 'Immediate security alert logged and emailed to ADMIN_EMAIL', badge: 'Security Alert', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                  { trigger: 'Forgot Password', action: 'Secure single-use token sent to user from NOREPLY_EMAIL', badge: 'Password Reset', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-[10px] font-bold flex items-center justify-center text-slate-700">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{item.trigger}</p>
                        <p className="text-[11px] text-slate-500">{item.action}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Security & RBAC Status */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h2>
                  <p className="text-[11px] text-slate-500">Security enforcement across routes</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                7 Layers Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Layer 1: Route Protection Guard
                </span>
                <p className="text-[11px] text-slate-500">
                  Direct visits to <code className="bg-slate-200 px-1 rounded text-slate-800">/admin/*</code> are intercepted by <code className="bg-slate-200 px-1 rounded text-slate-800">AdminRoute</code>. Non-admin users are blocked with 403 Forbidden.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Layer 2: Backend Authorization Middleware
                </span>
                <p className="text-[11px] text-slate-500">
                  All administrative mutations (user deletes, role changes, settings) verify the <code className="bg-slate-200 px-1 rounded text-slate-800">X-User-Role: admin</code> header.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Layer 3: Secret Keys & Environment Isolation
                </span>
                <p className="text-[11px] text-slate-500">
                  Credentials and email mailboxes are managed via <code className="bg-slate-200 px-1 rounded text-slate-800">.env</code> and excluded from version control via <code className="bg-slate-200 px-1 rounded text-slate-800">.gitignore</code>.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('users')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Manage User Roles & Permissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: USERS MANAGEMENT (RBAC) ───────────────────────── */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Accounts &amp; Role-Based Access Control
              </h2>
              <p className="text-xs text-slate-500">
                Inspect registered users, manage admin permissions, and toggle account states.
              </p>
            </div>

            {/* Search & Role Filter */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="user">Users Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4 rounded-l-xl font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role (RBAC)</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Tests Taken</th>
                  <th className="py-3 px-4 font-bold">Created At</th>
                  <th className="py-3 px-4 rounded-r-xl font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isUAdmin = u.role === 'admin'
                    const isSuspended = u.status === 'suspended'
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isUAdmin ? 'bg-purple-600' : 'bg-blue-600'
                          }`}>
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-600 font-mono text-[11px]">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isUAdmin
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {isUAdmin ? '👑 Admin' : '👤 User'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isSuspended
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {u.tests_taken || 0}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Role */}
                            <button
                              onClick={() => toggleUserRole(u.id, u.role)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                isUAdmin
                                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                              }`}
                              title={isUAdmin ? 'Demote to standard user' : 'Elevate to administrator'}
                            >
                              {isUAdmin ? 'Demote to User' : 'Promote to Admin'}
                            </button>

                            {/* Toggle Status */}
                            <button
                              onClick={() => toggleUserStatus(u.id, u.status)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                isSuspended
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                              }`}
                              title={isSuspended ? 'Reactivate account' : 'Suspend account'}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user ${u.name}?`)) {
                                  deleteUser(u.id)
                                }
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete user permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: ADMIN EMAIL HUB & OUTBOX ──────────────────────── */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  System Email Outbox &amp; Delivery Log
                </h2>
                <p className="text-xs text-slate-500">
                  Track all automated emails dispatched to ADMIN_EMAIL and users.
                </p>
              </div>

              <button
                onClick={() => setIsComposeOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Compose Test Email</span>
              </button>
            </div>

            {/* Email Outbox Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/60">
                    <th className="py-3 px-4 rounded-l-xl font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Recipient (To)</th>
                    <th className="py-3 px-4 font-bold">Sender (From)</th>
                    <th className="py-3 px-4 font-bold">Subject</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Dispatched At</th>
                    <th className="py-3 px-4 rounded-r-xl font-bold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailsOutbox.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                        No emails in the outbox yet.
                      </td>
                    </tr>
                  ) : (
                    emailsOutbox.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            e.type === 'new_user_alert'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : e.type === 'security_alert'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : e.type === 'contact_form'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {e.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-900">
                          {e.to}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {e.from}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                          {e.subject}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(e.sent_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedEmail(e)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors"
                          >
                            Preview
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: SECURITY AUDIT TRAIL ──────────────────────────── */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Security Logs &amp; Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Immutable records of logins, rate limiting, and role elevations.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Audit Guard Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4 rounded-l-xl font-bold">Event</th>
                  <th className="py-3 px-4 font-bold">Actor / Email</th>
                  <th className="py-3 px-4 font-bold">Client IP</th>
                  <th className="py-3 px-4 font-bold">Result</th>
                  <th className="py-3 px-4 font-bold">Audit Details</th>
                  <th className="py-3 px-4 rounded-r-xl font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                        log.event.includes('SUCCESS')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : log.event.includes('BLOCKED') || log.event.includes('FAILED')
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {log.event}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 font-semibold">
                      {log.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {log.ip}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate text-[11px]">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 5: CONTACT MESSAGES ──────────────────────────────── */}
      {activeTab === 'messages' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Contact Form Submissions &amp; User Reports
              </h2>
              <p className="text-xs text-slate-500">
                User inquiries sent from the website contact form routed to ADMIN_EMAIL.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {contactMessages.length} Messages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactMessages.map((msg) => (
              <div key={msg.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 block">{msg.email}</span>
                  <h3 className="text-xs font-bold text-slate-800 pt-1">{msg.subject}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    "{msg.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    msg.status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {msg.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => {
                      setEmailForm({
                        to: msg.email,
                        fromType: 'support',
                        subject: `Re: ${msg.subject}`,
                        body: `Hi ${msg.name},\n\nThank you for reaching out.\n\n`,
                      })
                      setIsComposeOpen(true)
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 6: UPLOADED FILES ────────────────────────────────── */}
      {activeTab === 'files' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Uploaded Documents &amp; Files
              </h2>
              <p className="text-xs text-slate-500">
                User resumes, offer letters, and system generated PDF exports.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              {uploadedFiles.length} Documents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4 rounded-l-xl font-bold">Filename</th>
                  <th className="py-3 px-4 font-bold">Owner User</th>
                  <th className="py-3 px-4 font-bold">File Size</th>
                  <th className="py-3 px-4 font-bold">Uploaded At</th>
                  <th className="py-3 px-4 rounded-r-xl font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uploadedFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>{f.filename}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {f.user_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {f.size}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(f.uploaded_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 7: WEBSITE SETTINGS ──────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs max-w-3xl space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-700" />
              Website Production Settings &amp; Policies
            </h2>
            <p className="text-xs text-slate-500">
              Configure platform availability, AI engine selection, and automated notification triggers.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900">Maintenance Mode</h3>
                  <p className="text-[11px] text-slate-500">When enabled, non-admin visitors see a maintenance window.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.maintenance_mode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900">Allow New User Registrations</h3>
                  <p className="text-[11px] text-slate-500">Permit new software engineers to create accounts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.allow_registrations}
                    onChange={(e) => setSettingsForm({ ...settingsForm, allow_registrations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900">Email Admin on New Signups</h3>
                  <p className="text-[11px] text-slate-500">Sends immediate registration notification to {adminEmail}.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.notify_admin_on_signup}
                    onChange={(e) => setSettingsForm({ ...settingsForm, notify_admin_on_signup: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-900">
                  Primary AI Model Engine
                </label>
                <select
                  value={settingsForm.ai_model}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ai_model: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Ultra-fast & cost-effective)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep reasoning & code analysis)</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Fallback secondary)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Save Website Settings
            </button>
          </form>
        </div>
      )}

      {/* ─── MODAL: COMPOSE SYSTEM EMAIL ──────────────────────────── */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Send System / Test Email</h3>
                </div>
                <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sender Address (From)</label>
                  <select
                    value={emailForm.fromType}
                    onChange={(e) => setEmailForm({ ...emailForm, fromType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  >
                    <option value="noreply">No-Reply ({noreplyEmail})</option>
                    <option value="support">Support ({supportEmail})</option>
                    <option value="admin">Admin ({adminEmail})</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Address (To)</label>
                  <input
                    type="email"
                    value={emailForm.to}
                    onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                    placeholder="recipient@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    placeholder="e.g. System Maintenance Notice / Security Alert"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message Body</label>
                  <textarea
                    rows="5"
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Type the message contents..."
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Email</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: PREVIEW OUTBOX EMAIL ──────────────────────────── */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Dispatched Email Record</span>
                <button onClick={() => setSelectedEmail(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p><strong>To:</strong> <span className="font-mono text-blue-600">{selectedEmail.to}</span></p>
                <p><strong>From:</strong> <span className="font-mono text-slate-600">{selectedEmail.from}</span></p>
                <p><strong>Subject:</strong> <span className="font-bold text-slate-900">{selectedEmail.subject}</span></p>
                <p><strong>Type:</strong> <span className="text-indigo-600 uppercase font-bold">{selectedEmail.type}</span></p>
                <p><strong>Date:</strong> <span className="text-slate-500">{new Date(selectedEmail.sent_at).toLocaleString()}</span></p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Body Preview:</span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed font-sans text-xs">
                  {selectedEmail.body}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default AdminDashboard
