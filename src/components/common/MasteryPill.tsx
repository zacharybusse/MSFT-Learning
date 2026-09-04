import type { MasteryBand } from '../../lib/scoring'
import { masteryLabel } from '../../lib/scoring'

const bandClass: Record<MasteryBand, string> = {
  'not-started': 'bg-[color:var(--bg-sunken)] text-[color:var(--text-faint)] border-[color:var(--border)]',
  developing: 'bg-domain-licensing/10 text-domain-licensing border-domain-licensing/30',
  solid: 'bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)] border-[color:var(--accent)]/30',
  strong: 'bg-domain-coordination/10 text-domain-coordination border-domain-coordination/30',
}

export function MasteryPill({ band }: { band: MasteryBand }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandClass[band]}`}>{masteryLabel(band)}</span>
}

export function AnalogyNote({ text, label }: { text: string; label?: string }) {
  return (
    <div className="rounded-md border border-dashed border-[color:var(--border-strong)] bg-[color:var(--bg-sunken)] p-3 text-sm">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">{label ?? 'Conceptual analogy, not a technical definition'}</p>
      <p className="italic text-[color:var(--text-muted)]">{text}</p>
    </div>
  )
}
