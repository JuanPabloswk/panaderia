import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UIkit from 'uikit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, tipo);

    if (result.ok) {
      UIkit.notification({
        message: 'Inicio de sesión exitoso',
        status: 'success',
        pos: 'top-center',
        timeout: 2000,
      });
      navigate('/', { replace: true });
    } else {
      UIkit.notification({
        message: result.error,
        status: 'danger',
        pos: 'top-center',
        timeout: 3000,
      });
    }

    setLoading(false);
  };

  return (
    <div className="uk-section uk-flex uk-flex-middle" style={{ minHeight: '70vh' }}>
      <div className="uk-container uk-container-small">
        <div className="uk-card uk-card-default uk-card-body uk-border-rounded" style={{ maxWidth: '450px', margin: '0 auto' }}>
          <h2 className="uk-text-center" style={{ color: '#C98A40', fontWeight: 'bold' }}>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="uk-form-stacked uk-margin-top">
            <div className="uk-margin">
              <label className="uk-form-label">Tipo de usuario</label>
              <div className="uk-form-controls">
                <select
                  className="uk-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="cliente">Cliente</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Correo electrónico</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Contraseña</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="uk-button uk-button-primary uk-width-1-1"
              style={{ borderRadius: '25px' }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="uk-text-center uk-margin-top">
            <p style={{ color: '#584125' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ color: '#C98A40', fontWeight: 'bold' }}>
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
