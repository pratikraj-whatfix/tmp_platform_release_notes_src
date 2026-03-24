# Interaction Behaviors

## Transitions & Timing

### Default Transition

```css
transition-property: background-color, border-color, box-shadow, transform, opacity;
transition-duration: 150ms;
transition-timing-function: ease-in-out;
```

Use the utility class `transition-default` for standard transitions.

### Duration Scale

| Duration | Use Case |
|----------|----------|
| 100ms | Micro-interactions (hover states) |
| 150ms | Standard UI transitions (default) |
| 200ms | Component enter/exit |
| 300ms | Page transitions, modals |
| 500ms | Chart animations |

## Hover States

### Buttons

| Variant | Default | Hover |
|---------|---------|-------|
| Primary | Solid background | Darker shade |
| Secondary | Outlined | Light fill + outline |
| Tertiary | Text only | Light fill |

### Cards

- Elevation: `elevation-1` → `elevation-2`
- Add subtle lift with transform if clickable

### Links

- Underline appears on hover
- Color shifts to darker shade

### Nav Items

| State | Style |
|-------|-------|
| Default | Text color: secondary-300 |
| Hover | Background: secondary-900, Text: white |
| Active | Background: secondary-900, Left border: primary-400 |

## Focus States

### Focus Ring

```css
outline: 2px solid var(--color-info-400); /* #0975D7 */
outline-offset: 2px;
```

Use the utility class `focus-ring` which applies focus ring on `:focus-visible`.

### Focus Order

Ensure logical tab order through proper DOM structure.

## Active/Pressed States

- Buttons: Slightly darker than hover
- Cards: `elevation-1` (no lift)
- Toggle buttons: Filled state with indicator

## Loading States

### Button Loading

- Spinner replaces icon/content
- Maintain button width (prevent layout shift)
- Disable interactions

```tsx
<Button loading>Saving...</Button>
```

### Content Loading

- Use skeleton screens with pulse animation
- Match content layout dimensions
- Animate with subtle opacity pulse

### Page Loading

- Full-page spinner centered
- Or progressive skeleton reveal

## Dropdown Behavior

### Opening

- Immediate open (no delay)
- Apply `elevation-3` shadow
- Animate in with `fade-in` + `scale-up`

### Sizing

| Property | Value |
|----------|-------|
| Max height | 320px |
| Item height | 40px |
| Min width | Match trigger |

### Closing

- Click outside: Close immediately
- Escape key: Close immediately
- Selection: Close after selection
- Focus out: Close after blur

### Position

- Default: Below trigger, left-aligned
- Flip: Above if no space below
- Shift: Adjust horizontal to stay in viewport

## Modal Behavior

### Opening

- Fade in backdrop (150ms)
- Scale up modal from 95% to 100% with fade (200ms)
- Trap focus inside modal
- Disable body scroll

### Closing

- Escape key: Close
- Backdrop click: Close
- Close button: Close
- Restore focus to trigger element
- Re-enable body scroll

### Stacking

- Only one modal visible at a time
- Nested modals should be avoided
- Use z-index: 50 for modal layer

## Form Behavior

### Validation

| Trigger | Action |
|---------|--------|
| On blur | Validate field |
| On submit | Validate all, show errors |
| On input (after error) | Re-validate |

### Error Display

- Show error message below input
- Apply error border color
- Clear error when fixed

### Success Indicators

- Use success color for valid states
- Show check icon for confirmation
- Toast notification for form submission

## Scroll Behavior

### Page Scroll

- Smooth scroll for anchor links
- Header shadow appears on scroll
- Sticky headers stay visible

### Container Scroll

- Use custom scrollbar styling
- Show scroll shadow at edges when scrollable
- Preserve scroll position on data updates

## Animation Patterns

### Enter Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale up */
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Staggered Reveals

For lists and grids, use `animation-delay` for staggered effect:

```tsx
items.map((item, index) => (
  <div 
    key={item.id}
    style={{ animationDelay: `${index * 50}ms` }}
    className="animate-fadeIn"
  />
))
```

### Loading Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

## Touch/Mobile Considerations

- Minimum tap target: 44x44px
- Touch feedback: Slight opacity change
- Swipe gestures: Use for drawer close, carousel
- Pull to refresh: If applicable
