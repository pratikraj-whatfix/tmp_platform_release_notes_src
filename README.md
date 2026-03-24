# Platform — Release Notes

**Repository (Whatfix GitHub):** [`pratikraj-whatfix/platform_release_notes`](https://github.com/pratikraj-whatfix/platform_release_notes)

Design exploration for a Release Notes revamp, reusing the Whatfix dashboard boilerplate (Navi design system: layout, tokens, components).

This project is a React + TypeScript + Tailwind CSS codebase for Whatfix-style product dashboards—button styles, sidebar, modals, page layouts, design tokens, and component patterns.

---

## 🚀 Use this template

### Option 1: GitHub template (Recommended)

1. Click the **"Use this template"** button at the top of the repository
2. Choose **"Create a new repository"**
3. Enter your new project name and description
4. Click **"Create repository"**
5. Clone your new repository and start building!

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
npm install
npm run dev
```

### Option 2: Manual clone

```bash
# Clone the template
npx degit whatfix/whatfix-boilerplate my-new-project

# Or using git
git clone https://github.com/whatfix/whatfix-boilerplate.git my-new-project
cd my-new-project
rm -rf .git
git init

# Update project name in package.json
npm install
npm run dev
```

### After creating your project

Run the interactive setup script to customize your project:

```bash
# Clone your new repo
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME

# Run the setup wizard
npm run setup
```

The setup script will:
- ✅ Ask for your project name and description
- ✅ Update `package.json` with your project details
- ✅ Update the HTML title
- ✅ Generate a new README for your project
- ✅ Clean up template-specific files

**Or manually configure:**

1. Update `package.json`:
   ```json
   {
     "name": "your-project-name",
     "description": "Your project description",
     "version": "0.1.0"
   }
   ```
2. Update `index.html` title
3. Update this README for your specific project
4. Start building your dashboard!

---

## Features

- 🎨 **Complete Design System** - Whatfix brand colors, typography, and spacing tokens
- 🧩 **UI Components** - Button, Modal, Input, Card, Badge with all variants
- 📐 **Layout Components** - Sidebar, Header, PageLayout, ContentPanel
- 📊 **Chart Components** - ECharts wrappers with Whatfix theme (Line, Bar, Pie)
- 🎯 **Tabler Icons** - Consistent iconography with `@tabler/icons-react`
- 📚 **Cursor Skills** - AI-assisted development documentation

## Quick start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project structure

```
src/
├── components/
│   ├── ui/           # Button, Modal, Input, Card, Badge
│   ├── layout/       # Sidebar, Header, PageLayout, ContentPanel
│   └── charts/       # LineChart, BarChart, PieChart
├── views/            # DashboardView, SettingsView
├── styles/
│   └── tokens/       # colors.css, typography.css, spacing.css
├── lib/              # Utilities and ECharts theme
└── types/            # TypeScript definitions
```

## Design tokens

### Colors

The design system uses semantic color naming:

| Color | Usage |
|-------|-------|
| `primary-*` | Whatfix Fire - Main CTA and brand actions |
| `secondary-*` | Inkredible - Backgrounds, text, borders |
| `success-*` | SuccesSage - Success states |
| `info-*` | Knowledgablue - Information, links |
| `warning-*` | Yell-uh-oh - Warning states |
| `critical-*` | Scare-let - Error/destructive states |

### Typography

Uses Inter font family with the following scale:

- **Headings**: 22px - 34px (Bold)
- **Subheadings**: 14px - 24px (Semibold)
- **Body**: 12px - 18px (Regular)
- **Labels**: 12px - 16px (Medium)

### Spacing

4px base unit with scale: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 72px

## Components

### Button

```tsx
import { Button } from './components/ui'

// Primary action (only ONE per page)
<Button intent="prime">Save changes</Button>

// Secondary action
<Button variant="secondary" intent="info">Preview</Button>

// Tertiary action
<Button variant="tertiary" intent="muted">Cancel</Button>

// With icons
<Button iconLeft={<IconPlus size={20} />}>Create new</Button>

// Icon only (uses rounded style)
<Button iconOnly intent="muted">
  <IconSettings size={20} />
</Button>

// Sizes: sm, lg (default), xl
<Button size="sm">Small</Button>
```

#### Button rules

1. Only **ONE primary button** per page/modal
2. Maximum **THREE buttons** per page/modal
3. Icon-only buttons must use **rounded (36px)** radius

### Modal

```tsx
import { Modal } from './components/ui'

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Create new flow"
  size="md" // sm, md, lg
  footer={
    <>
      <Button variant="tertiary" intent="muted" onClick={handleClose}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save</Button>
    </>
  }
>
  <p>Modal content here</p>
</Modal>
```

### Input

```tsx
import { Input } from './components/ui'

<Input
  label="Email address"
  placeholder="you@example.com"
  type="email"
  required
  error="Please enter a valid email"
  helperText="We'll never share your email"
/>
```

### Card

```tsx
import { Card } from './components/ui'

<Card hoverable padding="md">
  Card content here
</Card>
```

### Badge

```tsx
import { Badge } from './components/ui'

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

### Layout

```tsx
import { PageLayout, Sidebar, Header, ContentPanel } from './components/layout'

<PageLayout
  sidebar={
    <Sidebar
      items={navItems}
      activeItemId="dashboard"
      onItemClick={(item) => navigate(item.id)}
      logo={<Logo />}
    />
  }
>
  <Header title="Dashboard" actions={<Button>Create</Button>} />
  
  <ContentPanel title="Section title">
    Panel content
  </ContentPanel>
</PageLayout>
```

### Charts

```tsx
import { LineChart, BarChart, PieChart } from './components/charts'

<LineChart
  data={{
    xAxis: ['Jan', 'Feb', 'Mar'],
    series: [{ name: 'Users', data: [100, 200, 150] }],
  }}
  title="User trends"
  showArea
/>

<BarChart
  data={{
    xAxis: ['A', 'B', 'C'],
    series: [{ name: 'Sales', data: [50, 80, 60] }],
  }}
  stacked
/>

<PieChart
  data={{
    data: [
      { name: 'Desktop', value: 1000 },
      { name: 'Mobile', value: 500 },
    ],
  }}
  donut
/>
```

## Content guidelines

- Use **sentence case** for all text and CTA buttons
- Use "Save" not "Submit"
- Use "Cancel" not "Close"
- Use "Delete" not "Remove"
- Use "Create" not "Add"

## Cursor skills

The `.cursor/skills/` folder contains documentation for AI-assisted development:

- `SKILL.md` - Master skill entry point
- `architecture.md` - Component hierarchy and structure
- `terminology.md` - Content standards and terms
- `behaviors.md` - Interaction patterns and animations
- `icons.md` - Icon usage guidelines

## Dependencies

| Package | Purpose |
|---------|---------|
| `@tabler/icons-react` | Icon library |
| `echarts` + `echarts-for-react` | Charts |
| `clsx` + `tailwind-merge` | Class name utilities |
| `class-variance-authority` | Component variants |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

MIT
