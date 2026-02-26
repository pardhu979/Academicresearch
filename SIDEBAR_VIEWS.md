# Sidebar Navigation - View Variations

## 1. RESEARCHER VIEW (Default)

### Visual Layout
```
┌──────────────────────────────────┐
│                                  │
│  NAVIGATION                      │
│                                  │
│  📊 Dashboard          ← Active  │     (bg-blue-50, text-blue-700)
│  📋 Projects                     │     (text-gray-700, hover: bg-gray-100)
│  📄 Documents                    │     (text-gray-700, hover: bg-gray-100)
│  💬 Messages                     │     (text-gray-700, hover: bg-gray-100)
│                                  │
│  ─────────────────────────────── │
│                                  │
│  ROLE                            │
│  ◉ Researcher   (selected)       │     (radio: checked)
│  ○ Admin                         │     (radio: unchecked)
│                                  │
└──────────────────────────────────┘
```

### Features
- **Menu Items**: 4 main navigation items
- **Active Item**: Dashboard (soft blue highlight)
- **Admin Item**: NOT visible
- **Role Selection**: Researcher checked (◉)
- **Color Scheme**: 
  - Background: Light gray (bg-gray-50)
  - Active highlight: Soft blue (bg-blue-50)
  - Text: Neutral gray (text-gray-700)

### Styling Details

#### Dashboard (Active Item)
```
Background:  bg-blue-50
Text Color:  text-blue-700
Icon Color:  text-blue-600
Icon:        📊 Outline dashboard icon
Padding:     px-4 py-3 (16px, 12px)
Border:      rounded-lg (8px corners)
Font:        text-sm, font-medium
Gap:         gap-3 between icon and label
```

#### Projects, Documents, Messages (Inactive Items)
```
Background:  bg-transparent (default)
Text Color:  text-gray-700
Icon Color:  text-gray-500
Hover BG:    bg-gray-100
Hover Icon:  text-gray-700
Padding:     px-4 py-3
Border:      rounded-lg
Font:        text-sm, font-medium
Transition:  200ms all ease
```

#### Role Section
```
Border:      border-t border-gray-200 (subtle separator)
Padding:     p-5 (20px)
Title:       "ROLE" (text-xs, uppercase, tracking-wider)
Labels:      text-sm, font-medium, text-gray-700
Input:       Standard radio button (w-4 h-4)
Focus:       ring-2 ring-blue-500
```

---

## 2. ADMIN VIEW

### Visual Layout
```
┌──────────────────────────────────┐
│                                  │
│  NAVIGATION                      │
│                                  │
│  📊 Dashboard          ← Active  │     (bg-blue-50, text-blue-700)
│  📋 Projects                     │     (text-gray-700, hover: bg-gray-100)
│  📄 Documents                    │     (text-gray-700, hover: bg-gray-100)
│  💬 Messages                     │     (text-gray-700, hover: bg-gray-100)
│  🛡️ Admin                         │     ← NEW ITEM (conditional)
│                                  │
│  ─────────────────────────────── │
│                                  │
│  ROLE                            │
│  ○ Researcher                    │     (radio: unchecked)
│  ◉ Admin                (selected)│     (radio: checked)
│                                  │
└──────────────────────────────────┘
```

### Features
- **Menu Items**: 5 navigation items (Admin added)
- **New Item**: Admin with shield icon (🛡️)
- **Active Item**: Dashboard (still highlighted)
- **Role Selection**: Admin checked (◉)
- **Color Scheme**: Same as Researcher view, but Admin option checked

### New Admin Menu Item Details

#### Admin Item (Conditional Rendering)
```
Icon:        🛡️ Shield icon (outline style)
Label:       "Admin"
Route:       /admin
Color:       text-gray-700 (inactive)
Hover:       bg-gray-100, text-gray-900
Active:      bg-blue-50, text-blue-700, icon: text-blue-600
```

#### Conditional Logic
```jsx
{userRole === 'admin' ? [{ label: 'Admin', path: '/admin', icon: ShieldIcon }] : []}
```

---

## 3. STATE TRANSITIONS

### From Researcher to Admin View

**Action**: User selects "Admin" radio button

**Changes**:
1. `userRole` state changes from `'researcher'` to `'admin'`
2. Menu items array adds Admin item
3. Admin menu item renders with all styling
4. Role radio button "Admin" becomes checked (◉)
5. Role radio button "Researcher" becomes unchecked (○)

**Animation**: 
- Admin item fades in smoothly
- No page reload required
- Instant feedback

### From Admin to Researcher View

**Action**: User selects "Researcher" radio button

**Changes**:
1. `userRole` state changes from `'admin'` to `'researcher'`
2. Menu items array removes Admin item
3. Admin menu item hides (conditional rendering)
4. Role radio button "Researcher" becomes checked (◉)
5. Role radio button "Admin" becomes unchecked (○)

---

## 4. INTERACTIVE STATES COMPARISON

### Hover Interaction

#### Researcher View (Inactive Item Hover)
```
Before Hover:
  Background: bg-transparent
  Text:       text-gray-700
  Icon:       text-gray-500

After Hover:
  Background: bg-gray-100
  Text:       text-gray-700 (unchanged)
  Icon:       text-gray-700 (darkened)
  Transition: 200ms smooth
  Cursor:     pointer
```

#### Admin View (Admin Item Hover - First Time)
```
Before Hover:
  Background: bg-transparent
  Text:       text-gray-700
  Icon:       text-gray-500 (Shield outline)

After Hover:
  Background: bg-gray-100
  Text:       text-gray-700
  Icon:       text-gray-700
  Transition: 200ms smooth
  Cursor:     pointer
```

### Active/Focus States

#### Menu Item (Click & Active)
```
Active State:
  Background: bg-blue-50 (85% opacity blue)
  Text:       text-blue-700
  Icon:       text-blue-600
  Border:     rounded-lg (subtle rounding)
  Shadow:     None (flat design)
  Duration:   Immediate
```

#### Radio Button Focus
```
Focused State:
  Ring:       ring-2 ring-blue-500
  Size:       4px width
  Color:      Bright blue
  Keyboard:   Tab navigable
```

---

## 5. COLOR & SPACING REFERENCE

### Icon Sizes
- **All Icons**: 20px × 20px (w-5 h-5)
- **Stroke Width**: 1.5px (outline, not bold)
- **Colors**: Inherit from parent text color (adaptive)

### Spacing in Menu Item
```
┌─────────────────────────────────┐
│ [16px] [Icon] [12px gap] Label  │ ← 12px padding vertical
└─────────────────────────────────┘
  16px    20px      12px    ~60px    (approx widths)

Total height per item: ~44px (py-3 = 12px × 2 + ~20px font)
Gap between items: 4px (space-y-1)
```

### Sidebar Container
```
Width:          256px (w-64)
Height:         100vh (full screen)
Responsive:     hidden on mobile, md:flex and above
Flex Direction: column
Overflow:       flex-1 on nav (scrollable), role section fixed
```

---

## 6. EXAMPLE USER FLOWS

### Flow 1: View as Researcher (Default)
1. Page loads
2. Sidebar renders with Researcher role active
3. Dashboard menu item active (highlighted blue)
4. Admin menu item hidden
5. User sees 4 main menu items + role selector

### Flow 2: Switch to Admin
1. User clicks "Admin" radio button
2. State updates instantly
3. Admin menu item appears between Messages and Role section
4. Styling applied (same as other items)
5. User can now navigate to Admin page

### Flow 3: Navigate While Admin
1. User in Admin role
2. Clicks "Admin" menu item
3. Navigates to /admin route
4. Dashboard menu item styling reverts (no highlight)
5. Admin menu item styling becomes active (blue highlight)

---

## 7. IMPLEMENTATION CHECKLIST

- ✅ Light gray background (bg-gray-50)
- ✅ Vertical layout (flex-col)
- ✅ Navigation title section
- ✅ Icon + Label menu items (5 items, 4 always visible)
- ✅ Active state highlighting (soft blue)
- ✅ Hover states (light gray background)
- ✅ Role section with radio buttons
- ✅ Conditional Admin menu item
- ✅ Outline-style icons (all items)
- ✅ Rounded corners (rounded-lg)
- ✅ Proper padding (16-20px)
- ✅ Sans-serif font (Tailwind default)
- ✅ Accessibility features (labels, focus states, contrast)
- ✅ Smooth transitions (200ms)
- ✅ Flat design (minimal shadows)
- ✅ Responsive (hidden on mobile)
- ✅ Scrollable navigation section
- ✅ Fixed role section at bottom

---

## 8. TEST SCENARIOS

### Scenario 1: Researcher View
- [ ] Dashboard shows blue highlight
- [ ] All 4 menu items visible
- [ ] Admin menu item hidden
- [ ] Researcher radio button checked
- [ ] Admin radio button unchecked
- [ ] Hover states work on Projects, Documents, Messages
- [ ] Clicking menu items navigates correctly

### Scenario 2: Switch to Admin
- [ ] Admin radio button becomes checked
- [ ] Researcher radio button becomes unchecked
- [ ] Admin menu item appears instantly
- [ ] All 5 menu items visible
- [ ] Styling matches other items

### Scenario 3: Admin View
- [ ] All 5 menu items visible
- [ ] Dashboard still highlighted (if Dashboard route active)
- [ ] Hover states work on all items including Admin
- [ ] Clicking Admin navigates to /admin
- [ ] Admin item highlights when /admin route active

### Scenario 4: Accessibility
- [ ] Keyboard navigation (Tab through items)
- [ ] Focus states visible on radio buttons
- [ ] Focus states visible on menu items
- [ ] Color contrast meets WCAG standards
- [ ] Screen readers announce menu structure
- [ ] Labels associated with radio buttons

---

## 9. CSS QUICK REFERENCE

### Tailwind Classes Used
```
Layout:
  hidden, md:flex, md:flex-col, w-64, bg-gray-50, 
  border-r, border-gray-200, h-screen

Spacing:
  p-5, px-4, py-3, gap-3, space-y-1, space-y-3, mb-4, mb-6

Typography:
  text-xs, text-sm, font-semibold, font-medium, 
  uppercase, tracking-wider

Colors (Light States):
  text-gray-700, text-gray-500, bg-gray-100

Colors (Active States):
  bg-blue-50, text-blue-700, text-blue-600

Borders & Radius:
  rounded-lg, border-t

Interactive:
  hover:bg-gray-100, hover:text-gray-900, 
  transition-all, duration-200, cursor-pointer

Form Elements:
  w-4, h-4, bg-white, border-gray-300, 
  text-blue-600, ring-2, focus:ring-blue-500
```

---

## 10. VISUAL COMPARISON TABLE

| Aspect | Researcher View | Admin View |
|--------|-----------------|-----------|
| Menu Items Count | 4 | 5 |
| Dashboard Visible | ✅ | ✅ |
| Projects Visible | ✅ | ✅ |
| Documents Visible | ✅ | ✅ |
| Messages Visible | ✅ | ✅ |
| Admin Visible | ❌ Hidden | ✅ Visible |
| Researcher Selected | ✅ Checked | ❌ Unchecked |
| Admin Selected | ❌ Unchecked | ✅ Checked |
| Active Item | Dashboard | Dashboard (or Admin if navigated) |
| Background Color | bg-gray-50 | bg-gray-50 |
| Overall Height | Short | Slightly Taller |
