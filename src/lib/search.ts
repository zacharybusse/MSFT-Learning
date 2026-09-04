import { concepts } from '../content/concepts'
import { glossary } from '../content/glossary'
import { sources } from '../content/sources'
import { modules } from '../content/tracks'

export type SearchResult = {
  id: string
  kind: 'concept' | 'glossary' | 'source' | 'module'
  title: string
  subtitle: string
  path: string
}

let index: SearchResult[] | null = null

function buildIndex(): SearchResult[] {
  const out: SearchResult[] = []
  for (const c of concepts) {
    out.push({ id: c.id, kind: 'concept', title: c.name, subtitle: c.purpose, path: `/map?concept=${c.id}` })
  }
  for (const g of glossary) {
    out.push({ id: g.id, kind: 'glossary', title: g.term, subtitle: g.definition, path: `/glossary?term=${g.id}` })
  }
  for (const s of sources) {
    out.push({ id: s.id, kind: 'source', title: s.title, subtitle: s.publisher, path: `/sources?source=${s.id}` })
  }
  for (const m of modules) {
    out.push({ id: m.id, kind: 'module', title: m.title, subtitle: m.summary, path: `/tracks/${m.trackId}?module=${m.id}` })
  }
  return out
}

export function searchAll(query: string, limit = 20): SearchResult[] {
  if (!index) index = buildIndex()
  const q = query.trim().toLowerCase()
  if (!q) return []
  return index
    .filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q))
    .sort((a, b) => a.title.toLowerCase().indexOf(q) - b.title.toLowerCase().indexOf(q))
    .slice(0, limit)
}
