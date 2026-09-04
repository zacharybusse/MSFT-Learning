import type { Domain } from '../../content/types'
import { domainLabel, domainDotClass } from '../../lib/domainMeta'

export function DomainTag({ domain, size = 'sm' }: { domain: Domain; size?: 'sm' | 'xs' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] font-medium text-[color:var(--text-muted)] ${
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${domainDotClass[domain]}`} aria-hidden />
      {domainLabel[domain]}
    </span>
  )
}

export function StatusTag({ tone, children }: { tone: 'neutral' | 'good' | 'warn' | 'retired' | 'active'; children: React.ReactNode }) {
  const toneClass: Record<typeof tone, string> = {
    neutral: 'bg-[color:var(--bg-sunken)] text-[color:var(--text-muted)] border-[color:var(--border)]',
    good: 'bg-domain-coordination/10 text-domain-coordination border-domain-coordination/30',
    warn: 'bg-domain-licensing/10 text-domain-licensing border-domain-licensing/30',
    retired: 'bg-domain-security/10 text-domain-security border-domain-security/30',
    active: 'bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)] border-[color:var(--accent)]/30',
  }
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneClass[tone]}`}>{children}</span>
}
