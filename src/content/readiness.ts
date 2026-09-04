import type { ReadinessItem } from './types'

export const readinessChecklist: ReadinessItem[] = [
  { id: 'rd-1', label: 'Explain core cloud concepts (deployment models, shared responsibility, service models)', domain: 'cloud' },
  { id: 'rd-2', label: 'Draw the Azure hierarchy (tenant → subscription → resource group → resource)', domain: 'cloud' },
  { id: 'rd-3', label: 'Explain the Microsoft 365 workloads and what each does', domain: 'm365' },
  { id: 'rd-4', label: 'Explain the identity chain (AD DS → hybrid identity → Entra ID → Conditional Access)', domain: 'identity' },
  { id: 'rd-5', label: 'Explain what Intune does and how it connects to Conditional Access', domain: 'endpoint' },
  { id: 'rd-6', label: 'Describe the migration lifecycle end to end', domain: 'migration' },
  { id: 'rd-7', label: 'Classify a situation as Risk, Assumption, Issue, or Dependency', domain: 'coordination' },
  { id: 'rd-8', label: 'Build a basic cutover checklist with owners and rollback', domain: 'coordination' },
  { id: 'rd-9', label: 'Discuss licensing at a conceptual level, including why it can block a project', domain: 'licensing' },
]

// Explicit checklist bands — not a fabricated overall score. Each item is
// either checked (learner self-marks after genuinely practicing it) or not.
export const readinessById = new Map(readinessChecklist.map((r) => [r.id, r]))
