import { useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { SourceBadge } from '../components/common/SourceBadge'
import { ProgressBar } from '../components/common/ProgressBar'
import { studyPlan } from '../content/studyPlan'
import { scenarioById } from '../content/scenarios'
import { useStore } from '../state/store'
import { Link } from 'react-router-dom'

export function StudyPlanView() {
  const studyDayCompleted = useStore((s) => s.studyDayCompleted)
  const toggleStudyDayCompleted = useStore((s) => s.toggleStudyDayCompleted)
  const studyDayNotes = useStore((s) => s.studyDayNotes)
  const setStudyDayNote = useStore((s) => s.setStudyDayNote)
  const [openDay, setOpenDay] = useState<number | null>(1)

  const doneCount = studyPlan.filter((d) => studyDayCompleted[d.day]).length

  return (
    <div>
      <PageHeader
        eyebrow="Visual campaign plan"
        title="21-Day Study Plan"
        description="Each day has an objective, sources, learning blocks, a recall drill, and an applied scenario where relevant."
        actions={
          <div className="w-40">
            <ProgressBar value={doneCount} max={studyPlan.length} label="Days complete" />
          </div>
        }
      />
      <div className="p-4 sm:p-6">
        <div className="scrollbar-thin mb-6 flex gap-1.5 overflow-x-auto pb-2">
          {studyPlan.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setOpenDay(d.day)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                openDay === d.day
                  ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-white'
                  : studyDayCompleted[d.day]
                    ? 'border-domain-coordination bg-domain-coordination/10 text-domain-coordination'
                    : 'border-[color:var(--border)] text-[color:var(--text-muted)]'
              }`}
              aria-label={`Day ${d.day}: ${d.title}`}
            >
              {d.day}
            </button>
          ))}
        </div>

        {studyPlan
          .filter((d) => d.day === openDay)
          .map((d) => {
            const scenario = d.scenarioRef ? scenarioById.get(d.scenarioRef) : null
            return (
              <div key={d.day} className="max-w-2xl rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Day {d.day}</p>
                    <h2 className="text-lg font-bold">{d.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStudyDayCompleted(d.day)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      studyDayCompleted[d.day] ? 'border-domain-coordination bg-domain-coordination/10 text-domain-coordination' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'
                    }`}
                  >
                    {studyDayCompleted[d.day] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {studyDayCompleted[d.day] ? 'Complete' : 'Mark complete'}
                  </button>
                </div>
                <p className="mb-4 text-sm text-[color:var(--text)]">{d.objective}</p>

                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Learning blocks</p>
                  <ul className="list-disc space-y-1 pl-4 text-sm">
                    {d.learningBlocks.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Recall drill</p>
                  <Link to={`/drills`} className="text-sm text-[color:var(--accent-strong)] hover:underline">
                    Retrieval Drills — {d.drillTopic} focus
                  </Link>
                </div>

                {scenario && (
                  <div className="mb-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Applied scenario</p>
                    <Link to={`/scenarios/${scenario.id}`} className="text-sm text-[color:var(--accent-strong)] hover:underline">
                      {scenario.title}
                    </Link>
                  </div>
                )}

                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Sources</p>
                  <SourceBadge sourceIds={d.sourceIds} />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]" htmlFor={`note-${d.day}`}>
                    Notes
                  </label>
                  <textarea
                    id={`note-${d.day}`}
                    value={studyDayNotes[d.day] ?? ''}
                    onChange={(e) => setStudyDayNote(d.day, e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] p-2 text-sm outline-none focus-visible:border-[color:var(--accent)]"
                    placeholder="Your notes for this day…"
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
