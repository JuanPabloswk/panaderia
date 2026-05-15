import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && usuario && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
