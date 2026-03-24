import type {
  RawAuditLogEntry,
  NormalizedEvent,
  EventCategory,
  ChangeType,
  ContentType,
  ImpactState,
  NormalizedWhy,
  NormalizedObject,
  NormalizedTimestamp,
  MakerCheckerInfo,
  NormalizedActor,
} from './types'

// ─── Jira Detection ──────────────────────────────────────────────────────────

const JIRA_KEY_PATTERN = /\b([A-Z][A-Z0-9]+-\d+)\b/g
const JIRA_URL_PATTERN = /https?:\/\/[^\s]+\/browse\/([A-Z][A-Z0-9]+-\d+)/g

export function extractJiraReferences(text: string): NormalizedWhy {
  if (!text) return {}

  const urlMatch = JIRA_URL_PATTERN.exec(text)
  if (urlMatch) {
    JIRA_URL_PATTERN.lastIndex = 0
    return { jiraUrl: urlMatch[0], jiraKey: urlMatch[1] }
  }
  JIRA_URL_PATTERN.lastIndex = 0

  const keyMatch = JIRA_KEY_PATTERN.exec(text)
  if (keyMatch) {
    JIRA_KEY_PATTERN.lastIndex = 0
    return { jiraKey: keyMatch[1] }
  }
  JIRA_KEY_PATTERN.lastIndex = 0

  return {}
}

// ─── Timestamp Parsing ───────────────────────────────────────────────────────

function parseTimestamp(dateStr: string, timeStr: string): NormalizedTimestamp {
  const raw = `${dateStr.trim()} ${timeStr.trim()}`
  const d = new Date(raw)
  const epoch = isNaN(d.getTime()) ? Date.now() : d.getTime()

  const utc = isNaN(d.getTime())
    ? raw
    : d.toISOString()

  const local = isNaN(d.getTime())
    ? raw
    : d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

  return { utc, local, epoch }
}

// ─── Category Mapping ────────────────────────────────────────────────────────

function mapCategory(action: string, source: string, message: string): EventCategory {
  const a = action.toLowerCase()
  const s = source.toLowerCase()
  const m = message.toLowerCase()

  if (a === 'logged-in' || a === 'logged-out' || a === 'signup') return 'Access/Security'
  if (s === 'user role' || s === 'user name') return 'Access/Security'
  if (a === 'invited' && s === 'emailid') return 'Access/Security'

  if (['text', 'design', 'self help', 'task list'].includes(s)) {
    if (a === 'moved' && (m.includes('to ready') || m.includes('to production'))) {
      return 'Approvals/Publishing'
    }
    return 'Content'
  }

  if (s === 'userapitoken') return 'Integrations/API'
  if (s === 'extension') return 'Integrations/API'
  if (s === 'advancecustomization') return 'Configuration'
  if (s === 'audit logs downloaded') return 'Other'

  if (m.includes('tag')) return 'Tags/Metadata'
  if (m.includes('language') || m.includes('locale')) return 'Localization/Languages'

  if (m.includes('approv') || m.includes('reject') || m.includes('review')) {
    return 'Approvals/Publishing'
  }

  return 'Other'
}

// ─── Change Type Mapping ─────────────────────────────────────────────────────

function mapChangeType(action: string, message: string): ChangeType {
  const a = action.toLowerCase()
  const m = message.toLowerCase()

  switch (a) {
    case 'logged-in': return 'Login'
    case 'logged-out': return 'Logout'
    case 'created': return 'Created'
    case 'updated': return 'Updated'
    case 'deleted': return 'Deleted'
    case 'moved': {
      if (m.includes('to ready') || m.includes('to production')) return 'Published'
      if (m.includes('to draft')) return 'Unpublished'
      return 'Moved'
    }
    case 'invited': return 'Invited'
    case 'changed': return 'RoleChanged'
    case 'signup': return 'SignUp'
    case 'downloaded': return 'Downloaded'
    case 'generated': return 'Generated'
    case 'enabled': return 'Enabled'
    case 'disabled': return 'Disabled'
    case 'restored': return 'Restored'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: break
  }

  if (m.includes('approved')) return 'Approved'
  if (m.includes('rejected')) return 'Rejected'

  return 'Other'
}

// ─── Content Type Detection ──────────────────────────────────────────────────

function detectContentType(source: string, message: string): ContentType | undefined {
  const s = source.toLowerCase()
  const m = message.toLowerCase()

  if (s === 'self help') return 'Self Help'
  if (s === 'task list') return 'Task List'

  if (s === 'text' || s === 'design') {
    if (m.includes('tooltip')) return 'Tooltip'
    if (m.includes('beacon')) return 'Beacon'
    if (m.includes('smart tip') || m.includes('smarttip')) return 'Smart Tip'
    if (m.includes('launcher')) return 'Launcher'
    if (m.includes('pop-up') || m.includes('popup')) return 'Pop-up'
    if (m.includes('survey')) return 'Survey'
    if (m.includes('widget') || m.includes('segment')) return 'Widget'
    return 'Flow'
  }

  return undefined
}

// ─── Impact State ────────────────────────────────────────────────────────────

function detectImpactState(action: string, message: string): ImpactState {
  const m = message.toLowerCase()
  if (m.includes('to ready') || m.includes('to_state":"ready')) return 'Ready'
  if (m.includes('to draft') || m.includes('to_state":"draft')) return 'Draft'
  if (m.includes('to production') || m.includes('to_state":"production')) return 'Production'
  if (action.toLowerCase() === 'enabled') return 'Enabled'
  if (action.toLowerCase() === 'disabled') return 'Disabled'
  if (action.toLowerCase() === 'created') return 'Draft'
  return null
}

// ─── IP Address Extraction ───────────────────────────────────────────────────

const IP_PATTERN = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/

function extractIPAddress(raw: RawAuditLogEntry): string {
  const sourceIP = IP_PATTERN.exec(raw.Source)
  if (sourceIP) return sourceIP[1]

  const messageIP = IP_PATTERN.exec(raw.Message)
  if (messageIP) return messageIP[1]

  return ''
}

// ─── Object Extraction ───────────────────────────────────────────────────────

function extractObject(raw: RawAuditLogEntry, category: EventCategory): NormalizedObject {
  const obj: NormalizedObject = {}

  if (category === 'Content' || category === 'Approvals/Publishing') {
    obj.type = raw.Source
    obj.contentType = detectContentType(raw.Source, raw.Message + ' ' + (raw.ad2 || ''))

    if (raw.ad1 && raw.ad1 !== 'n/a') {
      obj.id = raw.ad1
    }

    const flowIdMatch = raw.Message.match(/Flow ids\s*:\s*\[([^\]]+)\]/)
      || (raw.ad2 && raw.ad2 !== 'n/a' ? raw.ad2.match(/Flow ids\s*:\s*\[([^\]]+)\]/) : null)
    if (flowIdMatch) {
      const ids = flowIdMatch[1].split(',').map(s => s.trim()).filter(Boolean)
      if (ids.length > 0 && !obj.id) {
        obj.id = ids[0]
      }
    }

    const segmentMatch = raw.Message.match(/Segment ids\s*:\s*\[([^\]]+)\]/)
      || (raw.ad2 && raw.ad2 !== 'n/a' ? raw.ad2.match(/Segment ids\s*:\s*\[([^\]]+)\]/) : null)
    if (segmentMatch && !obj.id) {
      const ids = segmentMatch[1].split(',').map(s => s.trim()).filter(Boolean)
      if (ids.length > 0) obj.id = ids[0]
    }

    obj.title = resolveContentTitle(raw, obj)
    obj.name = obj.title || (obj.id ? formatShortId(obj.id) : undefined)
  } else if (category === 'Access/Security') {
    if (raw.Action === 'Invited') {
      obj.type = 'User'
      if (raw.ad1 && raw.ad1 !== 'n/a') {
        obj.name = raw.ad1
        obj.id = raw.ad1
      }
    } else if (raw.Action === 'Changed' && raw.Source === 'User Role') {
      obj.type = 'User Role'
      const targetMatch = raw.Message.match(/User '([^']+)'/)
      if (targetMatch) obj.name = targetMatch[1]
      if (raw.ad1 && raw.ad1 !== 'n/a') obj.id = raw.ad1
    } else if (raw.Action === 'Updated' && raw.Source === 'User Name') {
      obj.type = 'User Profile'
      obj.name = raw.UserName.split('@')[0]
    } else {
      obj.type = 'Session'
    }
  } else if (category === 'Integrations/API') {
    obj.type = raw.Source
    if (raw.ad1 && raw.ad1 !== 'n/a') obj.name = raw.ad1
  } else if (category === 'Configuration') {
    obj.type = raw.Source
    obj.name = humanizeSourceLabel(raw.Source)
  } else {
    obj.type = raw.Source
    if (raw.Source === 'Audit logs downloaded') {
      obj.name = 'Audit Logs'
    }
  }

  return obj
}

function resolveContentTitle(raw: RawAuditLogEntry, obj: NormalizedObject): string | undefined {
  try {
    if (raw.Payload && raw.Payload !== 'n/a') {
      const parsed = JSON.parse(raw.Payload)
      if (parsed.title) return parsed.title
      if (parsed.name) return parsed.name
    }
  } catch { /* payload is not JSON, continue */ }

  if (raw.ad2 && raw.ad2 !== 'n/a') {
    try {
      const parsed = JSON.parse(raw.ad2)
      if (parsed.title) return parsed.title
      if (parsed.name) return parsed.name
    } catch { /* not JSON */ }
  }

  if (obj.contentType === 'Task List') return 'Task List'
  if (obj.contentType === 'Self Help') return 'Self Help Widget'
  return undefined
}

function formatShortId(id: string): string {
  if (id.length <= 12) return id
  return id.substring(0, 8) + '…'
}

function humanizeSourceLabel(source: string): string {
  return source
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
}

// ─── Maker-Checker Detection ─────────────────────────────────────────────────

function detectMakerChecker(raw: RawAuditLogEntry, actor: NormalizedActor): MakerCheckerInfo {
  const m = raw.Message.toLowerCase()
  const info: MakerCheckerInfo = {
    maker: actor,
    status: 'none',
  }

  const approvedByMatch = raw.Message.match(/approved\s+by\s+'?([^'"\n]+)'?/i)
  if (approvedByMatch) {
    info.checker = { id: '', name: approvedByMatch[1].trim() }
    info.status = 'approved'
    return info
  }

  const rejectedByMatch = raw.Message.match(/rejected\s+by\s+'?([^'"\n]+)'?/i)
  if (rejectedByMatch) {
    info.checker = { id: '', name: rejectedByMatch[1].trim() }
    info.status = 'rejected'
    return info
  }

  if (m.includes('pending approval') || m.includes('awaiting review')) {
    info.status = 'pending'
    return info
  }

  if (raw.Action.toLowerCase() === 'moved') {
    const actionedBy = raw.Message.match(/'([^']+@[^']+)'\s+(?:moved|initiated)/i)
    if (actionedBy && actionedBy[1] !== raw.UserName) {
      info.maker = { id: '', name: actionedBy[1] }
      info.checker = actor
      info.status = 'approved'
    }
  }

  try {
    if (raw.Payload && raw.Payload !== 'n/a') {
      const p = JSON.parse(raw.Payload)
      if (p.approver || p.checker || p.reviewer) {
        const checkerName = p.approver || p.checker || p.reviewer
        info.checker = { id: '', name: typeof checkerName === 'string' ? checkerName : checkerName.name || '' }
        info.status = p.status === 'rejected' ? 'rejected' : 'approved'
      }
    }
  } catch { /* payload is not JSON */ }

  return info
}

// ─── Notes Extraction ────────────────────────────────────────────────────────

function extractNotes(raw: RawAuditLogEntry, changeType: ChangeType): string {
  const reasonMatch = raw.Message.match(/reason:\s*['"]?([^'";\n]+)/i)
  if (reasonMatch) return reasonMatch[1].trim()

  const commentMatch = raw.Message.match(/comment:\s*['"]?([^'";\n]+)/i)
  if (commentMatch) return commentMatch[1].trim()

  try {
    if (raw.Payload && raw.Payload !== 'n/a') {
      const p = JSON.parse(raw.Payload)
      if (p.reason) return p.reason
      if (p.comment) return p.comment
      if (p.notes) return p.notes
    }
  } catch { /* not JSON */ }

  if (changeType === 'RoleChanged') {
    const fromTo = raw.Message.match(/from '([^']+)' to '([^']+)'/)
    if (fromTo) return `${fromTo[1]} → ${fromTo[2]}`
  }

  return ''
}

// ─── Human-Friendly Summary ──────────────────────────────────────────────────

function buildSummary(raw: RawAuditLogEntry, changeType: ChangeType, category: EventCategory, obj: NormalizedObject): string {
  const actor = raw.UserName.split('@')[0]
  const objectLabel = obj.title || obj.name || obj.contentType || obj.type || ''

  switch (changeType) {
    case 'Login':
      return `${actor} signed in`
    case 'Logout':
      return `${actor} signed out`
    case 'Created':
      if (category === 'Content') {
        return `${actor} created a new ${obj.contentType || obj.type || 'content item'}${objectLabel && objectLabel !== obj.contentType ? ` "${objectLabel}"` : ''}`
      }
      return `${actor} created ${objectLabel || 'an item'}`
    case 'Updated':
      if (category === 'Configuration') return `${actor} updated ${humanizeSourceLabel(obj.type || 'configuration')}`
      if (category === 'Integrations/API') return `${actor} updated ${obj.name || obj.type || 'integration settings'}`
      if (category === 'Access/Security') return `${actor} updated user profile`
      return `${actor} updated ${obj.contentType || obj.type || 'an item'}${objectLabel && objectLabel !== obj.contentType ? ` "${objectLabel}"` : ''}`
    case 'Published':
      return `${actor} moved ${obj.contentType || obj.type || 'content'} to Ready${objectLabel ? ` "${objectLabel}"` : ''}`
    case 'Unpublished':
      return `${actor} reverted ${obj.contentType || obj.type || 'content'} to Draft${objectLabel ? ` "${objectLabel}"` : ''}`
    case 'Moved':
      return `${actor} moved ${obj.contentType || obj.type || 'content'}${objectLabel ? ` "${objectLabel}"` : ''}`
    case 'Deleted':
      return `${actor} deleted ${obj.contentType || obj.type || 'an item'}${objectLabel ? ` "${objectLabel}"` : ''}`
    case 'Restored':
      return `${actor} restored ${obj.contentType || obj.type || 'an item'}${objectLabel ? ` "${objectLabel}"` : ''}`
    case 'Invited': {
      const invitee = obj.name || 'a user'
      const roleMatch = raw.Message.match(/role '([^']+)'/)
      return `${actor} invited ${invitee}${roleMatch ? ` as ${roleMatch[1]}` : ''}`
    }
    case 'RoleChanged': {
      const fromTo = raw.Message.match(/from '([^']+)' to '([^']+)'/)
      if (fromTo) return `${actor} changed role from ${fromTo[1]} to ${fromTo[2]} for ${obj.name || 'a user'}`
      return `${actor} changed a user role`
    }
    case 'SignUp': {
      const roleMatch = raw.Message.match(/role '([^']+)'/)
      return `${raw.UserName.split('@')[0]} signed up${roleMatch ? ` as ${roleMatch[1]}` : ''}`
    }
    case 'Downloaded':
      return `${actor} downloaded audit logs`
    case 'Generated':
      return `${actor} generated ${obj.type === 'UserApiToken' ? 'an API token' : obj.type || 'a resource'}`
    case 'Approved':
      return `${actor} approved ${objectLabel || 'an action'}`
    case 'Rejected':
      return `${actor} rejected ${objectLabel || 'an action'}`
    case 'Enabled':
      return `${actor} enabled ${objectLabel || 'a feature'}`
    case 'Disabled':
      return `${actor} disabled ${objectLabel || 'a feature'}`
    default: {
      if (raw.Message && raw.Message !== 'n/a' && raw.Message.length < 120) {
        return sanitizeSummary(raw.Message)
      }
      return `${actor} performed ${raw.Action || 'an action'} on ${obj.type || 'system'}`
    }
  }
}

function sanitizeSummary(msg: string): string {
  return msg
    .replace(/URL:\s*https?:\/\/\S+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim() || msg
}

// ─── Role Extraction ─────────────────────────────────────────────────────────

function extractActorRole(raw: RawAuditLogEntry): string | undefined {
  if (raw.Action === 'SignUp') {
    const m = raw.Message.match(/role '([^']+)'/)
    return m ? m[1] : undefined
  }
  if (raw.Action === 'Invited') {
    return undefined
  }
  return undefined
}

// ─── Main Normalizer ─────────────────────────────────────────────────────────

let idCounter = 0

export function normalizeEvent(raw: RawAuditLogEntry): NormalizedEvent {
  const category = mapCategory(raw.Action, raw.Source, raw.Message)
  const changeType = mapChangeType(raw.Action, raw.Message)
  const obj = extractObject(raw, category)
  const occurredAt = parseTimestamp(raw.Date, raw.Time)
  const impactState = detectImpactState(raw.Action, raw.Message + ' ' + (raw.ad2 || ''))
  const ipAddress = extractIPAddress(raw)
  const role = extractActorRole(raw)

  const jiraFromMessage = extractJiraReferences(raw.Message)
  const jiraFromAd2 = raw.ad2 !== 'n/a' ? extractJiraReferences(raw.ad2) : {}
  const why: NormalizedWhy = {
    ...jiraFromAd2,
    ...jiraFromMessage,
  }

  const actor: NormalizedActor = { id: raw.UserId, name: raw.UserName, role }
  const makerChecker = detectMakerChecker(raw, actor)
  const notes = extractNotes(raw, changeType)
  const summary = buildSummary(raw, changeType, category, obj)

  idCounter++

  return {
    id: `evt_${idCounter}_${occurredAt.epoch}`,
    category,
    changeType,
    actor,
    object: obj,
    occurredAt,
    why,
    summary,
    impactState,
    ipAddress,
    notes,
    makerChecker,
    raw,
  }
}

export function normalizeEvents(rawEvents: RawAuditLogEntry[]): NormalizedEvent[] {
  return rawEvents.map(normalizeEvent)
}
