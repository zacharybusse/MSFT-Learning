import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Network } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { DomainTag } from '../components/common/StatusTag'
import { SourceBadge } from '../components/common/SourceBadge'
import { Drawer } from '../components/common/Drawer'
import { glossary, glossaryById } from '../content/glossary'
import { allMapConceptIds } from '../content/mapLayout'

export function GlossaryView() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const activeId = params.get('term')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return glossary
    return glossary.filter(
      (g) => g.term.toLowerCase().includes(q) || g.acronym?.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q) || g.aliases?.some((a) => a.toLowerCase().includes(q)),
    )
  }, [query])

  const active = activeId ? glossaryById.get(activeId) : null

  return (
    <div>
      <PageHeader eyebrow={`${glossary.length} terms`} title="Glossary" description="Searchable and cross-linked to the Ecosystem Map and Learning Tracks." />
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 sm:max-w-md">
          <Search size={16} className="text-[color:var(--text-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms, acronyms, definitions…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-faint)]"
            aria-label="Search glossary"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setParams({ term: g.id })}
              className="flex flex-col items-start rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 text-left hover:border-[color:var(--accent)]"
            >
              <div className="mb-1 flex w-full items-center justify-between gap-2">
                <span className="font-semibold text-[color:var(--text)]">{g.term}</span>
                <DomainTag domain={g.domain} size="xs" />
              </div>
              {g.acronym && <span className="mb-1 text-xs text-[color:var(--text-faint)]">{g.acronym}</span>}
              <p className="line-clamp-2 text-xs text-[color:var(--text-muted)]">{g.definition}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-[color:var(--text-faint)]">No terms match "{query}".</p>}
        </div>
      </div>

      <Drawer open={Boolean(active)} onClose={() => { params.delete('term'); setParams(params, { replace: true }) }} title={active?.term ?? ''} subtitle={active?.acronym}>
        {active && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <DomainTag domain={active.domain} />
              <SourceBadge sourceIds={active.sourceIds} />
            </div>
            <p className="text-[color:var(--text)]">{active.definition}</p>
            {active.aliases && active.aliases.length > 0 && (
              <p className="text-[color:var(--text-muted)]">
                <span className="font-semibold">Also known as: </span>
                {active.aliases.join(', ')}
              </p>
            )}
            <p className="text-[color:var(--text-muted)]">
              <span className="font-semibold text-[color:var(--text)]">Project relevance: </span>
              {active.projectRelevance}
            </p>
            {active.relatedTerms.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Related terms</p>
                <div className="flex flex-wrap gap-1.5">
                  {active.relatedTerms.map((id) => {
                    const t = glossaryById.get(id)
                    if (!t) return null
                    return (
                      <button key={id} type="button" onClick={() => setParams({ term: id })} className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs hover:border-[color:var(--accent)]">
                        {t.term}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {active.conceptId && allMapConceptIds.includes(active.conceptId) && (
              <Link to={`/map?concept=${active.conceptId}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
                <Network size={13} /> View on Ecosystem Map
              </Link>
            )}
            <p className="text-xs text-[color:var(--text-faint)]">Last verified {active.lastVerified}</p>
          </div>
        )}
      </Drawer>
    </div>
  )
}
