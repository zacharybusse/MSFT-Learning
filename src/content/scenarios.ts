import type { Scenario } from './types'

// All scenarios are simulated, fixed-fact training situations — never
// dynamically generated. See sources.ts ('sim-scenario-lab').
export const scenarios: Scenario[] = [
  {
    id: 'scn-m365-migration',
    title: 'Microsoft 365 Migration from Google Workspace',
    brief:
      'A 250-user customer wants to move from Google Workspace to Microsoft 365. DNS is managed by an external MSP. 20 executives require white-glove support. The customer has requested a Friday cutover.',
    currentState: ['Google Workspace (mail, docs, chat) for ~250 users', 'DNS zone managed by an external MSP, not the customer directly', 'No pilot group identified yet', 'No stated maintenance window besides the requested Friday date'],
    objectives: [
      'Migrate mail, calendar, and files to Microsoft 365',
      'Provide white-glove support to 20 named executives',
      'Complete cutover with minimal business disruption',
    ],
    facts: [
      '250 total users',
      '20 executives flagged for white-glove support',
      'DNS is owned by an external MSP, not the customer',
      'Customer requested a Friday cutover',
    ],
    unknowns: [
      'Exact DNS change lead time from the external MSP',
      'Whether app compatibility (e.g., add-ins) has been assessed',
      'Whether a pilot cohort has been agreed',
      'Support staffing available over the requested weekend window',
    ],
    architectureNodes: ['m365-ecosystem', 'exchange-online', 'sharepoint-online', 'onedrive', 'dns', 'entra-id', 'license-assignment'],
    questionsToAsk: [
      { question: 'Who has administrative access to the DNS zone, and what is the MSP\'s standard change lead time?', whyItMatters: 'DNS is an external dependency outside the project team\'s direct control — this sets a hard scheduling constraint.', essential: true },
      { question: 'Can we run a pilot mailbox cohort before the full 250-user cutover?', whyItMatters: 'A pilot surfaces migration issues on a small group before broad user impact.', essential: true },
      { question: 'Are enough Microsoft 365 licenses purchased and ready to assign before the pilot?', whyItMatters: 'Licensing can block onboarding even when the technical migration path is ready.', essential: true },
      { question: 'What does "white-glove support" specifically mean for the 20 executives — dedicated staff, extended hours, 1:1 sessions?', whyItMatters: 'Vague VIP commitments create risk if expectations are not defined and staffed for.', essential: true },
      { question: 'Does a Friday cutover leave enough time to validate and roll back before Monday business hours?', whyItMatters: 'A tight window with no margin is a schedule risk that should be raised explicitly, not silently accepted.', essential: true },
      { question: 'What is the rollback plan if mail routing does not work as expected after the DNS change?', whyItMatters: 'Every cutover needs a defined way back to the prior state if validation fails.', essential: false },
    ],
    actions: [
      { id: 'a1', text: 'DNS zone is owned by an external MSP not directly controlled by the project team', correctCategory: 'dependency' },
      { id: 'a2', text: 'We assume the MSP can turn around DNS changes within 24 hours', correctCategory: 'assumption', contextNote: 'Unconfirmed belief — needs validation with the actual MSP.' },
      { id: 'a3', text: 'No pilot cohort has been identified yet, and the full migration is one week away', correctCategory: ['issue', 'risk'], contextNote: 'Already a gap today (issue) and creates risk of undetected problems at scale.' },
      { id: 'a4', text: 'There is a chance some executives use email add-ins that may not be compatible post-migration', correctCategory: 'risk' },
      { id: 'a5', text: 'Decision: pilot cohort will include 15 general users and 3 executives before full cutover', correctCategory: 'decision' },
      { id: 'a6', text: 'Confirm license count and assign licenses to the pilot cohort by Wednesday', correctCategory: 'action' },
      { id: 'a7', text: 'Cutover cannot proceed until DNS records are updated by the external MSP', correctCategory: 'dependency' },
      { id: 'a8', text: 'Requested Friday cutover leaves no buffer before Monday morning business hours', correctCategory: 'risk' },
    ],
    rubricItems: [
      { id: 'r1', label: 'Identified DNS as an external dependency' },
      { id: 'r2', label: 'Recommended a pilot cohort before full cutover' },
      { id: 'r3', label: 'Flagged licensing readiness as a blocker to confirm' },
      { id: 'r4', label: 'Questioned the vague "white-glove support" commitment' },
      { id: 'r5', label: 'Raised the Friday cutover as a schedule risk' },
      { id: 'r6', label: 'Asked about rollback/contingency before committing to the date' },
    ],
    afterActionExplanation:
      'This scenario is built around a common pattern: an external dependency (MSP-owned DNS), an undefined pilot, and a schedule request that does not obviously account for validation and rollback time. A strong coordinator surfaces all three before agreeing to the date, without needing to know the deep technical mechanics of migration itself.',
    sourceIds: ['sim-scenario-lab', 'ab900-what-is-m365'],
    note: 'simulation',
  },
  {
    id: 'scn-azure-server-migration',
    title: 'Azure Server Migration Ahead of Datacenter Contract Expiration',
    brief:
      'Three Windows application servers must move out of a colocation datacenter before the facility contract expires. Application dependencies between the three servers are not fully documented.',
    currentState: ['3 Windows application servers in a leased colocation datacenter', 'Datacenter contract has a fixed expiration date', 'Dependencies between the three servers are only partially documented'],
    objectives: ['Migrate all three servers to Azure before the contract expires', 'Avoid unplanned downtime for the dependent applications', 'Establish a validated rollback path in case of migration failure'],
    facts: ['3 servers, Windows OS', 'Fixed, non-negotiable contract expiration date', 'Dependencies between servers are only partially known'],
    unknowns: ['Exact network and application dependencies between the three servers', 'Target Azure subscription and governance structure', 'Backup and rollback readiness', 'Whether any server has app dependencies outside the three (databases, licensing servers, etc.)'],
    architectureNodes: ['compute', 'vnet', 'azure-subscription', 'backup', 'discover-phase'],
    questionsToAsk: [
      { question: 'Has a full dependency discovery been done across all three servers and anything they connect to?', whyItMatters: 'Undocumented dependencies are the most common cause of migration-day surprises.', essential: true },
      { question: 'What Azure subscription and resource group structure will these servers land in, and who governs it?', whyItMatters: 'Governance and access need to be established before resources are provisioned.', essential: true },
      { question: 'Have backups been taken and test-restored before migration begins?', whyItMatters: 'A completed backup job is not proof of a usable recovery point.', essential: true },
      { question: 'What is the actual hard deadline, and how much buffer exists before it?', whyItMatters: 'A fixed external deadline (contract expiration) changes how much schedule risk is acceptable.', essential: true },
      { question: 'What is the validation plan to confirm each server works correctly in Azure before decommissioning the colo servers?', whyItMatters: 'Validation should be defined before cutover, not improvised afterward.', essential: false },
    ],
    actions: [
      { id: 'a1', text: 'Dependencies between the three servers are only partially documented', correctCategory: 'issue' },
      { id: 'a2', text: 'The datacenter contract expires on a fixed date that cannot be extended', correctCategory: 'dependency' },
      { id: 'a3', text: 'There is a chance an undocumented dependency causes an outage after migration', correctCategory: 'risk' },
      { id: 'a4', text: 'We assume all three servers can be migrated as a single wave', correctCategory: 'assumption', contextNote: 'Unconfirmed — depends on the undiscovered dependency map.' },
      { id: 'a5', text: 'Decision: complete a full dependency discovery pass before scheduling any cutover date', correctCategory: 'decision' },
      { id: 'a6', text: 'Take and test-restore a backup of each server before migration begins', correctCategory: 'action' },
    ],
    rubricItems: [
      { id: 'r1', label: 'Prioritized dependency discovery before scheduling cutover' },
      { id: 'r2', label: 'Questioned whether the migration should be one wave or sequenced' },
      { id: 'r3', label: 'Confirmed backup and restore validation before migration' },
      { id: 'r4', label: 'Anchored planning to the fixed external deadline' },
      { id: 'r5', label: 'Defined validation criteria before declaring success' },
    ],
    afterActionExplanation:
      'This scenario tests whether the learner defaults to "just migrate it" or insists on discovery first, given an externally fixed deadline that creates pressure to skip steps. The correct instinct is to compress the schedule around discovery and validation, not skip them.',
    sourceIds: ['sim-scenario-lab', 'az900-architecture'],
    note: 'simulation',
  },
  {
    id: 'scn-intune-rollout',
    title: 'Intune Rollout Ahead of Stricter Conditional Access',
    brief:
      '800 Windows laptops need to be enrolled and brought to a compliant state in Intune before the organization enforces stricter Conditional Access policies that require device compliance.',
    currentState: ['800 Windows laptops, mixed enrollment status', 'Conditional Access policies currently do not require device compliance', 'Target: enforce compliance-based Conditional Access after rollout'],
    objectives: ['Enroll and configure all 800 laptops in Intune', 'Reach an acceptable compliance rate', 'Enforce stricter Conditional Access only after compliance is established'],
    facts: ['800 laptops', 'Target end-state ties access to device compliance'],
    unknowns: ['Current enrollment percentage', 'What compliance policy thresholds will be required', 'Support capacity for enrollment issues at this scale'],
    architectureNodes: ['intune', 'compliance-policy', 'conditional-access', 'enrollment', 'autopilot'],
    questionsToAsk: [
      { question: 'What is the current enrollment and compliance rate today, before rollout begins?', whyItMatters: 'You need a baseline to know how much work remains and to set a realistic rollout pace.', essential: true },
      { question: 'What specific compliance rate must be reached before Conditional Access enforcement goes live?', whyItMatters: 'Without an explicit sequencing gate, enforcement could go live and lock out non-compliant but legitimate users.', essential: true },
      { question: 'Is there a break-glass or exception process for devices that cannot enroll in time?', whyItMatters: 'Enforcement without exceptions risks blocking users who have a legitimate reason for delay.', essential: true },
      { question: 'What support capacity exists for enrollment issues at 800-device scale?', whyItMatters: 'Rollout pacing should match realistic support capacity, not just calendar ambition.', essential: false },
    ],
    actions: [
      { id: 'a1', text: 'Conditional Access enforcement is scheduled before enrollment is confirmed complete', correctCategory: 'risk' },
      { id: 'a2', text: 'We assume most laptops will enroll without issue', correctCategory: 'assumption' },
      { id: 'a3', text: 'Decision: enforce Conditional Access only once compliance reaches an agreed threshold, not on a fixed calendar date', correctCategory: 'decision' },
      { id: 'a4', text: 'Enrollment support capacity has not been confirmed for 800 devices', correctCategory: 'issue' },
      { id: 'a5', text: 'Compliance policy configuration depends on Intune enrollment being completed first', correctCategory: 'dependency' },
      { id: 'a6', text: 'Pilot the compliance policy on a small device group before applying it fleet-wide', correctCategory: 'action' },
    ],
    rubricItems: [
      { id: 'r1', label: 'Sequenced enrollment/compliance before Conditional Access enforcement' },
      { id: 'r2', label: 'Tied enforcement to a compliance threshold, not a fixed date' },
      { id: 'r3', label: 'Asked about exception handling for late-enrolling devices' },
      { id: 'r4', label: 'Considered support capacity at 800-device scale' },
    ],
    afterActionExplanation:
      'This scenario is a direct test of endpoint-before-access sequencing: Conditional Access should gate on device state, but only once that state is broadly and verifiably ready — not on a fixed calendar date regardless of readiness.',
    sourceIds: ['sim-scenario-lab', 'm365-admin-path'],
    note: 'simulation',
  },
  {
    id: 'scn-security-change',
    title: 'MFA and Conditional Access Rollout After a Security Incident',
    brief:
      'Following a security incident, the organization wants to roll out MFA and stricter Conditional Access broadly and quickly. Some legacy applications do not support modern authentication.',
    currentState: ['Recent security incident involving compromised credentials', 'MFA not consistently enforced today', 'Some legacy line-of-business applications rely on older authentication methods'],
    objectives: ['Roll out MFA broadly', 'Enforce Conditional Access policy consistent with Zero Trust principles', 'Avoid locking out legitimate users, including via legacy apps'],
    facts: ['A security incident already occurred', 'Legacy apps exist that may not support modern authentication', 'Organizational urgency is high following the incident'],
    unknowns: ['Full inventory of legacy apps and their authentication methods', 'Whether break-glass emergency access accounts exist', 'Pilot group and support readiness for the rollout'],
    architectureNodes: ['mfa', 'conditional-access', 'zero-trust', 'entra-id'],
    questionsToAsk: [
      { question: 'Is there a break-glass (emergency access) account excluded from policy in case of admin lockout?', whyItMatters: 'Without one, a policy misconfiguration could lock out every administrator simultaneously.', essential: true },
      { question: 'What is the full inventory of legacy applications that may not support modern authentication?', whyItMatters: 'Enforcing MFA/Conditional Access broadly without exceptions can break legitimate legacy app access.', essential: true },
      { question: 'Can the rollout start with a pilot group despite the post-incident urgency?', whyItMatters: 'Urgency increases pressure to skip piloting, which is exactly when mistakes are most costly.', essential: true },
      { question: 'What exception process exists for legacy apps that genuinely cannot support the new policy yet?', whyItMatters: 'Exceptions should be deliberate and tracked, not implicit gaps discovered after lockout.', essential: false },
    ],
    actions: [
      { id: 'a1', text: 'No break-glass account has been confirmed to exist', correctCategory: ['issue', 'risk'], contextNote: 'A current gap (issue) that also creates forward risk of total lockout.' },
      { id: 'a2', text: 'Legacy application authentication compatibility has not been fully inventoried', correctCategory: 'issue' },
      { id: 'a3', text: 'Broad enforcement could lock out users on unsupported legacy apps', correctCategory: 'risk' },
      { id: 'a4', text: 'We assume urgency justifies skipping the pilot phase', correctCategory: 'assumption', contextNote: 'A dangerous, unconfirmed assumption worth challenging directly.' },
      { id: 'a5', text: 'Decision: confirm a break-glass account before any policy change is enabled', correctCategory: 'decision' },
      { id: 'a6', text: 'Inventory legacy app authentication methods before broad enforcement', correctCategory: 'action' },
    ],
    rubricItems: [
      { id: 'r1', label: 'Insisted on a break-glass account before enforcement' },
      { id: 'r2', label: 'Flagged legacy app compatibility as a blocker to inventory first' },
      { id: 'r3', label: 'Pushed back on skipping the pilot despite urgency' },
      { id: 'r4', label: 'Distinguished "urgent" from "skip the basics"' },
    ],
    afterActionExplanation:
      'Post-incident urgency is exactly when coordinators are pressured to skip safeguards. This scenario rewards recognizing that a break-glass account and legacy app exceptions are non-negotiable even under time pressure.',
    sourceIds: ['sim-scenario-lab', 'sc900-cert'],
    note: 'simulation',
  },
  {
    id: 'scn-sql-migration',
    title: 'SQL Database Migration to Azure',
    brief:
      'An application team wants its on-premises SQL Server database migrated to Azure. The database owner is a third-party vendor, not internal IT.',
    currentState: ['On-premises SQL Server database', 'Application owned internally, database supported by a third-party vendor', 'No confirmed RPO/RTO for this workload yet'],
    objectives: ['Migrate the database to an appropriate Azure database service', 'Maintain application functionality post-migration', 'Meet business-acceptable recovery objectives'],
    facts: ['Database is vendor-supported, not internally managed', 'No RPO/RTO has been documented for this workload'],
    unknowns: ['SQL Server version and compatibility with the Azure target', 'Vendor availability and cooperation for testing', 'Acceptable downtime window', 'Whether the vendor contract even permits this kind of migration work'],
    architectureNodes: ['azure-database', 'database', 'backup', 'rpo', 'rto', 'application'],
    questionsToAsk: [
      { question: 'Who is the application owner, and who is the database vendor/DBA, and are both available for this project?', whyItMatters: 'A vendor-owned database means the project depends on a party outside direct organizational control.', essential: true },
      { question: 'Has SQL Server version compatibility with the target Azure database service been assessed?', whyItMatters: 'Version incompatibility can silently break functionality after migration.', essential: true },
      { question: 'What are the RPO and RTO for this workload, and who set them?', whyItMatters: 'Without documented recovery objectives, backup design and downtime planning have no target to meet.', essential: true },
      { question: 'Has a backup been taken and test-restored before migration begins?', whyItMatters: 'Confirms a safe fallback exists if migration or validation fails.', essential: true },
      { question: 'What downtime, if any, is acceptable to the business for this cutover?', whyItMatters: 'Sets the real constraint the migration approach and maintenance window must fit inside.', essential: false },
    ],
    actions: [
      { id: 'a1', text: 'The database vendor\'s availability for this project has not been confirmed', correctCategory: 'dependency' },
      { id: 'a2', text: 'No RPO/RTO has been documented for this workload', correctCategory: 'issue' },
      { id: 'a3', text: 'SQL Server version compatibility with the Azure target has not been assessed', correctCategory: 'risk' },
      { id: 'a4', text: 'We assume the vendor will support testing on the project\'s timeline', correctCategory: 'assumption' },
      { id: 'a5', text: 'Decision: document RPO/RTO with the business owner before finalizing the migration design', correctCategory: 'decision' },
      { id: 'a6', text: 'Confirm vendor availability and contract scope for migration support', correctCategory: 'action' },
    ],
    rubricItems: [
      { id: 'r1', label: 'Identified the vendor relationship as an external dependency' },
      { id: 'r2', label: 'Flagged missing RPO/RTO as something to resolve before design' },
      { id: 'r3', label: 'Raised version compatibility as a risk to assess' },
      { id: 'r4', label: 'Required backup/restore validation before migration' },
      { id: 'r5', label: 'Connected acceptable downtime to the maintenance window decision' },
    ],
    afterActionExplanation:
      'This scenario tests whether the learner treats a third-party vendor relationship as a real project dependency requiring active coordination, and whether they insist on RPO/RTO being defined rather than assumed.',
    sourceIds: ['sim-scenario-lab', 'az900-architecture'],
    note: 'simulation',
  },
]

export const scenarioById = new Map(scenarios.map((s) => [s.id, s]))
