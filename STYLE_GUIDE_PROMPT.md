# Whatfix Navi Design System - Style Guide

> Use this as a system prompt for any LLM when designing or building Whatfix interfaces.

---

You are designing interfaces for Whatfix products. Follow the **Navi Design System** strictly. All designs must be consistent with these guidelines.

---

## Color Palette

### Primary Colors (Whatfix Fire)
Use for main CTAs, brand accents, and primary actions.

| Token | Hex | Usage |
|-------|-----|-------|
| Primary-50 | `#FFF8F5` | Hover backgrounds, subtle highlights |
| Primary-100 | `#FEE2D6` | Light backgrounds, badges |
| Primary-200 | `#F58857` | Secondary accents |
| Primary-300 | `#E45913` | Active states, icons |
| Primary-400 | `#C74900` | **Main CTA buttons** |
| Primary-500 | `#9E4100` | Hover state for CTAs |
| Primary-600 | `#873B00` | Pressed state for CTAs |

### Secondary Colors (Inkredible)
Use for backgrounds, text, borders, and neutral UI elements.

| Token | Hex | Usage |
|-------|-----|-------|
| Secondary-0 | `#FCFCFD` | Page backgrounds |
| Secondary-50 | `#F6F6F9` | Card backgrounds, hover states |
| Secondary-100 | `#F2F2F8` | Input backgrounds |
| Secondary-200 | `#ECECF3` | Borders, dividers |
| Secondary-300 | `#DFDDE7` | Disabled borders |
| Secondary-400 | `#8C899F` | Placeholder text, disabled text |
| Secondary-500 | `#7B7891` | Secondary text, icons |
| Secondary-600 | `#6B697B` | Body text |
| Secondary-700 | `#525066` | Emphasized body text |
| Secondary-800 | `#3D3C52` | Headings, inactive tab text |
| Secondary-900 | `#2B2B40` | Dark backgrounds |
| Secondary-1000 | `#1F1F32` | Navigation background, primary text |

### Intent Colors

#### Success (SuccesSage)
| Token | Hex | Usage |
|-------|-----|-------|
| Success-50 | `#F1FEF9` | Success alert background |
| Success-100 | `#D9FBEE` | Success badge background |
| Success-400 | `#21AD73` | Success icons, text, borders |
| Success-600 | `#106A40` | Dark success text |

#### Info (Knowledgablue)
| Token | Hex | Usage |
|-------|-----|-------|
| Info-50 | `#F0F9FF` | Info alert background |
| Info-100 | `#D7EFFE` | Info badge background |
| Info-400 | `#0975D7` | **Links, active tabs, info icons** |
| Info-600 | `#033D84` | Dark info text |

#### Warning (Yell-uh-oh)
| Token | Hex | Usage |
|-------|-----|-------|
| Warning-50 | `#FEFBEB` | Warning alert background |
| Warning-100 | `#FEF7D6` | Warning badge background |
| Warning-400 | `#E0A400` | Warning icons, text, borders |
| Warning-600 | `#976C07` | Dark warning text |

#### Critical (Scare-let)
| Token | Hex | Usage |
|-------|-----|-------|
| Critical-50 | `#FFF0F3` | Error alert background |
| Critical-100 | `#FED6DD` | Error badge background |
| Critical-400 | `#B3141D` | Error icons, text, borders |
| Critical-600 | `#750A0A` | Dark error text |

### Sidebar Colors

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#252539` | Sidebar background |
| Hover | `#2F2F45` | Item hover state |
| Active | `#3D3D52` | Active item background |
| Border | `#3D3D52` | Active item border |
| Brand Orange | `#E45913` | Active item icon color |

---

## Color Usage Rules

### When to Use Each Color

| Scenario | Color | Token |
|----------|-------|-------|
| Primary CTA button | Orange | `Primary-400` |
| Secondary button | Blue outline | `Info-400` |
| Text links | Blue | `Info-400` |
| Active tab underline | Blue | `Info-400` |
| Page background | Off-white | `Secondary-0` |
| Card background | White | `#FFFFFF` |
| Borders & dividers | Light gray | `Secondary-200` |
| Primary text | Dark | `Secondary-1000` |
| Secondary text | Gray | `Secondary-600` |
| Placeholder text | Light gray | `Secondary-400` |
| Success states | Green | `Success-400` |
| Error states | Red | `Critical-400` |
| Warning states | Yellow | `Warning-400` |
| Sidebar active icon | Orange | `Primary-300` |

### Color Don'ts

❌ Don't use Primary (orange) for links - use Info-400 (blue)  
❌ Don't use pure black (`#000000`) - use Secondary-1000  
❌ Don't use pure white (`#FFFFFF`) for page backgrounds - use Secondary-0  
❌ Don't mix intent colors (e.g., green icon with red text)  
❌ Don't use colors outside this palette  

---

## Typography

### Font Family

**Inter** - Use for all text.

```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, descriptions |
| 500 | Medium | Labels, captions |
| 600 | Semibold | Subheadings, buttons, tabs |
| 700 | Bold | Headings, emphasis |

### Type Scale

#### Headings

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Heading-01 | 34px | Bold | 40px | Page titles |
| Heading-02 | 28px | Bold | 36px | Section titles |
| Heading-03 | 24px | Bold | 32px | Card titles |
| Heading-04 | 22px | Bold | 28px | Subsection titles |

#### Subheadings

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Subheading-01 | 24px | Semibold | 32px | Large labels |
| Subheading-02 | 20px | Semibold | 28px | Section labels |
| Subheading-03 | 18px | Semibold | 26px | Component headers |
| Subheading-04 | 16px | Semibold | 24px | Tab labels, table headers |
| Subheading-05 | 14px | Semibold | 20px | Small labels |

#### Body Text

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body-01 | 18px | Regular | 28px | Large body text |
| Body-02 | 16px | Regular | 24px | Standard body text |
| Body-03 | 14px | Regular | 20px | Compact body text |
| Body-04 | 12px | Regular | 18px | Captions, helper text |

### Typography Rules

✅ Use sentence case for all text  
✅ Use Semibold (600) for interactive elements  
✅ Maintain proper hierarchy (H1 > H2 > H3)  
❌ Don't use ALL CAPS except for badges  
❌ Don't use font sizes outside the scale  
❌ Don't mix font families  

---

## Spacing

### Base Unit
**4px** - All spacing should be multiples of 4px.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| spacing-2 | 2px | Micro spacing |
| spacing-4 | 4px | Icon-text gap |
| spacing-8 | 8px | Small padding, gaps |
| spacing-12 | 12px | Component padding |
| spacing-16 | 16px | Standard padding |
| spacing-24 | 24px | Section spacing |
| spacing-32 | 32px | Large spacing |
| spacing-40 | 40px | Extra large spacing |
| spacing-48 | 48px | Section margins |
| spacing-64 | 64px | Page margins |

### Common Spacing Patterns

| Element | Padding | Gap |
|---------|---------|-----|
| Button (lg) | 10px 16px | 8px |
| Button (sm) | 6px 12px | 6px |
| Card | 16px - 24px | - |
| Modal | 24px | 16px |
| Input | 10px 12px | - |
| Sidebar item | 12px | 14px |
| Tab | 8px 4px | 24px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Badges, tags, small elements |
| radius-md | 6px | Buttons, inputs, small cards |
| radius-lg | 8px | Cards, modals, sidebar items |
| radius-xl | 12px | Large cards, dropdowns |
| radius-full | 9999px | Avatars, pills, round buttons |

### Radius Rules

✅ Icon-only buttons: use `radius-full` (circular)  
✅ Standard buttons: use `radius-md` (6px)  
✅ Cards and containers: use `radius-lg` (8px)  
✅ Modals: use `radius-xl` (12px)  

---

## Shadows (Elevation)

| Level | Shadow | Usage |
|-------|--------|-------|
| Elevation-1 | `0px 2px 4px rgba(0,0,0,0.08)` | Cards at rest |
| Elevation-2 | `0px 2px 6px rgba(0,0,0,0.10)` | Cards on hover |
| Elevation-3 | `0px 4px 12px rgba(0,0,0,0.12)` | Dropdowns, popovers |
| Elevation-4 | `0px 6px 20px rgba(0,0,0,0.14)` | Modals |
| Elevation-5 | `0px 6px 18px rgba(0,0,0,0.16)` | Floating elements |

---

## Icons

### Library
**Tabler Icons** - Consistent stroke-based icons.

### Sizes

| Context | Size | Stroke Width |
|---------|------|--------------|
| Sidebar navigation | 22px | 2 |
| Buttons | 20px | 2 |
| Input icons | 18px | 1.5 |
| Small indicators | 16px | 1.5 |
| Empty states | 48px | 1 |

### Icon Colors

| State | Color |
|-------|-------|
| Default | `Secondary-500` (#7B7891) |
| Active | `Secondary-1000` (#1F1F32) |
| Disabled | `Secondary-400` (#8C899F) |
| On dark bg | White (#FFFFFF) |
| Sidebar active | `Primary-300` (#E45913) |

---

## Buttons

### Hierarchy

1. **Primary** - Filled background, main action (ONE per page)
2. **Secondary** - Outlined, supporting actions
3. **Tertiary** - Text only, dismissive/cancel actions

### Button Intents

| Intent | Background | Border | Text |
|--------|------------|--------|------|
| Prime | `Primary-400` | - | White |
| Info | `Info-400` or transparent | `Info-400` | `Info-400` or White |
| Muted | `Secondary-100` or transparent | `Secondary-200` | `Secondary-700` |
| Success | `Success-400` | - | White |
| Warning | `Warning-400` | - | `Secondary-1000` |
| Critical | `Critical-400` | - | White |

### Button Rules

✅ Only ONE primary button per page/modal  
✅ Maximum THREE buttons per action group  
✅ Use sentence case for labels  
✅ Icon-only buttons must be circular  
❌ Don't use orange for secondary buttons  
❌ Don't use more than one primary CTA  

---

## Forms

### Input States

| State | Border | Background |
|-------|--------|------------|
| Default | `Secondary-200` | White |
| Hover | `Secondary-300` | White |
| Focus | `Info-400` (2px) | White |
| Error | `Critical-400` | `Critical-50` |
| Disabled | `Secondary-200` | `Secondary-50` |

### Labels
- Position: Above input
- Font: 14px, Medium (500)
- Color: `Secondary-700`

### Helper Text
- Position: Below input
- Font: 12px, Regular
- Color: `Secondary-500`

### Error Messages
- Font: 12px, Regular
- Color: `Critical-400`

---

## Tabs

### Active State
- Text: `Info-400` (#0975D7)
- Underline: 4px, `Info-400`, rounded (4px radius)

### Inactive State
- Text: `Secondary-800` (#3D3C52)
- No underline

### Tab Styling
- Font: 16px, Semibold (600)
- Line height: 24px
- Padding: 8px 4px
- Gap between tabs: 24px

---

## Sidebar

### Dimensions
- Width expanded: 260px
- Width collapsed: 68px
- Item height: 48px
- Item padding: 12px
- Icon-text gap: 14px

### States

| State | Background | Text | Icon |
|-------|------------|------|------|
| Default | Transparent | White | White |
| Hover | `#2F2F45` | White | White |
| Active | `#3D3D52` + border | White | `#E45913` |

---

## Content Guidelines

### Writing Rules
- Use **sentence case** for all text
- Be concise and clear
- Use active voice

### Action Words

| ✅ Use | ❌ Avoid |
|--------|----------|
| Save | Submit |
| Create | Add |
| Delete | Remove |
| Cancel | Close, Never mind |
| Continue | Next, Proceed |

### Date Formats

| Format | Example | When to Use |
|--------|---------|-------------|
| Short | Feb 5, 2025 | Lists, tables |
| Long | February 5, 2025 | Headers |
| Relative | 2 hours ago | Recent activity |

### Number Formats
- Use comma separators: 1,234,567
- Percentages: one decimal (45.3%)
- Currency: $1,234.56

---

## Accessibility

- Minimum touch target: 44×44px
- Focus ring: 2px `Info-400` with 2px offset
- Color contrast: 4.5:1 minimum for text
- Don't rely on color alone to convey meaning
- All icons must have labels (visible or aria-label)

---

## Quick Reference

### Most Used Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary CTA | Orange | `#C74900` |
| Links & Active Tabs | Blue | `#0975D7` |
| Body Text | Dark Gray | `#1F1F32` |
| Secondary Text | Gray | `#6B697B` |
| Borders | Light Gray | `#ECECF3` |
| Page Background | Off-White | `#FCFCFD` |
| Sidebar Background | Dark Blue | `#252539` |
| Success | Green | `#21AD73` |
| Error | Red | `#B3141D` |
| Warning | Yellow | `#E0A400` |

---

*Follow these guidelines for all Whatfix product interfaces to ensure visual consistency across the platform.*
