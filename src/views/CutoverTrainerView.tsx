import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { cutoverPhases } from '../content/cutoverPhases'

type RunbookRow = {
  id: string
  task: string
  owner: string
  plannedStart: string
  duration: string
  predecessorId: string | null
  validation: string
  rollback: string
  status: 'Not started' | 'In progress' | 'Complete' | 'Blocked'
}

function makeRow(task = ''): RunbookRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    task,
    owner: '',
    plannedStart: '',
    duration: '',
    predecessorId: null,
    validation: '',
    rollback: '',
    status: 'Not started',
  }
}

const statusOptions: RunbookRow['status'][] = ['Not started', 'In progress', 'Complete', 'Blocked']

export function CutoverTrainerView() {
  const [rows, setRows] = useState<RunbookRow[]>(() => cutoverPhases.map((p) => makeRow(p.name)))

  const update = (id: string, patch: Partial<RunbookRow>) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id))
  const move = (id: string, dir: -1 | 1) =>
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id)
      const next = [...prev]
      const swapIdx = idx + dir
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })

  return (
    <div>
      <PageHeader
        eyebrow="Standalone tool — no production commands"
        title="Cutover Trainer"
        description="Build a sequenced runbook: sequence, task, owner, timing, predecessor, validation, and rollback. Pre-loaded with generic phases you can edit, reorder, or remove."
        actions={
          <Link to="/scenarios" className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
            <ChevronLeft size={14} /> Scenario Lab
          </Link>
        }
      />
      <div className="p-4 sm:p-6">
        <div className="scrollbar-thin overflow-x-auto rounded-lg border border-[color:var(--border)]">
          <table className="min-w-[1100px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-[color:var(--bg-sunken)] text-left text-xs uppercase tracking-wide text-[color:var(--text-faint)]">
                <th className="w-10 px-2 py-2">#</th>
                <th className="px-2 py-2">Task</th>
                <th className="px-2 py-2">Owner</th>
                <th className="px-2 py-2">Planned start</th>
                <th className="px-2 py-2">Duration est.</th>
                <th className="px-2 py-2">Predecessor</th>
                <th className="px-2 py-2">Validation</th>
                <th className="px-2 py-2">Rollback action</th>
                <th className="px-2 py-2">Status</th>
                <th className="w-24 px-2 py-2">Reorder</th>
                <th className="w-8 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-[color:var(--border)] last:border-b-0">
                  <td className="px-2 py-1.5 text-[color:var(--text-faint)]">{i + 1}</td>
                  <td className="px-2 py-1.5">
                    <input value={r.task} onChange={(e) => update(r.id, { task: e.target.value })} className="w-40 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={r.owner} onChange={(e) => update(r.id, { owner: e.target.value })} placeholder="Name/role" className="w-28 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={r.plannedStart} onChange={(e) => update(r.id, { plannedStart: e.target.value })} placeholder="e.g. 18:00" className="w-24 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={r.duration} onChange={(e) => update(r.id, { duration: e.target.value })} placeholder="e.g. 30m" className="w-20 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <select value={r.predecessorId ?? ''} onChange={(e) => update(r.id, { predecessorId: e.target.value || null })} className="rounded border border-[color:var(--border)] bg-transparent px-1 py-0.5 text-xs">
                      <option value="">None</option>
                      {rows.filter((o) => o.id !== r.id).map((o, oi) => (
                        <option key={o.id} value={o.id}>
                          {oi + 1}. {o.task || 'Untitled'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={r.validation} onChange={(e) => update(r.id, { validation: e.target.value })} placeholder="How confirmed?" className="w-40 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={r.rollback} onChange={(e) => update(r.id, { rollback: e.target.value })} placeholder="If it fails…" className="w-40 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]" />
                  </td>
                  <td className="px-2 py-1.5">
                    <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value as RunbookRow['status'] })} className="rounded border border-[color:var(--border)] bg-transparent px-1 py-0.5 text-xs">
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex gap-0.5">
                      <button type="button" onClick={() => move(r.id, -1)} aria-label="Move up" className="rounded p-1 hover:bg-[color:var(--bg-sunken)]">
                        <ArrowUp size={13} />
                      </button>
                      <button type="button" onClick={() => move(r.id, 1)} aria-label="Move down" className="rounded p-1 hover:bg-[color:var(--bg-sunken)]">
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <button type="button" onClick={() => remove(r.id)} aria-label="Remove row" className="rounded p-1 text-domain-security hover:bg-domain-security/10">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, makeRow()])}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]"
        >
          <Plus size={14} /> Add task
        </button>
      </div>
    </div>
  )
}
