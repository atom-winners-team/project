import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import EquipmentPage from '../pages/EquipmentPage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import RequestsPage from '../pages/RequestsPage.jsx';
import TelemetryPage from '../pages/TelemetryPage.jsx';
import UsersPage from '../pages/UsersPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="telemetry" element={<TelemetryPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
