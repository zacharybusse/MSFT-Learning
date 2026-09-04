import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { CommandCenterView } from './views/CommandCenterView'
import { EcosystemMapView } from './views/EcosystemMapView'
import { LearningTracksView } from './views/LearningTracksView'
import { ScenarioLabView } from './views/ScenarioLabView'
import { ScenarioDetailView } from './views/ScenarioDetailView'
import { RaidTrainerView } from './views/RaidTrainerView'
import { CutoverTrainerView } from './views/CutoverTrainerView'
import { GlossaryView } from './views/GlossaryView'
import { RetrievalDrillsView } from './views/RetrievalDrillsView'
import { InterviewPrepView } from './views/InterviewPrepView'
import { ProgressView } from './views/ProgressView'
import { SourcesView } from './views/SourcesView'
import { StudyPlanView } from './views/StudyPlanView'
import { NotFoundView } from './views/NotFoundView'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<CommandCenterView />} />
        <Route path="/map" element={<EcosystemMapView />} />
        <Route path="/tracks" element={<LearningTracksView />} />
        <Route path="/tracks/:trackId" element={<LearningTracksView />} />
        <Route path="/scenarios" element={<ScenarioLabView />} />
        <Route path="/scenarios/raid-trainer" element={<RaidTrainerView />} />
        <Route path="/scenarios/cutover-trainer" element={<CutoverTrainerView />} />
        <Route path="/scenarios/:scenarioId" element={<ScenarioDetailView />} />
        <Route path="/glossary" element={<GlossaryView />} />
        <Route path="/drills" element={<RetrievalDrillsView />} />
        <Route path="/interview" element={<InterviewPrepView />} />
        <Route path="/progress" element={<ProgressView />} />
        <Route path="/sources" element={<SourcesView />} />
        <Route path="/study-plan" element={<StudyPlanView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  )
}

export default App
