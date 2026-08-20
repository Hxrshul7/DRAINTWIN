import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Landing from './pages/Landing'
import Citizen from './pages/Citizen'
import AdminLayout from './components/layout/AdminLayout'
import WorkerLayout from './components/layout/WorkerLayout'

import Dashboard from './pages/admin/Dashboard'
import Network from './pages/admin/Network'
import RiskAnalysis from './pages/admin/RiskAnalysis'
import DigitalTwin from './pages/admin/DigitalTwin'
import Interventions from './pages/admin/Interventions'
import Sensors from './pages/admin/Sensors'
import Rainfall from './pages/admin/Rainfall'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

import WorkerDashboard from './pages/worker/Dashboard'
import WorkerMap from './pages/worker/Map'
import WorkerTasks from './pages/worker/Tasks'
import TaskDetails from './pages/worker/TaskDetails'
import WorkerReports from './pages/worker/Reports'
import WorkerProfile from './pages/worker/Profile'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/citizen" element={<Citizen />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="network" element={<Network />} />
            <Route path="risk" element={<RiskAnalysis />} />
            <Route path="digital-twin" element={<DigitalTwin />} />
            <Route path="interventions" element={<Interventions />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="rainfall" element={<Rainfall />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<WorkerDashboard />} />
            <Route path="map" element={<WorkerMap />} />
            <Route path="tasks" element={<WorkerTasks />} />
            <Route path="task/:id" element={<TaskDetails />} />
            <Route path="reports" element={<WorkerReports />} />
            <Route path="profile" element={<WorkerProfile />} />
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
