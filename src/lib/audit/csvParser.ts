import type { RawAuditLogEntry, NormalizedEvent } from './types'
import { normalizeEvents } from './normalizeEvent'
import { FULL_AUDIT_DATA } from './auditData'

/**
 * Parses audit log CSV text into raw entries.
 * Handles quoted fields containing commas and newlines.
 */
export function parseAuditCSV(csvText: string): RawAuditLogEntry[] {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []

  const results: RawAuditLogEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const fields = parseCSVLine(line)
    if (fields.length < 12) continue

    results.push({
      UserId: fields[0],
      UserName: fields[1],
      EntId: fields[2],
      EntName: fields[3],
      Action: fields[4],
      Message: fields[5],
      Source: fields[6],
      Date: fields[7],
      Time: fields[8],
      ad1: fields[9],
      ad2: fields[10],
      Payload: fields[11] || 'n/a',
    })
  }

  return results
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
  }
  fields.push(current.trim())
  return fields
}

// ─── Mock API Adapter ────────────────────────────────────────────────────────

export interface AuditLogAPIOptions {
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface AuditLogAPIResponse {
  events: NormalizedEvent[]
  total: number
  page: number
  pageSize: number
}

/**
 * Simulates an API call. Replace the body with a real fetch() in production.
 */
export async function fetchAuditLogs(_options?: AuditLogAPIOptions): Promise<AuditLogAPIResponse> {
  await new Promise(r => setTimeout(r, 300))
  const events = normalizeEvents(FULL_AUDIT_DATA)
  return {
    events,
    total: events.length,
    page: 1,
    pageSize: events.length,
  }
}

/**
 * Stub for fetching a content snapshot for comparison.
 * In production this would call a versioned content API.
 */
export async function fetchContentSnapshot(_contentId: string, _version?: number): Promise<Record<string, unknown>> {
  await new Promise(r => setTimeout(r, 200))
  return {
    id: _contentId,
    version: _version || 1,
    title: `Content ${_contentId.substring(0, 8)}`,
    steps: [
      { stepNumber: 1, text: 'Navigate to the page', selector: '#main-nav' },
      { stepNumber: 2, text: 'Click the button', selector: '.cta-btn' },
      { stepNumber: 3, text: 'Fill in the form', selector: '#form-input' },
    ],
    metadata: { createdAt: new Date().toISOString(), author: 'system' },
  }
}
