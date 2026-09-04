import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchAll } from '../../lib/search'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  if (!open) return null

  const results = searchAll(query)

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 pt-24" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--border)] px-4 py-3">
          <Search size={16} className="text-[color:var(--text-faint)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, glossary, sources, modules…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-faint)]"
            aria-label="Search"
          />
          <kbd className="hidden rounded border border-[color:var(--border)] px-1.5 py-0.5 text-[10px] text-[color:var(--text-faint)] sm:block">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto scrollbar-thin">
          {results.length === 0 && query && <li className="px-4 py-6 text-center text-sm text-[color:var(--text-faint)]">No results</li>}
          {results.map((r) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                onClick={() => {
                  navigate(r.path)
                  setOpen(false)
                }}
                className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-[color:var(--bg-sunken)] focus-visible:bg-[color:var(--bg-sunken)]"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-[color:var(--text)]">
                  <span className="rounded border border-[color:var(--border)] px-1 py-0 text-[10px] uppercase tracking-wide text-[color:var(--text-faint)]">{r.kind}</span>
                  {r.title}
                </span>
                <span className="line-clamp-1 text-xs text-[color:var(--text-muted)]">{r.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
