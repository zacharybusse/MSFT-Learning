import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { SourceBadge } from '../components/common/SourceBadge'
import { questions } from '../content/questions'
import { conceptById } from '../content/concepts'
import type { Domain, Question } from '../content/types'
import { useStore } from '../state/store'
import { seededShuffle, isDueForReview, type QuestionStat } from '../lib/scoring'

const domainOptions: { id: Domain | 'all' | 'due'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'due', label: 'Due for review' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'm365', label: 'Microsoft 365' },
  { id: 'identity', label: 'Identity' },
  { id: 'endpoint', label: 'Endpoint' },
  { id: 'security', label: 'Security' },
  { id: 'migration', label: 'Migration' },
  { id: 'licensing', label: 'Licensing' },
  { id: 'coordination', label: 'Coordination' },
]

function questionDomain(q: Question): Domain | null {
  const c = q.conceptIds[0] ? conceptById.get(q.conceptIds[0]) : null
  return c?.domain ?? null
}

function OrderingQuestion({ question, onAnswer }: { question: Question; onAnswer: (correct: boolean) => void }) {
  const choices = question.choices ?? []
  const correctOrder = question.answer as string[]
  const [chosen, setChosen] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const remaining = choices.filter((c) => !chosen.includes(c))

  return (
    <div>
      <p className="mb-3 text-sm text-[color:var(--text-muted)]">Click items in the correct order.</p>
      <div className="mb-3 flex min-h-[44px] flex-wrap gap-2 rounded-md border border-dashed border-[color:var(--border-strong)] p-2">
        {chosen.length === 0 && <span className="text-xs text-[color:var(--text-faint)]">Your sequence appears here</span>}
        {chosen.map((c, i) => (
          <span key={c} className="rounded-full bg-[color:var(--accent)]/12 px-2.5 py-1 text-xs font-medium text-[color:var(--accent-strong)]">
            {i + 1}. {c}
          </span>
        ))}
      </div>
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((c) => (
            <button key={c} type="button" onClick={() => setChosen((prev) => [...prev, c])} className="rounded-full border border-[color:var(--border)] px-2.5 py-1 text-xs hover:border-[color:var(--accent)]">
              {c}
            </button>
          ))}
        </div>
      )}
      {!submitted ? (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setChosen([])} className="text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
            Clear
          </button>
          <button
            type="button"
            disabled={chosen.length !== choices.length}
            onClick={() => {
              setSubmitted(true)
              onAnswer(JSON.stringify(chosen) === JSON.stringify(correctOrder))
            }}
            className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
          >
            Check order
          </button>
        </div>
      ) : (
        <p className={`mt-3 text-sm font-medium ${JSON.stringify(chosen) === JSON.stringify(correctOrder) ? 'text-domain-coordination' : 'text-domain-security'}`}>
          Correct order: {correctOrder.join(' → ')}
        </p>
      )}
    </div>
  )
}

function ChoiceQuestion({ question, onAnswer }: { question: Question; onAnswer: (correct: boolean) => void }) {
  const choices = useMemo(() => seededShuffle(question.choices ?? [], question.id), [question])
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <div className="space-y-2" role="radiogroup" aria-label="Answer choices">
        {choices.map((c) => {
          const isCorrect = c === question.answer
          const showState = submitted && (c === selected || isCorrect)
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={selected === c}
              disabled={submitted}
              onClick={() => setSelected(c)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-domain-coordination bg-domain-coordination/10'
                    : c === selected
                      ? 'border-domain-security bg-domain-security/10'
                      : 'border-[color:var(--border)]'
                  : selected === c
                    ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/8'
                    : 'border-[color:var(--border)] hover:border-[color:var(--border-strong)]'
              }`}
            >
              <span>{c}</span>
              {showState && (isCorrect ? <CheckCircle2 size={16} className="text-domain-coordination" /> : <XCircle size={16} className="text-domain-security" />)}
            </button>
          )
        })}
      </div>
      {!submitted ? (
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            setSubmitted(true)
            onAnswer(selected === question.answer)
          }}
          className="mt-3 rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
        >
          Check answer
        </button>
      ) : null}
    </div>
  )
}

function FillInQuestion({ question, onAnswer }: { question: Question; onAnswer: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const correct = value.trim().toLowerCase() === (question.answer as string).toLowerCase()

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submitted}
        placeholder="Type your answer"
        className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm outline-none focus-visible:border-[color:var(--accent)]"
      />
      {!submitted ? (
        <button
          type="button"
          disabled={!value.trim()}
          onClick={() => {
            setSubmitted(true)
            onAnswer(correct)
          }}
          className="mt-3 rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <p className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${correct ? 'text-domain-coordination' : 'text-domain-security'}`}>
          {correct ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
          {correct ? 'Correct.' : `Expected: ${question.answer as string}`}
        </p>
      )}
    </div>
  )
}

export function RetrievalDrillsView() {
  const [filter, setFilter] = useState<Domain | 'all' | 'due'>('all')
  const quizStats = useStore((s) => s.quizStats)
  const recordAnswer = useStore((s) => s.recordAnswer)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Record<string, boolean>>({})

  const pool = useMemo(() => {
    let list = questions
    if (filter === 'due') {
      const now = Date.now()
      list = questions.filter((q) => isDueForReview(quizStats[q.id] ?? ({ attempts: 0, correct: 0, lastSeen: null, box: 'new' } as QuestionStat), now))
    } else if (filter !== 'all') {
      list = questions.filter((q) => questionDomain(q) === filter)
    }
    return seededShuffle(list, `drill-${filter}`)
  }, [filter, quizStats])

  const current = pool[index % pool.length]
  const stat = current ? quizStats[current.id] : undefined
  const sessionCorrect = Object.values(answered).filter(Boolean).length
  const sessionTotal = Object.keys(answered).length

  if (!current) {
    return (
      <div className="p-6">
        <PageHeader title="Retrieval Drills" description="No questions match this filter yet." />
      </div>
    )
  }

  const handleAnswer = (correct: boolean) => {
    recordAnswer(current.id, correct)
    setAnswered((prev) => ({ ...prev, [current.id]: correct }))
  }

  return (
    <div>
      <PageHeader
        eyebrow={`${questions.length} questions in the bank`}
        title="Retrieval Drills"
        description="Multiple choice, matching, ordering, fill-in, placement, PM judgment, RAID classification, dependency, and current/target questions."
      />
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {domainOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setFilter(d.id)
                setIndex(0)
              }}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                filter === d.id ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between text-xs text-[color:var(--text-faint)]">
            <span>
              Question {(index % pool.length) + 1} of {pool.length}
              {stat && stat.attempts > 0 ? ` · box: ${stat.box} · seen ${stat.attempts}×` : ''}
            </span>
            <span>
              Session: {sessionCorrect}/{sessionTotal}
            </span>
          </div>

          <div key={current.id} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 sm:p-5">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">{current.type.replace(/-/g, ' ')}</p>
            <p className="mb-4 text-base font-medium text-[color:var(--text)]">{current.prompt}</p>

            {current.type === 'ordering' ? (
              <OrderingQuestion question={current} onAnswer={handleAnswer} />
            ) : current.type === 'fill-in' ? (
              <FillInQuestion question={current} onAnswer={handleAnswer} />
            ) : (
              <ChoiceQuestion question={current} onAnswer={handleAnswer} />
            )}

            {answered[current.id] !== undefined && (
              <div className="mt-4 rounded-md bg-[color:var(--bg-sunken)] p-3 text-sm">
                <p className="text-[color:var(--text)]">{current.explanation}</p>
                <div className="mt-2">
                  <SourceBadge sourceIds={current.sourceIds} compact />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)] px-4 py-1.5 text-xs font-semibold text-white"
            >
              Next <ArrowRight size={14} />
            </button>
            {sessionTotal > 0 && (
              <button
                type="button"
                onClick={() => setAnswered({})}
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)]"
              >
                <RotateCcw size={13} /> Reset session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
