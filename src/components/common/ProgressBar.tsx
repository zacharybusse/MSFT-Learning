export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--bg-sunken)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[color:var(--accent)] transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
