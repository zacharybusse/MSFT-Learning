import type { Domain } from '../content/types'

export const domainLabel: Record<Domain, string> = {
  foundation: 'IT Foundation',
  cloud: 'Cloud / AZ-900',
  m365: 'Microsoft 365',
  identity: 'Identity',
  endpoint: 'Endpoint',
  security: 'Security',
  migration: 'Migration',
  licensing: 'Licensing',
  coordination: 'Coordination',
}

// Tailwind can't resolve a template-literal class name, so the dot color
// is mapped explicitly to a full, statically-greppable class per domain.
export const domainDotClass: Record<Domain, string> = {
  foundation: 'bg-domain-foundation',
  cloud: 'bg-domain-azure',
  m365: 'bg-domain-m365',
  identity: 'bg-domain-identity',
  endpoint: 'bg-domain-endpoint',
  security: 'bg-domain-security',
  migration: 'bg-domain-migration',
  licensing: 'bg-domain-licensing',
  coordination: 'bg-domain-coordination',
}
