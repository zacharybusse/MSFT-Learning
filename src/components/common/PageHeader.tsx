export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="border-b border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">{eyebrow}</p>}
          <h1 className="text-xl font-bold text-[color:var(--text)] sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-[color:var(--text-muted)]">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
