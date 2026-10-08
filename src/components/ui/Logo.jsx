import React from 'react'
import { Link } from 'react-router-dom'

export function Logo({
  collapsed = false,
  showTagline = true,
  className = '',
  to = '/app/dashboard'
}) {
  return (
    <Link to={to} className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Abstract Modern AI + Career SVG Icon */}
      <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
        >
          <defs>
            <linearGradient id="logoGradPrimary" x1="4" y1="40" x2="38" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="logoGradAccent" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="logoGlow" x="-4" y="-4" width="52" height="52" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left sweeping ascending stroke (Career growth) */}
          <path
            d="M8 36 C 8 36, 16 10, 22 6 C 24 3.5, 27 5, 26 9 C 24 16, 17 32, 14 36 Z"
            fill="url(#logoGradPrimary)"
          />

          {/* Right descending stroke creating the 'A' geometry */}
          <path
            d="M22 6 C 26 12, 34 26, 38 36 C 39 38, 35 39, 32 37 C 28 32, 23 21, 22 17 Z"
            fill="url(#logoGradPrimary)"
            opacity="0.9"
          />

          {/* Cross loop connecting as neural AI node */}
          <path
            d="M13 25 C 19 21, 29 21, 33 26 C 34 27.5, 32 29, 29 28 C 24 26.5, 18 26.5, 13 28 C 11.5 28.5, 11 26.5, 13 25 Z"
            fill="url(#logoGradAccent)"
          />

          {/* Floating AI Network Synapse Node */}
          <circle cx="22" cy="15" r="3.2" fill="#ffffff" />
          <circle cx="22" cy="15" r="2" fill="#2563eb" />
          <circle cx="33" cy="26" r="2.2" fill="#06b6d4" />
        </svg>
      </div>

      {/* Brand Text */}
      {!collapsed && (
        <div className="flex flex-col min-w-0 leading-[1.15]">
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">
            AI Career
          </span>
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">
            Companion
          </span>
        </div>
      )}
    </Link>
  )
}

export default Logo
