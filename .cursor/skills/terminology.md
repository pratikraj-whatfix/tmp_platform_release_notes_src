# Terminology & Content Standards

## Date & Time Formats

### Date Display

| Format | Example | Use Case |
|--------|---------|----------|
| Short | Feb 5, 2025 | Lists, tables, compact spaces |
| Long | February 5, 2025 | Headers, prominent displays |
| Numeric | 02/05/2025 | Data exports only |

### Time Display

| Format | Example | Use Case |
|--------|---------|----------|
| Standard | 2:30 PM | All user-facing times |
| 24-hour | 14:30 | Data exports, logs |

### Relative Time

| Threshold | Display |
|-----------|---------|
| < 1 minute | Just now |
| < 60 minutes | X minutes ago |
| < 24 hours | X hours ago |
| Yesterday | Yesterday |
| < 7 days | X days ago |
| ≥ 7 days | Last week / Date |

## Action Terms

### Primary Actions (Create/Positive)

| ✅ Use | ❌ Avoid |
|--------|----------|
| Save | Submit |
| Create | Add, Make |
| Continue | Next, Proceed |
| Confirm | OK, Yes |

### Secondary Actions

| ✅ Use | ❌ Avoid |
|--------|----------|
| Save as draft | Save draft |
| Preview | View preview |
| Export | Download data |
| Share | Send |

### Tertiary/Dismissive Actions

| ✅ Use | ❌ Avoid |
|--------|----------|
| Cancel | Close, Never mind |
| Back | Previous, Go back |
| Skip | Later, Not now |

### Destructive Actions

| ✅ Use | ❌ Avoid |
|--------|----------|
| Delete | Remove, Erase |
| Discard | Throw away |
| Clear | Reset, Empty |

## Button Labels

### Sentence Case Rule

All button text should be in **sentence case** (first letter capitalized, rest lowercase unless proper noun).

| ✅ Correct | ❌ Incorrect |
|------------|--------------|
| Save changes | Save Changes |
| Create new flow | Create New Flow |
| Delete permanently | DELETE PERMANENTLY |

### Action + Object Pattern

For clarity, pair action with object when context isn't obvious:

| Context Clear | Context Unclear |
|---------------|-----------------|
| Save | Save flow |
| Cancel | Cancel changes |
| Delete | Delete this item |

## Form Labels

### Input Labels

- Use sentence case
- Be concise but clear
- Include units where relevant

| ✅ Use | ❌ Avoid |
|--------|----------|
| Email address | Email Address / EMAIL |
| Password | Your password |
| First name | First Name |
| Duration (minutes) | Duration in mins |

### Placeholder Text

- Use descriptive examples
- Don't repeat the label
- Sentence case

| Label | ✅ Placeholder | ❌ Placeholder |
|-------|----------------|----------------|
| Email address | you@company.com | Enter email |
| Search | Search by name or ID | Search... |

### Helper Text

- Use sentence case
- Keep under 100 characters
- Be specific and actionable

### Error Messages

| ✅ Use | ❌ Avoid |
|--------|----------|
| Email address is required | Required field |
| Password must be at least 8 characters | Invalid password |
| This name is already in use | Duplicate error |

## Status & State Labels

### System Status

| Status | Color Intent | Example |
|--------|--------------|---------|
| Active | success | Active |
| Pending | warning | Pending review |
| Error/Failed | critical | Failed to sync |
| Draft | default | Draft |
| Inactive | default | Inactive |

### Progress States

| State | Display |
|-------|---------|
| Not started | Not started |
| In progress | In progress |
| Completed | Completed |
| Blocked | Blocked |

## Numbers & Data

### Number Formatting

| Type | Format | Example |
|------|--------|---------|
| Whole numbers | Comma separators | 1,234,567 |
| Decimals | Up to 2 places | 1,234.56 |
| Percentages | 1 decimal place | 45.3% |
| Currency | Symbol + value | $1,234.56 |

### Empty States

| Scenario | Display |
|----------|---------|
| No data | No data available |
| No results | No results found |
| Zero count | 0 (not "None" or "-") |

## Confirmation Messages

### Success

- Start with action completed
- Be specific about what happened

| ✅ Use | ❌ Avoid |
|--------|----------|
| Flow saved successfully | Success! |
| 3 items deleted | Items removed |
| Changes applied | Done |

### Warnings

- Lead with impact
- Offer clear next steps

### Errors

- Explain what went wrong
- Provide resolution path if possible

| ✅ Use | ❌ Avoid |
|--------|----------|
| Unable to save. Please try again. | Error 500 |
| Connection lost. Reconnecting... | Network error |
