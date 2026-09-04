import { useState } from 'react'
import { ExternalLink, X, ShieldCheck, Building2, FileEdit, FlaskConical } from 'lucide-react'
import { sourceById } from '../../content/sources'
import type { SourceType } from '../../content/types'

const typeMeta: Record<SourceType, { label: string; icon: typeof ShieldCheck; className: string }> = {
  'official-microsoft': { label: 'Official Microsoft', icon: ShieldCheck, className: 'text-[color:var(--accent-strong)]' },
  company: { label: 'TrustedTech (company)', icon: Building2, className: 'text-domain-licensing' },
  'user-note': { label: 'User-authored', icon: FileEdit, className: 'text-[color:var(--text-muted)]' },
  simulation: { label: 'Simulation', icon: FlaskConical, className: 'text-domain-migration' },
}

export function SourceBadge({ sourceIds, compact = false }: { sourceIds: string[]; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const sources = sourceIds.map((id) => sourceById.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s))
  if (sources.length === 0) return null
  const primary = sources[0]
  const meta = typeMeta[primary.type]
  const Icon = meta.icon

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-0.5 text-[11px] font-medium hover:border-[color:var(--border-strong)] ${meta.className}`}
        aria-expanded={open}
        aria-label={`Source: ${meta.label}. ${primary.title}`}
      >
        <Icon size={12} aria-hidden />
        {!compact && <span>{meta.label}</span>}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Source details"
          className="absolute z-30 mt-2 w-80 max-w-[90vw] rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 shadow-xl"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Source{sources.length > 1 ? 's' : ''}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close source details" className="text-[color:var(--text-faint)] hover:text-[color:var(--text)]">
              <X size={14} />
            </button>
          </div>
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} className="text-sm">
                <p className="font-medium text-[color:var(--text)]">{s.title}</p>
                <p className="text-xs text-[color:var(--text-muted)]">
                  {s.publisher} · {typeMeta[s.type].label} · verified {s.lastVerified}
                </p>
                {s.status && (
                  <p className="mt-0.5 text-xs font-medium text-domain-security">
                    {s.status === 'retired_certification_material' ? `Retired${s.retiredDate ? ` ${s.retiredDate}` : ''}` : s.status.replaceAll('_', ' ')}
                  </p>
                )}
                {s.notes && <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">{s.notes}</p>}
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent-strong)] hover:underline"
                  >
                    Open source <ExternalLink size={11} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </span>
  )
}

export function VerifyBadge({ label = 'Verify current information' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-domain-licensing/40 bg-domain-licensing/10 px-2 py-0.5 text-[11px] font-medium text-domain-licensing">
      ⚠ {label}
    </span>
  )
}
