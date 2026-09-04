import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReactFlow, { Background, BackgroundVariant, Controls, MarkerType, MiniMap, type Node } from 'reactflow'
import 'reactflow/dist/style.css'
import { Compass, Route as RouteIcon } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { MapNode } from '../components/map/MapNode'
import { ConceptDrawer } from '../components/map/ConceptDrawer'
import { buildMapGraph, downstreamOf, upstreamOf, type MapNodeData } from '../lib/mapGraph'
import { mapLayers } from '../content/mapLayout'
import { useStore } from '../state/store'

const nodeTypes = { mapNode: MapNode }

const layerDot: Record<string, string> = {
  business: 'bg-domain-coordination',
  workloads: 'bg-domain-m365',
  identity: 'bg-domain-identity',
  endpoint: 'bg-domain-endpoint',
  azure: 'bg-domain-azure',
  security: 'bg-domain-security',
  operations: 'bg-domain-foundation',
}

export function EcosystemMapView() {
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState<string | null>(params.get('concept'))
  const pmLensOn = useStore((s) => s.pmLensOn)
  const togglePmLens = useStore((s) => s.togglePmLens)
  const migrationViewOn = useStore((s) => s.migrationViewOn)
  const toggleMigrationView = useStore((s) => s.toggleMigrationView)
  const setLastOpenTopic = useStore((s) => s.setLastOpenTopic)

  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => buildMapGraph(), [])
  const allIds = useMemo(() => new Set(baseNodes.map((n) => n.id)), [baseNodes])

  const highlight = useMemo(() => {
    if (!selected) return null
    const up = upstreamOf(selected, allIds)
    const down = downstreamOf(selected, allIds)
    return { up, down }
  }, [selected, allIds])

  const nodes: Node<MapNodeData & Record<string, unknown>>[] = useMemo(
    () =>
      baseNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          pmLens: pmLensOn,
          highlighted: highlight ? n.id === selected || highlight.up.has(n.id) || highlight.down.has(n.id) : false,
          dimmed: highlight ? !(n.id === selected || highlight.up.has(n.id) || highlight.down.has(n.id)) : false,
        },
      })),
    [baseNodes, pmLensOn, highlight, selected],
  )

  const edges = useMemo(
    () =>
      baseEdges.map((e) => ({
        ...e,
        animated: migrationViewOn,
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--text-faint)' },
        style: {
          stroke:
            highlight && (e.source === selected || e.target === selected || highlight.up.has(e.source) || highlight.down.has(e.target))
              ? 'var(--accent)'
              : 'var(--text-faint)',
          strokeWidth: highlight && (e.source === selected || e.target === selected) ? 2.75 : 2,
          opacity: highlight && !(highlight.up.has(e.source) || highlight.down.has(e.target) || e.source === selected || e.target === selected) ? 0.25 : 0.85,
        },
      })),
    [baseEdges, migrationViewOn, highlight, selected],
  )

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setSelected(node.id)
      setParams({ concept: node.id }, { replace: true })
      setLastOpenTopic({ type: 'concept', id: node.id, label: (node.data as MapNodeData).label })
    },
    [setParams, setLastOpenTopic],
  )

  return (
    <div className="flex h-[calc(100vh-53px)] flex-col">
      <PageHeader
        eyebrow="Most important feature"
        title="Ecosystem Map"
        description="Zoom from business outcomes down to identity, endpoint, Azure infrastructure, and security. Click a node for the full breakdown; relationships shown are only what this content set explicitly defines."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePmLens}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                pmLensOn ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'
              }`}
              aria-pressed={pmLensOn}
            >
              <Compass size={14} /> Project-Coordinator View
            </button>
            <button
              type="button"
              onClick={toggleMigrationView}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                migrationViewOn ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'
              }`}
              aria-pressed={migrationViewOn}
            >
              <RouteIcon size={14} /> Migration View
            </button>
          </div>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-52 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 lg:block">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Layers, top to bottom</p>
          <ul className="space-y-2.5">
            {mapLayers.map((l) => (
              <li key={l.layer} className="text-xs">
                <div className="flex items-center gap-1.5 font-medium text-[color:var(--text)]">
                  <span className={`h-2 w-2 rounded-full ${layerDot[l.layer]}`} />
                  {l.label}
                </div>
                <p className="mt-0.5 pl-3.5 text-[11px] leading-snug text-[color:var(--text-faint)]">{l.description}</p>
              </li>
            ))}
          </ul>
          {selected && (
            <button type="button" onClick={() => setSelected(null)} className="mt-4 text-xs font-medium text-[color:var(--accent-strong)] hover:underline">
              Clear highlight
            </button>
          )}
        </div>
        <div className="bg-grid flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              style={{ backgroundColor: 'var(--bg-elevated)' }}
              maskColor="color-mix(in srgb, var(--bg) 70%, transparent)"
              nodeColor="var(--border-strong)"
              nodeStrokeColor="var(--border-strong)"
            />
          </ReactFlow>
        </div>
      </div>
      <ConceptDrawer
        conceptId={selected}
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null)
          params.delete('concept')
          setParams(params, { replace: true })
        }}
      />
    </div>
  )
}
