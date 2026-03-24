# Architecture

## Project Structure

```
src/
├── assets/
│   └── global/                 # Shared assets (logos, images)
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── Button/             # Buttons with variants
│   │   ├── Modal/              # Dialog overlays
│   │   ├── Input/              # Form inputs
│   │   ├── Card/               # Content containers
│   │   └── Badge/              # Status indicators
│   ├── layout/                 # Layout components
│   │   ├── Sidebar/            # Left navigation
│   │   ├── Header/             # Top header bar
│   │   ├── PageLayout/         # Main layout wrapper
│   │   └── ContentPanel/       # Content sections
│   └── charts/                 # ECharts wrappers
│       ├── BaseChart.tsx       # Core chart wrapper
│       ├── LineChart.tsx       # Line/area charts
│       ├── BarChart.tsx        # Bar charts
│       └── PieChart.tsx        # Pie/donut charts
├── views/                      # Composed screens/pages
│   ├── DashboardView.tsx       # Main dashboard
│   └── SettingsView.tsx        # Settings page
├── styles/
│   ├── tokens/
│   │   ├── colors.css          # Color primitives
│   │   ├── typography.css      # Font styles
│   │   └── spacing.css         # Spacing, shadows, radii
│   └── globals.css             # Global styles
├── lib/
│   ├── echarts-theme.ts        # Chart theming
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript definitions
├── App.tsx                     # Root component
└── main.tsx                    # Entry point
```

## Component Architecture

### UI Components (`/components/ui/`)

Atomic design pattern - small, reusable components.

Each component folder contains:
- `ComponentName.tsx` - Main component
- `ComponentName.styles.ts` - Style variants (if complex)
- `index.ts` - Barrel export

### Layout Components (`/components/layout/`)

Structural components that define page layouts.

**Hierarchy:**
```
PageLayout
├── Sidebar (left navigation)
│   └── SidebarItem (nav items)
├── Header (top bar)
│   └── actions slot
└── main content area
    └── ContentPanel (content sections)
```

### Views (`/views/`)

Page-level components that compose UI and layout components.

Views should:
- Import layout components for structure
- Import UI components for interactions
- Manage page-level state
- Handle data fetching logic

## Design Token Architecture

### Token Hierarchy

1. **Primitives** (colors.css)
   - Raw color values
   - Named by color family: `--color-primary-400`

2. **Semantic** (via Tailwind)
   - Purpose-based colors
   - Applied through utility classes

3. **Component** (in component styles)
   - Component-specific tokens
   - Derived from semantic tokens

### Style Layering

```css
/* 1. CSS Variables (tokens) */
:root { --color-primary-400: #C74900; }

/* 2. Tailwind Config (extends Tailwind) */
colors: { primary: { 400: '#C74900' } }

/* 3. Component Styles (uses Tailwind) */
className="bg-primary-400 text-white"
```

## Data Flow

### State Management

- Local state: React `useState`
- Form state: Controlled components
- Shared state: React Context (when needed)

### Props Pattern

Components use typed props interfaces:

```typescript
interface ComponentProps {
  // Required props first
  title: string
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary'
  
  // Event handlers
  onClick?: () => void
  
  // Standard props last
  className?: string
  children?: React.ReactNode
}
```

## File Conventions

### Naming

- **Components**: PascalCase (`Button.tsx`)
- **Utilities**: camelCase (`utils.ts`)
- **Styles**: kebab-case (`global-styles.css`)
- **Types**: PascalCase for types (`ButtonProps`)

### Exports

Use barrel exports (`index.ts`) for clean imports:

```typescript
// Instead of
import { Button } from '@/components/ui/Button/Button'

// Use
import { Button } from '@/components/ui'
```
