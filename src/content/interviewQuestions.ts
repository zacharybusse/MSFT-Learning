export type InterviewQuestion = {
  id: string
  question: string
  keyConcepts: string[]
  strongAnswerOutline: string[]
  commonMisconceptions: string[]
  sourceIds: string[]
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'iq-1',
    question: 'What is a Microsoft 365 tenant?',
    keyConcepts: ['Dedicated Entra ID instance', 'Organizational boundary', 'Holds identities and directory data'],
    strongAnswerOutline: ['Define tenant as the dedicated Entra ID instance representing the organization', 'Mention it holds identities and is the boundary licensing and services attach to', 'Note tenant readiness (domain verification) as a common prerequisite'],
    commonMisconceptions: ['Confusing "tenant" with "subscription" — a tenant is the identity boundary; a subscription is a billing/access boundary within Azure, tied to a tenant.'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-2',
    question: 'Explain Azure subscription vs. resource group.',
    keyConcepts: ['Subscription: billing/access boundary', 'Resource group: logical container for related resources', 'Hierarchy: tenant → subscription → resource group → resource'],
    strongAnswerOutline: ['Subscription groups resources for billing and access at a broad level', 'Resource group groups related resources for a specific solution, managed together', 'Give the full hierarchy for context'],
    commonMisconceptions: ['Treating them as interchangeable — they solve different problems (billing/access vs. lifecycle grouping).'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-3',
    question: 'AD DS vs. Entra ID — what is the difference?',
    keyConcepts: ['AD DS: on-premises directory', 'Entra ID: cloud identity service', 'Hybrid identity connects them via Entra Connect'],
    strongAnswerOutline: ['AD DS is the traditional on-prem directory service', 'Entra ID is Microsoft\'s cloud identity and access service', 'Many organizations run both together as hybrid identity'],
    commonMisconceptions: ['Assuming Entra ID is just "AD DS in the cloud" with identical features — it is a different service built for cloud-first scenarios, connected via sync rather than being a lift-and-shift of AD DS.'],
    sourceIds: ['sc900-cert'],
  },
  {
    id: 'iq-4',
    question: 'What is hybrid identity?',
    keyConcepts: ['On-prem AD DS + cloud Entra ID', 'Directory synchronization (Entra Connect)', 'Consistent identity across both environments'],
    strongAnswerOutline: ['Define hybrid identity as integrating on-prem AD DS with Entra ID', 'Mention Entra Connect as the sync mechanism', 'Note this lets an org keep an existing directory while enabling cloud access'],
    commonMisconceptions: ['Assuming hybrid identity means users have two separate, unrelated accounts — the goal is a consistent identity, not duplication.'],
    sourceIds: ['sc900-cert'],
  },
  {
    id: 'iq-5',
    question: 'What is Conditional Access?',
    keyConcepts: ['Policy engine', 'Signals: user, device, location, risk', 'Enforces access decisions like requiring MFA or blocking access'],
    strongAnswerOutline: ['Define it as a policy engine that evaluates context to make access decisions', 'Give an example signal (device compliance, risk)', 'Mention the need for pilot/exception planning (break-glass accounts) before broad enforcement'],
    commonMisconceptions: ['Describing it as a simple on/off access switch rather than a conditional, signal-based policy engine.'],
    sourceIds: ['sc900-cert'],
  },
  {
    id: 'iq-6',
    question: 'What does Intune do?',
    keyConcepts: ['Cloud-based endpoint management', 'MDM (whole device) and MAM (app-level)', 'Feeds compliance signal to Conditional Access'],
    strongAnswerOutline: ['Define Intune as a cloud service for managing devices and apps', 'Distinguish MDM vs. MAM briefly', 'Connect it to Conditional Access via compliance policy'],
    commonMisconceptions: ['Assuming Intune only manages phones — it manages Windows, mobile, and other endpoint types.'],
    sourceIds: ['m365-admin-path'],
  },
  {
    id: 'iq-7',
    question: 'Difference between OneDrive and SharePoint?',
    keyConcepts: ['OneDrive: personal storage', 'SharePoint: shared team/site storage'],
    strongAnswerOutline: ['OneDrive is scoped to the individual user', 'SharePoint is shared, permissioned team/site content'],
    commonMisconceptions: ['Assuming they are unrelated products — Teams file storage is actually backed by SharePoint.'],
    sourceIds: ['ab900-what-is-m365'],
  },
  {
    id: 'iq-8',
    question: 'Why would a migration use a pilot?',
    keyConcepts: ['Validate approach at small scale', 'Representative group, including edge cases', 'Reduces blast radius of issues'],
    strongAnswerOutline: ['Explain that a pilot surfaces issues before broad rollout', 'Emphasize the pilot group should be representative, not just the easiest users'],
    commonMisconceptions: ['Choosing a pilot group made up only of the most technical, cooperative users — this hides real-world edge cases.'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-9',
    question: 'What is rollback?',
    keyConcepts: ['Predefined revert path', 'Triggered by a defined failure condition', 'Depends on a validated backup'],
    strongAnswerOutline: ['Define rollback as the planned path back to the prior known-good state', 'Mention it should be predefined, with a clear trigger condition, not improvised'],
    commonMisconceptions: ['Treating rollback as an afterthought decided in the moment rather than planned before cutover.'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-10',
    question: 'What is RPO vs. RTO?',
    keyConcepts: ['RPO: acceptable data loss (time)', 'RTO: acceptable time to restore'],
    strongAnswerOutline: ['RPO measures acceptable data loss window, driving backup frequency', 'RTO measures acceptable downtime, driving recovery speed requirements'],
    commonMisconceptions: ['Mixing up which one is about data loss versus downtime.'],
    sourceIds: ['az900-cloud-concepts'],
  },
  {
    id: 'iq-11',
    question: 'What is RAID?',
    keyConcepts: ['Risks, Assumptions, Issues, Dependencies', 'Tracking framework for project uncertainty'],
    strongAnswerOutline: ['Define each of the four categories briefly', 'Give an example that shows the distinction between risk and issue'],
    commonMisconceptions: ['Confusing project RAID with the storage acronym RAID (Redundant Array of Independent Disks) — same letters, unrelated meaning.'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-12',
    question: 'What is a technical dependency?',
    keyConcepts: ['Something the work relies on', 'Can be internal or external (vendor, MSP)', 'Should be identified early, not discovered mid-project'],
    strongAnswerOutline: ['Define dependency as something the project needs from elsewhere to proceed', 'Give an example of an external dependency (DNS owned by an MSP)'],
    commonMisconceptions: ['Treating every uncertainty as a risk rather than distinguishing a true dependency (something required) from a risk (something that might happen).'],
    sourceIds: ['az900-architecture'],
  },
  {
    id: 'iq-13',
    question: 'Why can licensing block a project?',
    keyConcepts: ['Without enough purchased/assigned licenses, users cannot use the service', 'Term commitments can limit changes'],
    strongAnswerOutline: ['Explain that technical readiness alone does not grant access — licensing must also be in place', 'Mention that licensing terms should always be verified, since they change'],
    commonMisconceptions: ['Assuming licensing is purely an administrative afterthought that never affects technical timelines.'],
    sourceIds: ['ms900-licensing-support'],
  },
]
