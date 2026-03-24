# 🎨 Designer Setup Guide

Welcome! This guide will help you create your own Whatfix dashboard project from the boilerplate template.

---

## Prerequisites

Before you begin, make sure you have these installed:

| Tool | Version | Check Command | Download |
|------|---------|---------------|----------|
| **Node.js** | 20.19+ or 22+ | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | 10+ | `npm --version` | Comes with Node.js |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com/) |
| **VS Code** or **Cursor** | Latest | - | [cursor.com](https://cursor.com/) |

### Quick Install (macOS)

```bash
# Install Node.js using Homebrew
brew install node

# Verify installation
node --version  # Should show v20.19+ or v22+
npm --version   # Should show 10+
```

---

## Step 1: Create Your Project

### Option A: Using GitHub (Recommended)

1. Go to **https://github.com/shubham-bhatt50/whatfix-boilerplate**

2. Click the green **"Use this template"** button

3. Select **"Create a new repository"**

4. Fill in your project details:
   - **Repository name:** `your-project-name` (e.g., `mirror-admin-dashboard`)
   - **Description:** Your project description
   - **Visibility:** Public or Private

5. Click **"Create repository"**

6. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-project-name.git
   cd your-project-name
   ```

### Option B: Using Command Line

```bash
# Using degit (no git history)
npx degit shubham-bhatt50/whatfix-boilerplate my-project-name
cd my-project-name

# Initialize git
git init
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes on first run).

---

## Step 3: Customize Your Project

Run the interactive setup wizard:

```bash
npm run setup
```

You'll be prompted to enter:
- **Project name** - e.g., "Mirror Admin Dashboard"
- **Description** - e.g., "Admin dashboard for Whatfix Mirror"
- **Author name** - Your name (optional)

The wizard will automatically update:
- ✅ `package.json` with your project details
- ✅ `index.html` with your project title
- ✅ `README.md` with a new project-specific readme

---

## Step 4: Start Development Server

```bash
npm run dev
```

Open your browser to **http://localhost:5173** (or the URL shown in terminal).

🎉 **You're ready to start building!**

---

## Project Structure

```
your-project/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   └── TabGroup/
│   │   ├── layout/          # Page structure components
│   │   │   ├── Sidebar/
│   │   │   ├── Header/
│   │   │   ├── PageLayout/
│   │   │   ├── ContentPanel/
│   │   │   ├── SecondaryNav/
│   │   │   └── ContentPageHeader/
│   │   └── charts/          # Chart components
│   │       ├── LineChart/
│   │       ├── BarChart/
│   │       └── PieChart/
│   ├── styles/
│   │   ├── globals.css      # Global styles & component CSS
│   │   └── tokens/          # Design tokens
│   │       ├── colors.css
│   │       ├── typography.css
│   │       └── spacing.css
│   ├── views/               # Page views
│   ├── lib/                 # Utilities
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/
│   └── brand/               # Brand assets (logos, icons)
├── scripts/
│   └── setup.js             # Project setup wizard
└── package.json
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code for errors |

---

## Using Components

### Import Components

```tsx
// UI Components
import { Button, Modal, Input, Card, Badge, TabGroup } from './components/ui'

// Layout Components
import { PageLayout, Sidebar, Header, ContentPanel } from './components/layout'

// Chart Components
import { LineChart, BarChart, PieChart } from './components/charts'
```

### Button Examples

```tsx
// Primary action (only ONE per page)
<Button intent="prime">Save changes</Button>

// Secondary action
<Button variant="secondary" intent="info">Preview</Button>

// Text button with icon
<Button variant="tertiary">
  <IconPlus size={20} />
  Add item
</Button>

// Icon only
<Button iconOnly intent="muted">
  <IconSettings size={20} />
</Button>
```

### Modal Example

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create workflow"
  size="md"
>
  <p>Modal content here</p>
</Modal>
```

### TabGroup Example

```tsx
<TabGroup
  tabs={[
    { id: 'draft', label: 'Draft' },
    { id: 'ready', label: 'Ready' },
    { id: 'production', label: 'Production' },
  ]}
  defaultActiveId="draft"
  onChange={(tabId) => console.log('Selected:', tabId)}
/>
```

---

## Design Tokens

### Colors

| Token | Usage |
|-------|-------|
| `--color-primary-*` | Whatfix Fire - Main CTAs |
| `--color-secondary-*` | Inkredible - Backgrounds, text |
| `--color-success-*` | Success states |
| `--color-info-*` | Information, links (#0975D7) |
| `--color-warning-*` | Warning states |
| `--color-critical-*` | Error/destructive states |

### Using Colors in CSS

```css
.my-element {
  color: var(--color-info-400);           /* #0975D7 - Link blue */
  background: var(--color-secondary-50);  /* #F6F6F9 - Light gray */
  border: 1px solid var(--color-secondary-200); /* #ECECF3 */
}
```

### Typography

```css
/* Use Inter font family */
font-family: var(--font-sans);

/* Font weights */
font-weight: 400;  /* Regular */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold */
```

---

## Icons

This boilerplate uses [Tabler Icons](https://tabler.io/icons).

### Usage

```tsx
import { IconSettings, IconPlus, IconSearch } from '@tabler/icons-react'

// In your component
<IconSettings size={20} stroke={2} />
<IconPlus size={24} stroke={1.5} />
```

### Icon Guidelines

| Context | Size | Stroke |
|---------|------|--------|
| Sidebar navigation | 22px | 2 |
| Buttons | 20px | 2 |
| Input icons | 18px | 1.5 |
| Small indicators | 16px | 1.5 |

---

## Adding New Pages

1. Create a new view in `src/views/`:

```tsx
// src/views/MyNewView.tsx
export function MyNewView() {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  )
}
```

2. Export from `src/views/index.ts`:

```tsx
export { MyNewView } from './MyNewView'
```

3. Add to your navigation in `App.tsx`

---

## Adding Sidebar Items

Edit the `productNavConfigs` in `App.tsx`:

```tsx
const productNavConfigs = {
  myProduct: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <IconLayoutDashboard size={22} stroke={2} />,
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={22} stroke={2} />,
      // Optional: Add secondary navigation
      secondaryNav: {
        title: 'Settings',
        sections: [
          { id: 'general', label: 'General' },
          { id: 'team', label: 'Team' },
        ]
      }
    },
  ],
}
```

---

## Troubleshooting

### "Module not found" Error

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use

```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### TypeScript Errors

```bash
# Check for type errors
npm run build
```

### Styles Not Applying

1. Make sure you're importing `globals.css` in `main.tsx`
2. Check that your CSS classes match those defined in `globals.css`
3. Try restarting the dev server

---

## Getting Help

- **Navi Design System:** [navi.whatfix.com](https://navi.whatfix.com)
- **Tabler Icons:** [tabler.io/icons](https://tabler.io/icons)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React:** [react.dev](https://react.dev)

---

## Content Guidelines

- Use **sentence case** for all text and buttons
- Use "Save" not "Submit"
- Use "Cancel" not "Close"  
- Use "Delete" not "Remove"
- Use "Create" not "Add"

---

Happy building! 🚀
