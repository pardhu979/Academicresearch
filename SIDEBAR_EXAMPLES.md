# Sidebar Component - Code Examples & Recipes

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Color Customizations](#color-customizations)
3. [Adding Menu Items](#adding-menu-items)
4. [Advanced Patterns](#advanced-patterns)
5. [Integration Examples](#integration-examples)
6. [CSS Variations](#css-variations)

---

## Basic Examples

### Example 1: Default Implementation
```jsx
import Sidebar from '@/components/Sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-white">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
```

### Example 2: With Top Navigation Bar
```jsx
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Page content */}
        </main>
      </div>
    </div>
  )
}
```

### Example 3: Mobile-Responsive with Toggle
```jsx
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex">
      {/* Mobile Sidebar with Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 md:relative md:z-auto ${sidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-4"
        >
          ☰
        </button>
        {/* Page content */}
      </main>
    </div>
  )
}
```

---

## Color Customizations

### Example 4: Green Theme
```jsx
// In Sidebar.jsx, replace the active state styling:
className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
    isActive
      ? 'bg-green-50 text-green-700'      // Changed to green
      : 'text-gray-700 hover:bg-gray-100'
  }`
}
```

### Example 5: Purple Theme
```jsx
// Full sidebar with purple theme
className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
    isActive
      ? 'bg-purple-50 text-purple-700'    // Purple
      : 'text-gray-700 hover:bg-gray-100'
  }`
}

// Also update radio button focus:
className="w-4 h-4 text-purple-600 bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 cursor-pointer"
```

### Example 6: Dark Mode Theme
```jsx
// Dark mode variant
export default function SidebarDark() {
  const [userRole, setUserRole] = useState('researcher')

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen">
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Navigation
        </h2>
        
        <nav className="space-y-1">
          {/* Nav items with dark mode colors */}
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 active:bg-gray-800 active:text-blue-400">
            {/* Item content */}
          </a>
        </nav>
      </div>
    </aside>
  )
}
```

---

## Adding Menu Items

### Example 7: Add Notifications Menu Item
```jsx
// In Sidebar.jsx
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Documents', path: '/documents', icon: DocumentsIcon },
  { label: 'Messages', path: '/messages', icon: MessagesIcon },
  // NEW: Notifications item
  { label: 'Notifications', path: '/notifications', icon: BellIcon },
  ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
]

// Add the BellIcon component:
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)
```

### Example 8: Add Settings Menu Item
```jsx
// Add Settings item
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Documents', path: '/documents', icon: DocumentsIcon },
  { label: 'Messages', path: '/messages', icon: MessagesIcon },
  // NEW: Settings item
  { label: 'Settings', path: '/settings', icon: CogIcon },
  ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
]

const CogIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
```

### Example 9: Conditional Menu Items Based on Permissions
```jsx
// More sophisticated conditional rendering
const [userRole, setUserRole] = useState('researcher')
const [permissions, setPermissions] = useState({
  canViewAnalytics: true,
  canManageUsers: false,
  canAccessSettings: true
})

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Documents', path: '/documents', icon: DocumentsIcon },
  { label: 'Messages', path: '/messages', icon: MessagesIcon },
  ...(permissions.canViewAnalytics ? [{ label: 'Analytics', path: '/analytics', icon: ChartIcon }] : []),
  ...(permissions.canAccessSettings ? [{ label: 'Settings', path: '/settings', icon: CogIcon }] : []),
  ...(userRole === 'admin' && permissions.canManageUsers ? [
    { label: 'Admin', path: '/admin', icon: ShieldIcon },
    { label: 'Users', path: '/users', icon: UsersIcon }
  ] : [])
]
```

---

## Advanced Patterns

### Example 10: Collapsible Sidebar
```jsx
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState('researcher')

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Projects', path: '/projects', icon: ProjectsIcon },
    { label: 'Documents', path: '/documents', icon: DocumentsIcon },
    { label: 'Messages', path: '/messages', icon: MessagesIcon },
    ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
  ]

  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-64'}
      hidden md:flex md:flex-col bg-gray-50 border-r border-gray-200 h-screen
      transition-all duration-300
    `}>
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-3 text-gray-500 hover:bg-gray-100 self-end"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        {!isCollapsed && <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">Navigation</h2>}
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Role Section */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Role</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="researcher"
                checked={userRole === 'researcher'}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-xs font-medium text-gray-700">Researcher</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={userRole === 'admin'}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-xs font-medium text-gray-700">Admin</span>
            </label>
          </div>
        </div>
      )}
    </aside>
  )
}
```

### Example 11: Sidebar with Badge Notifications
```jsx
// Update menu item structure to include badge count
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon, badge: null },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon, badge: null },
  { label: 'Documents', path: '/documents', icon: DocumentsIcon, badge: null },
  { label: 'Messages', path: '/messages', icon: MessagesIcon, badge: 3 },
  ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon, badge: 1 }] : [])
]

// Render with badge
{menuItems.map((item) => {
  const IconComponent = item.icon
  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <div className="flex items-center gap-3">
        <IconComponent className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.badge && (
        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
})}
```

### Example 12: Sidebar with User Profile Section
```jsx
// Add user profile at the bottom
<aside className="hidden md:flex md:flex-col w-64 bg-gray-50 border-r border-gray-200 h-screen">
  {/* Navigation */}
  <div className="flex-1 overflow-y-auto p-5">
    {/* Navigation menu items */}
  </div>

  {/* Role Section */}
  <div className="border-t border-gray-200 p-5">
    {/* Role radio buttons */}
  </div>

  {/* User Profile Section */}
  <div className="border-t border-gray-200 p-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        PS
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">Pardhu Swaroop</p>
        <p className="text-xs text-gray-500">Researcher</p>
      </div>
    </div>
  </div>
</aside>
```

---

## Integration Examples

### Example 13: With Context-Based Role Management
```jsx
// AuthContext.jsx
import { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState('researcher')

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// Sidebar.jsx
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

export default function Sidebar() {
  const { userRole, setUserRole } = useContext(AuthContext)
  
  // Use context values instead of local state
  const menuItems = [
    // ... menu items
    ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
  ]

  return (
    // ... sidebar JSX
  )
}
```

### Example 14: With Redux State Management
```jsx
// store.js
import { createSlice, configureStore } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { userRole: 'researcher' },
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload
    }
  }
})

export const { setUserRole } = authSlice.actions
export const store = configureStore({
  reducer: { auth: authSlice.reducer }
})

// Sidebar.jsx
import { useSelector, useDispatch } from 'react-redux'
import { setUserRole } from '@/store'

export default function Sidebar() {
  const dispatch = useDispatch()
  const userRole = useSelector(state => state.auth.userRole)

  const menuItems = [
    // ... base items
    ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
  ]

  return (
    // ... JSX with dispatch(setUserRole()) on radio change
  )
}
```

### Example 15: With API-Fetched Permissions
```jsx
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const [userRole, setUserRole] = useState('researcher')
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch permissions from API
    fetch('/api/user/permissions')
      .then(res => res.json())
      .then(data => {
        setUserRole(data.role)
        setPermissions(data.permissions)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="w-64 bg-gray-50">Loading...</div>

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon, requiredPermission: 'view_dashboard' },
    { label: 'Projects', path: '/projects', icon: ProjectsIcon, requiredPermission: 'view_projects' },
    { label: 'Documents', path: '/documents', icon: DocumentsIcon, requiredPermission: 'view_documents' },
    { label: 'Messages', path: '/messages', icon: MessagesIcon, requiredPermission: 'view_messages' },
    ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon, requiredPermission: 'admin_access' }] : [])
  ].filter(item => !item.requiredPermission || permissions.includes(item.requiredPermission))

  return (
    // ... sidebar JSX
  )
}
```

---

## CSS Variations

### Example 16: Compact Spacing Variant
```jsx
// Tighter spacing for dense UI
const menuItems = [...].map(item => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded text-sm transition-all ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {/* ... */}
  </NavLink>
))
```

### Example 17: Expanded Spacing Variant
```jsx
// Generous spacing for accessible UI
const menuItems = [...].map(item => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 rounded-lg text-base transition-all ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {/* ... */}
  </NavLink>
))
```

### Example 18: Square Icons Variant
```jsx
// Icons with square background instead of text-only
{menuItems.map((item) => {
  const IconComponent = item.icon
  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <div className={`w-8 h-8 rounded flex items-center justify-center ${
        isActive ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  )
})}
```

---

## Quick Copy-Paste Snippets

### Add New Icon to Export List
```jsx
const YourNewIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M..." />
  </svg>
)
```

### Menu Item Template
```jsx
{ label: 'Item Name', path: '/item-path', icon: ItemIcon }
```

### Conditional Menu Item Template
```jsx
...(condition ? [{ label: 'Item', path: '/path', icon: Icon }] : [])
```

### Active State Classes
```jsx
// Active
'bg-blue-50 text-blue-700'

// Inactive
'text-gray-700 hover:bg-gray-100'
```

---

**Last Updated:** February 26, 2026
