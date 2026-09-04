import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Concept } from '../../content/types'
import { conceptById } from '../../content/concepts'
import { scenarios } from '../../content/scenarios'
import { AnalogyNote } from '../common/MasteryPill'
import { SourceBadge } from '../common/SourceBadge'
import { DomainTag } from '../common/StatusTag'

const layerLabel: Record<string, string> = {
  business: 'Business / Users',
  workloads: 'Microsoft 365 / Business Applications / Data',
  identity: 'Identity & Access',
  endpoint: 'Endpoint',
  azure: 'Azure Platform',
  security: 'Security / Governance',
  operations: 'Operations / Delivery Overlay',
}

function Level({ n, title, defaultOpen = false, children }: { n: number; title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[color:var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[color:var(--bg-sunken)]"
        aria-expanded={open}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/12 text-[10px] font-bold text-[color:var(--accent-strong)]">{n}</span>
        <span className="flex-1 text-sm font-semibold text-[color:var(--text)]">{title}</span>
        <ChevronDown size={16} className={`shrink-0 text-[color:var(--text-faint)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-3 pb-3 pl-11 pt-0.5 text-sm text-[color:var(--text)]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function KnowledgeStack({ concept }: { concept: Concept }) {
  const related = concept.relatedConcepts.map((id) => conceptById.get(id)).filter(Boolean)
  const linkedScenario = scenarios.find((s) => s.architectureNodes.includes(concept.id))

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
      <Level n={1} title="Name" defaultOpen>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold">{concept.name}</span>
          {concept.acronym && <span className="text-[color:var(--text-faint)]">({concept.acronym})</span>}
          <DomainTag domain={concept.domain} size="xs" />
        </div>
      </Level>
      <Level n={2} title="One-Sentence Purpose">
        <p>{concept.purpose}</p>
      </Level>
      <Level n={3} title="Place on the Map">
        <p>{layerLabel[concept.mapLayer] ?? concept.mapLayer}</p>
      </Level>
      <Level n={4} title="Components / Related Concepts">
        {related.length ? (
          <div className="flex flex-wrap gap-1.5">
            {related.map((c) => (
              <Link key={c!.id} to={`/glossary?term=${c!.id}`} className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]">
                {c!.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[color:var(--text-faint)]">None recorded in this content set.</p>
        )}
      </Level>
      <Level n={5} title="Project Effect">
        <ul className="list-disc space-y-1 pl-4">
          {concept.projectRelevance.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Level>
      {concept.analogy && (
        <Level n={6} title="Military / Ops Analogy">
          <AnalogyNote text={concept.analogy} label={concept.analogyLabel} />
        </Level>
      )}
      {concept.retrievalPrompt && (
        <Level n={7} title="Retrieval Question">
          <p className="rounded-md bg-[color:var(--bg-sunken)] p-3 italic">{concept.retrievalPrompt}</p>
        </Level>
      )}
      <Level n={8} title="Scenario">
        {linkedScenario ? (
          <p>
            Applied in{' '}
            <Link to={`/scenarios/${linkedScenario.id}`} className="font-medium text-[color:var(--accent-strong)] hover:underline">
              {linkedScenario.title}
            </Link>{' '}
            — a simulated project situation, not real customer data.
          </p>
        ) : (
          <p className="text-[color:var(--text-faint)]">Not directly featured in a Scenario Lab scenario yet — see the Ecosystem Map for related nodes.</p>
        )}
      </Level>
      <Level n={9} title="Official Source">
        <SourceBadge sourceIds={concept.sourceIds} />
      </Level>
    </div>
  )
}
