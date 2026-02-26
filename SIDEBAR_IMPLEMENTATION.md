# Sidebar Component - Implementation Guide

## Quick Start

### Import the Component
```jsx
import Sidebar from '@/components/Sidebar'
```

### Basic Usage
```jsx
export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {/* Your page content */}
      </main>
    </div>
  )
}
```

## Component Architecture

### File Structure
```
src/components/
├── Sidebar.jsx          ← Main component
├── Sidebar.js           ← Legacy version (optional)
└── ... other components
```

### Component Exports
```jsx
export default function Sidebar() {
  const [userRole, setUserRole] = useState('researcher')
  // ... component code
}
```

## State Management

### Role State Hook
```jsx
const [userRole, setUserRole] = useState('researcher') // 'researcher' or 'admin'
```

**State Values:**
- `'researcher'`: Default state, Admin menu item hidden
- `'admin'`: Admin menu item visible

### State Updates
Automatically updated when user selects radio button:
```jsx
onChange={(e) => setUserRole(e.target.value)}
```

## Dynamic Menu Items

### Menu Item Configuration
```jsx
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Documents', path: '/documents', icon: DocumentsIcon },
  { label: 'Messages', path: '/messages', icon: MessagesIcon },
  ...(userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : [])
]
```

### Conditional Rendering Logic
- **Researcher View**: Arrays first 4 items
- **Admin View**: Adds 5th item (Admin) using spread operator
- **No page reload**: Smooth component re-render

## Icon System

### Available Icons
1. **DashboardIcon** - Dashboard/grid icon
2. **ProjectsIcon** - Projects/files icon
3. **DocumentsIcon** - Documents icon
4. **MessagesIcon** - Chat/messages icon
5. **ShieldIcon** - Security/admin icon

### Icon Component Structure
```jsx
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* SVG path */}
  </svg>
)
```

### Icon Properties
- **Default Size**: `w-5 h-5` (20px × 20px)
- **Stroke Width**: `strokeWidth={1.5}` (outline style)
- **Color**: Inherits from parent text color
- **Line Caps**: Rounded (`strokeLinecap="round"`)
- **Line Joins**: Rounded (`strokeLinejoin="round"`)

### Using Icons
```jsx
const IconComponent = item.icon
return <IconComponent className="w-5 h-5" />
```

## Styling Details

### Tailwind Classes Breakdown

#### Container
```jsx
<aside className="hidden md:flex md:flex-col w-64 bg-gray-50 border-r border-gray-200 h-screen">
```
- `hidden md:flex`: Hidden on mobile, flex on medium screen+
- `md:flex-col`: Column layout
- `w-64`: 256px width
- `bg-gray-50`: Light gray background
- `border-r border-gray-200`: Right border
- `h-screen`: Full viewport height

#### Navigation Section
```jsx
<nav className="space-y-1">
```
- `space-y-1`: 4px gap between items

#### Menu Item
```jsx
className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
  isActive
    ? 'bg-blue-50 text-blue-700'
    : 'text-gray-700 hover:bg-gray-100'
}`}
```

**Active State:**
- `bg-blue-50`: Light blue background
- `text-blue-700`: Rich blue text

**Inactive State:**
- `text-gray-700`: Default gray text
- `hover:bg-gray-100`: Light gray on hover

**Transitions:**
- `transition-all`: All properties
- `duration-200`: 200ms timing

#### Role Section
```jsx
<div className="border-t border-gray-200 p-5">
```
- `border-t`: Top border only
- `border-gray-200`: Light gray border
- `p-5`: 20px padding

## Customization Guide

### Changing Colors

#### Active State Color
Find this section:
```jsx
? 'bg-blue-50 text-blue-700'  // Change blue colors
```

**Available color options (Tailwind):**
- Blue: `bg-blue-50`, `text-blue-700`, `text-blue-600`
- Green: `bg-green-50`, `text-green-700`, `text-green-600`
- Purple: `bg-purple-50`, `text-purple-700`, `text-purple-600`
- Indigo: `bg-indigo-50`, `text-indigo-700`, `text-indigo-600`

#### Example: Green Theme
```jsx
isActive
  ? 'bg-green-50 text-green-700'
  : 'text-gray-700 hover:bg-gray-100'
```

### Changing Background
```jsx
<aside className="... bg-gray-50 ... ">  // Change this
```

**Options:**
- `bg-white`: Pure white
- `bg-gray-50`: Light gray (current)
- `bg-slate-50`: Slate variant
- `bg-stone-50`: Stone variant

### Changing Sidebar Width
```jsx
<aside className="... w-64 ... ">  // 256px
```

**Options:**
- `w-56`: 224px
- `w-64`: 256px (current)
- `w-72`: 288px
- `w-80`: 320px

### Changing Responsive Breakpoint
```jsx
<aside className="hidden md:flex">  // Change md
```

**Options:**
- `hidden sm:flex`: Hidden on mobile, visible on small+
- `hidden md:flex`: Hidden on mobile/tablet, visible on desktop+
- `hidden lg:flex`: Hidden on mobile/tablet/small desktop, visible on large+

### Adding More Menu Items

#### Before the Admin Item
```jsx
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'NEW ITEM', path: '/new', icon: NewIcon },  // Add here
  { label: 'Documents', path: '/documents', icon: DocumentsIcon },
  // ... rest
]
```

#### Create New Icon
```jsx
const NewIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
  </svg>
)
```

### Adding More Role Options

1. **Update State**: Change from boolean to multiple options
```jsx
const [userRole, setUserRole] = useState('researcher')
// Add new role option to conditional rendering
```

2. **Add Radio Button**:
```jsx
<label className="flex items-center gap-3 cursor-pointer group">
  <input
    type="radio"
    name="role"
    value="moderator"  // New role
    checked={userRole === 'moderator'}
    onChange={(e) => setUserRole(e.target.value)}
    className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
  />
  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
    Moderator
  </span>
</label>
```

3. **Show Menu Items Based on Role**:
```jsx
const menuItems = [
  // ... base items
  ...(userRole === 'admin' ? [adminItem] : []),
  ...(userRole === 'moderator' ? [moderatorItem] : []),
]
```

## Accessibility Considerations

### WCAG 2.1 Features Implemented ✓

1. **Semantic HTML**
   - `<nav>` for navigation
   - `<label>` for form controls
   - Proper link elements

2. **Focus Management**
   ```jsx
   focus:ring-2 focus:ring-blue-500  // Visible focus indicator
   ```

3. **Color Contrast**
   - Active blue on light blue: 4.5:1+ ratio
   - Gray text on light gray: 4.5:1+ ratio
   - Meets AA standards

4. **Interactive States**
   - Hover states for mouse users
   - Focus states for keyboard users
   - Active states for current page

5. **Icon + Text**
   - Never icon-only
   - Always has accompanying text label
   - Reduces cognitive load

### Testing Accessibility

```bash
# Install axe DevTools browser extension
# Run accessibility audit in browser DevTools

# Or use terminal testing
npm install --save-dev axe-core
```

## Routing Integration

### React Router Setup
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <div className="flex">
    <Sidebar />
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </div>
</BrowserRouter>
```

### NavLink Active Detection
```jsx
<NavLink
  to={item.path}
  className={({ isActive }) =>
    isActive
      ? 'bg-blue-50 text-blue-700'    // Active styling
      : 'text-gray-700 hover:bg-gray-100'  // Inactive styling
  }
>
```

## Performance Optimization

### Memoization (Optional)
```jsx
import { memo } from 'react'

const SidebarMenuItem = memo(({ item, isActive }) => {
  // Component code
})

export default memo(Sidebar)
```

### Icon Optimization
- Icons are inline SVGs (no extra requests)
- Stroke-based (smaller than filled)
- Responsive size via className

### Conditional Rendering Optimization
```jsx
// Efficient: Only Admin item is added/removed when role changes
...(userRole === 'admin' ? [adminItem] : [])

// Not optimal: Would re-render all items
{menuItems.filter(item => item.showForRole(userRole))}
```

## Browser Support

| Browser | Support | Version |
|---------|---------|---------|
| Chrome | ✓ | Latest |
| Firefox | ✓ | Latest |
| Safari | ✓ | Latest |
| Edge | ✓ | Latest |
| Mobile Safari | ✓ | iOS 14+ |
| Chrome Mobile | ✓ | Latest |

## Troubleshooting

### Issue: Sidebar not showing

**Check:**
1. Component imported correctly
2. React Router setup
3. Tailwind CSS loaded
4. Breakpoint: `hidden md:flex` (hidden on mobile)

### Issue: Active state not updating

**Check:**
1. NavLink paths match Route paths
2. React Router properly wrapped
3. Browser DevTools - check current route
4. Clear browser cache

### Issue: Icons not rendering

**Check:**
1. SVG syntax is correct
2. viewBox="0 0 24 24" present
3. fill="none" stroke="currentColor"
4. Path data is valid

### Issue: Styles not applying

**Check:**
1. Tailwind CSS installed
2. tailwind.config.cjs configured
3. CSS file importing Tailwind directives
4. Build process running
5. No conflicting CSS

## Testing

### Unit Testing Example (Jest + React Testing Library)
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from './Sidebar'

// Mock React Router
jest.mock('react-router-dom', () => ({
  NavLink: ({ to, children, className }) => (
    <a href={to} className={className}>{children}</a>
  ),
}))

describe('Sidebar', () => {
  test('renders navigation items', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  test('does not show Admin item in researcher view', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  test('shows Admin item when role changed to admin', async () => {
    render(<Sidebar />)
    const adminRadio = screen.getByRole('radio', { name: 'Admin' })
    await userEvent.click(adminRadio)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
```

## Version History

### v1.0.0 (Current)
- ✅ Basic sidebar navigation
- ✅ Role-based menu visibility
- ✅ Outline-style icons
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Smooth transitions

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [React Hooks Documentation](https://react.dev/reference/react)
- [SVG Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support & Feedback

For issues or suggestions:
1. Check Troubleshooting section
2. Review design documentation
3. Test in browser DevTools
4. Check React/Tailwind versions

---

**Last Updated:** February 26, 2026
**Component Version:** 1.0.0
**React Version:** 19.2.0+
**Tailwind CSS:** 3.4.0+
