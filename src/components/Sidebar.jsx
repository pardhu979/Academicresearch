import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

// Icon Components (Outline style)
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-8h14l2 8M5 9v10a1 1 0 001 1h2a1 1 0 001-1V9m4 0v10a1 1 0 001 1h2a1 1 0 001-1V9" />
  </svg>
)

const ProjectsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const DocumentsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const MessagesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 2z" />
  </svg>
)

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

export default function Sidebar() {
  const { user } = useContext(AuthContext)
  const userRole = user?.role || 'researcher'

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Projects', path: '/projects', icon: ProjectsIcon },
    { label: 'Documents', path: '/documents', icon: DocumentsIcon },
    { label: 'Messages', path: '/messages', icon: MessagesIcon },
    ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
  ]

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gray-50 border-r border-gray-200 h-screen">
      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Title */}
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
          Navigation
        </h2>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IconComponent
                  className={`w-5 h-5 transition-colors ${({ isActive: _isActive } = {}) =>
                    _isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* show current role */}
      <div className="border-t border-gray-200 p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
        <p className="text-sm font-medium mt-1">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
      </div>
    </aside>
  )
}
