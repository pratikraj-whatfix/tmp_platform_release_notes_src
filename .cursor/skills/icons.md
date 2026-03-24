# Icon System

## Icon Library

**Package**: `@tabler/icons-react`

Tabler Icons provides a consistent, open-source icon set with adjustable stroke width.

### Installation

```bash
npm install @tabler/icons-react
```

### Basic Usage

```tsx
import { IconPlus, IconSettings, IconUser } from '@tabler/icons-react'

<IconPlus size={20} stroke={1.5} />
```

## Icon Sizes

### Size by Context

| Context | Size | Stroke | Example |
|---------|------|--------|---------|
| Button (sm) | 16px | 1.5 | Action buttons |
| Button (lg) | 20px | 1.5 | Standard buttons |
| Button (xl) | 24px | 1.5 | Large buttons |
| Navigation | 20px | 1.5 | Sidebar items |
| Inline text | 16px | 1.5 | Text with icon |
| Input icon | 16px | 1.5 | Search, clear |
| Empty state | 48px | 1 | Large illustration |
| Status indicator | 16px | 1.5 | Badges, alerts |

### Consistency Rule

Always use a fixed-size container matching the icon size to prevent layout shifts:

```tsx
<span className="flex-shrink-0 w-5 h-5">
  <IconSettings size={20} stroke={1.5} />
</span>
```

## Icon Colors

### Default Colors

| Context | Color Token | Hex |
|---------|-------------|-----|
| Default | secondary-500 | #7B7891 |
| Active/Selected | secondary-1000 | #1F1F32 |
| Disabled | secondary-400 | #8C899F |
| On dark background | white | #FFFFFF |

### Status Colors

| Status | Color Token | Hex |
|--------|-------------|-----|
| Success | success-400 | #21AD73 |
| Warning | warning-400 | #E0A400 |
| Critical | critical-400 | #B3141D |
| Info | info-400 | #0975D7 |

### Applying Colors

```tsx
// Using Tailwind classes
<IconCheck size={16} className="text-success-400" />

// Using inline style (when dynamic)
<IconAlert size={16} style={{ color: 'var(--color-warning-400)' }} />
```

## Common Icon Mappings

### Navigation

| Action | Icon |
|--------|------|
| Dashboard | `IconLayoutDashboard` |
| Analytics | `IconChartBar` |
| Content | `IconFileText` |
| Users | `IconUsers` |
| Settings | `IconSettings` |
| Help | `IconHelp` |

### Actions

| Action | Icon |
|--------|------|
| Add/Create | `IconPlus` |
| Edit | `IconPencil` |
| Delete | `IconTrash` |
| Copy | `IconCopy` |
| Download | `IconDownload` |
| Upload | `IconUpload` |
| Share | `IconShare` |
| Search | `IconSearch` |
| Filter | `IconFilter` |
| Sort | `IconArrowsSort` |
| Refresh | `IconRefresh` |
| Close | `IconX` |

### Status

| Status | Icon |
|--------|------|
| Success | `IconCheck` |
| Warning | `IconAlertTriangle` |
| Error | `IconAlertCircle` |
| Info | `IconInfoCircle` |
| Loading | `IconLoader2` (animated) |

### Navigation/Direction

| Direction | Icon |
|-----------|------|
| Back | `IconArrowLeft` |
| Forward | `IconArrowRight` |
| Up | `IconChevronUp` |
| Down | `IconChevronDown` |
| Expand | `IconChevronRight` |
| Collapse | `IconChevronLeft` |
| External link | `IconExternalLink` |

### Content

| Type | Icon |
|------|------|
| File | `IconFile` |
| Folder | `IconFolder` |
| Image | `IconPhoto` |
| Video | `IconVideo` |
| Link | `IconLink` |
| Calendar | `IconCalendar` |
| Clock | `IconClock` |

## Icon Button Pattern

### Icon-Only Buttons

Icon-only buttons **must use rounded (36px) radius**:

```tsx
<Button iconOnly intent="muted" size="lg">
  <IconSettings size={20} stroke={1.5} />
</Button>
```

### Icon with Text

```tsx
<Button iconLeft={<IconPlus size={20} stroke={1.5} />}>
  Create new
</Button>

<Button iconRight={<IconChevronDown size={20} stroke={1.5} />}>
  Options
</Button>
```

## Accessibility

### Labels

Icon-only buttons and links must have accessible labels:

```tsx
<Button iconOnly aria-label="Settings">
  <IconSettings size={20} />
</Button>

// Or with title tooltip
<Button iconOnly title="Settings">
  <IconSettings size={20} />
</Button>
```

### Decorative Icons

Icons that are purely decorative (next to text labels) should be hidden from screen readers:

```tsx
<span aria-hidden="true">
  <IconCheck size={16} />
</span>
<span>Completed</span>
```

## Animation

### Loading Spinner

```tsx
import { IconLoader2 } from '@tabler/icons-react'

<IconLoader2 size={20} className="animate-spin" />
```

### Transition on State Change

```tsx
<IconChevronDown 
  size={16} 
  className={cn(
    "transition-transform duration-150",
    isOpen && "rotate-180"
  )}
/>
```

## Custom Icons

If Tabler doesn't have an icon you need:

1. Check the full Tabler icon set: https://tabler.io/icons
2. Create a custom SVG component following the same pattern:

```tsx
interface CustomIconProps {
  size?: number
  stroke?: number
  className?: string
}

export function CustomIcon({ size = 24, stroke = 1.5, className }: CustomIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* SVG paths here */}
    </svg>
  )
}
```
