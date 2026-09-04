import { ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { StatusTag } from '../components/common/StatusTag'
import { sources, SOURCE_BASELINE_DATE } from '../content/sources'
import type { SourceType } from '../content/types'

const groups: { type: SourceType; label: string; note: string }[] = [
  { type: 'official-microsoft', label: 'Official Microsoft', note: 'Microsoft Learn certifications and training paths.' },
  { type: 'company', label: 'TrustedTech (company)', note: 'Company-specific material — distinct from verified Microsoft fact.' },
  { type: 'simulation', label: 'Simulation', note: 'Scenario Lab content. Not real customer data, not dynamically generated.' },
  { type: 'user-note', label: 'User-authored', note: 'Entered by you. Not verified, not treated as a source of fact by the app.' },
]

export function SourcesView() {
  return (
    <div>
      <PageHeader
        eyebrow={`Baseline ${SOURCE_BASELINE_DATE}`}
        title="Sources"
        description="Every factual learning item in this app references a source here. Microsoft products, licensing, and credentials change — verify volatile information against the linked official sources."
      />
      <div className="space-y-8 p-4 sm:p-6">
        {groups.map((g) => {
          const items = sources.filter((s) => s.type === g.type)
          if (items.length === 0) return null
          return (
            <section key={g.type}>
              <h2 className="mb-1 text-sm font-semibold">{g.label}</h2>
              <p className="mb-3 text-xs text-[color:var(--text-muted)]">{g.note}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((s) => (
                  <div key={s.id} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                    <div className="mb-1.5 flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[color:var(--text)]">{s.title}</p>
                      {s.status === 'retired_certification_material' && <StatusTag tone="retired">Retired{s.retiredDate ? ` ${s.retiredDate}` : ''}</StatusTag>}
                      {s.status === 'active_certification' && <StatusTag tone="active">Active certification</StatusTag>}
                    </div>
                    <p className="text-xs text-[color:var(--text-faint)]">
                      {s.publisher} · verified {s.lastVerified}
                    </p>
                    {s.notes && <p className="mt-2 text-xs text-[color:var(--text-muted)]">{s.notes}</p>}
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
                        Open <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
