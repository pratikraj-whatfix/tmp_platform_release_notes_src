# Whatfix Dashboard Boilerplate Skill

This skill guides the creation of Whatfix product dashboard interfaces following the Navi design system.

## Quick Reference

- **Design System**: Navi (https://navi.whatfix.com)
- **Icons**: Tabler Icons (`@tabler/icons-react`)
- **Charts**: ECharts with Whatfix theme
- **Stack**: React + TypeScript + Tailwind CSS

## Key Files

- `architecture.md` - System structure and component hierarchy
- `terminology.md` - Standardized terms and content guidelines
- `behaviors.md` - Interaction patterns and animations
- `icons.md` - Icon guidelines and sizing

## Component Locations

| Type | Path |
|------|------|
| UI Components | `src/components/ui/` |
| Layout Components | `src/components/layout/` |
| Chart Components | `src/components/charts/` |
| Views/Pages | `src/views/` |
| Design Tokens | `src/styles/tokens/` |
| Utilities | `src/lib/` |

## Core Rules

### Button Rules
1. Only **ONE primary button** per page/modal
2. Maximum **THREE buttons** per page/modal
3. Only ONE primary prime + ONE secondary prime per page
4. Icon-only buttons must use **rounded (36px)** radius

### Typography
- Always use **Inter** font family
- Follow the typography scale defined in `typography.css`
- Use semantic class names: `text-heading-01`, `text-bodytext-03`, etc.

### Spacing
- Follow **4px base** spacing scale
- Use spacing tokens: `--spacing-4`, `--spacing-8`, etc.

### Colors
- **Primary CTA**: `--color-primary-400` (#C74900)
- **Nav background**: `--color-secondary-1000` (#1F1F32)
- **Product background**: `--color-secondary-0` (#FCFCFD)
- Use semantic color intentions: prime, muted, success, warning, critical, info

## Content Guidelines

- Make text **sentence case**
- Make CTA text **sentence case**
- Use "Save" not "Submit"
- Use "Cancel" not "Close" (for form dismissal)
- Use "Delete" not "Remove" (for destructive actions)
- Use "Create" not "Add" (for new items)

## Component Quick Reference

### Button
```tsx
<Button variant="primary" intent="prime">Save changes</Button>
<Button variant="secondary" intent="info">Preview</Button>
<Button variant="tertiary" intent="muted">Cancel</Button>
```

### Modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Modal title" size="md">
  Content here
</Modal>
```

### Layout
```tsx
<PageLayout
  sidebar={<Sidebar items={navItems} />}
  header={<Header title="Page title" />}
>
  <ContentPanel title="Section">
    Content here
  </ContentPanel>
</PageLayout>
```

### Charts
```tsx
<LineChart data={lineData} title="Trends" showArea />
<BarChart data={barData} title="Comparison" stacked />
<PieChart data={pieData} title="Distribution" donut />
```
