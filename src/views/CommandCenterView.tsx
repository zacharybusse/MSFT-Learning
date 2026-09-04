import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flame, ArrowRight, Network, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { ProgressBar } from '../components/common/ProgressBar'
import { StatusTag } from '../components/common/StatusTag'
import { domainLabel } from '../lib/domainMeta'
import { studyPlan } from '../content/studyPlan'
import { modules, tracks } from '../content/tracks'
import { questions } from '../content/questions'
import { SOURCE_BASELINE_DATE } from '../content/sources'
import { useStore } from '../state/store'
import { domainMasteryBreakdown, weakQuestions, computeStreak } from '../lib/progress'
import { seededShuffle } from '../lib/scoring'
import { mapLayers } from '../content/mapLayout'

export function CommandCenterView() {
  const quizStats = useStore((s) => s.quizStats)
  const moduleCompleted = useStore((s) => s.moduleCompleted)
  const studyDaysActive = useStore((s) => s.studyDaysActive)
  const lastOpenTopic = useStore((s) => s.lastOpenTopic)
  const touchStudyDay = useStore((s) => s.touchStudyDay)
  const studyDayCompleted = useStore((s) => s.studyDayCompleted)

  useEffect(() => {
    touchStudyDay()
  }, [touchStudyDay])

  const breakdown = useMemo(() => domainMasteryBreakdown(quizStats), [quizStats])
  const weak = useMemo(() => weakQuestions(quizStats, 5), [quizStats])
  const streak = useMemo(() => computeStreak(studyDaysActive), [studyDaysActive])

  const todaysDrill = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return seededShuffle(questions, `today-${today}`).slice(0, 5)
  }, [])

  const nextModule = useMemo(() => {
    const incomplete = modules.filter((m) => !moduleCompleted[m.id])
    const readyOnes = incomplete.filter((m) => m.prerequisites.every((p) => moduleCompleted[p]))
    return readyOnes[0] ?? incomplete[0] ?? null
  }, [moduleCompleted])

  const totalModules = modules.length
  const doneModules = modules.filter((m) => moduleCompleted[m.id]).length

  const nextStudyDay = studyPlan.find((d) => !studyDayCompleted[d.day]) ?? studyPlan[0]

  return (
    <div>
      <PageHeader
        eyebrow="MICROSOFT PROJECT COORDINATOR — LEARNING COMMAND CENTER"
        title="Learn the ecosystem. See the dependencies. Speak the language. Run the project."
        description="A local-first command center for transitioning into Microsoft-centric IT project coordination — built around one interactive terrain model of how Microsoft 365, identity, endpoint, Azure, and security fit together."
      />

      <div className="border-b border-domain-licensing/30 bg-domain-licensing/5 px-4 py-2.5 text-center text-xs text-domain-licensing sm:px-6">
        Source baseline: {SOURCE_BASELINE_DATE}. Microsoft products, licensing, and credentials change. Verify volatile information against linked official sources in{' '}
        <Link to="/sources" className="underline">
          Sources
        </Link>
        .
      </div>

      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Mission</h2>
            <p className="text-sm leading-relaxed text-[color:var(--text)]">
              Build enough Microsoft ecosystem fluency to sit in a technical conversation — hybrid identity, Entra Connect, Exchange Online licensing, Conditional Access, DNS
              cutover — and translate it into a project operating picture: current state, target state, technical workstreams, dependencies, and delivery controls.
            </p>
          </section>

          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Ecosystem Map preview</h2>
              <Link to="/map" className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
                Open full map <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {mapLayers.map((l) => (
                <Link key={l.layer} to="/map" className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs hover:border-[color:var(--accent)]">
                  <Network size={14} className="shrink-0 text-[color:var(--text-faint)]" />
                  <span>
                    <span className="block font-medium text-[color:var(--text)]">{l.label}</span>
                    <span className="text-[color:var(--text-faint)]">{l.conceptIds.length} nodes</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <h2 className="mb-3 text-sm font-semibold">Progress by domain</h2>
            <div className="space-y-2.5">
              {breakdown
                .filter((d) => d.total > 0)
                .map((d) => (
                  <div key={d.domain}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{domainLabel[d.domain]}</span>
                      <span className="text-[color:var(--text-faint)]">
                        {d.attempted}/{d.total}
                      </span>
                    </div>
                    <ProgressBar value={d.attempted} max={d.total} />
                  </div>
                ))}
            </div>
          </section>

          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <h2 className="mb-3 text-sm font-semibold">Certification status notices</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between gap-2">
                <span>AZ-900 (Azure Fundamentals)</span>
                <StatusTag tone="active">Active — see Sources</StatusTag>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>MS-900 (Microsoft 365 Fundamentals)</span>
                <StatusTag tone="retired">Retired March 31, 2026</StatusTag>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>AB-900 (Intro to M365 &amp; AI administration)</span>
                <StatusTag tone="neutral">Current beginner/admin material — not a confirmed MS-900 replacement</StatusTag>
              </li>
            </ul>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/5 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">Today</h2>

            {lastOpenTopic && (
              <Link
                to={lastOpenTopic.type === 'concept' ? `/map?concept=${lastOpenTopic.id}` : '/tracks'}
                className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-xs hover:border-[color:var(--accent)]"
              >
                <span>
                  Resume: <span className="font-medium text-[color:var(--text)]">{lastOpenTopic.label}</span>
                </span>
                <ArrowRight size={13} />
              </Link>
            )}

            {nextModule && (
              <div className="mb-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Next lesson</p>
                <p className="mb-1 text-sm font-medium">{nextModule.title}</p>
                <Link to={`/tracks/${nextModule.trackId}`} className="text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
                  Go to module <ArrowRight size={11} className="inline" />
                </Link>
              </div>
            )}

            <div className="mb-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">5-question recall drill</p>
              <ul className="mb-2 space-y-1 text-xs text-[color:var(--text-muted)]">
                {todaysDrill.map((q) => (
                  <li key={q.id} className="line-clamp-1">
                    · {q.prompt}
                  </li>
                ))}
              </ul>
              <Link to="/drills" className="text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
                Start drill <ArrowRight size={11} className="inline" />
              </Link>
            </div>

            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Weak concepts</p>
              {weak.length === 0 ? (
                <p className="text-xs text-[color:var(--text-faint)]">None yet — no quiz history recorded.</p>
              ) : (
                <ul className="space-y-1 text-xs text-[color:var(--text-muted)]">
                  {weak.map((w) => (
                    <li key={w.questionId} className="line-clamp-1">
                      · {w.prompt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <div className="flex items-center gap-2">
              <Flame size={18} className={streak > 0 ? 'text-domain-security' : 'text-[color:var(--text-faint)]'} />
              <div>
                <p className="text-lg font-bold leading-none">{streak} day{streak === 1 ? '' : 's'}</p>
                <p className="text-xs text-[color:var(--text-faint)]">Current streak (local activity only)</p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={doneModules} max={totalModules} label="Modules complete" />
            </div>
          </section>

          <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
            <h2 className="mb-2 text-sm font-semibold">Tracks</h2>
            <ul className="space-y-1.5">
              {tracks.map((t) => (
                <li key={t.id}>
                  <Link to={`/tracks/${t.id}`} className="flex items-center justify-between gap-2 text-xs hover:text-[color:var(--accent-strong)]">
                    <span>
                      {t.code}. {t.title}
                    </span>
                    <ArrowRight size={11} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="border-t border-[color:var(--border)] p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Study campaign timeline</h2>
          <Link to="/study-plan" className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
            Open 21-day plan <ArrowRight size={12} />
          </Link>
        </div>
        <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-2">
          {studyPlan.map((d) => (
            <Link
              key={d.day}
              to="/study-plan"
              className={`flex w-32 shrink-0 flex-col gap-1 rounded-lg border p-2.5 text-xs ${
                studyDayCompleted[d.day] ? 'border-domain-coordination bg-domain-coordination/10' : nextStudyDay?.day === d.day ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/5' : 'border-[color:var(--border)]'
              }`}
            >
              <span className="flex items-center gap-1 font-semibold">
                {studyDayCompleted[d.day] && <CheckCircle2 size={12} className="text-domain-coordination" />}
                Day {d.day}
              </span>
              <span className="line-clamp-2 text-[color:var(--text-muted)]">{d.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
