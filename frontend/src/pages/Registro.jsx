import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [primerNombre, setPrimerNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        primerNombre: primerNombre.trim(),
        apellido: apellido.trim(),
      });
      UIkit.notification({
        message: 'Cuenta creada',
        status: 'success',
        pos: 'top-center',
        timeout: 2000,
      });
      navigate('/checkout', { replace: true });
    } catch (err) {
      UIkit.notification({
        message: err.message || 'No se pudo registrar',
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
          Crear cuenta
        </h1>

        <form className="uk-form-stacked uk-margin" onSubmit={handleSubmit}>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="reg-primer-nombre">
              Primer nombre (opcional)
            </label>
            <input
              id="reg-primer-nombre"
              className="uk-input"
              type="text"
              autoComplete="given-name"
              value={primerNombre}
              onChange={(e) => setPrimerNombre(e.target.value)}
            />
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="reg-apellido">
              Apellido (opcional)
            </label>
            <input
              id="reg-apellido"
              className="uk-input"
              type="text"
              autoComplete="family-name"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="reg-email">
              Correo
            </label>
            <input
              id="reg-email"
              className="uk-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="reg-password">
              Contraseña (mín. 6 caracteres)
            </label>
            <input
              id="reg-password"
              className="uk-input"
              type="password"
              autoComplete="new-password"
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
            {loading ? 'Creando…' : 'Registrarme'}
          </button>
        </form>

        <p className="uk-text-center">
          <Link to="/login">Ya tengo cuenta</Link>
        </p>
      </div>
    </div>
  );
}
