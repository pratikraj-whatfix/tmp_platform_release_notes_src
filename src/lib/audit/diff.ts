import type { DiffLine, CompareResult, CompareMode, NormalizedEvent } from './types'

/**
 * Simple line-based diff for comparing two text blocks.
 * Uses a basic LCS approach suitable for MVP.
 */
export function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const result: DiffLine[] = []

  let i = 0
  let j = 0

  while (i < linesA.length && j < linesB.length) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: 'unchanged', content: linesA[i] })
      i++
      j++
    } else {
      const lookAheadB = linesB.indexOf(linesA[i], j)
      const lookAheadA = linesA.indexOf(linesB[j], i)

      if (lookAheadB !== -1 && (lookAheadA === -1 || lookAheadB - j <= lookAheadA - i)) {
        while (j < lookAheadB) {
          result.push({ type: 'added', content: linesB[j] })
          j++
        }
      } else if (lookAheadA !== -1) {
        while (i < lookAheadA) {
          result.push({ type: 'removed', content: linesA[i] })
          i++
        }
      } else {
        result.push({ type: 'removed', content: linesA[i] })
        result.push({ type: 'added', content: linesB[j] })
        i++
        j++
      }
    }
  }

  while (i < linesA.length) {
    result.push({ type: 'removed', content: linesA[i] })
    i++
  }
  while (j < linesB.length) {
    result.push({ type: 'added', content: linesB[j] })
    j++
  }

  return result
}

function detectCompareMode(eventA: NormalizedEvent, eventB: NormalizedEvent): CompareMode {
  const aIsContent = eventA.category === 'Content' || eventA.category === 'Approvals/Publishing'
  const bIsContent = eventB.category === 'Content' || eventB.category === 'Approvals/Publishing'

  if (aIsContent && bIsContent) {
    if (eventA.object.id && eventA.object.id === eventB.object.id) {
      return 'same-content-versions'
    }
    if (eventA.object.contentType && eventA.object.contentType === eventB.object.contentType) {
      return 'different-content-same-type'
    }
  }

  return 'generic'
}

function buildSnapshot(event: NormalizedEvent, mode: CompareMode): string {
  if (mode === 'same-content-versions') {
    return JSON.stringify({
      summary: event.summary,
      changeType: event.changeType,
      actor: event.actor.name,
      timestamp: event.occurredAt.utc,
      state: event.impactState,
      notes: event.notes || undefined,
      makerChecker: event.makerChecker.status !== 'none' ? {
        maker: event.makerChecker.maker.name,
        checker: event.makerChecker.checker?.name,
        status: event.makerChecker.status,
      } : undefined,
      message: event.raw.Message,
    }, null, 2)
  }

  if (mode === 'different-content-same-type') {
    return JSON.stringify({
      contentType: event.object.contentType,
      objectId: event.object.id,
      objectTitle: event.object.title || event.object.name,
      summary: event.summary,
      changeType: event.changeType,
      actor: event.actor.name,
      timestamp: event.occurredAt.utc,
      state: event.impactState,
      message: event.raw.Message,
    }, null, 2)
  }

  return JSON.stringify({
    summary: event.summary,
    category: event.category,
    changeType: event.changeType,
    object: event.object,
    actor: event.actor.name,
    timestamp: event.occurredAt.utc,
    impactState: event.impactState,
    notes: event.notes || undefined,
    message: event.raw.Message,
  }, null, 2)
}

export function compareEvents(eventA: NormalizedEvent, eventB: NormalizedEvent): CompareResult {
  const mode = detectCompareMode(eventA, eventB)

  const snapshotA = buildSnapshot(eventA, mode)
  const snapshotB = buildSnapshot(eventB, mode)

  return {
    labelA: `${eventA.summary} (${eventA.occurredAt.local})`,
    labelB: `${eventB.summary} (${eventB.occurredAt.local})`,
    mode,
    lines: computeDiff(snapshotA, snapshotB),
  }
}
