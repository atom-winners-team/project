import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole } from '../auth/roles.js';

export default function RoleRoute({ roles }) {
  const role = useSelector((state) => state.auth.user?.role);

  return hasRole(role, ...roles) ? <Outlet /> : <Navigate to="/" replace />;
}
