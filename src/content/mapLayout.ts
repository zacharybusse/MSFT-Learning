import type { MapLayer } from './types'

export type MapLayerDef = {
  layer: MapLayer
  label: string
  description: string
  conceptIds: string[]
}

// The curated ecosystem map structure (section 8 of the build spec). Not
// every concept in the library appears on the map — only the layer-defining
// nodes. Edges are derived from each concept's dependsOn/usedBy at render
// time, so this file only decides which nodes exist and which layer they
// render in.
export const mapLayers: MapLayerDef[] = [
  {
    layer: 'business',
    label: 'Business / Users',
    description: 'The people and business outcomes everything below exists to serve.',
    conceptIds: [],
  },
  {
    layer: 'workloads',
    label: 'Microsoft 365 / Business Applications / Data',
    description: 'Productivity, collaboration, low-code apps, and analytics workloads.',
    conceptIds: ['m365-ecosystem', 'power-platform', 'data-analytics-workloads'],
  },
  {
    layer: 'identity',
    label: 'Identity & Access (cross-cutting)',
    description: 'Entra ID and the access controls layered on top of it — cuts across every other layer.',
    conceptIds: ['entra-id', 'mfa', 'conditional-access', 'rbac'],
  },
  {
    layer: 'endpoint',
    label: 'Endpoint',
    description: 'Device enrollment, configuration, and compliance.',
    conceptIds: ['intune', 'mdm', 'mam', 'autopilot', 'compliance-policy'],
  },
  {
    layer: 'azure',
    label: 'Azure Platform',
    description: 'Compute, networking, storage, and databases.',
    conceptIds: ['compute', 'vnet', 'storage', 'azure-database'],
  },
  {
    layer: 'security',
    label: 'Security / Governance',
    description: 'Threat protection, monitoring, and policy enforcement.',
    conceptIds: ['defender-family', 'sentinel', 'purview', 'azure-policy', 'azure-monitor'],
  },
  {
    layer: 'operations',
    label: 'Operations / Delivery Overlay',
    description: 'Admin centers, service health, licensing, and change/cutover control.',
    conceptIds: ['m365-admin-center', 'service-health', 'license-assignment', 'change-control', 'cutover'],
  },
]

export const allMapConceptIds = mapLayers.flatMap((l) => l.conceptIds)
