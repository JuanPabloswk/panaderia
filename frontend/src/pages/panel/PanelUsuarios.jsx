import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UIkit from 'uikit';
import { API_BASE_URL } from '../../config/api.js';
import { useAuth } from '../../context/AuthContext';

const emptyNuevo = () => ({
  username: '',
  email: '',
  password: '',
  rol: 'empleado',
  primerNombre: '',
  apellido: '',
  telefono: '',
  salario: '0',
  estado: 'activo',
});

export default function PanelUsuarios() {
  const { authHeader, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState(emptyNuevo());
  const [editando, setEditando] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios`, {
        headers: { ...authHeader() },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Error al cargar usuarios');
      setUsuarios(Array.isArray(data.usuarios) ? data.usuarios : []);
    } catch (e) {
      UIkit.notification({
        message: e.message,
        status: 'danger',
        pos: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [authHeader, logout]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          username: nuevo.username.trim().toLowerCase(),
          email: nuevo.email.trim().toLowerCase(),
          password: nuevo.password,
          rol: nuevo.rol,
          primerNombre: nuevo.primerNombre.trim(),
          apellido: nuevo.apellido.trim(),
          telefono: nuevo.telefono.trim(),
          salario: Number(nuevo.salario) || 0,
          estado: nuevo.estado,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo crear');
      UIkit.notification({ message: 'Usuario creado', status: 'success', pos: 'top-center' });
      setNuevo(emptyNuevo());
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const bodyFromEditando = (ed, overrides = {}) => {
    const body = {
      username: ed.username.trim().toLowerCase(),
      email: ed.email.trim().toLowerCase(),
      rol: ed.rol,
      primerNombre: ed.primerNombre.trim(),
      apellido: ed.apellido.trim(),
      telefono: ed.telefono.trim(),
      salario: Number(ed.salario) || 0,
      estado: ed.estado,
      ...overrides,
    };
    if (ed.password && ed.password.length >= 6) {
      body.password = ed.password;
    }
    return body;
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!editando) return;
    try {
      const body = bodyFromEditando(editando);
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios/${editando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo guardar');
      UIkit.notification({
        message: 'Usuario actualizado',
        status: 'success',
        pos: 'top-center',
      });
      setEditando(null);
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const activarDesdeModal = async () => {
    if (!editando) return;
    if (!window.confirm(`¿Activar a ${editando.username || editando.email}?`)) return;
    try {
      const body = bodyFromEditando(editando, { estado: 'activo' });
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios/${editando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo activar');
      UIkit.notification({
        message: 'Usuario activado',
        status: 'success',
        pos: 'top-center',
      });
      setEditando(null);
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const desactivar = async (u) => {
    if (!window.confirm(`¿Desactivar a ${u.username || u.email}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios/${u._id}`, {
        method: 'DELETE',
        headers: { ...authHeader() },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo desactivar');
      UIkit.notification({
        message: 'Usuario desactivado',
        status: 'success',
        pos: 'top-center',
      });
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const activar = async (u) => {
    if (!window.confirm(`¿Activar a ${u.username || u.email}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/usuarios/${u._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ estado: 'activo' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo activar');
      UIkit.notification({
        message: 'Usuario activado',
        status: 'success',
        pos: 'top-center',
      });
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const abrirEditar = (u) => {
    setEditando({
      _id: String(u._id),
      username: u.username || '',
      email: u.email || '',
      password: '',
      rol: u.rol || 'empleado',
      primerNombre: u.primerNombre || '',
      apellido: u.apellido || '',
      telefono: u.telefono || '',
      salario: String(u.salario ?? 0),
      estado: u.estado || 'activo',
    });
  };

  const cerrarEdicion = () => {
    setEditando(null);
  };

  useEffect(() => {
    if (!editando) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEscape = (e) => {
      if (e.key === 'Escape') setEditando(null);
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [editando]);

  return (
    <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
      <p className="uk-text-meta uk-margin-small-bottom">
        <Link to="/Productos">← Volver al menú público</Link>
      </p>
      <h1 className="uk-heading-small" style={{ color: '#584125' }}>
        Gestión de usuarios
      </h1>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <>
          <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
            <h3 className="uk-card-title" style={{ color: '#C98A40' }}>
              Nuevo usuario de personal
            </h3>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid onSubmit={crear}>
              <div className="uk-width-1-3@m">
                <label className="uk-form-label">Usuario</label>
                <input
                  className="uk-input"
                  value={nuevo.username}
                  onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })}
                  required
                />
              </div>
              <div className="uk-width-1-3@m">
                <label className="uk-form-label">Correo</label>
                <input
                  className="uk-input"
                  type="email"
                  value={nuevo.email}
                  onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                  required
                />
              </div>
              <div className="uk-width-1-3@m">
                <label className="uk-form-label">Contraseña</label>
                <input
                  className="uk-input"
                  type="password"
                  minLength={6}
                  value={nuevo.password}
                  onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
                  required
                />
              </div>
              <div className="uk-width-1-4@m">
                <label className="uk-form-label">Rol</label>
                <select
                  className="uk-select"
                  value={nuevo.rol}
                  onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="uk-width-1-4@m">
                <label className="uk-form-label">Estado</label>
                <select
                  className="uk-select"
                  value={nuevo.estado}
                  onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="uk-width-1-4@m">
                <label className="uk-form-label">Nombre</label>
                <input
                  className="uk-input"
                  value={nuevo.primerNombre}
                  onChange={(e) => setNuevo({ ...nuevo, primerNombre: e.target.value })}
                />
              </div>
              <div className="uk-width-1-4@m">
                <label className="uk-form-label">Apellido</label>
                <input
                  className="uk-input"
                  value={nuevo.apellido}
                  onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
                />
              </div>
              <div className="uk-width-1-2@m">
                <label className="uk-form-label">Teléfono</label>
                <input
                  className="uk-input"
                  value={nuevo.telefono}
                  onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                />
              </div>
              <div className="uk-width-1-2@m">
                <label className="uk-form-label">Salario</label>
                <input
                  className="uk-input"
                  type="number"
                  min={0}
                  value={nuevo.salario}
                  onChange={(e) => setNuevo({ ...nuevo, salario: e.target.value })}
                />
              </div>
              <div className="uk-width-1-1">
                <button
                  type="submit"
                  className="uk-button uk-button-primary"
                  style={{ borderRadius: '25px' }}
                >
                  Crear usuario
                </button>
              </div>
            </form>
          </div>

          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-divider uk-table-small uk-table-middle">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Nombre</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>{u.estado}</td>
                    <td>{[u.primerNombre, u.apellido].filter(Boolean).join(' ')}</td>
                    <td className="uk-text-nowrap">
                      <button
                        type="button"
                        className="uk-button uk-button-default uk-button-small uk-margin-small-right"
                        onClick={() => abrirEditar(u)}
                      >
                        Editar
                      </button>
                      {u.estado === 'inactivo' ? (
                        <button
                          type="button"
                          className="uk-button uk-button-primary uk-button-small"
                          onClick={() => activar(u)}
                        >
                          Activar usuario
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="uk-button uk-button-danger uk-button-small"
                          onClick={() => desactivar(u)}
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editando && (
        <div
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10050,
            background: 'rgba(88, 65, 37, 0.5)',
            overflow: 'auto',
            padding: '1rem',
          }}
          onClick={cerrarEdicion}
        >
          <div
            className="uk-card uk-card-default uk-card-body uk-margin-auto-vertical"
            style={{
              maxWidth: 520,
              margin: '2rem auto',
              maxHeight: 'calc(100vh - 4rem)',
              overflow: 'auto',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-usuario"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-small-bottom">
              <h2 id="titulo-editar-usuario" className="uk-modal-title uk-margin-remove">
                Editar usuario
              </h2>
              <button
                type="button"
                className="uk-button uk-button-text"
                onClick={cerrarEdicion}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <form className="uk-form-stacked" noValidate onSubmit={guardarEdicion}>
              <div className="uk-margin">
                <label className="uk-form-label">Usuario</label>
                <input
                  className="uk-input"
                  value={editando.username}
                  onChange={(e) => setEditando({ ...editando, username: e.target.value })}
                />
              </div>
              <div className="uk-margin">
                <label className="uk-form-label">Correo</label>
                <input
                  className="uk-input"
                  type="email"
                  value={editando.email}
                  onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                />
              </div>
              <div className="uk-margin">
                <label className="uk-form-label">Nueva contraseña (opcional, mín. 6)</label>
                <input
                  className="uk-input"
                  type="password"
                  minLength={6}
                  value={editando.password}
                  onChange={(e) => setEditando({ ...editando, password: e.target.value })}
                />
              </div>
              <div className="uk-margin uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Rol</label>
                  <select
                    className="uk-select"
                    value={editando.rol}
                    onChange={(e) => setEditando({ ...editando, rol: e.target.value })}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Estado</label>
                  <select
                    className="uk-select"
                    value={editando.estado}
                    onChange={(e) => setEditando({ ...editando, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="uk-margin uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Nombre</label>
                  <input
                    className="uk-input"
                    value={editando.primerNombre}
                    onChange={(e) =>
                      setEditando({ ...editando, primerNombre: e.target.value })
                    }
                  />
                </div>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Apellido</label>
                  <input
                    className="uk-input"
                    value={editando.apellido}
                    onChange={(e) => setEditando({ ...editando, apellido: e.target.value })}
                  />
                </div>
              </div>
              <div className="uk-margin uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Teléfono</label>
                  <input
                    className="uk-input"
                    value={editando.telefono}
                    onChange={(e) => setEditando({ ...editando, telefono: e.target.value })}
                  />
                </div>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Salario</label>
                  <input
                    className="uk-input"
                    type="number"
                    min={0}
                    value={editando.salario}
                    onChange={(e) => setEditando({ ...editando, salario: e.target.value })}
                  />
                </div>
              </div>
              {editando.estado === 'inactivo' && (
                <p className="uk-margin">
                  <button
                    type="button"
                    className="uk-button uk-button-primary"
                    onClick={() => void activarDesdeModal()}
                  >
                    Activar usuario
                  </button>
                </p>
              )}
              <p className="uk-text-right">
                <button type="button" className="uk-button uk-button-default" onClick={cerrarEdicion}>
                  Cancelar
                </button>
                <button type="submit" className="uk-button uk-button-primary uk-margin-small-left">
                  Guardar
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
