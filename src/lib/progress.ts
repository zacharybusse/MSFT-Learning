import { questions } from '../content/questions'
import { conceptById } from '../content/concepts'
import type { Domain } from '../content/types'
import type { QuestionStat } from './scoring'
import { accuracy } from './scoring'

export function questionDomain(questionId: string): Domain | null {
  const q = questions.find((x) => x.id === questionId)
  const c = q?.conceptIds[0] ? conceptById.get(q.conceptIds[0]) : null
  return c?.domain ?? null
}

export type DomainMastery = { domain: Domain; attempted: number; total: number; correct: number; accuracyPct: number }

export function domainMasteryBreakdown(quizStats: Record<string, QuestionStat>): DomainMastery[] {
  const domains: Domain[] = ['foundation', 'cloud', 'm365', 'identity', 'endpoint', 'security', 'migration', 'licensing', 'coordination']
  return domains.map((domain) => {
    const domainQuestions = questions.filter((q) => {
      const c = q.conceptIds[0] ? conceptById.get(q.conceptIds[0]) : null
      return c?.domain === domain
    })
    const attemptedStats = domainQuestions.map((q) => quizStats[q.id]).filter((s): s is QuestionStat => Boolean(s) && s.attempts > 0)
    const correct = attemptedStats.reduce((sum, s) => sum + s.correct, 0)
    const attempts = attemptedStats.reduce((sum, s) => sum + s.attempts, 0)
    return {
      domain,
      attempted: attemptedStats.length,
      total: domainQuestions.length,
      correct,
      accuracyPct: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    }
  })
}

// Consecutive-day streak counted only from genuinely recorded local activity
// (studyDaysActive), ending today or yesterday. Never fabricated.
export function computeStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0
  const set = new Set(activeDates)
  const today = new Date()
  const cursor = new Date(today)
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!set.has(cursor.toISOString().slice(0, 10))) return 0
  }
  let streak = 0
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export type WeakItem = { questionId: string; prompt: string; accuracyPct: number; box: string }

export function weakQuestions(quizStats: Record<string, QuestionStat>, limit = 8): WeakItem[] {
  return Object.entries(quizStats)
    .filter(([, stat]) => stat.attempts > 0 && (accuracy(stat) < 0.6 || stat.box === 'learning'))
    .map(([id, stat]) => {
      const q = questions.find((x) => x.id === id)
      return { questionId: id, prompt: q?.prompt ?? id, accuracyPct: Math.round(accuracy(stat) * 100), box: stat.box }
    })
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, limit)
}
