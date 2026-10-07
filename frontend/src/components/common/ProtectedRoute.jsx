import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === 'owner' && role !== 'owner_success') {
    return <Navigate to="/customer-store" replace />;
  }

  if (allowedRole === 'customer' && role === 'owner_success') {
    return <Navigate to="/owner-dashboard" replace />;
  }

  return children;
}
