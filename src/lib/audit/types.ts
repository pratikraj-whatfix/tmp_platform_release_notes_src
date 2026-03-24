// ─── Raw CSV Schema ──────────────────────────────────────────────────────────

export interface RawAuditLogEntry {
  UserId: string
  UserName: string
  EntId: string
  EntName: string
  Action: string
  Message: string
  Source: string
  Date: string
  Time: string
  ad1: string
  ad2: string
  Payload: string
}

// ─── Enums ───────────────────────────────────────────────────────────────────

export type EventCategory =
  | 'Content'
  | 'Approvals/Publishing'
  | 'Configuration'
  | 'Access/Security'
  | 'Integrations/API'
  | 'Localization/Languages'
  | 'Tags/Metadata'
  | 'Other'

export type ChangeType =
  | 'Created'
  | 'Updated'
  | 'Published'
  | 'Unpublished'
  | 'Deleted'
  | 'Restored'
  | 'Enabled'
  | 'Disabled'
  | 'Login'
  | 'Logout'
  | 'Moved'
  | 'Invited'
  | 'RoleChanged'
  | 'SignUp'
  | 'Downloaded'
  | 'Generated'
  | 'Approved'
  | 'Rejected'
  | 'Other'

export type ContentType =
  | 'Flow'
  | 'Tooltip'
  | 'Beacon'
  | 'Task List'
  | 'Self Help'
  | 'Smart Tip'
  | 'Launcher'
  | 'Pop-up'
  | 'Survey'
  | 'Widget'
  | 'Unknown'

export type ImpactState =
  | 'Draft'
  | 'Ready'
  | 'Production'
  | 'Enabled'
  | 'Disabled'
  | null

// ─── Normalized Event ────────────────────────────────────────────────────────

export interface NormalizedActor {
  id: string
  name: string
  role?: string
}

export interface NormalizedObject {
  id?: string
  name?: string
  type?: string
  contentType?: ContentType
  title?: string
}

export interface NormalizedTimestamp {
  utc: string
  local: string
  epoch: number
}

export interface NormalizedWhy {
  jiraUrl?: string
  jiraKey?: string
  reason?: string
}

export interface MakerCheckerInfo {
  maker: NormalizedActor
  checker?: NormalizedActor
  status: 'pending' | 'approved' | 'rejected' | 'none'
  checkedAt?: NormalizedTimestamp
}

export interface NormalizedEvent {
  id: string
  category: EventCategory
  changeType: ChangeType
  actor: NormalizedActor
  object: NormalizedObject
  occurredAt: NormalizedTimestamp
  why: NormalizedWhy
  summary: string
  impactState: ImpactState
  ipAddress: string
  notes: string
  makerChecker: MakerCheckerInfo
  raw: RawAuditLogEntry
}

// ─── Version History (content only) ──────────────────────────────────────────

export interface VersionHistoryEntry {
  version: number
  timestamp: NormalizedTimestamp
  actor: NormalizedActor
  changeType: ChangeType
  summary: string
  state: ImpactState
  eventId: string
}

// ─── Filter State ────────────────────────────────────────────────────────────

export interface DateRange {
  start: string
  end: string
}

export interface AuditFilterState {
  dateRange: DateRange | null
  datePreset: '7d' | '30d' | '90d' | 'custom' | null
  categories: EventCategory[]
  changeTypes: ChangeType[]
  userSearch: string
  objectSearch: string
  objectType: string
  contentTypes: ContentType[]
  impactStates: ImpactState[]
  hasWhyLink: boolean
}

export const EMPTY_FILTERS: AuditFilterState = {
  dateRange: null,
  datePreset: null,
  categories: [],
  changeTypes: [],
  userSearch: '',
  objectSearch: '',
  objectType: '',
  contentTypes: [],
  impactStates: [],
  hasWhyLink: false,
}

// ─── Compare ─────────────────────────────────────────────────────────────────

export type CompareMode = 'same-content-versions' | 'different-content-same-type' | 'generic'

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
}

export interface CompareResult {
  labelA: string
  labelB: string
  mode: CompareMode
  lines: DiffLine[]
}
