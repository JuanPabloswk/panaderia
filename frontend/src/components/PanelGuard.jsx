import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {string[]} anyOf - al menos uno de estos permisos
 */
export default function PanelGuard({ anyOf = [], children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  const perms = user?.permisos || [];
  const ok = anyOf.some((p) => perms.includes(p));

  if (!ok) {
    return (
      <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
        <div className="uk-alert-danger" data-uk-alert>
          <p className="uk-margin-remove">
            No tienes permiso para ver esta sección. Inicia sesión con una cuenta
            de empleado o administrador.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
