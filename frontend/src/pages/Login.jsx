import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import UIkit from 'uikit';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      UIkit.notification({
        message: 'Sesión iniciada',
        status: 'success',
        pos: 'top-center',
        timeout: 2000,
      });
      navigate(redirect, { replace: true });
    } catch (err) {
      UIkit.notification({
        message: err.message || 'Error al iniciar sesión',
        status: 'danger',
        pos: 'top-center',
        timeout: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
      <div className="uk-width-1-2@m uk-margin-auto">
        <h1 className="uk-heading-small" style={{ color: '#584125' }}>
          Iniciar sesión
        </h1>
        <p className="uk-text-meta">
          Necesitas una cuenta de cliente para finalizar la compra. Si eres
          empleado, usa tu usuario o correo corporativo.
        </p>

        <form className="uk-form-stacked uk-margin" onSubmit={handleSubmit}>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="login-email">
              Correo o usuario
            </label>
            <input
              id="login-email"
              className="uk-input"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              className="uk-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="uk-button uk-button-primary uk-width-1-1"
            style={{ borderRadius: '25px' }}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="uk-text-center">
          <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
