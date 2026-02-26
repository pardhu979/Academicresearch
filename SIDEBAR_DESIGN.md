# Sidebar Navigation Design Documentation

## Overview
A modern, accessible sidebar navigation component for a SaaS dashboard with role-based menu visibility and clean design patterns.

## Component Features

### 1. **Visual Design**
- **Background**: Light gray (`bg-gray-50`)
- **Border**: Subtle right border (`border-r border-gray-200`)
- **Layout**: Vertical, minimal sidebar
- **Width**: Fixed 256px (w-64)
- **Height**: Full screen height
- **Responsive**: Hidden on mobile, visible on `md:` breakpoint

### 2. **Navigation Section**

#### Title
- Text: "Navigation" (all caps)
- Font: Sans-serif, extra small (`text-xs`), bold, uppercase
- Letter spacing: `tracking-wider`
- Color: Gray-500 (`text-gray-500`)
- Margin: Bottom 24px

#### Menu Items Structure
```
Icon (20x20) + Label + Hover/Active States
```

**Menu Items:**
1. **Dashboard** (📊 Dashboard Icon)
   - Active by default
   - Route: `/dashboard`

2. **Projects** (📋 Projects Icon)
   - Route: `/projects`

3. **Documents** (📄 Documents Icon)
   - Route: `/documents`

4. **Messages** (💬 Messages Icon)
   - Route: `/messages`

5. **Admin** (🛡️ Shield Icon) - *Conditional*
   - Route: `/admin`
   - **Only visible when user role is "Admin"**

#### Menu Item Styling

| State | Background | Text Color | Icon Color |
|-------|-----------|-----------|-----------|
| Active | `bg-blue-50` | `text-blue-700` | `text-blue-600` |
| Hover | `bg-gray-100` | `text-gray-700` | `text-gray-700` |
| Default | `bg-transparent` | `text-gray-700` | `text-gray-500` |

**Spacing:**
- Padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Gap between icon and label: `gap-3` (12px)
- Space between items: `space-y-1` (4px)
- Rounded corners: `rounded-lg`

**Interactive Properties:**
- Transition: All properties in 200ms
- Font weight: Medium
- Font size: Small (`text-sm`)

### 3. **Role Section**

#### Title
- Text: "Role" (all caps)
- Same styling as Navigation title
- Margin bottom: 16px

#### Border
- Top border: `border-t border-gray-200`
- Padding: `p-5` (20px)

#### Radio Button Options

**Researcher** ✓ (Default selected)
- Value: `researcher`
- Matches the non-admin view

**Admin**
- Value: `admin`
- When selected, shows Admin menu item in Navigation

#### Radio Button Styling

| State | Ring Color | Border Color |
|-------|-----------|-----------|
| Checked | `ring-blue-500` | `border-gray-300` |
| Unchecked | `ring-2 focus:ring-blue-500` | `border-gray-300` |

**Label Styling:**
- Font size: Small (`text-sm`)
- Font weight: Medium
- Color: `text-gray-700`
- Hover: `group-hover:text-gray-900`
- Cursor: Pointer
- Gap between radio and label: `gap-3` (12px)
- Space between options: `space-y-3` (12px)

## Icons

### Icon Design System
All icons use **outline style** with:
- Stroke-based (not filled)
- `strokeWidth={1.5}` for subtle appearance
- Rounded line caps: `strokeLinecap="round"`
- Rounded joins: `strokeLinejoin="round"`
- Size: 20x20px (w-5 h-5)
- Color: Inherits from text color (adaptive)

### Icon Components
1. **DashboardIcon** - Grid/Layout icon
2. **ProjectsIcon** - Files/Layers icon
3. **DocumentsIcon** - Document icon
4. **MessagesIcon** - Chat bubble icon
5. **ShieldIcon** - Shield/Security icon

## Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│  NAVIGATION                         │
│  ├─ 📊 Dashboard        (Active)   │
│  ├─ 📋 Projects                     │
│  ├─ 📄 Documents                    │
│  └─ 💬 Messages                     │
│  [─ 🛡️ Admin  (if admin role) ]    │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ROLE                               │
│  ◉ Researcher                       │
│  ○ Admin                            │
│                                     │
└─────────────────────────────────────┘
```

## State Management

### Role State
- **Type**: `useState('researcher')`
- **Values**: 
  - `'researcher'`: Hides Admin menu item
  - `'admin'`: Shows Admin menu item

### Active Navigation
- Managed by React Router's `<NavLink>`
- `isActive` parameter for conditional styling
- URL-based state (e.g., current route `/dashboard`, `/admin`, etc.)

## Accessibility Features

✅ **WCAG 2.1 Compliance:**
- Proper semantic HTML (`<nav>`, `<label>`)
- Radio buttons with proper labels (associated via structure)
- Focus states with ring indicators (`focus:ring-2`)
- High contrast ratios:
  - Active blue text on light blue: 4.5:1
  - Default gray text on light gray bg: 4.5:1
- Visual feedback on hover and focus states
- Icon + text labels (not icon-only)
- Cursor pointers on interactive elements

## Design Patterns

### Active State
- **Soft highlight**: Light blue background (`bg-blue-50`)
- **Text color**: Rich blue (`text-blue-700`)
- **Icon color**: Deeper blue (`text-blue-600`)
- **Non-intrusive**: Smooth transition without harsh contrast

### Hover States
- **Background**: Light gray (`bg-gray-100`)
- **Text**: Slightly darker gray (`text-gray-900`)
- **Transition**: 200ms smooth animation
- **Group interaction**: Icon color changes with text

### Responsive Behavior
- **Hidden on mobile**: `hidden md:flex`
- **Full height**: `h-screen`
- **Scrollable content**: Inner nav can scroll (`overflow-y-auto`) while footer stays fixed
- **Fixed footer**: Role section at bottom with border separator

## Color Palette

| Use Case | Color | Tailwind |
|----------|-------|----------|
| Background | Light Gray | `bg-gray-50` |
| Default Text | Gray | `text-gray-700` |
| Secondary Text | Medium Gray | `text-gray-500` |
| Borders | Light Gray | `border-gray-200` |
| Hover Background | Lighter Gray | `bg-gray-100` |
| Active Background | Soft Blue | `bg-blue-50` |
| Active Text | Rich Blue | `text-blue-700` |
| Icon Active | Blue | `text-blue-600` |
| Focus Ring | Bright Blue | `focus:ring-blue-500` |

## Spacing System

| Element | Padding | Notes |
|---------|---------|-------|
| Sidebar outer | 20px (p-5) | Top and both sections |
| Menu item | 16px H, 12px V | Icon + label zone |
| Gap (icon-label) | 12px | `gap-3` |
| Item spacing | 4px | `space-y-1` |
| Role label margin | 16px bottom | `mb-4` |
| Role item spacing | 12px | `space-y-3` |

## Typography

| Element | Font Size | Font Weight | Letter Spacing |
|---------|-----------|-------------|-----------------|
| Section Title | `text-xs` | Bold (600) | Wide (`tracking-wider`) |
| Menu Label | `text-sm` | Medium (500) | - |
| Radio Label | `text-sm` | Medium (500) | - |

## Component Usage

### Basic Implementation
```jsx
import Sidebar from '@/components/Sidebar'

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {/* Page content */}
      </main>
    </div>
  )
}
```

### Role-Based Features
The component manages its own state:
- Toggle role with radio buttons
- Admin menu item conditionally renders
- All styling adjusts automatically

## Design Decisions

1. **Light Gray Background**: Subtle, professional without being stark white
2. **Outline Icons**: Modern, clean, line-based rather than filled
3. **Soft Blue Active**: Non-aggressive highlight, easy on the eyes
4. **Vertical Spacing**: 4px between items keeps menu compact but readable
5. **Fixed Width**: Consistent 256px for predictable layout
6. **Scrollable Navigation**: Allows many menu items without overflow
7. **Fixed Role Section**: Always visible, important for role visibility
8. **Role selector in sidebar**: Quick access to role switching for testing/multi-role users

## Browser Support

- Modern browsers with CSS Grid/Flexbox support
- Tailwind CSS v3+
- React 16.8+ (hooks)
- React Router v7+

## Future Enhancements

- Collapsible sidebar toggle
- Sub-menu support (nested items)
- Icons customization via props
- Animation preferences (prefers-reduced-motion)
- Dark mode variant
- Keyboard shortcuts display
- User profile section
- Notifications badge on menu items
