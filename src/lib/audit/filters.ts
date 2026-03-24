import type { NormalizedEvent, AuditFilterState } from './types'

export function applyFilters(events: NormalizedEvent[], filters: AuditFilterState): NormalizedEvent[] {
  return events.filter(evt => {
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start).getTime()
      const end = new Date(filters.dateRange.end + 'T23:59:59.999Z').getTime()
      if (evt.occurredAt.epoch < start || evt.occurredAt.epoch > end) return false
    }

    if (filters.categories.length > 0 && !filters.categories.includes(evt.category)) return false

    if (filters.changeTypes.length > 0 && !filters.changeTypes.includes(evt.changeType)) return false

    if (filters.userSearch) {
      const q = filters.userSearch.toLowerCase()
      if (!evt.actor.name.toLowerCase().includes(q) && !(evt.actor.role || '').toLowerCase().includes(q)) return false
    }

    if (filters.objectSearch) {
      const q = filters.objectSearch.toLowerCase()
      const matchName = evt.object.name?.toLowerCase().includes(q)
      const matchId = evt.object.id?.toLowerCase().includes(q)
      const matchType = evt.object.type?.toLowerCase().includes(q)
      const matchTitle = evt.object.title?.toLowerCase().includes(q)
      const matchSummary = evt.summary.toLowerCase().includes(q)
      if (!matchName && !matchId && !matchType && !matchTitle && !matchSummary) return false
    }

    if (filters.objectType) {
      const q = filters.objectType.toLowerCase()
      const type = (evt.object.type || '').toLowerCase()
      if (!type.includes(q)) return false
    }

    if (filters.contentTypes.length > 0) {
      if (!evt.object.contentType || !filters.contentTypes.includes(evt.object.contentType)) return false
    }

    if (filters.impactStates.length > 0) {
      if (!evt.impactState || !filters.impactStates.includes(evt.impactState)) return false
    }

    if (filters.hasWhyLink) {
      if (!evt.why.jiraKey && !evt.why.jiraUrl) return false
    }

    return true
  })
}

export function getDatePresetRange(preset: '7d' | '30d' | '90d'): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  switch (preset) {
    case '7d': start.setDate(end.getDate() - 7); break
    case '30d': start.setDate(end.getDate() - 30); break
    case '90d': start.setDate(end.getDate() - 90); break
  }
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}
