import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { SourceBadge } from '../components/common/SourceBadge'
import { MasteryPill } from '../components/common/MasteryPill'
import { scenarioById } from '../content/scenarios'
import type { ScenarioActionCategory } from '../content/types'
import { useStore } from '../state/store'
import { masteryBand } from '../lib/scoring'

const categories: { id: ScenarioActionCategory; label: string }[] = [
  { id: 'risk', label: 'Risk' },
  { id: 'assumption', label: 'Assumption' },
  { id: 'issue', label: 'Issue' },
  { id: 'dependency', label: 'Dependency' },
  { id: 'decision', label: 'Decision' },
  { id: 'action', label: 'Action' },
]

export function ScenarioDetailView() {
  const { scenarioId } = useParams()
  const scenario = scenarioId ? scenarioById.get(scenarioId) : null
  const progress = useStore((s) => (scenarioId ? s.scenarioProgress[scenarioId] : undefined))
  const setScenarioCategory = useStore((s) => s.setScenarioCategory)
  const toggleScenarioRubric = useStore((s) => s.toggleScenarioRubric)
  const resetScenario = useStore((s) => s.resetScenario)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [showAAR, setShowAAR] = useState(false)

  if (!scenario) return <p className="p-6 text-sm text-[color:var(--text-muted)]">Scenario not found.</p>

  const categorized = progress?.categorized ?? {}
  const rubricChecked = progress?.rubricChecked ?? []
  const band = masteryBand(rubricChecked.length, scenario.rubricItems.length)

  return (
    <div>
      <PageHeader
        eyebrow="Simulation — not real customer data"
        title={scenario.title}
        description={scenario.brief}
        actions={
          <div className="flex items-center gap-2">
            <MasteryPill band={band} />
            <Link to="/scenarios" className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
              <ChevronLeft size={14} /> All scenarios
            </Link>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Current state</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {scenario.currentState.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Objectives</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {scenario.objectives.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Known facts</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {scenario.facts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-dashed border-[color:var(--border-strong)] bg-[color:var(--bg-sunken)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Unknowns</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm text-[color:var(--text-muted)]">
              {scenario.unknowns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <SourceBadge sourceIds={scenario.sourceIds} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <section>
            <h3 className="mb-1 text-sm font-semibold">Action Inbox</h3>
            <p className="mb-3 text-xs text-[color:var(--text-muted)]">Classify each item. Some are genuinely context-dependent — the explanation will say so.</p>
            <div className="space-y-2">
              {scenario.actions.map((a) => {
                const chosen = categorized[a.id]
                const correctSet = Array.isArray(a.correctCategory) ? a.correctCategory : [a.correctCategory]
                const isCorrect = chosen ? correctSet.includes(chosen as ScenarioActionCategory) : null
                return (
                  <div key={a.id} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
                    <p className="mb-2 text-sm">{a.text}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setScenarioCategory(scenario.id, a.id, cat.id)}
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
                      <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                        {isCorrect ? 'Consistent with the intended classification.' : `Reconsider — intended: ${correctSet.map((c) => categories.find((x) => x.id === c)?.label).join(' and/or ')}.`}
                        {a.contextNote && <span className="mt-0.5 block italic">{a.contextNote}</span>}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">Questions to Ask</h3>
            <p className="mb-3 text-xs text-[color:var(--text-muted)]">Select the questions you'd raise before proceeding.</p>
            <div className="space-y-2">
              {scenario.questionsToAsk.map((q, i) => {
                const key = `${scenario.id}-q${i}`
                const isChecked = askedQuestions.has(key)
                return (
                  <label key={key} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setAskedQuestions((prev) => {
                          const next = new Set(prev)
                          if (next.has(key)) next.delete(key)
                          else next.add(key)
                          return next
                        })
                      }
                      className="mt-0.5"
                    />
                    <span>
                      <span className="font-medium">{q.question}</span>
                      {q.essential && <span className="ml-1.5 rounded-full bg-domain-security/10 px-1.5 py-0 text-[10px] font-semibold text-domain-security">essential</span>}
                      {isChecked && <span className="mt-1 flex items-start gap-1 text-xs text-[color:var(--text-muted)]"><HelpCircle size={12} className="mt-0.5 shrink-0" />{q.whyItMatters}</span>}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">After-Action Review</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => resetScenario(scenario.id)} className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
                  <RotateCcw size={12} /> Reset
                </button>
                <button type="button" onClick={() => setShowAAR((v) => !v)} className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                  {showAAR ? 'Hide' : 'Reveal'} AAR
                </button>
              </div>
            </div>
            {showAAR && (
              <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <p className="mb-3 text-sm text-[color:var(--text)]">{scenario.afterActionExplanation}</p>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Self-check: what was identified</p>
                <ul className="space-y-1.5">
                  {scenario.rubricItems.map((r) => {
                    const checked = rubricChecked.includes(r.id)
                    return (
                      <li key={r.id}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input type="checkbox" checked={checked} onChange={() => toggleScenarioRubric(scenario.id, r.id)} />
                          <CheckCircle2 size={14} className={checked ? 'text-domain-coordination' : 'text-[color:var(--text-faint)]'} />
                          {r.label}
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
