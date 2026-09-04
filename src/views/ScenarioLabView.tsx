import { Link } from 'react-router-dom'
import { ClipboardList, Route, ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { MasteryPill } from '../components/common/MasteryPill'
import { scenarios } from '../content/scenarios'
import { masteryBand } from '../lib/scoring'
import { useStore } from '../state/store'

export function ScenarioLabView() {
  const scenarioProgress = useStore((s) => s.scenarioProgress)

  return (
    <div>
      <PageHeader
        eyebrow="Branching, fixed-fact simulations"
        title="Scenario Lab"
        description="Applied reasoning practice using predefined customer situations. Facts are fixed by design — nothing here is dynamically generated."
        actions={
          <div className="flex gap-2">
            <Link to="/scenarios/raid-trainer" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]">
              <ClipboardList size={14} /> RAID Trainer
            </Link>
            <Link to="/scenarios/cutover-trainer" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]">
              <Route size={14} /> Cutover Trainer
            </Link>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
        {scenarios.map((s) => {
          const progress = scenarioProgress[s.id]
          const checked = progress?.rubricChecked.length ?? 0
          const band = masteryBand(checked, s.rubricItems.length)
          return (
            <Link
              key={s.id}
              to={`/scenarios/${s.id}`}
              className="group flex flex-col rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 hover:border-[color:var(--accent)]"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-domain-migration/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-domain-migration">Simulation</span>
                <MasteryPill band={band} />
              </div>
              <h2 className="text-base font-semibold group-hover:text-[color:var(--accent-strong)]">{s.title}</h2>
              <p className="mt-1 flex-1 text-sm text-[color:var(--text-muted)]">{s.brief}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent-strong)]">
                Open scenario <ArrowRight size={12} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
