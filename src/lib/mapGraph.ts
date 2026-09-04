import type { Edge, Node } from 'reactflow'
import { mapLayers } from '../content/mapLayout'
import { conceptById } from '../content/concepts'

export type MapNodeData = {
  label: string
  acronym?: string
  domain: string
  layer: string
  conceptId: string
  purpose: string
}

const ROW_HEIGHT = 168
const COL_WIDTH = 220

export function buildMapGraph(): { nodes: Node<MapNodeData>[]; edges: Edge[] } {
  const nodes: Node<MapNodeData>[] = []
  const nodeIds = new Set<string>()

  mapLayers.forEach((layerDef, layerIndex) => {
    const count = layerDef.conceptIds.length
    const totalWidth = Math.max(count - 1, 0) * COL_WIDTH
    layerDef.conceptIds.forEach((conceptId, i) => {
      const concept = conceptById.get(conceptId)
      if (!concept) return
      nodeIds.add(conceptId)
      nodes.push({
        id: conceptId,
        type: 'mapNode',
        position: { x: i * COL_WIDTH - totalWidth / 2, y: layerIndex * ROW_HEIGHT },
        data: {
          label: concept.name,
          acronym: concept.acronym,
          domain: concept.domain,
          layer: layerDef.layer,
          conceptId,
          purpose: concept.purpose,
        },
      })
    })
  })

  const edges: Edge[] = []
  const seen = new Set<string>()
  for (const id of nodeIds) {
    const concept = conceptById.get(id)
    if (!concept) continue
    for (const depId of concept.dependsOn) {
      if (!nodeIds.has(depId)) continue
      const key = `${depId}->${id}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({
        id: key,
        source: depId,
        target: id,
        type: 'smoothstep',
      })
    }
  }

  return { nodes, edges }
}

export function upstreamOf(conceptId: string, within: Set<string>): Set<string> {
  const result = new Set<string>()
  const visit = (id: string) => {
    const c = conceptById.get(id)
    if (!c) return
    for (const dep of c.dependsOn) {
      if (!within.has(dep) || result.has(dep)) continue
      result.add(dep)
      visit(dep)
    }
  }
  visit(conceptId)
  return result
}

export function downstreamOf(conceptId: string, within: Set<string>): Set<string> {
  const result = new Set<string>()
  for (const id of within) {
    const c = conceptById.get(id)
    if (!c) continue
    if (c.dependsOn.includes(conceptId)) result.add(id)
  }
  return result
}
