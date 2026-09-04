import type { RaidCard } from './types'

export const raidCards: RaidCard[] = [
  { id: 'rc-1', text: 'The customer has not supplied tenant admin access and configuration starts tomorrow.', correctCategory: ['issue', 'dependency'], explanation: 'Already blocking today (Issue) and something the work relies on (Dependency) — context-dependent, and that ambiguity should be named rather than forced into one box.' },
  { id: 'rc-2', text: 'We believe the pilot group is representative of the full user population, but this has not been confirmed.', correctCategory: ['assumption'], explanation: 'Believed true but unconfirmed — a classic assumption to validate before relying on it.' },
  { id: 'rc-3', text: 'There is a chance the vendor cannot meet the requested testing timeline.', correctCategory: ['risk'], explanation: 'Something that might happen, not something that has happened yet.' },
  { id: 'rc-4', text: 'Migration cannot begin until the external MSP completes DNS changes.', correctCategory: ['dependency'], explanation: 'The work explicitly relies on an outside party completing their piece first.' },
  { id: 'rc-5', text: 'Three users reported they cannot access their mailbox after this morning\'s change.', correctCategory: ['issue'], explanation: 'Something that has already happened and needs resolution now.' },
  { id: 'rc-6', text: 'The rollout assumes all laptops are already on a supported OS version.', correctCategory: ['assumption'], explanation: 'An unverified belief the plan is currently resting on.' },
  { id: 'rc-7', text: 'License purchase approval has not been confirmed and the pilot is scheduled for Monday.', correctCategory: ['issue', 'dependency'], explanation: 'Already a gap today, and something the pilot depends on to proceed — genuinely both.' },
  { id: 'rc-8', text: 'Enforcing Conditional Access before compliance reaches an acceptable rate could lock out legitimate users.', correctCategory: ['risk'], explanation: 'A potential future consequence of proceeding out of sequence — not something that has happened yet.' },
  { id: 'rc-9', text: 'The customer\'s legacy application does not support modern authentication.', correctCategory: ['issue'], explanation: 'A confirmed, current technical fact that constrains the plan — not a maybe.' },
  { id: 'rc-10', text: 'We are relying on the vendor to provide accurate documentation of database dependencies.', correctCategory: ['assumption', 'dependency'], explanation: 'Trusting unverified vendor input is an assumption, and needing that input at all is a dependency.' },
]

export const raidCardById = new Map(raidCards.map((r) => [r.id, r]))
