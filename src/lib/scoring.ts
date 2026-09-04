// Deterministic scoring/classification utilities — no AI, no fabricated
// precision. A simple adaptive review queue based on wrong answers and
// elapsed time, and explicit checklist-based mastery, not a fake IQ score.

export type ReviewBox = 'new' | 'learning' | 'review' | 'strong'

export type QuestionStat = {
  attempts: number
  correct: number
  lastSeen: number | null
  box: ReviewBox
  confidence?: 1 | 2 | 3
}

export function nextBox(current: ReviewBox, wasCorrect: boolean): ReviewBox {
  if (!wasCorrect) return 'learning'
  switch (current) {
    case 'new':
      return 'learning'
    case 'learning':
      return 'review'
    case 'review':
      return 'strong'
    case 'strong':
      return 'strong'
  }
}

const BOX_INTERVAL_MS: Record<ReviewBox, number> = {
  new: 0,
  learning: 1000 * 60 * 60 * 6, // 6 hours
  review: 1000 * 60 * 60 * 24 * 2, // 2 days
  strong: 1000 * 60 * 60 * 24 * 7, // 7 days
}

export function isDueForReview(stat: QuestionStat, now: number): boolean {
  if (stat.attempts === 0) return true
  if (stat.lastSeen === null) return true
  return now - stat.lastSeen >= BOX_INTERVAL_MS[stat.box]
}

export function accuracy(stat: QuestionStat): number {
  if (stat.attempts === 0) return 0
  return stat.correct / stat.attempts
}

export type MasteryBand = 'not-started' | 'developing' | 'solid' | 'strong'

// Explicit band thresholds tied to completed rubric items — never a
// meaningless single "readiness percentage."
export function masteryBand(completed: number, total: number): MasteryBand {
  if (total === 0 || completed === 0) return 'not-started'
  const ratio = completed / total
  if (ratio >= 1) return 'strong'
  if (ratio >= 0.6) return 'solid'
  return 'developing'
}

export function masteryLabel(band: MasteryBand): string {
  switch (band) {
    case 'not-started':
      return 'Not started'
    case 'developing':
      return 'Developing'
    case 'solid':
      return 'Solid'
    case 'strong':
      return 'Strong'
  }
}

// Small deterministic string hash → seeded PRNG, so a given seed always
// produces the same shuffle order (keeps drills testable/reproducible).
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  const rand = () => {
    h = (Math.imul(1103515245, h) + 12345) | 0
    return ((h >>> 0) % 100000) / 100000
  }
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
