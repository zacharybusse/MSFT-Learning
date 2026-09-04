import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronLeft, Lock } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { DomainTag } from '../components/common/StatusTag'
import { ProgressBar } from '../components/common/ProgressBar'
import { KnowledgeStack } from '../components/knowledge/KnowledgeStack'
import { tracks, modules, modulesByTrack, moduleById } from '../content/tracks'
import { conceptById } from '../content/concepts'
import { useStore } from '../state/store'

function TrackList() {
  const moduleCompleted = useStore((s) => s.moduleCompleted)
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tracks.map((t) => {
          const mods = modulesByTrack(t.id)
          const done = mods.filter((m) => moduleCompleted[m.id]).length
          return (
            <Link
              key={t.id}
              to={`/tracks/${t.id}`}
              className="group flex flex-col rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition-colors hover:border-[color:var(--accent)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-[color:var(--bg-sunken)] px-2 py-0.5 text-xs font-bold text-[color:var(--text-faint)]">Track {t.code}</span>
                <DomainTag domain={t.domain} size="xs" />
              </div>
              <h2 className="text-base font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent-strong)]">{t.title}</h2>
              <p className="mt-1 flex-1 text-sm text-[color:var(--text-muted)]">{t.description}</p>
              <div className="mt-3">
                <ProgressBar value={done} max={mods.length} label="Modules complete" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function TrackDetail({ trackId }: { trackId: string }) {
  const track = tracks.find((t) => t.id === trackId)
  const mods = modulesByTrack(trackId)
  const moduleCompleted = useStore((s) => s.moduleCompleted)
  const toggleModuleCompleted = useStore((s) => s.toggleModuleCompleted)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(mods[0]?.id ?? null)
  const navigate = useNavigate()

  if (!track) return <p className="p-6 text-sm text-[color:var(--text-muted)]">Track not found.</p>

  const activeModule = activeModuleId ? moduleById.get(activeModuleId) : null

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-[color:var(--border)] p-4 lg:w-72 lg:border-b-0 lg:border-r">
        <button type="button" onClick={() => navigate('/tracks')} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
          <ChevronLeft size={14} /> All tracks
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Track {track.code}</p>
        <h1 className="mb-3 text-lg font-bold">{track.title}</h1>
        <ul className="space-y-1">
          {mods.map((m) => {
            const prereqsDone = m.prerequisites.every((p) => moduleCompleted[p])
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActiveModuleId(m.id)}
                  className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${
                    activeModuleId === m.id ? 'bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'text-[color:var(--text)] hover:bg-[color:var(--bg-sunken)]'
                  }`}
                >
                  {moduleCompleted[m.id] ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-domain-coordination" />
                  ) : prereqsDone ? (
                    <Circle size={16} className="mt-0.5 shrink-0 text-[color:var(--text-faint)]" />
                  ) : (
                    <Lock size={14} className="mt-0.5 shrink-0 text-[color:var(--text-faint)]" />
                  )}
                  <span>{m.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div className="min-w-0 flex-1 p-4 sm:p-6">
        {activeModule && (
          <>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{activeModule.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">{activeModule.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleModuleCompleted(activeModule.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  moduleCompleted[activeModule.id]
                    ? 'border-domain-coordination bg-domain-coordination/10 text-domain-coordination'
                    : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]'
                }`}
              >
                {moduleCompleted[activeModule.id] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                {moduleCompleted[activeModule.id] ? 'Completed' : 'Mark complete'}
              </button>
            </div>

            {activeModule.prerequisites.length > 0 && !activeModule.prerequisites.every((p) => moduleCompleted[p]) && (
              <p className="mb-4 rounded-md border border-domain-licensing/30 bg-domain-licensing/10 px-3 py-2 text-xs text-domain-licensing">
                Suggested prerequisite{activeModule.prerequisites.length > 1 ? 's' : ''} not yet marked complete:{' '}
                {activeModule.prerequisites.map((p) => moduleById.get(p)?.title).join(', ')}. You can still continue — this is a suggestion, not a lock.
              </p>
            )}

            <div className="mb-5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Objectives</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {activeModule.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {activeModule.conceptIds.map((cid) => {
                const c = conceptById.get(cid)
                if (!c) return null
                return <KnowledgeStack key={cid} concept={c} />
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function LearningTracksView() {
  const { trackId } = useParams()
  const total = modules.length
  const moduleCompleted = useStore((s) => s.moduleCompleted)
  const done = useMemo(() => modules.filter((m) => moduleCompleted[m.id]).length, [moduleCompleted])

  return (
    <div>
      <PageHeader
        eyebrow="9 tracks"
        title={trackId ? 'Learning Tracks' : 'Learning Tracks'}
        description="Foundation, cloud, Microsoft 365, identity, endpoint, security, migration delivery, licensing, and project coordination — each concept opens as a knowledge stack."
        actions={
          !trackId ? (
            <div className="w-48">
              <ProgressBar value={done} max={total} label="Overall modules" />
            </div>
          ) : undefined
        }
      />
      {trackId ? <TrackDetail trackId={trackId} /> : <TrackList />}
    </div>
  )
}
