/**
 * TRACE: Ghost Protocol — Main Application
 * 
 * Root component with React Router configuration.
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MissionBoard from './pages/MissionBoard';
import MissionDetail from './pages/MissionDetail';
import EvidenceLocker from './pages/EvidenceLocker';
import ConnectionMap from './pages/ConnectionMap';
import Leaderboard from './pages/Leaderboard';
import FieldManual from './pages/FieldManual';
import AdminPanel from './pages/AdminPanel';

function AppLayout() {
  const { state } = useGame();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-ghost-dark">
      {state.isRecruited && !isLanding && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/missions" element={<MissionBoard />} />
          <Route path="/mission/:missionId" element={<MissionDetail />} />
          <Route path="/evidence" element={<EvidenceLocker />} />
          <Route path="/connections" element={<ConnectionMap />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/field-manual" element={<FieldManual />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-ghost-dark flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-6xl font-bold text-ghost-amber mb-4">404</div>
        <div className="font-mono text-sm text-ghost-text-muted mb-6">
          Signal lost. This sector is not on our grid.
        </div>
        <a
          href="/missions"
          className="inline-block px-6 py-2.5 rounded font-mono text-xs tracking-wider bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost"
        >
          ← RETURN TO MISSION BOARD
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppLayout />
      </GameProvider>
    </BrowserRouter>
  );
}
