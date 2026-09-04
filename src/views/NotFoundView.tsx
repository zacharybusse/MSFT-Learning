import { Link } from 'react-router-dom'

export function NotFoundView() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">404</p>
      <h1 className="text-xl font-bold">Page not found</h1>
      <Link to="/" className="text-sm font-medium text-[color:var(--accent-strong)] hover:underline">
        Return to Command Center
      </Link>
    </div>
  )
}
