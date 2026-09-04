import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { raidCards } from '../content/raidCards'
import type { ScenarioActionCategory } from '../content/types'

const categories: { id: ScenarioActionCategory; label: string }[] = [
  { id: 'risk', label: 'Risk' },
  { id: 'assumption', label: 'Assumption' },
  { id: 'issue', label: 'Issue' },
  { id: 'dependency', label: 'Dependency' },
]

export function RaidTrainerView() {
  const [choices, setChoices] = useState<Record<string, ScenarioActionCategory>>({})

  const answeredCount = Object.keys(choices).length
  const correctCount = raidCards.filter((c) => choices[c.id] && c.correctCategory.includes(choices[c.id])).length

  return (
    <div>
      <PageHeader
        eyebrow="Standalone drill"
        title="RAID Trainer"
        description="Classify each card as a Risk, Assumption, Issue, or Dependency. Some are genuinely context-dependent, and the explanation says so rather than forcing false certainty."
        actions={
          <Link to="/scenarios" className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
            <ChevronLeft size={14} /> Scenario Lab
          </Link>
        }
      />
      <div className="p-4 sm:p-6">
        <p className="mb-4 text-sm text-[color:var(--text-muted)]">
          Score: {correctCount}/{answeredCount || 0} answered correctly {answeredCount === 0 && '— pick a category for each card below'}
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {raidCards.map((card) => {
            const chosen = choices[card.id]
            const isCorrect = chosen ? card.correctCategory.includes(chosen) : null
            return (
              <div key={card.id} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <p className="mb-3 text-sm">{card.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setChoices((prev) => ({ ...prev, [card.id]: cat.id }))}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        chosen === cat.id
                          ? isCorrect
                            ? 'border-domain-coordination bg-domain-coordination/10 text-domain-coordination'
                            : 'border-domain-security bg-domain-security/10 text-domain-security'
                          : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {chosen && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-[color:var(--text-muted)]">
                    {isCorrect ? <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-domain-coordination" /> : <XCircle size={13} className="mt-0.5 shrink-0 text-domain-security" />}
                    {card.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
