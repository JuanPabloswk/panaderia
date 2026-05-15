import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UIkit from 'uikit';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    primerNombre: '',
    apellido: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);

    if (result.ok) {
      UIkit.notification({
        message: 'Registro exitoso. ¡Bienvenido!',
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
          <h2 className="uk-text-center" style={{ color: '#C98A40', fontWeight: 'bold' }}>Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="uk-form-stacked uk-margin-top">
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Nombre</label>
                <input
                  className="uk-input"
                  type="text"
                  name="primerNombre"
                  placeholder="Tu nombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Apellido</label>
                <input
                  className="uk-input"
                  type="text"
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Correo electrónico</label>
              <input
                className="uk-input"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Teléfono</label>
              <input
                className="uk-input"
                type="tel"
                name="telefono"
                placeholder="3001234567"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Contraseña</label>
              <input
                className="uk-input"
                type="password"
                name="password"
                placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas y números"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="uk-button uk-button-primary uk-width-1-1"
              style={{ borderRadius: '25px' }}
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="uk-text-center uk-margin-top">
            <p style={{ color: '#584125' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#C98A40', fontWeight: 'bold' }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
