import { concepts } from './concepts'
import type { GlossaryTerm } from './types'

// The glossary is generated from the concept library (so definitions stay
// consistent in one place) plus a small set of glossary-only terms that
// don't warrant a full ecosystem-map concept entry of their own.
const fromConcepts: GlossaryTerm[] = concepts.map((c) => ({
  id: c.id,
  term: c.name,
  acronym: c.acronym,
  definition: c.definition,
  domain: c.domain,
  aliases: c.aliases,
  relatedTerms: c.relatedConcepts,
  projectRelevance: c.projectRelevance[0] ?? '',
  sourceIds: c.sourceIds,
  lastVerified: c.verificationDate,
  conceptId: c.id,
}))

const extras: GlossaryTerm[] = [
  {
    id: 'azure-platform',
    term: 'Azure',
    definition: 'Microsoft\'s public cloud platform, offering compute, networking, storage, database, identity, and management services.',
    domain: 'cloud',
    relatedTerms: ['azure-tenant', 'azure-subscription', 'compute'],
    projectRelevance: 'The umbrella platform most cloud-infrastructure project work in this app happens on.',
    sourceIds: ['az900-architecture'],
    lastVerified: '2026-09-01',
  },
  {
    id: 'vm',
    term: 'Virtual Machine',
    acronym: 'VM',
    definition: 'A software-based emulation of a physical computer, running an operating system and applications on shared underlying hardware.',
    domain: 'cloud',
    relatedTerms: ['compute', 'iaas-paas-saas'],
    projectRelevance: 'Lift-and-shift migrations commonly move workloads into Azure VMs as the first step before considering re-platforming.',
    sourceIds: ['az900-architecture'],
    lastVerified: '2026-09-01',
    conceptId: 'compute',
  },
  {
    id: 'paas-term',
    term: 'Platform as a Service',
    acronym: 'PaaS',
    definition: 'A cloud service model providing a managed platform (runtime, middleware) so customers build and run applications without managing the underlying servers.',
    domain: 'cloud',
    relatedTerms: ['iaas-paas-saas', 'shared-responsibility'],
    projectRelevance: 'Choosing PaaS over IaaS shifts patching and platform maintenance responsibility to Microsoft.',
    sourceIds: ['az900-cloud-concepts'],
    lastVerified: '2026-09-01',
    conceptId: 'iaas-paas-saas',
  },
  {
    id: 'saas-term',
    term: 'Software as a Service',
    acronym: 'SaaS',
    definition: 'A cloud service model delivering a ready-to-use application over the internet, with the provider managing nearly everything underneath it.',
    domain: 'cloud',
    relatedTerms: ['iaas-paas-saas', 'm365-ecosystem'],
    projectRelevance: 'Microsoft 365 is delivered as SaaS — customers configure and use it rather than build or maintain the underlying platform.',
    sourceIds: ['az900-cloud-concepts'],
    lastVerified: '2026-09-01',
    conceptId: 'iaas-paas-saas',
  },
  {
    id: 'iaas-term',
    term: 'Infrastructure as a Service',
    acronym: 'IaaS',
    definition: 'A cloud service model providing raw compute, storage, and networking resources, leaving the operating system and above to the customer.',
    domain: 'cloud',
    relatedTerms: ['iaas-paas-saas', 'compute'],
    projectRelevance: 'IaaS carries the most customer-managed responsibility of the three service models — relevant when estimating operational effort.',
    sourceIds: ['az900-cloud-concepts'],
    lastVerified: '2026-09-01',
    conceptId: 'iaas-paas-saas',
  },
  {
    id: 'cmdb',
    term: 'Configuration Management Database',
    acronym: 'CMDB',
    definition: 'A repository that tracks IT assets (configuration items) and their relationships, used to understand what exists and how it connects.',
    domain: 'coordination',
    relatedTerms: ['discover-phase', 'action-log'],
    projectRelevance: 'A maintained CMDB (or its absence) directly affects how much discovery work a migration project needs.',
    sourceIds: ['az900-architecture'],
    lastVerified: '2026-09-01',
  },
  {
    id: 'msp',
    term: 'Managed Service Provider',
    acronym: 'MSP',
    definition: 'A third-party company contracted to manage IT infrastructure or services (such as networking or DNS) on a customer\'s behalf.',
    domain: 'coordination',
    relatedTerms: ['dns', 'csp'],
    projectRelevance: 'An external MSP managing a system (e.g., DNS) is a common external dependency that adds coordination lead time to a project.',
    sourceIds: ['az900-architecture'],
    lastVerified: '2026-09-01',
  },
]

export const glossary: GlossaryTerm[] = [...fromConcepts, ...extras].sort((a, b) => a.term.localeCompare(b.term))

export const glossaryById = new Map(glossary.map((g) => [g.id, g]))
