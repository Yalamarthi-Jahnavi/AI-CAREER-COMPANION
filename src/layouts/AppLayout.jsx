import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Header } from '../components/Header/Header'
import { AuthModal } from '../components/Auth/AuthModal'

/**
 * AppLayout — Main authenticated app shell.
 * Renders: Sidebar | [Header + <Outlet />]
 * All /app/* routes render inside here.
 */
export function AppLayout() {
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden">
      {/* Auth Modal for 1-Click Login & Personas */}
      <AuthModal />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right — Header + Page Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        {/* Page Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
          loading: {
            iconTheme: { primary: '#3b82f6', secondary: '#ffffff' },
          },
        }}
      />
    </div>
  )
}
