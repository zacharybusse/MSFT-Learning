import type { MilitaryMapping } from './types'

// Conceptual analogies only — never doctrinal equivalence. Used to explain
// process relationships (why a step exists), not technical product behavior.
export const militaryMappings: MilitaryMapping[] = [
  { id: 'mm-1', military: 'Mission / Commander\'s Intent', civilian: 'Business Outcome / Project Objective', note: 'Both describe the desired end state that all planning should serve.' },
  { id: 'mm-2', military: 'CONOP', civilian: 'Solution / Migration Plan', note: 'A structured description of how the objective will be achieved.' },
  { id: 'mm-3', military: 'Task Organization', civilian: 'RACI / Resourcing', note: 'Both assign who does what, and who owns the outcome.' },
  { id: 'mm-4', military: 'PCC / PCI', civilian: 'Readiness Review / Pre-Cutover Checklist', note: 'A structured check that everything required is actually ready before execution.' },
  { id: 'mm-5', military: 'Phase Line / Trigger', civilian: 'Milestone / Stage Gate', note: 'A defined point that marks progress and can gate the next phase.' },
  { id: 'mm-6', military: 'FRAGO', civilian: 'Controlled Change / Updated Plan', note: 'A formal update to the plan in response to new information, not an unplanned deviation.' },
  { id: 'mm-7', military: 'Risk to Mission', civilian: 'Project / Technical Risk', note: 'Something that might happen and would affect the outcome if it does.' },
  { id: 'mm-8', military: 'PMCS', civilian: 'Health / Readiness Checks', note: 'Routine verification that a system or process is in working order before relying on it.' },
  { id: 'mm-9', military: 'Hand Receipt / Property Accountability', civilian: 'Asset Inventory / CMDB Concepts', note: 'A record of what exists and who is responsible for it.' },
  { id: 'mm-10', military: 'AAR (After-Action Review)', civilian: 'Retrospective / Post-Implementation Review', note: 'A structured look back at what happened, what worked, and what to change next time.' },
]

export const militaryMappingById = new Map(militaryMappings.map((m) => [m.id, m]))
