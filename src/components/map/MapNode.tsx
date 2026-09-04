import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { AlertTriangle, Link2 } from 'lucide-react'
import type { MapNodeData } from '../../lib/mapGraph'

const domainBorder: Record<string, string> = {
  foundation: 'border-l-domain-foundation',
  cloud: 'border-l-domain-azure',
  m365: 'border-l-domain-m365',
  identity: 'border-l-domain-identity',
  endpoint: 'border-l-domain-endpoint',
  security: 'border-l-domain-security',
  migration: 'border-l-domain-migration',
  licensing: 'border-l-domain-licensing',
  coordination: 'border-l-domain-coordination',
}

export const MapNode = memo(function MapNode({ data, selected }: NodeProps<MapNodeData & { pmLens?: boolean; dimmed?: boolean; highlighted?: boolean }>) {
  return (
    <div
      className={`w-52 rounded-lg border border-l-4 bg-[color:var(--bg-elevated)] px-3 py-2.5 shadow-sm transition-opacity ${domainBorder[data.domain] ?? 'border-l-[color:var(--border-strong)]'} ${
        selected || data.highlighted ? 'ring-2 ring-[color:var(--accent)]' : ''
      } ${data.dimmed ? 'opacity-30' : 'opacity-100'}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[color:var(--border-strong)]" />
      <div className="flex items-start justify-between gap-1">
        <p className="text-[13px] font-semibold leading-tight text-[color:var(--text)]">{data.label}</p>
        {data.pmLens && <AlertTriangle size={13} className="mt-0.5 shrink-0 text-domain-licensing" aria-label="Has project-coordinator implications" />}
      </div>
      {data.acronym && <p className="mt-0.5 text-[11px] text-[color:var(--text-faint)]">{data.acronym}</p>}
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[color:var(--text-muted)]">{data.purpose}</p>
      {data.pmLens && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[color:var(--text-faint)]">
          <Link2 size={10} /> dependency-aware
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-[color:var(--border-strong)]" />
    </div>
  )
})
