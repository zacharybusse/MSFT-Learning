import { Link } from 'react-router-dom'
import { Pin, PinOff, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Drawer } from '../common/Drawer'
import { DomainTag } from '../common/StatusTag'
import { SourceBadge } from '../common/SourceBadge'
import { AnalogyNote } from '../common/MasteryPill'
import { conceptById } from '../../content/concepts'
import { useStore } from '../../state/store'

const layerLabel: Record<string, string> = {
  business: 'Business / Users',
  workloads: 'Microsoft 365 / Business Applications / Data',
  identity: 'Identity & Access',
  endpoint: 'Endpoint',
  azure: 'Azure Platform',
  security: 'Security / Governance',
  operations: 'Operations / Delivery Overlay',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">{title}</h3>
      {children}
    </section>
  )
}

export function ConceptDrawer({ conceptId, open, onClose }: { conceptId: string | null; open: boolean; onClose: () => void }) {
  const pmLensOn = useStore((s) => s.pmLensOn)
  const pinned = useStore((s) => s.pinnedConceptIds)
  const togglePinned = useStore((s) => s.togglePinned)

  const concept = conceptId ? conceptById.get(conceptId) : null
  if (!concept) return <Drawer open={open} onClose={onClose} title="Concept"><p className="text-sm text-[color:var(--text-muted)]">Not found.</p></Drawer>

  const isPinned = pinned.includes(concept.id)
  const dependsOnConcepts = concept.dependsOn.map((id) => conceptById.get(id)).filter(Boolean)
  const usedByConcepts = [
    ...concept.usedBy.map((id) => conceptById.get(id)).filter(Boolean),
  ]
  const relatedConcepts = concept.relatedConcepts.map((id) => conceptById.get(id)).filter(Boolean)

  return (
    <Drawer open={open} onClose={onClose} title={concept.name} subtitle={concept.acronym}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DomainTag domain={concept.domain} />
        <SourceBadge sourceIds={concept.sourceIds} />
        <button
          type="button"
          onClick={() => togglePinned(concept.id)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text)]"
        >
          {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          {isPinned ? 'Unpin' : 'Pin to field notes'}
        </button>
      </div>

      {pmLensOn && (concept.projectRelevance.length > 0 || concept.pmQuestions.length > 0) && (
        <div className="mb-5 rounded-lg border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/5 p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">Project-Coordinator Lens</p>
          {concept.projectRelevance.length > 0 && (
            <ul className="mb-2 list-disc space-y-1 pl-4 text-sm text-[color:var(--text)]">
              {concept.projectRelevance.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
          {concept.pmQuestions.length > 0 && (
            <ul className="space-y-1 pl-0 text-sm text-[color:var(--text-muted)]">
              {concept.pmQuestions.map((q, i) => (
                <li key={i} className="before:mr-1.5 before:content-['❓']">
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Section title="1 · What it is">
        <p className="text-sm leading-relaxed text-[color:var(--text)]">{concept.definition}</p>
      </Section>

      <Section title="2 · What problem it solves">
        <p className="text-sm leading-relaxed text-[color:var(--text)]">{concept.problemSolved}</p>
      </Section>

      <Section title="3 · Where it sits">
        <p className="text-sm text-[color:var(--text)]">{layerLabel[concept.mapLayer] ?? concept.mapLayer}</p>
      </Section>

      <Section title="4 · What it depends on">
        {dependsOnConcepts.length ? (
          <div className="flex flex-wrap gap-1.5">
            {dependsOnConcepts.map((c) => (
              <span key={c!.id} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs text-[color:var(--text-muted)]">
                <ArrowUpRight size={11} /> {c!.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--text-faint)]">No explicit upstream dependency in this content set.</p>
        )}
      </Section>

      <Section title="5 · What depends on it">
        {usedByConcepts.length ? (
          <div className="flex flex-wrap gap-1.5">
            {usedByConcepts.map((c) => (
              <span key={c!.id} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs text-[color:var(--text-muted)]">
                <ArrowDownRight size={11} /> {c!.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--text-faint)]">No explicit downstream dependent in this content set.</p>
        )}
      </Section>

      <Section title="6 · Typical project work">
        <ul className="list-disc space-y-1 pl-4 text-sm text-[color:var(--text)]">
          {concept.projectRelevance.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="7 · PM questions to ask">
        <ul className="list-disc space-y-1 pl-4 text-sm text-[color:var(--text)]">
          {concept.pmQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </Section>

      {concept.commonTerms && concept.commonTerms.length > 0 && (
        <Section title="8 · Common terms">
          <div className="flex flex-wrap gap-1.5">
            {concept.commonTerms.map((t) => (
              <span key={t} className="rounded-full bg-[color:var(--bg-sunken)] px-2 py-0.5 text-xs text-[color:var(--text-muted)]">
                {t}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="9 · Related nodes">
        <div className="flex flex-wrap gap-1.5">
          {relatedConcepts.map((c) => (
            <Link
              key={c!.id}
              to={`/glossary?term=${c!.id}`}
              className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
            >
              {c!.name}
            </Link>
          ))}
        </div>
      </Section>

      {concept.analogy && (
        <Section title="Military / operations analogy">
          <AnalogyNote text={concept.analogy} label={concept.analogyLabel} />
        </Section>
      )}

      {concept.retrievalPrompt && (
        <Section title="Retrieval question">
          <p className="rounded-md bg-[color:var(--bg-sunken)] p-3 text-sm italic text-[color:var(--text)]">{concept.retrievalPrompt}</p>
        </Section>
      )}

      <Section title="10 · Official sources">
        <SourceBadge sourceIds={concept.sourceIds} />
      </Section>
    </Drawer>
  )
}
