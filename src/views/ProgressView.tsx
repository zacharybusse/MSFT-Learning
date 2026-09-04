import { useMemo, useRef } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { ProgressBar } from '../components/common/ProgressBar'
import { domainLabel } from '../lib/domainMeta'
import { readinessChecklist } from '../content/readiness'
import { sources, SOURCE_BASELINE_DATE } from '../content/sources'
import { modules } from '../content/tracks'
import { scenarios } from '../content/scenarios'
import { useStore, buildExport, type ExportShape } from '../state/store'
import { domainMasteryBreakdown, weakQuestions } from '../lib/progress'
import { masteryBand } from '../lib/scoring'
import { MasteryPill } from '../components/common/MasteryPill'

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ProgressView() {
  const quizStats = useStore((s) => s.quizStats)
  const moduleCompleted = useStore((s) => s.moduleCompleted)
  const readinessChecked = useStore((s) => s.readinessChecked)
  const toggleReadinessItem = useStore((s) => s.toggleReadinessItem)
  const scenarioProgress = useStore((s) => s.scenarioProgress)
  const studyDaysActive = useStore((s) => s.studyDaysActive)
  const importState = useStore((s) => s.importState)
  const resetProgress = useStore((s) => s.resetProgress)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const breakdown = useMemo(() => domainMasteryBreakdown(quizStats), [quizStats])
  const weak = useMemo(() => weakQuestions(quizStats), [quizStats])

  const staleSourceCount = sources.filter((s) => s.status === 'retired_certification_material').length
  const modulesDone = modules.filter((m) => moduleCompleted[m.id]).length

  const handleImport = (file: File) => {
    file.text().then((text) => {
      try {
        const data = JSON.parse(text) as Partial<ExportShape>
        importState(data)
      } catch {
        alert('Could not read that file as valid exported JSON.')
      }
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Locally tracked only"
        title="Progress / Weak Areas"
        description="No fabricated overall score. Mastery bands come from explicit checklist and rubric completion; domain accuracy comes from actual quiz history."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => download(`msft-lcc-progress-${Date.now()}.json`, buildExport())} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]">
              <Download size={14} /> Export
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]">
              <Upload size={14} /> Import
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all locally stored progress? This cannot be undone.')) resetProgress()
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-domain-security/40 px-3 py-1.5 text-xs font-semibold text-domain-security hover:bg-domain-security/10"
            >
              <Trash2 size={14} /> Reset
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Mastery by domain (quiz accuracy)</h2>
            <div className="space-y-3">
              {breakdown.map((d) => (
                <div key={d.domain}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[color:var(--text)]">{domainLabel[d.domain]}</span>
                    <span className="text-[color:var(--text-faint)]">
                      {d.attempted}/{d.total} questions attempted{d.attempted > 0 ? ` · ${d.accuracyPct}% correct` : ''}
                    </span>
                  </div>
                  <ProgressBar value={d.attempted > 0 ? d.accuracyPct : 0} max={100} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-2 text-sm font-semibold">Weak concepts (from actual quiz history)</h2>
            {weak.length === 0 ? (
              <p className="text-sm text-[color:var(--text-faint)]">Nothing flagged yet — answer some drills to populate this.</p>
            ) : (
              <ul className="space-y-2">
                {weak.map((w) => (
                  <li key={w.questionId} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-[color:var(--text)]">{w.prompt}</span>
                    <span className="shrink-0 rounded-full bg-domain-security/10 px-2 py-0.5 text-[11px] font-medium text-domain-security">
                      {w.accuracyPct}% · {w.box}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-2 text-sm font-semibold">Scenario rubric performance</h2>
            <ul className="space-y-2">
              {scenarios.map((s) => {
                const progress = scenarioProgress[s.id]
                const checked = progress?.rubricChecked.length ?? 0
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>{s.title}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-[color:var(--text-faint)]">
                        {checked}/{s.rubricItems.length}
                      </span>
                      <MasteryPill band={masteryBand(checked, s.rubricItems.length)} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-2 text-sm font-semibold">Readiness checklist</h2>
            <ul className="space-y-2">
              {readinessChecklist.map((r) => (
                <li key={r.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input type="checkbox" checked={Boolean(readinessChecked[r.id])} onChange={() => toggleReadinessItem(r.id)} />
                    {r.label}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-2 text-sm font-semibold">Study activity</h2>
            <p className="text-sm text-[color:var(--text-muted)]">
              Days with recorded activity: <span className="font-semibold text-[color:var(--text)]">{studyDaysActive.length}</span>
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-faint)]">Only actual local activity is counted — no fabricated streak or study-time claim.</p>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <h2 className="mb-2 text-sm font-semibold">Modules completed</h2>
            <ProgressBar value={modulesDone} max={modules.length} label="Learning Tracks modules" />
          </section>

          <section className="rounded-lg border border-domain-licensing/30 bg-domain-licensing/5 p-4">
            <h2 className="mb-2 text-sm font-semibold text-domain-licensing">Source freshness</h2>
            <p className="text-sm text-[color:var(--text)]">Baseline: {SOURCE_BASELINE_DATE}</p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">{staleSourceCount} source{staleSourceCount === 1 ? '' : 's'} marked retired — see the Sources view.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
