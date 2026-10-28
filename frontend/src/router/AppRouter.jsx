import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import EquipmentPage from '../pages/EquipmentPage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import RegisterPage from '../pages/register/RegisterPage.jsx';
import RequestsPage from '../pages/RequestsPage.jsx';
import UsersPage from '../pages/UsersPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
