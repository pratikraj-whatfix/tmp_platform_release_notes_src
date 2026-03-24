import { describe, it, expect } from 'vitest'
import { normalizeEvent, extractJiraReferences } from '../normalizeEvent'
import type { RawAuditLogEntry } from '../types'

function makeRaw(overrides: Partial<RawAuditLogEntry>): RawAuditLogEntry {
  return {
    UserId: 'user-1',
    UserName: 'alice@whatfix.com',
    EntId: 'ent-1',
    EntName: 'ent1',
    Action: 'Created',
    Message: 'n/a',
    Source: 'Text',
    Date: '2026-Feb-10',
    Time: '10:00:00.000 +0000',
    ad1: 'n/a',
    ad2: 'n/a',
    Payload: 'n/a',
    ...overrides,
  }
}

// ─── Jira Detection ──────────────────────────────────────────────────────────

describe('extractJiraReferences', () => {
  it('detects a Jira key like ABC-123', () => {
    const result = extractJiraReferences('Fixed in ABC-123 and deployed')
    expect(result.jiraKey).toBe('ABC-123')
  })

  it('detects a full Jira URL', () => {
    const result = extractJiraReferences('See https://jira.company.com/browse/PROJ-456 for details')
    expect(result.jiraKey).toBe('PROJ-456')
    expect(result.jiraUrl).toContain('PROJ-456')
  })

  it('returns empty for text without Jira references', () => {
    const result = extractJiraReferences('User logged in successfully')
    expect(result.jiraKey).toBeUndefined()
    expect(result.jiraUrl).toBeUndefined()
  })

  it('returns empty for empty string', () => {
    const result = extractJiraReferences('')
    expect(result.jiraKey).toBeUndefined()
  })

  it('does not match lowercase patterns', () => {
    const result = extractJiraReferences('see abc-123')
    expect(result.jiraKey).toBeUndefined()
  })

  it('prefers URL over plain key when both present', () => {
    const result = extractJiraReferences('https://jira.co/browse/AB-1 and also CD-2')
    expect(result.jiraKey).toBe('AB-1')
    expect(result.jiraUrl).toBeDefined()
  })

  it('handles multiple Jira keys, returning the first', () => {
    const result = extractJiraReferences('Relates to FEAT-100 and BUG-200')
    expect(result.jiraKey).toBe('FEAT-100')
  })
})

// ─── Category Mapping ────────────────────────────────────────────────────────

describe('normalizeEvent - category mapping', () => {
  it('maps Logged-in to Access/Security', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.category).toBe('Access/Security')
    expect(evt.changeType).toBe('Login')
  })

  it('maps Logged-out to Access/Security', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-out', Source: '127.0.0.1', Message: "User 'a@b.com' logged out." }))
    expect(evt.category).toBe('Access/Security')
    expect(evt.changeType).toBe('Logout')
  })

  it('maps SignUp to Access/Security', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'SignUp', Source: 'EmailId', Message: "'a@b.com' signed up with role 'Editor'" }))
    expect(evt.category).toBe('Access/Security')
    expect(evt.changeType).toBe('SignUp')
  })

  it('maps Invited to Access/Security', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Invited', Source: 'EmailId', Message: "'a@b.com' invited 'c@d.com' with role 'Editor'", ad1: 'c@d.com' }))
    expect(evt.category).toBe('Access/Security')
    expect(evt.changeType).toBe('Invited')
  })

  it('maps User Role Changed to Access/Security', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Changed', Source: 'User Role', Message: "'a@b.com' has changed role for User 'c@d.com' from 'Editor' to 'Admin'" }))
    expect(evt.category).toBe('Access/Security')
    expect(evt.changeType).toBe('RoleChanged')
  })

  it('maps Content Created (Text) to Content', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Text', Message: 'URL: http://default/service/ent/text/create/v17', ad1: 'content-id' }))
    expect(evt.category).toBe('Content')
    expect(evt.changeType).toBe('Created')
  })

  it('maps Content Moved (draft to ready) to Approvals/Publishing', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Moved', Source: 'Design', Message: 'draft to ready' }))
    expect(evt.category).toBe('Approvals/Publishing')
    expect(evt.changeType).toBe('Published')
  })

  it('maps Content Moved (ready to draft) to Content', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Moved', Source: 'Design', Message: 'ready to draft' }))
    expect(evt.category).toBe('Content')
    expect(evt.changeType).toBe('Unpublished')
  })

  it('maps Self Help Created to Content', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Self Help', Message: 'n/a', ad1: 'sh-id' }))
    expect(evt.category).toBe('Content')
    expect(evt.object.contentType).toBe('Self Help')
  })

  it('maps Task List Created to Content', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Task List', Message: 'n/a', ad1: 'tl-id' }))
    expect(evt.category).toBe('Content')
    expect(evt.object.contentType).toBe('Task List')
  })

  it('maps UserApiToken Generated to Integrations/API', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Generated', Source: 'UserApiToken', Message: 'User api token generated' }))
    expect(evt.category).toBe('Integrations/API')
    expect(evt.changeType).toBe('Generated')
  })

  it('maps Extension Updated to Integrations/API', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Updated', Source: 'Extension', Message: '{"mode":"developer"}', ad1: 'chrome' }))
    expect(evt.category).toBe('Integrations/API')
  })

  it('maps AdvanceCustomization to Configuration', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Updated', Source: 'AdvanceCustomization', Message: 'console.log("test")' }))
    expect(evt.category).toBe('Configuration')
  })

  it('maps Downloaded audit logs to Other', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Downloaded', Source: 'Audit logs downloaded', Message: "User downloaded the audit logs." }))
    expect(evt.category).toBe('Other')
    expect(evt.changeType).toBe('Downloaded')
  })
})

// ─── Summary Generation ──────────────────────────────────────────────────────

describe('normalizeEvent - human-readable summary', () => {
  it('generates a readable login summary', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'alice@whatfix.com' logged in." }))
    expect(evt.summary).toBe('alice signed in')
  })

  it('generates a readable invite summary with role', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Invited',
      Source: 'EmailId',
      Message: "'alice@whatfix.com' invited 'bob@whatfix.com' with role 'Editor'",
      ad1: 'bob@whatfix.com',
    }))
    expect(evt.summary).toContain('alice')
    expect(evt.summary).toContain('bob@whatfix.com')
    expect(evt.summary).toContain('Editor')
  })

  it('generates a readable role change summary', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Changed',
      Source: 'User Role',
      Message: "'admin@whatfix.com' has changed role for User 'bob@whatfix.com' from 'Editor' to 'Admin'",
      ad1: 'admin-id',
    }))
    expect(evt.summary).toContain('Editor')
    expect(evt.summary).toContain('Admin')
  })

  it('generates a readable content creation summary', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Created',
      Source: 'Text',
      Message: 'URL: http://default/service/ent/text/create/v17',
      ad1: 'abc12345-defg-hijk',
    }))
    expect(evt.summary).toContain('alice')
    expect(evt.summary).toContain('created')
    expect(evt.summary).toContain('Flow')
  })

  it('generates a readable API token summary', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Generated', Source: 'UserApiToken', Message: 'User api token generated' }))
    expect(evt.summary).toContain('API token')
  })

  it('generates a readable delete summary', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Deleted', Source: 'Text', Message: 'Content deleted', ad1: 'del-id',
    }))
    expect(evt.summary).toContain('alice')
    expect(evt.summary).toContain('deleted')
  })

  it('generates a readable enabled summary', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Enabled', Source: 'Extension', Message: 'Extension enabled',
    }))
    expect(evt.summary).toContain('alice')
    expect(evt.summary).toContain('enabled')
  })
})

// ─── Graceful Degradation ────────────────────────────────────────────────────

describe('normalizeEvent - graceful degradation for unknown events', () => {
  it('maps unknown action to category Other and changeType Other', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'SomeUnknownAction',
      Source: 'UnknownSource',
      Message: 'Something happened that we do not recognize',
    }))
    expect(evt.category).toBe('Other')
    expect(evt.changeType).toBe('Other')
  })

  it('uses raw message as summary for unknown event with short message', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'SomeUnknownAction',
      Source: 'UnknownSource',
      Message: 'Something happened that we do not recognize',
    }))
    expect(evt.summary).toBe('Something happened that we do not recognize')
  })

  it('generates a fallback summary for unknown event with long or n/a message', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'SomeUnknownAction',
      Source: 'UnknownSource',
      Message: 'n/a',
    }))
    expect(evt.summary).toContain('alice')
    expect(evt.summary).toContain('SomeUnknownAction')
  })

  it('still extracts Jira from unknown events', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'SomeUnknownAction',
      Source: 'UnknownSource',
      Message: 'Deployed for PROJ-789',
    }))
    expect(evt.why.jiraKey).toBe('PROJ-789')
  })

  it('preserves raw record in all events', () => {
    const raw = makeRaw({ Action: 'SomeUnknownAction', Source: 'X', Message: 'Y' })
    const evt = normalizeEvent(raw)
    expect(evt.raw).toEqual(raw)
  })
})

// ─── Maker-Checker Detection ─────────────────────────────────────────────────

describe('normalizeEvent - maker-checker', () => {
  it('detects approved by pattern', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Moved',
      Source: 'Design',
      Message: "draft to ready, approved by 'admin@whatfix.com'",
    }))
    expect(evt.makerChecker.status).toBe('approved')
    expect(evt.makerChecker.checker?.name).toContain('admin@whatfix.com')
  })

  it('detects rejected by pattern', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Moved',
      Source: 'Design',
      Message: "ready to draft, rejected by 'reviewer@whatfix.com'",
    }))
    expect(evt.makerChecker.status).toBe('rejected')
    expect(evt.makerChecker.checker?.name).toContain('reviewer@whatfix.com')
  })

  it('detects pending approval', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Moved',
      Source: 'Design',
      Message: 'draft to ready - pending approval',
    }))
    expect(evt.makerChecker.status).toBe('pending')
  })

  it('defaults to none for events without maker-checker', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.makerChecker.status).toBe('none')
  })

  it('extracts approver from payload JSON', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Moved',
      Source: 'Design',
      Message: 'draft to ready',
      Payload: JSON.stringify({ approver: 'boss@whatfix.com', status: 'approved' }),
    }))
    expect(evt.makerChecker.status).toBe('approved')
    expect(evt.makerChecker.checker?.name).toBe('boss@whatfix.com')
  })
})

// ─── Content Enrichment ──────────────────────────────────────────────────────

describe('normalizeEvent - content enrichment', () => {
  it('extracts title from payload JSON', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Created',
      Source: 'Text',
      ad1: 'content-123',
      Payload: JSON.stringify({ title: 'Onboarding Flow' }),
    }))
    expect(evt.object.title).toBe('Onboarding Flow')
    expect(evt.object.name).toBe('Onboarding Flow')
  })

  it('falls back to Task List title for Task List content type', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Created',
      Source: 'Task List',
      ad1: 'tl-123',
    }))
    expect(evt.object.title).toBe('Task List')
  })

  it('falls back to Self Help title for Self Help content type', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Created',
      Source: 'Self Help',
      ad1: 'sh-123',
    }))
    expect(evt.object.title).toBe('Self Help Widget')
  })

  it('uses short ID when no title available', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Created',
      Source: 'Text',
      ad1: 'abc12345-defg-hijk-lmno',
    }))
    expect(evt.object.name).toContain('abc12345')
  })

  it('provides human-friendly name for configuration objects', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Updated',
      Source: 'AdvanceCustomization',
      Message: 'console.log("test")',
    }))
    expect(evt.object.name).toBe('Advance Customization')
  })
})

// ─── Notes Extraction ────────────────────────────────────────────────────────

describe('normalizeEvent - notes', () => {
  it('extracts reason from message', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Deleted',
      Source: 'Text',
      Message: 'Content deleted. Reason: outdated content',
      ad1: 'del-id',
    }))
    expect(evt.notes).toBe('outdated content')
  })

  it('extracts notes from payload JSON', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Updated',
      Source: 'Text',
      ad1: 'content-id',
      Payload: JSON.stringify({ notes: 'Quarterly review update' }),
    }))
    expect(evt.notes).toBe('Quarterly review update')
  })

  it('generates role transition note for RoleChanged', () => {
    const evt = normalizeEvent(makeRaw({
      Action: 'Changed',
      Source: 'User Role',
      Message: "'admin@w.com' has changed role for User 'user@w.com' from 'Editor' to 'Admin'",
      ad1: 'admin-id',
    }))
    expect(evt.notes).toContain('Editor')
    expect(evt.notes).toContain('Admin')
    expect(evt.notes).toContain('→')
  })

  it('returns empty for events without notes', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.notes).toBe('')
  })
})

// ─── IP Address Extraction ───────────────────────────────────────────────────

describe('normalizeEvent - IP address extraction', () => {
  it('extracts IP from Source field for login events', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.ipAddress).toBe('127.0.0.1')
  })

  it('extracts IP from Message if Source is not an IP', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Text', Message: 'Created from 192.168.1.1' }))
    expect(evt.ipAddress).toBe('192.168.1.1')
  })

  it('returns empty string when no IP found', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Text', Message: 'n/a' }))
    expect(evt.ipAddress).toBe('')
  })
})

// ─── Impact State Detection ──────────────────────────────────────────────────

describe('normalizeEvent - impact state', () => {
  it('detects Ready state from "draft to ready" message', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Moved', Source: 'Design', Message: 'draft to ready' }))
    expect(evt.impactState).toBe('Ready')
  })

  it('detects Draft state from "ready to draft" message', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Moved', Source: 'Design', Message: 'ready to draft' }))
    expect(evt.impactState).toBe('Draft')
  })

  it('detects Draft state for Created actions', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Text', ad1: 'id-1' }))
    expect(evt.impactState).toBe('Draft')
  })

  it('returns null for login events', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.impactState).toBeNull()
  })

  it('detects Production state', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Moved', Source: 'Design', Message: 'ready to production' }))
    expect(evt.impactState).toBe('Production')
  })
})

// ─── Object Extraction ───────────────────────────────────────────────────────

describe('normalizeEvent - object extraction', () => {
  it('extracts content ID from ad1', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Created', Source: 'Text', ad1: '29c02a7f-9814-4bd5-87ed-2f42281a40d0' }))
    expect(evt.object.id).toBe('29c02a7f-9814-4bd5-87ed-2f42281a40d0')
  })

  it('extracts invited user from ad1', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Invited', Source: 'EmailId', Message: "'a@b.com' invited 'c@d.com' with role 'Editor'", ad1: 'c@d.com' }))
    expect(evt.object.name).toBe('c@d.com')
    expect(evt.object.type).toBe('User')
  })

  it('sets type = Session for login events', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Logged-in', Source: '127.0.0.1', Message: "User 'a@b.com' logged in." }))
    expect(evt.object.type).toBe('Session')
  })

  it('assigns User Profile for user name update', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Updated', Source: 'User Name', Message: "User name updated by 'alice@whatfix.com'" }))
    expect(evt.object.type).toBe('User Profile')
    expect(evt.object.name).toBe('alice')
  })

  it('assigns Audit Logs name for download event', () => {
    const evt = normalizeEvent(makeRaw({ Action: 'Downloaded', Source: 'Audit logs downloaded', Message: 'User downloaded audit logs.' }))
    expect(evt.object.name).toBe('Audit Logs')
  })
})

// ─── NormalizedEvent Structure ───────────────────────────────────────────────

describe('normalizeEvent - output structure', () => {
  it('produces all required fields', () => {
    const evt = normalizeEvent(makeRaw({}))
    expect(evt).toHaveProperty('id')
    expect(evt).toHaveProperty('category')
    expect(evt).toHaveProperty('changeType')
    expect(evt).toHaveProperty('actor')
    expect(evt.actor).toHaveProperty('id')
    expect(evt.actor).toHaveProperty('name')
    expect(evt).toHaveProperty('object')
    expect(evt).toHaveProperty('occurredAt')
    expect(evt.occurredAt).toHaveProperty('utc')
    expect(evt.occurredAt).toHaveProperty('local')
    expect(evt.occurredAt).toHaveProperty('epoch')
    expect(evt).toHaveProperty('why')
    expect(evt).toHaveProperty('summary')
    expect(evt).toHaveProperty('notes')
    expect(evt).toHaveProperty('makerChecker')
    expect(evt.makerChecker).toHaveProperty('status')
    expect(evt.makerChecker).toHaveProperty('maker')
    expect(evt).toHaveProperty('raw')
  })

  it('preserves the original raw record', () => {
    const raw = makeRaw({ Action: 'Logged-in', Message: 'test message' })
    const evt = normalizeEvent(raw)
    expect(evt.raw).toEqual(raw)
  })

  it('generates unique IDs', () => {
    const a = normalizeEvent(makeRaw({ Action: 'Logged-in' }))
    const b = normalizeEvent(makeRaw({ Action: 'Logged-out' }))
    expect(a.id).not.toBe(b.id)
  })
})
