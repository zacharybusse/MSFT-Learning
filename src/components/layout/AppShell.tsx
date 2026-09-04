import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Network,
  BookOpen,
  FlaskConical,
  Library,
  Brain,
  MessageSquareText,
  BarChart3,
  FileCheck2,
  CalendarDays,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react'
import { useStore } from '../../state/store'
import { CommandPalette } from './CommandPalette'
import { SOURCE_BASELINE_DATE } from '../../content/sources'

const navItems = [
  { to: '/', label: 'Command Center', icon: LayoutDashboard, end: true },
  { to: '/map', label: 'Ecosystem Map', icon: Network },
  { to: '/tracks', label: 'Learning Tracks', icon: BookOpen },
  { to: '/scenarios', label: 'Scenario Lab', icon: FlaskConical },
  { to: '/glossary', label: 'Glossary', icon: Library },
  { to: '/drills', label: 'Retrieval Drills', icon: Brain },
  { to: '/interview', label: 'Interview Prep', icon: MessageSquareText },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/sources', label: 'Sources', icon: FileCheck2 },
  { to: '/study-plan', label: '21-Day Plan', icon: CalendarDays },
]

function useAppliedTheme() {
  const theme = useStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const onChange = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    apply(theme === 'dark')
  }, [theme])
}

function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const options: { value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Laptop, label: 'System' },
  ]
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-0.5" role="radiogroup" aria-label="Theme">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={theme === o.value}
          onClick={() => setTheme(o.value)}
          className={`rounded-full p-1.5 ${theme === o.value ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--text-faint)] hover:text-[color:var(--text)]'}`}
          aria-label={o.label}
          title={o.label}
        >
          <o.icon size={14} />
        </button>
      ))}
    </div>
  )
}

export function AppShell() {
  useAppliedTheme()

  return (
    <div className="flex min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-[color:var(--accent)] focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="no-print sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-[color:var(--border)] bg-[color:var(--bg-elevated)] py-3 md:w-56 md:items-stretch md:px-2"
      >
        <div className="mb-2 hidden px-2 md:block">
          <p className="text-[13px] font-bold leading-tight text-[color:var(--text)]">MS PROJECT COORDINATOR</p>
          <p className="text-[11px] leading-tight text-[color:var(--text-faint)]">Learning Command Center</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors md:px-3 ${
                isActive
                  ? 'bg-[color:var(--accent)]/12 text-[color:var(--accent-strong)]'
                  : 'text-[color:var(--text-muted)] hover:bg-[color:var(--bg-sunken)] hover:text-[color:var(--text)]'
              }`
            }
          >
            <item.icon size={18} className="shrink-0" aria-hidden />
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
        <div className="mt-auto hidden px-2 pt-3 md:block">
          <p className="text-[10px] leading-snug text-[color:var(--text-faint)]">Source baseline: {SOURCE_BASELINE_DATE}. Verify volatile info against linked sources.</p>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[color:var(--border)] bg-[color:var(--bg)]/90 px-4 py-2.5 backdrop-blur">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex w-full max-w-sm items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-left text-sm text-[color:var(--text-faint)] hover:border-[color:var(--border-strong)]"
          >
            Search… <kbd className="ml-auto rounded border border-[color:var(--border)] px-1.5 text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </header>
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
