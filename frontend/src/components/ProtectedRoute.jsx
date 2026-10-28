import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function getAccessToken() {
  try {
    return window.localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

export default function ProtectedRoute() {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token) || getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
