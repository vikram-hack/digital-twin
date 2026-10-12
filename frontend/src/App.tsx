import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import AttackSimulation from './pages/AttackSimulation';
import AttackPath from './pages/AttackPath';
import Assets from './pages/Assets';
import Scenarios from './pages/Scenarios';
import SecurityControls from './pages/SecurityControls';
import MitreAttack from './pages/MitreAttack';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/twin" element={<DigitalTwin />} />
          <Route path="/simulation" element={<AttackSimulation />} />
          <Route path="/attack-path" element={<AttackPath />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/controls" element={<SecurityControls />} />
          <Route path="/mitre" element={<MitreAttack />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
}