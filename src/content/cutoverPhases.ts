import type { CutoverPhase } from './types'

// Generic, safe phase names for a runbook template. No production commands
// — the trainer builds sequencing/ownership structure, not executable scripts.
export const cutoverPhases: CutoverPhase[] = [
  { id: 'cp-1', name: 'Pre-check', description: 'Confirm prerequisites, access, and environment readiness before freezing changes.' },
  { id: 'cp-2', name: 'Freeze / Readiness', description: 'Stop non-essential changes to the environment ahead of the cutover window.' },
  { id: 'cp-3', name: 'Backup', description: 'Take and confirm a restorable backup or recovery point before making changes.' },
  { id: 'cp-4', name: 'Configuration', description: 'Apply the planned configuration changes in the target environment.' },
  { id: 'cp-5', name: 'Migration / Change', description: 'Execute the core migration or change activity.' },
  { id: 'cp-6', name: 'DNS / Routing Switch', description: 'Update DNS or routing if the change requires redirecting traffic — only when relevant to this cutover.' },
  { id: 'cp-7', name: 'Validation', description: 'Confirm the change worked using agreed, specific checks.' },
  { id: 'cp-8', name: 'Business Acceptance', description: 'Get sign-off from the business owner against agreed acceptance criteria.' },
  { id: 'cp-9', name: 'Hypercare', description: 'Provide a defined period of elevated support immediately after go-live.' },
  { id: 'cp-10', name: 'Closeout', description: 'Confirm hypercare exit criteria are met and hand off to normal operations.' },
]

export const cutoverPhaseById = new Map(cutoverPhases.map((c) => [c.id, c]))
