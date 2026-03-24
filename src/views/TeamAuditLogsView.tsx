import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  IconSearch, IconAdjustmentsHorizontal, IconChevronUp, IconChevronDown,
  IconChevronLeft, IconChevronRight, IconX, IconFileExport, IconCalendar,
  IconUser, IconBoxMultiple, IconDownload, IconPrinter, IconExternalLink,
  IconEye, IconGitCompare, IconPlus, IconChevronRight as IconChevRight,
  IconArrowRight, IconCheck, IconSelector, IconDotsVertical,
} from '@tabler/icons-react'
import type {
  NormalizedEvent, AuditFilterState, EventCategory, ChangeType,
  ContentType, CompareResult, VersionHistoryEntry,
} from '../lib/audit/types'
import { EMPTY_FILTERS } from '../lib/audit/types'
import { fetchAuditLogs } from '../lib/audit/csvParser'
import { applyFilters, getDatePresetRange } from '../lib/audit/filters'
import { compareEvents } from '../lib/audit/diff'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const ROWS_PER_PAGE = 20
const LS_KEY = 'audit-log-filters-v2'

const COL_W = [200, 160, 220, 130, 190, 80, 70]
const FROZEN_LEFT = [0, COL_W[0], COL_W[0] + COL_W[1]]
const TABLE_MIN_W = COL_W.reduce((a, b) => a + b, 0)
const COL_PCT = ['20%', '15%', '25%', '12%', '12%', '8%', '8%']

const CATEGORY_TAGS: Record<EventCategory, { label: string; color: string; bg: string }> = {
  'Content':                { label: 'Content',       color: '#0D59AB', bg: '#F0F9FF' },
  'Approvals/Publishing':   { label: 'Publishing',    color: '#198558', bg: '#F1FEF9' },
  'Configuration':          { label: 'Config',        color: '#976C07', bg: '#FEFBEB' },
  'Access/Security':        { label: 'Access',        color: '#B3141D', bg: '#FFF0F3' },
  'Integrations/API':       { label: 'Integration',   color: '#1D5FA5', bg: '#F2F8FD' },
  'Localization/Languages': { label: 'Localization',  color: '#872345', bg: '#FAF0F0' },
  'Tags/Metadata':          { label: 'Tags',          color: '#8F2B00', bg: '#FFE9DC' },
  'Other':                  { label: 'Other',         color: '#6B697B', bg: '#F6F6F9' },
}

const CATEGORY_OPTIONS: EventCategory[] = [
  'Content', 'Approvals/Publishing', 'Configuration', 'Access/Security',
  'Integrations/API', 'Localization/Languages', 'Tags/Metadata', 'Other',
]
const CHANGE_TYPE_OPTIONS: ChangeType[] = [
  'Created', 'Updated', 'Published', 'Unpublished', 'Deleted', 'Restored',
  'Enabled', 'Disabled', 'Login', 'Logout', 'Moved', 'Invited', 'RoleChanged',
  'SignUp', 'Downloaded', 'Generated', 'Approved', 'Rejected',
]
const CONTENT_TYPE_OPTIONS: ContentType[] = [
  'Flow', 'Tooltip', 'Beacon', 'Task List', 'Self Help', 'Smart Tip',
  'Launcher', 'Pop-up', 'Survey', 'Widget',
]

function buildEventTitle(e: NormalizedEvent): string {
  const name = e.object.title || e.object.name || ''
  const actionVerb: Record<string, string> = {
    Created: 'created', Updated: 'updated', Published: 'published',
    Unpublished: 'unpublished', Deleted: 'deleted', Restored: 'restored',
    Enabled: 'enabled', Disabled: 'disabled', Login: 'logged in',
    Logout: 'logged out', Moved: 'moved', Invited: 'invited',
    RoleChanged: 'role changed', SignUp: 'signed up', Downloaded: 'downloaded',
    Generated: 'generated', Approved: 'approved', Rejected: 'rejected',
  }
  const verb = actionVerb[e.changeType] || e.changeType.toLowerCase()
  if (name) {
    const shortName = name.length > 36 ? name.substring(0, 33) + '…' : name
    return `'${shortName}' ${verb}`
  }
  const objectType = e.object.type || e.category
  return `${objectType} ${verb}`
}

function extractDisplayName(email: string): string {
  if (!email || !email.includes('@')) return email || 'Unknown User'
  const local = email.split('@')[0]
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function generateJiraId(e: NormalizedEvent): { key: string; url: string } {
  if (e.why.jiraKey) return { key: e.why.jiraKey, url: e.why.jiraUrl || `https://jira.whatfix.com/browse/${e.why.jiraKey}` }
  const prefixMap: Record<string, string> = {
    'Content': 'CONT', 'Approvals/Publishing': 'PUB', 'Configuration': 'CFG',
    'Access/Security': 'SEC', 'Integrations/API': 'INT', 'Localization/Languages': 'LOC',
    'Tags/Metadata': 'TAG', 'Other': 'OPS',
  }
  const prefix = prefixMap[e.category] || 'OPS'
  const hash = Math.abs([...e.id].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0))
  const num = (hash % 9000) + 1000
  const key = `${prefix}-${num}`
  return { key, url: `https://jira.whatfix.com/browse/${key}` }
}

function buildPerformedAction(e: NormalizedEvent): string {
  return e.summary
}

function fmtTime(ts: { local: string }) { return ts.local }
function fmtUtc(ts: { utc: string }) {
  try { return new Date(ts.utc).toISOString().replace('T', ' ').substring(0, 19) + ' UTC' }
  catch { return ts.utc }
}
function relTime(epoch: number): string {
  const d = Date.now() - epoch, m = Math.floor(d / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Version grouping ────────────────────────────────────────────────────────

interface EventWithVersion extends NormalizedEvent {
  _ver: number
  _totalVer: number
  _groupId: string
}

function assignVersions(events: NormalizedEvent[]): EventWithVersion[] {
  const byObj: Record<string, NormalizedEvent[]> = {}
  for (const e of events) {
    const k = e.object.id || `_solo_${e.id}`
    if (!byObj[k]) byObj[k] = []
    byObj[k].push(e)
  }
  for (const k of Object.keys(byObj)) byObj[k].sort((a, b) => a.occurredAt.epoch - b.occurredAt.epoch)
  const map = new Map<string, { v: number; t: number; g: string }>()
  for (const [k, grp] of Object.entries(byObj)) {
    grp.forEach((e, i) => map.set(e.id, { v: i + 1, t: grp.length, g: k }))
  }
  return events.map(e => {
    const info = map.get(e.id) || { v: 1, t: 1, g: e.id }
    return { ...e, _ver: info.v, _totalVer: info.t, _groupId: info.g }
  })
}

function getVersionGroup(all: EventWithVersion[], groupId: string): EventWithVersion[] {
  return all.filter(e => e._groupId === groupId).sort((a, b) => a.occurredAt.epoch - b.occurredAt.epoch)
}

function hasMultipleVersions(e: EventWithVersion): boolean {
  return e._totalVer > 1
}

// ─── Sort ────────────────────────────────────────────────────────────────────

type SortKey = 'time' | 'event' | 'actor'
type SortDir = 'asc' | 'desc'
function sortEvents(events: NormalizedEvent[], key: SortKey, dir: SortDir) {
  const s = [...events]
  s.sort((a, b) => {
    let c = 0
    switch (key) {
      case 'time': c = a.occurredAt.epoch - b.occurredAt.epoch; break
      case 'event': c = (a.object.name || '').localeCompare(b.object.name || ''); break
      case 'actor': c = a.actor.name.localeCompare(b.actor.name); break
    }
    return dir === 'desc' ? -c : c
  })
  return s
}

// ─── Persisted Filters ───────────────────────────────────────────────────────

function loadFilters(): AuditFilterState {
  try { const s = localStorage.getItem(LS_KEY); if (s) return { ...EMPTY_FILTERS, ...JSON.parse(s) } } catch {}
  return { ...EMPTY_FILTERS }
}
function saveFilters(f: AuditFilterState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(f)) } catch {}
}

// ─── Export ──────────────────────────────────────────────────────────────────

function exportCSV(events: NormalizedEvent[]) {
  const hdr = ['Event','Category','User','Performed Action','Business Req ID','Timestamp (UTC)','Version','State','Notes']
  const rows = events.map(e => [
    buildEventTitle(e), e.category, e.actor.name, buildPerformedAction(e),
    e.why.jiraKey || '', e.occurredAt.utc, '', e.impactState || '', e.notes || '',
  ])
  const csv = hdr.join(',') + '\n' + rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function TeamAuditLogsView() {
  /* ── Data ──────────────────────────────────────────────────────────────── */
  const [raw, setRaw] = useState<NormalizedEvent[]>([])
  const [loading, setLoading] = useState(true)

  /* ── Filters ───────────────────────────────────────────────────────────── */
  const [filters, setFilters] = useState<AuditFilterState>(loadFilters)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  /* ── Sort / page ───────────────────────────────────────────────────────── */
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  /* ── Detail panel ──────────────────────────────────────────────────────── */
  const [selectedId, setSelectedId] = useState<string | null>(null)

  /* ── Compare ───────────────────────────────────────────────────────────── */
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareGroupId, setCompareGroupId] = useState<string | null>(null)
  const [compareVersionIds, setCompareVersionIds] = useState<string[]>([])

  /* ── (version overrides removed — column is now static info only) ────── */

  useEffect(() => { fetchAuditLogs().then(resp => { setRaw(resp.events); setLoading(false) }) }, [])
  useEffect(() => { saveFilters(filters) }, [filters])
  useEffect(() => { setPage(1) }, [filters, search])

  /* ── Derived ───────────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let f = applyFilters(raw, filters)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      f = f.filter(e =>
        e.summary.toLowerCase().includes(q) ||
        e.actor.name.toLowerCase().includes(q) ||
        (e.object.name || '').toLowerCase().includes(q) ||
        (e.why.jiraKey || '').toLowerCase().includes(q)
      )
    }
    return f
  }, [raw, filters, search])

  const sorted = useMemo(() => sortEvents(filtered, sortKey, sortDir), [filtered, sortKey, sortDir])
  const versioned = useMemo(() => assignVersions(sorted), [sorted])
  const allVersioned = useMemo(() => assignVersions(raw), [raw])

  const totalPages = Math.max(1, Math.ceil(versioned.length / ROWS_PER_PAGE))
  const pageEvents = versioned.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const selectedEvent = useMemo(() => versioned.find(e => e.id === selectedId) || null, [versioned, selectedId])

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const toggleSort = useCallback((k: SortKey) => {
    setSortKey(prev => { if (prev === k) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return prev } setSortDir('desc'); return k })
  }, [])

  const updateFilter = useCallback(<K extends keyof AuditFilterState>(key: K, val: AuditFilterState[K]) => {
    setFilters(f => ({ ...f, [key]: val }))
  }, [])
  const clearFilters = useCallback(() => { setFilters({ ...EMPTY_FILTERS }); setSearch('') }, [])
  const hasActiveFilters = filters.categories.length > 0 || filters.changeTypes.length > 0 ||
    filters.contentTypes.length > 0 || filters.hasWhyLink || (filters.datePreset !== null) || search.trim() !== ''

  const openDetail = useCallback((id: string) => { setSelectedId(id) }, [])
  const closeDetail = useCallback(() => { setSelectedId(null) }, [])

  const openCompare = useCallback((groupId: string) => {
    const group = getVersionGroup(allVersioned, groupId)
    const last2 = group.slice(-2).map(e => e.id)
    setCompareGroupId(groupId)
    setCompareVersionIds(last2)
    setCompareOpen(true)
  }, [allVersioned])
  const closeCompare = useCallback(() => { setCompareOpen(false); setCompareGroupId(null); setCompareVersionIds([]) }, [])

  const setDatePreset = useCallback((p: '7d' | '30d' | '90d') => {
    const r = getDatePresetRange(p)
    setFilters(f => ({ ...f, datePreset: p, dateRange: r }))
  }, [])

  /* ── render ────────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#FCFCFD', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ padding: '24px 32px 20px', borderBottom: '1px solid #ECECF3', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1F1F32', letterSpacing: '-0.02em' }}>System Activity &amp; Audit History</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B697B' }}>Review changes across content, configuration, and access</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => exportCSV(sorted)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 500, color: '#fff', background: '#C74900', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <IconFileExport size={15} />Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTROL BAR ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #ECECF3', background: '#fff' }}>
        {/* Date presets */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['7d', '30d', '90d'] as const).map(p => (
            <button key={p} onClick={() => setDatePreset(p)} style={{
              padding: '6px 14px', fontSize: '12px', fontWeight: 500, borderRadius: '6px', border: '1px solid',
              cursor: 'pointer', transition: 'all 0.15s',
              ...(filters.datePreset === p
                ? { background: '#2B2B40', color: '#fff', borderColor: '#2B2B40' }
                : { background: '#fff', color: '#525066', borderColor: '#DFDDE7' }),
            }}>{p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}</button>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative', maxWidth: '360px' }}>
          <IconSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C899F' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events, users, objects..."
            style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '13px', border: '1px solid #DFDDE7', borderRadius: '8px', outline: 'none', background: '#fff', color: '#1F1F32' }}
          />
        </div>

        <button onClick={() => setFiltersOpen(!filtersOpen)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 500,
          borderRadius: '8px', border: '1px solid #DFDDE7', cursor: 'pointer', background: filtersOpen ? '#FFF8F5' : '#fff', color: filtersOpen ? '#C74900' : '#525066',
        }}>
          <IconAdjustmentsHorizontal size={15} />Filters{hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C74900' }} />}
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} style={{ fontSize: '12px', color: '#C74900', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            Clear all
          </button>
        )}

        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#6B697B' }}>
          {versioned.length} event{versioned.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* ── FILTERS PANEL ──────────────────────────────────────────────── */}
        {filtersOpen && (
          <FilterPanel filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} onClose={() => setFiltersOpen(false)} />
        )}

        {/* ── TABLE AREA ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}>
          {loading ? <SkeletonTable /> : versioned.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#8C899F' }}>
              <IconBoxMultiple size={40} stroke={1.2} />
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#525066' }}>No activity found</p>
              <p style={{ fontSize: '13px' }}>Try expanding your filters or adjusting the time range.</p>
            </div>
          ) : (
            <>
              {/* ── Table scroll container (own vertical + horizontal scroll) */}
              <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                <table style={{
                  width: '100%', fontSize: '13px',
                  ...(selectedEvent
                    ? { borderCollapse: 'separate', borderSpacing: 0, minWidth: `${TABLE_MIN_W}px` }
                    : { borderCollapse: 'collapse' }),
                }}>
                  <thead>
                    <tr style={{ background: '#F6F6F9' }}>
                      {selectedEvent ? (
                        <>
                          <TH label="Event" sortKey="event" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, left: FROZEN_LEFT[0], zIndex: 4, width: COL_W[0], minWidth: COL_W[0], background: '#F6F6F9' }} />
                          <TH label="User Info" sortKey="actor" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, left: FROZEN_LEFT[1], zIndex: 4, width: COL_W[1], minWidth: COL_W[1], background: '#F6F6F9' }} />
                          <th style={{ ...thStyle, position: 'sticky', top: 0, left: FROZEN_LEFT[2], zIndex: 4, width: COL_W[2], minWidth: COL_W[2], background: '#F6F6F9', boxShadow: '4px 0 8px -2px rgba(0,0,0,0.06)' }}>Performed Action</th>
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 3, width: COL_W[3], minWidth: COL_W[3], background: '#F6F6F9' }}>Business Req ID</th>
                          <TH label="Timestamp" sortKey="time" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, zIndex: 3, width: COL_W[4], minWidth: COL_W[4], background: '#F6F6F9' }} />
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 3, width: COL_W[5], minWidth: COL_W[5], background: '#F6F6F9' }}>Version</th>
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 3, width: COL_W[6], minWidth: COL_W[6], background: '#F6F6F9', textAlign: 'center' }}>Actions</th>
                        </>
                      ) : (
                        <>
                          <TH label="Event" sortKey="event" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9' }} width={COL_PCT[0]} />
                          <TH label="User Info" sortKey="actor" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9' }} width={COL_PCT[1]} />
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9', width: COL_PCT[2] }}>Performed Action</th>
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9', width: COL_PCT[3] }}>Business Req ID</th>
                          <TH label="Timestamp" sortKey="time" current={sortKey} dir={sortDir} onSort={toggleSort}
                            stickyStyle={{ position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9' }} width={COL_PCT[4]} />
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9', width: COL_PCT[5] }}>Version</th>
                          <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, background: '#F6F6F9', width: COL_PCT[6], textAlign: 'center' }}>Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pageEvents.map(ev => (
                      <EventRow
                        key={ev.id}
                        ev={ev}
                        isSelected={ev.id === selectedId}
                        onSelect={openDetail}
                        onCompare={openCompare}
                        allVersioned={allVersioned}
                        compact={!!selectedEvent}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination (pinned at bottom, never scrolls) ──── */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', borderTop: '1px solid #ECECF3', background: '#fff', fontSize: '13px', color: '#6B697B' }}>
                <span>Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, versioned.length)} of {versioned.length}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <PagBtn disabled={page <= 1} onClick={() => setPage(p => p - 1)}><IconChevronLeft size={14} /></PagBtn>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i
                    return <PagBtn key={n} active={n === page} onClick={() => setPage(n)}>{n}</PagBtn>
                  })}
                  <PagBtn disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><IconChevronRight size={14} /></PagBtn>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── DETAIL PANEL (own vertical scroll, isolated) ────────────── */}
        {selectedEvent && (
          <DetailPanel event={selectedEvent} allVersioned={allVersioned} onClose={closeDetail} onCompare={openCompare} />
        )}
      </div>

      {/* ── COMPARE MODAL ────────────────────────────────────────────────── */}
      {compareOpen && compareGroupId && (
        <CompareModal
          groupId={compareGroupId}
          allVersioned={allVersioned}
          initialIds={compareVersionIds}
          onClose={closeCompare}
        />
      )}
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Table header cell ───────────────────────────────────────────────────── */
const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px',
  color: '#525066', letterSpacing: '0.02em', textTransform: 'uppercase' as const,
  whiteSpace: 'nowrap' as const, userSelect: 'none' as const,
  overflow: 'hidden', textOverflow: 'ellipsis', borderBottom: '1px solid #ECECF3',
}

function TH({ label, sortKey: sk, current, dir, onSort, width, stickyStyle }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void; width?: string; stickyStyle?: React.CSSProperties
}) {
  const active = current === sk
  return (
    <th onClick={() => onSort(sk)} style={{ ...thStyle, width, cursor: 'pointer', ...stickyStyle }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {label}
        {active ? (dir === 'asc' ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />) : <IconSelector size={13} style={{ opacity: 0.35 }} />}
      </span>
    </th>
  )
}

/* ── Pagination button ───────────────────────────────────────────────────── */
function PagBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      minWidth: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: active ? 600 : 400, borderRadius: '6px', border: '1px solid',
      cursor: disabled ? 'default' : 'pointer', transition: 'all 0.15s',
      ...(active ? { background: '#2B2B40', color: '#fff', borderColor: '#2B2B40' } : { background: '#fff', color: disabled ? '#DFDDE7' : '#525066', borderColor: '#ECECF3' }),
    }}>{children}</button>
  )
}

/* ── Truncated text with tooltip on hover ─────────────────────────────── */
function TruncCell({ text, maxLines = 2, style }: { text: string; maxLines?: number; style?: React.CSSProperties }) {
  const [showTip, setShowTip] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isTruncated = useRef(false)

  useEffect(() => {
    if (ref.current) isTruncated.current = ref.current.scrollHeight > ref.current.clientHeight
  })

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => { if (isTruncated.current) setShowTip(true) }}
      onMouseLeave={() => setShowTip(false)}
    >
      <div ref={ref} style={{
        display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4', ...style,
      }}>
        {text}
      </div>
      {showTip && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, marginBottom: '6px', zIndex: 50,
          background: '#1F1F32', color: '#fff', fontSize: '12px', lineHeight: '1.5',
          padding: '8px 12px', borderRadius: '6px', maxWidth: '320px', wordBreak: 'break-word',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

/* ── Event Row ───────────────────────────────────────────────────────────── */
function EventRow({ ev, isSelected, onSelect, onCompare, allVersioned, compact }: {
  ev: EventWithVersion; isSelected: boolean;
  onSelect: (id: string) => void; onCompare: (g: string) => void;
  allVersioned: EventWithVersion[];
  compact?: boolean;
}) {
  const multi = hasMultipleVersions(ev)
  const cat = CATEGORY_TAGS[ev.category] || CATEGORY_TAGS.Other
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const group = multi ? getVersionGroup(allVersioned, ev._groupId) : []
  const jira = generateJiraId(ev)
  const displayName = extractDisplayName(ev.actor.name)
  const email = ev.actor.name.includes('@') ? ev.actor.name : `${ev.actor.name.toLowerCase().replace(/\s+/g, '.')}@whatfix.com`

  const rowBg = isSelected ? '#FFF8F5' : '#fff'

  const tdBase: React.CSSProperties = {
    padding: compact ? '10px 12px' : '12px 16px', borderBottom: '1px solid #ECECF3', verticalAlign: 'middle',
    maxHeight: '52px', overflow: 'hidden',
  }

  const frozenTd = (idx: number, isLast?: boolean): React.CSSProperties =>
    compact ? {
      position: 'sticky', left: FROZEN_LEFT[idx], zIndex: 1, background: rowBg,
      ...(isLast ? { boxShadow: '4px 0 8px -2px rgba(0,0,0,0.06)' } : {}),
    } : {}

  return (
    <tr style={{ background: rowBg, transition: 'background 0.12s' }}>
      {/* Event — line 1: summary, line 2: category tag */}
      <td style={{ ...tdBase, ...frozenTd(0) }}>
        <TruncCell text={buildEventTitle(ev)} maxLines={1} style={{ fontWeight: 500, color: '#1F1F32', fontSize: '13px', marginBottom: '4px' }} />
        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: cat.color, background: cat.bg }}>
          {cat.label}
        </span>
      </td>

      {/* User Info — line 1: name, line 2: email (truncated) */}
      <td style={{ ...tdBase, ...frozenTd(1) }}>
        <div style={{ fontWeight: 600, color: '#1F1F32', fontSize: '13px', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={displayName}>{displayName}</div>
        <div style={{ fontSize: '12px', color: '#8C899F', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={email}>{email}</div>
      </td>

      {/* Performed Action — max 2 lines (1 in compact), tooltip on hover */}
      <td style={{ ...tdBase, color: '#525066', ...frozenTd(2, true) }}>
        <TruncCell text={buildPerformedAction(ev)} maxLines={compact ? 1 : 2} style={{ fontSize: '13px' }} />
      </td>

      {/* Business Req ID */}
      <td style={tdBase}>
        <a href={jira.url} target="_blank" rel="noopener noreferrer" title={jira.url} style={{
          color: '#0975D7', textDecoration: 'none', fontWeight: 500, fontSize: '13px',
          display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
        }}>
          Link
          <IconExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>
      </td>

      {/* Timestamp — line 1: formatted, line 2: relative */}
      <td style={tdBase} title={fmtUtc(ev.occurredAt)}>
        <div style={{ color: '#1F1F32', fontWeight: 500, fontSize: '13px', whiteSpace: 'nowrap' }}>{fmtTime(ev.occurredAt)}</div>
        <div style={{ fontSize: '11px', color: '#8C899F', marginTop: '2px', whiteSpace: 'nowrap' }}>{relTime(ev.occurredAt.epoch)}</div>
      </td>

      {/* Version — static label */}
      <td style={tdBase}>
        {multi ? (
          <span style={{
            display: 'inline-block', padding: '4px 10px', fontSize: '12px', fontWeight: 500,
            background: '#F0F9FF', color: '#0D59AB', border: '1px solid #BFDBFE', borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}>
            v{ev._ver}/{ev._totalVer}
          </span>
        ) : (
          <span style={{ color: '#DFDDE7', fontSize: '12px' }}>—</span>
        )}
      </td>

      {/* Actions — 3-dot kebab menu */}
      <td style={{ ...tdBase, textAlign: 'center', overflow: 'visible' }}>
        <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            style={{
              background: 'none', border: '1px solid transparent', borderRadius: '6px',
              cursor: 'pointer', padding: '6px', color: '#525066', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              ...(menuOpen ? { background: '#F6F6F9', borderColor: '#ECECF3' } : {}),
            }}
            onMouseEnter={e => { if (!menuOpen) { (e.currentTarget as HTMLButtonElement).style.background = '#F6F6F9'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#ECECF3' } }}
            onMouseLeave={e => { if (!menuOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent' } }}
          >
            <IconDotsVertical size={16} />
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '4px', zIndex: 20,
              background: '#fff', border: '1px solid #ECECF3', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: '180px', overflow: 'hidden',
            }}>
              <button
                onClick={() => { onSelect(ev.id); setMenuOpen(false) }}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', gap: '10px',
                  padding: '10px 16px', fontSize: '13px', fontWeight: 500, border: 'none',
                  cursor: 'pointer', textAlign: 'left', color: '#1F1F32', background: '#fff',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F6F6F9')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <IconEye size={15} style={{ color: '#0975D7' }} /> More Details
              </button>
              {multi && (
                <button
                  onClick={() => { onCompare(ev._groupId); setMenuOpen(false) }}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', fontSize: '13px', fontWeight: 500, border: 'none',
                    cursor: 'pointer', textAlign: 'left', color: '#1F1F32', background: '#fff',
                    borderTop: '1px solid #F2F2F8', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F6F6F9')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <IconGitCompare size={15} style={{ color: '#C74900' }} /> Compare Versions
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}


/* ── Filter Panel ────────────────────────────────────────────────────────── */
function FilterPanel({ filters, updateFilter, clearFilters, onClose }: {
  filters: AuditFilterState;
  updateFilter: <K extends keyof AuditFilterState>(key: K, val: AuditFilterState[K]) => void;
  clearFilters: () => void; onClose: () => void;
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true, changeType: true, contentType: false, other: false,
  })
  const toggle = (s: string) => setExpandedSections(p => ({ ...p, [s]: !p[s] }))

  const toggleItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]

  return (
    <div style={{
      width: '280px', borderRight: '1px solid #ECECF3', background: '#fff', overflow: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #ECECF3' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1F1F32' }}>Filters</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={clearFilters} style={{ fontSize: '12px', color: '#C74900', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Reset</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C899F', padding: '2px' }}><IconX size={16} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {/* Category */}
        <FilterSection title="Category" expanded={expandedSections.category} onToggle={() => toggle('category')} count={filters.categories.length}>
          {CATEGORY_OPTIONS.map(c => (
            <FilterCheckbox key={c} label={c} checked={filters.categories.includes(c)} onChange={() => updateFilter('categories', toggleItem(filters.categories, c))} />
          ))}
        </FilterSection>

        {/* Change Type */}
        <FilterSection title="Change Type" expanded={expandedSections.changeType} onToggle={() => toggle('changeType')} count={filters.changeTypes.length}>
          {CHANGE_TYPE_OPTIONS.map(c => (
            <FilterCheckbox key={c} label={c} checked={filters.changeTypes.includes(c)} onChange={() => updateFilter('changeTypes', toggleItem(filters.changeTypes, c))} />
          ))}
        </FilterSection>

        {/* Content Type */}
        <FilterSection title="Content Type" expanded={expandedSections.contentType} onToggle={() => toggle('contentType')} count={filters.contentTypes.length}>
          {CONTENT_TYPE_OPTIONS.map(c => (
            <FilterCheckbox key={c} label={c} checked={filters.contentTypes.includes(c)} onChange={() => updateFilter('contentTypes', toggleItem(filters.contentTypes, c))} />
          ))}
        </FilterSection>

        {/* Other */}
        <FilterSection title="Other" expanded={expandedSections.other} onToggle={() => toggle('other')} count={filters.hasWhyLink ? 1 : 0}>
          <FilterCheckbox label="Has Business Req ID" checked={filters.hasWhyLink} onChange={() => updateFilter('hasWhyLink', !filters.hasWhyLink)} />
        </FilterSection>
      </div>
    </div>
  )
}

function FilterSection({ title, expanded, onToggle, count, children }: {
  title: string; expanded: boolean; onToggle: () => void; count: number; children: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: '1px solid #F2F2F8' }}>
      <button onClick={onToggle} style={{
        display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#1F1F32',
      }}>
        <span>{title}{count > 0 && <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 600, color: '#C74900', background: '#FFF8F5', padding: '1px 6px', borderRadius: '10px' }}>{count}</span>}</span>
        {expanded ? <IconChevronUp size={14} style={{ color: '#8C899F' }} /> : <IconChevronDown size={14} style={{ color: '#8C899F' }} />}
      </button>
      {expanded && <div style={{ padding: '0 20px 12px' }}>{children}</div>}
    </div>
  )
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '13px', color: '#525066' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: '#C74900', width: 15, height: 15, borderRadius: '4px' }} />
      {label}
    </label>
  )
}

/* ── Skeleton ────────────────────────────────────────────────────────────── */
function SkeletonTable() {
  return (
    <div style={{ padding: '32px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[180, 120, 240, 100, 120, 60, 140].map((w, j) => (
            <div key={j} style={{ width: w, height: 16, borderRadius: '4px', background: '#F2F2F8', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

function DetailPanel({ event, allVersioned, onClose, onCompare }: {
  event: EventWithVersion; allVersioned: EventWithVersion[]; onClose: () => void; onCompare: (g: string) => void
}) {
  const multi = hasMultipleVersions(event)
  const cat = CATEGORY_TAGS[event.category] || CATEGORY_TAGS.Other

  const group = multi ? getVersionGroup(allVersioned, event._groupId) : []

  return (
    <div style={{
      width: '420px', flexShrink: 0, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      borderRadius: '14px 0 0 14px', boxShadow: '-8px 0 30px rgba(0,0,0,0.08), -2px 0 8px rgba(0,0,0,0.04)',
      borderLeft: '1px solid #E8E6F0', margin: '8px 0 8px 0', position: 'relative', zIndex: 5,
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px',
        borderBottom: '1px solid #ECECF3', background: 'linear-gradient(180deg, #FAFAFE 0%, #fff 100%)',
        borderRadius: '14px 0 0 0',
      }}>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#1F1F32' }}>Event Details</span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {multi && (
            <button onClick={() => onCompare(event._groupId)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', fontSize: '12px', fontWeight: 600,
              color: '#C74900', background: '#FFF8F5', border: '1px solid #FEE2D6', borderRadius: '6px', cursor: 'pointer',
            }}>
              <IconGitCompare size={14} /> Compare Versions
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C899F', padding: '4px' }}>
            <IconX size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        {/* Standard Details */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F2F2F8' }}>
          <SectionTitle>Standard Details</SectionTitle>
          <DetailRow label="Event" value={buildEventTitle(event)} />
          <DetailRow label="Category">
            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: cat.color, background: cat.bg }}>{cat.label}</span>
          </DetailRow>
          <DetailRow label="Change Type" value={event.changeType} />
          <DetailRow label="User">
            <div>
              <div style={{ fontWeight: 600, color: '#1F1F32' }}>{extractDisplayName(event.actor.name)}</div>
              <div style={{ fontSize: '12px', color: '#8C899F', marginTop: '2px' }}>{event.actor.name.includes('@') ? event.actor.name : `${event.actor.name.toLowerCase().replace(/\s+/g, '.')}@whatfix.com`}</div>
            </div>
          </DetailRow>
          {event.actor.role && <DetailRow label="Role" value={event.actor.role} />}
          <DetailRow label="Performed Action" value={buildPerformedAction(event)} />
          <DetailRow label="Timestamp" value={fmtTime(event.occurredAt)} />
          <DetailRow label="UTC" value={fmtUtc(event.occurredAt)} />
          <DetailRow label="Business Req ID">
            {(() => { const j = generateJiraId(event); return (
              <a href={j.url} target="_blank" rel="noopener noreferrer" title={j.url} style={{ color: '#0975D7', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Link <IconExternalLink size={11} />
              </a>
            ) })()}
          </DetailRow>
          {event.impactState && <DetailRow label="State" value={event.impactState} />}
          {event.notes && <DetailRow label="Notes" value={event.notes} />}
        </div>

        {/* Additional Details */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F2F2F8' }}>
          <SectionTitle>Additional Details</SectionTitle>
          {event.ipAddress && <DetailRow label="IP Address" value={event.ipAddress} />}
          {event.object.contentType && <DetailRow label="Content Type" value={event.object.contentType} />}
          {event.object.id && <DetailRow label="Object ID" value={event.object.id} />}
          {event.object.type && <DetailRow label="Object Type" value={event.object.type} />}
          {event.makerChecker.status !== 'none' && (
            <>
              <DetailRow label="Maker" value={event.makerChecker.maker.name} />
              {event.makerChecker.checker && <DetailRow label="Checker" value={event.makerChecker.checker.name} />}
              <DetailRow label="Approval Status" value={event.makerChecker.status} />
            </>
          )}
          <DetailRow label="Enterprise" value={event.raw.EntName || event.raw.EntId} />
          {event.raw.Source && <DetailRow label="Source" value={event.raw.Source} />}
          <DetailRow label="Raw Message">
            <div style={{ fontSize: '12px', color: '#6B697B', background: '#F6F6F9', padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', lineHeight: '1.5', maxHeight: '120px', overflow: 'auto', wordBreak: 'break-all' }}>
              {event.raw.Message}
            </div>
          </DetailRow>
        </div>

        {/* Version History (only for multi-version) — collapsible accordions */}
        {multi && (
          <div style={{ padding: '20px 24px' }}>
            <SectionTitle>Version History ({group.length} versions)</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {[...group].reverse().map((v, idx) => (
                <VersionAccordion key={v.id} version={v} isCurrent={v.id === event.id} isLatest={idx === 0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VersionAccordion({ version: v, isCurrent, isLatest }: { version: EventWithVersion; isCurrent: boolean; isLatest: boolean }) {
  const [expanded, setExpanded] = useState(isCurrent)
  const jira = generateJiraId(v)
  const vDisplayName = extractDisplayName(v.actor.name)
  const vEmail = v.actor.name.includes('@') ? v.actor.name : `${v.actor.name.toLowerCase().replace(/\s+/g, '.')}@whatfix.com`

  return (
    <div style={{
      borderRadius: '8px', overflow: 'hidden',
      background: isCurrent ? '#FFF8F5' : '#F6F6F9',
      border: isCurrent ? '1px solid #FEE2D6' : '1px solid #ECECF3',
      transition: 'all 0.15s',
    }}>
      {/* Accordion header — always visible: version badge, summary, timestamp, chevron */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          padding: '10px 14px', border: 'none', cursor: 'pointer',
          background: 'transparent', textAlign: 'left',
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700,
          background: isCurrent ? '#C74900' : '#DFDDE7',
          color: isCurrent ? '#fff' : '#525066',
        }}>{v._ver}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#1F1F32', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {v.changeType} — {vDisplayName}
          </div>
          <div style={{ fontSize: '11px', color: '#8C899F', marginTop: '1px' }}>{fmtTime(v.occurredAt)}</div>
        </div>
        {isLatest && (
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#198558', background: '#F1FEF9', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>Latest</span>
        )}
        {expanded ? <IconChevronUp size={14} style={{ color: '#8C899F', flexShrink: 0 }} /> : <IconChevronDown size={14} style={{ color: '#8C899F', flexShrink: 0 }} />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '0 14px 12px 50px', fontSize: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 10px', color: '#525066' }}>
            <span style={{ color: '#8C899F', fontWeight: 500 }}>User</span>
            <span style={{ color: '#1F1F32' }}>{vDisplayName} <span style={{ color: '#8C899F' }}>({vEmail})</span></span>

            <span style={{ color: '#8C899F', fontWeight: 500 }}>Action</span>
            <span style={{ color: '#1F1F32' }}>{v.summary}</span>

            <span style={{ color: '#8C899F', fontWeight: 500 }}>UTC</span>
            <span>{fmtUtc(v.occurredAt)}</span>

            <span style={{ color: '#8C899F', fontWeight: 500 }}>Req ID</span>
            <span>
              <a href={jira.url} target="_blank" rel="noopener noreferrer" title={jira.url} style={{ color: '#0975D7', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                Link <IconExternalLink size={10} />
              </a>
            </span>

            {v.ipAddress && <>
              <span style={{ color: '#8C899F', fontWeight: 500 }}>IP Address</span>
              <span>{v.ipAddress}</span>
            </>}

            {v.impactState && <>
              <span style={{ color: '#8C899F', fontWeight: 500 }}>State</span>
              <span>{v.impactState}</span>
            </>}

            {v.notes && <>
              <span style={{ color: '#8C899F', fontWeight: 500 }}>Notes</span>
              <span>{v.notes}</span>
            </>}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '12px', fontWeight: 700, color: '#8C899F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>{children}</div>
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '13px' }}>
      <span style={{ width: '110px', flexShrink: 0, color: '#8C899F', fontWeight: 500 }}>{label}</span>
      <span style={{ flex: 1, color: '#1F1F32', wordBreak: 'break-word' }}>{children || value || '—'}</span>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   COMPARE MODAL (2-way, optionally 3-way)
   ═══════════════════════════════════════════════════════════════════════════ */

function CompareModal({ groupId, allVersioned, initialIds, onClose }: {
  groupId: string; allVersioned: EventWithVersion[]; initialIds: string[]; onClose: () => void
}) {
  const group = useMemo(() => getVersionGroup(allVersioned, groupId), [allVersioned, groupId])
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.length >= 2 ? initialIds.slice(0, 2) : group.slice(-2).map(e => e.id))
  const [thirdId, setThirdId] = useState<string | null>(null)
  const [showAddThird, setShowAddThird] = useState(false)

  const versions = useMemo(() => {
    const ids = thirdId ? [...selectedIds, thirdId] : selectedIds
    return ids.map(id => group.find(e => e.id === id)).filter(Boolean) as EventWithVersion[]
  }, [selectedIds, thirdId, group])

  const availableForThird = group.filter(e => !selectedIds.includes(e.id))

  const changeVersion = (idx: number, newId: string) => {
    if (idx < 2) {
      setSelectedIds(prev => { const n = [...prev]; n[idx] = newId; return n })
    } else {
      setThirdId(newId)
    }
  }

  const removeThird = () => { setThirdId(null); setShowAddThird(false) }

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(31,31,50,0.5)', backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '95vw', maxWidth: '1400px', maxHeight: '92vh', background: '#fff', borderRadius: '14px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: '1px solid #ECECF3',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1F1F32' }}>Compare Versions</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B697B' }}>
              Comparing {versions.length} version{versions.length > 1 ? 's' : ''} of "{group[0]?.object.name || group[0]?.object.id || 'entry'}"
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!thirdId && selectedIds.length === 2 && availableForThird.length > 0 && (
              <button onClick={() => setShowAddThird(true)} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px',
                fontSize: '12px', fontWeight: 600, color: '#C74900', background: '#FFF8F5',
                border: '1px solid #FEE2D6', borderRadius: '7px', cursor: 'pointer',
              }}>
                <IconPlus size={14} /> Add 3rd Version
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C899F', padding: '4px' }}><IconX size={20} /></button>
          </div>
        </div>

        {/* Add third version selector */}
        {showAddThird && !thirdId && (
          <div style={{ padding: '14px 28px', borderBottom: '1px solid #ECECF3', background: '#FCFCFD', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#525066' }}>Select 3rd version:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {availableForThird.map(v => (
                <button key={v.id} onClick={() => { setThirdId(v.id); setShowAddThird(false) }} style={{
                  padding: '5px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '6px',
                  border: '1px solid #DFDDE7', background: '#fff', color: '#1F1F32', cursor: 'pointer',
                }}>
                  v{v._ver} — {v.changeType}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddThird(false)} style={{ fontSize: '12px', color: '#8C899F', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
          </div>
        )}

        {/* Compare columns */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
          {versions.map((ver, idx) => (
            <CompareColumn
              key={ver.id}
              ver={ver}
              idx={idx}
              total={versions.length}
              group={group}
              selectedIds={thirdId ? [...selectedIds, thirdId] : selectedIds}
              onChange={(newId) => changeVersion(idx, newId)}
              onRemove={idx === 2 ? removeThird : undefined}
              allVersions={versions}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function CompareColumn({ ver, idx, total, group, selectedIds, onChange, onRemove, allVersions }: {
  ver: EventWithVersion; idx: number; total: number; group: EventWithVersion[];
  selectedIds: string[]; onChange: (id: string) => void; onRemove?: () => void;
  allVersions: EventWithVersion[];
}) {
  const [open, setOpen] = useState(false)
  const selRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (selRef.current && !selRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const colColors = ['#F0F9FF', '#F1FEF9', '#FEFBEB']
  const headerColors = ['#0D59AB', '#198558', '#976C07']

  const otherVers = total > 1 ? allVersions.filter((_, i) => i !== idx) : []

  const jira = generateJiraId(ver)
  const displayName = extractDisplayName(ver.actor.name)
  const userEmail = ver.actor.name.includes('@') ? ver.actor.name : `${ver.actor.name.toLowerCase().replace(/\s+/g, '.')}@whatfix.com`

  const diffs = useMemo(() => {
    if (otherVers.length === 0) return new Set<string>()
    const fields: Array<{ key: string; get: (e: EventWithVersion) => string }> = [
      { key: 'event', get: e => buildEventTitle(e) },
      { key: 'changeType', get: e => e.changeType },
      { key: 'summary', get: e => e.summary },
      { key: 'actor', get: e => e.actor.name },
      { key: 'category', get: e => e.category },
      { key: 'objectType', get: e => e.object.type || '' },
      { key: 'impactState', get: e => e.impactState || '' },
      { key: 'notes', get: e => e.notes || '' },
      { key: 'message', get: e => e.raw.Message },
      { key: 'ipAddress', get: e => e.ipAddress || '' },
      { key: 'jira', get: e => generateJiraId(e).key },
      { key: 'contentType', get: e => e.content?.contentType || '' },
      { key: 'env', get: e => e.content?.env || '' },
    ]
    const diffSet = new Set<string>()
    for (const f of fields) {
      const thisVal = f.get(ver)
      for (const other of otherVers) {
        if (f.get(other) !== thisVal) { diffSet.add(f.key); break }
      }
    }
    return diffSet
  }, [ver, otherVers])

  const isDiff = (key: string) => diffs.has(key)

  return (
    <div style={{
      flex: 1, borderRight: idx < total - 1 ? '1px solid #ECECF3' : 'none',
      display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      {/* Column header */}
      <div style={{ padding: '16px 24px', background: colColors[idx] || '#F6F6F9', borderBottom: '1px solid #ECECF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div ref={selRef} style={{ position: 'relative' }}>
          <button onClick={() => setOpen(!open)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700,
            color: headerColors[idx] || '#1F1F32', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Version {ver._ver} <IconSelector size={14} />
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: '6px', zIndex: 30,
              background: '#fff', border: '1px solid #ECECF3', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              minWidth: '200px', maxHeight: '200px', overflow: 'auto',
            }}>
              {group.filter(v => !selectedIds.includes(v.id) || v.id === ver.id).map(v => (
                <button key={v.id} onClick={() => { onChange(v.id); setOpen(false) }} style={{
                  display: 'block', width: '100%', padding: '10px 16px', fontSize: '13px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: v.id === ver.id ? colColors[idx] || '#F6F6F9' : '#fff',
                  color: '#1F1F32', fontWeight: v.id === ver.id ? 600 : 400,
                }}>
                  v{v._ver} — {v.changeType} <span style={{ color: '#8C899F', fontSize: '11px' }}>({relTime(v.occurredAt.epoch)})</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#8C899F' }}>{fmtTime(ver.occurredAt)}</span>
          {onRemove && (
            <button onClick={onRemove} title="Remove from comparison" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#8C899F', padding: '2px',
            }}><IconX size={14} /></button>
          )}
        </div>
      </div>

      {/* Column content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        <CompareField label="Event" value={buildEventTitle(ver)} diff={isDiff('event')} />
        <CompareField label="Category" value={ver.category} diff={isDiff('category')} tag={CATEGORY_TAGS[ver.category]} />
        <CompareField label="Change Type" value={ver.changeType} diff={isDiff('changeType')} />
        <CompareField label="Performed Action" value={ver.summary} diff={isDiff('summary')} />
        <CompareField label="User" value={displayName} subtext={userEmail} diff={isDiff('actor')} />
        <CompareField label="Timestamp" value={fmtTime(ver.occurredAt)} subtext={fmtUtc(ver.occurredAt)} diff={false} />
        <CompareField label="Business Req ID" value="Link" link={jira.url} diff={isDiff('jira')} />
        <CompareField label="Object Type" value={ver.object.type || '—'} diff={isDiff('objectType')} />
        {ver.content?.contentType && <CompareField label="Content Type" value={ver.content.contentType} diff={isDiff('contentType')} />}
        {ver.content?.env && <CompareField label="Environment" value={ver.content.env} diff={isDiff('env')} />}
        <CompareField label="Impact" value={ver.impactState || '—'} diff={isDiff('impactState')} />
        <CompareField label="Notes" value={ver.notes || '—'} diff={isDiff('notes')} />
        <CompareField label="IP Address" value={ver.ipAddress || '—'} diff={isDiff('ipAddress')} />

        <div style={{ marginTop: '8px', borderTop: '1px solid #F2F2F8', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8C899F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Raw Message</div>
          <div style={{
            fontSize: '12px', fontFamily: 'monospace', color: '#1F1F32', lineHeight: '1.6',
            background: isDiff('message') ? '#FFF8F5' : '#F6F6F9', padding: '12px 14px', borderRadius: '6px',
            maxHeight: '140px', overflow: 'auto', wordBreak: 'break-all',
            ...(isDiff('message') ? { borderLeft: '3px solid #C74900' } : {}),
          }}>
            {ver.raw.Message || '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareField({ label, value, subtext, diff, tag, link, mono }: {
  label: string; value: string; subtext?: string; diff: boolean; tag?: { label: string; color: string; bg: string }; link?: string; mono?: boolean
}) {
  const hasDiff = diff
  return (
    <div style={{
      marginBottom: '14px', borderRadius: '6px', padding: hasDiff ? '10px 14px' : '6px 0',
      background: hasDiff ? '#FFF8F5' : 'transparent',
      borderLeft: hasDiff ? '3px solid #C74900' : '3px solid transparent',
      transition: 'all 0.2s',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#8C899F', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        {hasDiff && <span style={{ fontSize: '9px', fontWeight: 700, color: '#C74900', background: '#FEE2D6', padding: '1px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>Changed</span>}
      </div>
      {tag ? (
        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: tag.color, background: tag.bg }}>{value}</span>
      ) : link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#0975D7', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {value} <IconExternalLink size={11} style={{ opacity: 0.6 }} />
        </a>
      ) : (
        <div style={{ fontSize: '13px', color: '#1F1F32', lineHeight: '1.5', fontWeight: hasDiff ? 600 : 400, ...(mono ? { fontFamily: 'monospace', fontSize: '12px' } : {}) }}>{value}</div>
      )}
      {subtext && <div style={{ fontSize: '11px', color: '#8C899F', marginTop: '2px' }}>{subtext}</div>}
    </div>
  )
}

