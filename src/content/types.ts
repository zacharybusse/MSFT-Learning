// Central content schema. All learning content is structured data, not
// hard-coded prose in components. See src/content/sources.ts for the
// source registry that every factual item should reference.

export type Domain =
  | 'foundation'
  | 'cloud'
  | 'm365'
  | 'identity'
  | 'endpoint'
  | 'security'
  | 'migration'
  | 'licensing'
  | 'coordination'

export type MapLayer =
  | 'business'
  | 'workloads'
  | 'identity'
  | 'endpoint'
  | 'azure'
  | 'security'
  | 'operations'

export type SourceType = 'official-microsoft' | 'company' | 'user-note' | 'simulation'

export type Source = {
  id: string
  title: string
  publisher: string
  url: string
  type: SourceType
  lastVerified: string
  status?: string
  retiredDate?: string
  notes?: string
}

export type Concept = {
  id: string
  name: string
  acronym?: string
  aliases?: string[]
  domain: Domain
  mapLayer: MapLayer
  purpose: string
  definition: string
  problemSolved: string
  dependsOn: string[]
  usedBy: string[]
  projectRelevance: string[]
  pmQuestions: string[]
  commonTerms?: string[]
  analogy?: string
  analogyLabel?: string
  retrievalPrompt?: string
  scenarioNote?: string
  relatedConcepts: string[]
  sourceIds: string[]
  verificationDate: string
}

export type GlossaryTerm = {
  id: string
  term: string
  acronym?: string
  definition: string
  domain: Domain
  aliases?: string[]
  relatedTerms: string[]
  projectRelevance: string
  sourceIds: string[]
  lastVerified: string
  conceptId?: string
}

export type ExerciseType =
  | 'placement'
  | 'sequencing'
  | 'card-sort'
  | 'matching'
  | 'dependency-chain'
  | 'go-no-go'

export type Exercise = {
  id: string
  type: ExerciseType
  title: string
  prompt: string
  sourceIds: string[]
}

export type LearningModule = {
  id: string
  trackId: string
  title: string
  summary: string
  prerequisites: string[]
  conceptIds: string[]
  objectives: string[]
  sourceIds: string[]
}

export type Track = {
  id: string
  code: string
  title: string
  description: string
  domain: Domain
  moduleIds: string[]
}

export type QuestionType =
  | 'multiple-choice'
  | 'matching'
  | 'ordering'
  | 'fill-in'
  | 'placement'
  | 'pm-judgment'
  | 'raid-classify'
  | 'dependency'
  | 'current-target'
  | 'acronym'

export type Question = {
  id: string
  conceptIds: string[]
  type: QuestionType
  prompt: string
  choices?: string[]
  answer: string | string[]
  explanation: string
  sourceIds: string[]
}

export type RubricItem = {
  id: string
  label: string
  hint?: string
}

export type ScenarioActionCategory = 'risk' | 'assumption' | 'issue' | 'dependency' | 'decision' | 'action'

export type ScenarioAction = {
  id: string
  text: string
  correctCategory: ScenarioActionCategory | ScenarioActionCategory[]
  contextNote?: string
}

export type Scenario = {
  id: string
  title: string
  brief: string
  currentState: string[]
  objectives: string[]
  facts: string[]
  unknowns: string[]
  architectureNodes: string[]
  questionsToAsk: { question: string; whyItMatters: string; essential: boolean }[]
  actions: ScenarioAction[]
  rubricItems: RubricItem[]
  afterActionExplanation: string
  sourceIds: string[]
  note: 'simulation'
}

export type StudyDay = {
  day: number
  title: string
  objective: string
  learningBlocks: string[]
  trackIds: string[]
  drillTopic: string
  scenarioRef?: string
  sourceIds: string[]
}

export type ReadinessItem = {
  id: string
  label: string
  domain: Domain
}

export type MilitaryMapping = {
  id: string
  military: string
  civilian: string
  note: string
}

export type RaidCard = {
  id: string
  text: string
  correctCategory: ScenarioActionCategory[]
  explanation: string
}

export type CutoverPhase = {
  id: string
  name: string
  description: string
}
