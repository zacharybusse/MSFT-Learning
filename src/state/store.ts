import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nextBox, type QuestionStat, type ReviewBox } from '../lib/scoring'

export type ThemeMode = 'light' | 'dark' | 'system'

export type FieldNote = {
  id: string
  conceptId?: string
  text: string
  createdAt: number
}

export type StarStory = {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  relevance: string
}

export type LastTopic = { type: string; id: string; label: string } | null

type ScenarioProgressEntry = {
  categorized: Record<string, string> // actionId -> chosen category
  rubricChecked: string[]
}

type State = {
  theme: ThemeMode
  pmLensOn: boolean
  mapViewMode: 'coordinator' | 'technical'
  migrationViewOn: boolean

  quizStats: Record<string, QuestionStat>
  confidenceRatings: Record<string, 1 | 2 | 3>

  moduleCompleted: Record<string, boolean>
  studyDayCompleted: Record<number, boolean>
  studyDayNotes: Record<number, string>
  readinessChecked: Record<string, boolean>

  scenarioProgress: Record<string, ScenarioProgressEntry>

  pinnedConceptIds: string[]
  fieldNotes: FieldNote[]
  starStories: StarStory[]

  lastOpenTopic: LastTopic
  studyStartDate: string | null
  studyDaysActive: string[] // ISO date strings, local-tracked only

  setTheme: (t: ThemeMode) => void
  togglePmLens: () => void
  setMapViewMode: (m: 'coordinator' | 'technical') => void
  toggleMigrationView: () => void

  recordAnswer: (questionId: string, wasCorrect: boolean) => void
  setConfidence: (questionId: string, rating: 1 | 2 | 3) => void

  toggleModuleCompleted: (moduleId: string) => void
  toggleStudyDayCompleted: (day: number) => void
  setStudyDayNote: (day: number, note: string) => void
  toggleReadinessItem: (id: string) => void

  setScenarioCategory: (scenarioId: string, actionId: string, category: string) => void
  toggleScenarioRubric: (scenarioId: string, rubricId: string) => void
  resetScenario: (scenarioId: string) => void

  togglePinned: (conceptId: string) => void
  addFieldNote: (note: Omit<FieldNote, 'id' | 'createdAt'>) => void
  removeFieldNote: (id: string) => void

  addStarStory: (story: Omit<StarStory, 'id'>) => void
  updateStarStory: (id: string, patch: Partial<StarStory>) => void
  removeStarStory: (id: string) => void

  setLastOpenTopic: (t: LastTopic) => void
  touchStudyDay: () => void

  importState: (data: Partial<ExportShape>) => void
  resetProgress: () => void
}

export type ExportShape = {
  quizStats: State['quizStats']
  moduleCompleted: State['moduleCompleted']
  studyDayCompleted: State['studyDayCompleted']
  studyDayNotes: State['studyDayNotes']
  readinessChecked: State['readinessChecked']
  scenarioProgress: State['scenarioProgress']
  pinnedConceptIds: State['pinnedConceptIds']
  fieldNotes: State['fieldNotes']
  starStories: State['starStories']
  studyDaysActive: State['studyDaysActive']
  exportedAt: string
}

function newStat(): QuestionStat {
  return { attempts: 0, correct: 0, lastSeen: null, box: 'new' as ReviewBox }
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      theme: 'system',
      pmLensOn: false,
      mapViewMode: 'coordinator',
      migrationViewOn: false,

      quizStats: {},
      confidenceRatings: {},

      moduleCompleted: {},
      studyDayCompleted: {},
      studyDayNotes: {},
      readinessChecked: {},

      scenarioProgress: {},

      pinnedConceptIds: [],
      fieldNotes: [],
      starStories: [],

      lastOpenTopic: null,
      studyStartDate: null,
      studyDaysActive: [],

      setTheme: (t) => set({ theme: t }),
      togglePmLens: () => set((s) => ({ pmLensOn: !s.pmLensOn })),
      setMapViewMode: (m) => set({ mapViewMode: m }),
      toggleMigrationView: () => set((s) => ({ migrationViewOn: !s.migrationViewOn })),

      recordAnswer: (questionId, wasCorrect) =>
        set((s) => {
          const prev = s.quizStats[questionId] ?? newStat()
          const box = nextBox(prev.box, wasCorrect)
          return {
            quizStats: {
              ...s.quizStats,
              [questionId]: {
                attempts: prev.attempts + 1,
                correct: prev.correct + (wasCorrect ? 1 : 0),
                lastSeen: Date.now(),
                box,
              },
            },
          }
        }),
      setConfidence: (questionId, rating) =>
        set((s) => ({ confidenceRatings: { ...s.confidenceRatings, [questionId]: rating } })),

      toggleModuleCompleted: (moduleId) =>
        set((s) => ({ moduleCompleted: { ...s.moduleCompleted, [moduleId]: !s.moduleCompleted[moduleId] } })),
      toggleStudyDayCompleted: (day) =>
        set((s) => ({ studyDayCompleted: { ...s.studyDayCompleted, [day]: !s.studyDayCompleted[day] } })),
      setStudyDayNote: (day, note) => set((s) => ({ studyDayNotes: { ...s.studyDayNotes, [day]: note } })),
      toggleReadinessItem: (id) =>
        set((s) => ({ readinessChecked: { ...s.readinessChecked, [id]: !s.readinessChecked[id] } })),

      setScenarioCategory: (scenarioId, actionId, category) =>
        set((s) => {
          const entry = s.scenarioProgress[scenarioId] ?? { categorized: {}, rubricChecked: [] }
          return {
            scenarioProgress: {
              ...s.scenarioProgress,
              [scenarioId]: { ...entry, categorized: { ...entry.categorized, [actionId]: category } },
            },
          }
        }),
      toggleScenarioRubric: (scenarioId, rubricId) =>
        set((s) => {
          const entry = s.scenarioProgress[scenarioId] ?? { categorized: {}, rubricChecked: [] }
          const has = entry.rubricChecked.includes(rubricId)
          return {
            scenarioProgress: {
              ...s.scenarioProgress,
              [scenarioId]: {
                ...entry,
                rubricChecked: has ? entry.rubricChecked.filter((r) => r !== rubricId) : [...entry.rubricChecked, rubricId],
              },
            },
          }
        }),
      resetScenario: (scenarioId) =>
        set((s) => {
          const next = { ...s.scenarioProgress }
          delete next[scenarioId]
          return { scenarioProgress: next }
        }),

      togglePinned: (conceptId) =>
        set((s) => ({
          pinnedConceptIds: s.pinnedConceptIds.includes(conceptId)
            ? s.pinnedConceptIds.filter((id) => id !== conceptId)
            : [...s.pinnedConceptIds, conceptId],
        })),
      addFieldNote: (note) =>
        set((s) => ({
          fieldNotes: [...s.fieldNotes, { ...note, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() }],
        })),
      removeFieldNote: (id) => set((s) => ({ fieldNotes: s.fieldNotes.filter((n) => n.id !== id) })),

      addStarStory: (story) =>
        set((s) => ({
          starStories: [...s.starStories, { ...story, id: `star-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }],
        })),
      updateStarStory: (id, patch) =>
        set((s) => ({ starStories: s.starStories.map((st) => (st.id === id ? { ...st, ...patch } : st)) })),
      removeStarStory: (id) => set((s) => ({ starStories: s.starStories.filter((st) => st.id !== id) })),

      setLastOpenTopic: (t) => set({ lastOpenTopic: t }),
      touchStudyDay: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10)
          if (s.studyDaysActive.includes(today)) return {}
          return {
            studyStartDate: s.studyStartDate ?? today,
            studyDaysActive: [...s.studyDaysActive, today],
          }
        }),

      importState: (data) =>
        set(() => ({
          quizStats: data.quizStats ?? {},
          moduleCompleted: data.moduleCompleted ?? {},
          studyDayCompleted: data.studyDayCompleted ?? {},
          studyDayNotes: data.studyDayNotes ?? {},
          readinessChecked: data.readinessChecked ?? {},
          scenarioProgress: data.scenarioProgress ?? {},
          pinnedConceptIds: data.pinnedConceptIds ?? [],
          fieldNotes: data.fieldNotes ?? [],
          starStories: data.starStories ?? [],
          studyDaysActive: data.studyDaysActive ?? [],
        })),
      resetProgress: () =>
        set({
          quizStats: {},
          confidenceRatings: {},
          moduleCompleted: {},
          studyDayCompleted: {},
          studyDayNotes: {},
          readinessChecked: {},
          scenarioProgress: {},
          pinnedConceptIds: [],
          fieldNotes: [],
          starStories: [],
          lastOpenTopic: null,
          studyStartDate: null,
          studyDaysActive: [],
        }),
    }),
    { name: 'msft-lcc-store-v1' },
  ),
)

export function buildExport(): ExportShape {
  const s = useStore.getState()
  return {
    quizStats: s.quizStats,
    moduleCompleted: s.moduleCompleted,
    studyDayCompleted: s.studyDayCompleted,
    studyDayNotes: s.studyDayNotes,
    readinessChecked: s.readinessChecked,
    scenarioProgress: s.scenarioProgress,
    pinnedConceptIds: s.pinnedConceptIds,
    fieldNotes: s.fieldNotes,
    starStories: s.starStories,
    studyDaysActive: s.studyDaysActive,
    exportedAt: new Date().toISOString(),
  }
}
