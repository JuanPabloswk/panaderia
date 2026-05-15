import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import UIkit from 'uikit';
import { API_BASE_URL } from '../../config/api.js';
import { useAuth } from '../../context/AuthContext';

/** Solo dígitos (precio en COP, entero). */
function digitosPrecio(val) {
  return String(val ?? '').replace(/\D/g, '');
}

function precioEnteroForm(val) {
  const d = digitosPrecio(val);
  if (d === '') return NaN;
  const n = parseInt(d, 10);
  return Number.isFinite(n) ? n : NaN;
}

const emptyForm = () => ({
  nombre: '',
  descripcion: '',
  precio: '',
  categoriaId: '',
  stock: '0',
  imagen: '',
  disponible: true,
});

export default function PanelProductos() {
  const { authHeader, logout, hasPermiso } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState(emptyForm());
  const [editando, setEditando] = useState(null);
  const evitarPantallaCargaCompleta = useRef(false);

  const catsActivas = useMemo(
    () => categorias.filter((c) => c.estado !== 'inactiva'),
    [categorias]
  );

  /** Incluye la categoría actual del producto aunque esté inactiva (evita select HTML inválido). */
  const opcionesEdicionCategoria = useMemo(() => {
    const cid = editando?.categoriaId;
    if (!cid) return catsActivas;
    if (catsActivas.some((c) => c.id === cid)) return catsActivas;
    const actual = categorias.find((c) => c.id === cid);
    if (actual) {
      return [actual, ...catsActivas.filter((c) => c.id !== actual.id)];
    }
    return [
      { id: cid, nombre: '(Categoría actual)', estado: '' },
      ...catsActivas,
    ];
  }, [editando?.categoriaId, catsActivas, categorias]);

  const cargar = useCallback(async () => {
    if (!evitarPantallaCargaCompleta.current) {
      setLoading(true);
    }
    try {
      const [rProd, rCat] = await Promise.all([
        fetch(`${API_BASE_URL}/api/panel/productos`, {
          headers: { ...authHeader() },
        }),
        fetch(`${API_BASE_URL}/api/panel/categorias`, {
          headers: { ...authHeader() },
        }),
      ]);
      if (rProd.status === 401 || rCat.status === 401) {
        logout();
        return;
      }
      const dProd = await rProd.json().catch(() => ({}));
      const dCat = await rCat.json().catch(() => ({}));
      if (!rProd.ok) throw new Error(dProd.message || 'Error al cargar productos');
      if (!rCat.ok) throw new Error(dCat.message || 'Error al cargar categorías');
      setProductos(Array.isArray(dProd.productos) ? dProd.productos : []);
      setCategorias(Array.isArray(dCat.categorias) ? dCat.categorias : []);
    } catch (e) {
      UIkit.notification({
        message: e.message,
        status: 'danger',
        pos: 'top-center',
      });
    } finally {
      setLoading(false);
      evitarPantallaCargaCompleta.current = true;
    }
  }, [authHeader, logout]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (e) => {
    e.preventDefault();
    const precio = precioEnteroForm(nuevo.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      UIkit.notification({
        message:
          'El precio debe ser un número entero: solo dígitos, sin puntos ni comas (ej. 5000).',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          nombre: nuevo.nombre.trim(),
          descripcion: nuevo.descripcion.trim(),
          precio,
          categoriaId: nuevo.categoriaId,
          stock: Number(nuevo.stock) || 0,
          imagen: (nuevo.imagen ?? '').trim() || null,
          disponible: nuevo.disponible,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo crear');
      UIkit.notification({ message: 'Producto creado', status: 'success', pos: 'top-center' });
      setNuevo(emptyForm());
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!editando) return;

    const nombre = editando.nombre.trim();
    const descripcion = editando.descripcion.trim();
    const catIdForm = String(editando.categoriaId || '').trim();
    if (!nombre) {
      UIkit.notification({
        message: 'El nombre es obligatorio.',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }
    if (!descripcion) {
      UIkit.notification({
        message: 'La descripción es obligatoria.',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }
    if (!catIdForm) {
      UIkit.notification({
        message: 'Elige una categoría.',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }

    const precio = precioEnteroForm(editando.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      UIkit.notification({
        message:
          'El precio debe ser un número entero: solo dígitos, sin puntos ni comas (ej. 5000).',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }

    const idProducto = String(editando.id || editando._id || '').trim();
    if (!idProducto) {
      UIkit.notification({
        message: 'No se pudo identificar el producto. Recarga la página.',
        status: 'danger',
        pos: 'top-center',
      });
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/panel/productos/${idProducto}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader() },
          body: JSON.stringify({
            nombre,
            descripcion,
            precio,
            categoriaId: catIdForm,
            stock: Number(editando.stock) || 0,
            imagen: (editando.imagen ?? '').trim() || null,
            disponible: editando.disponible,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo guardar');
      UIkit.notification({
        message: 'Producto actualizado',
        status: 'success',
        pos: 'top-center',
      });
      setEditando(null);
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    const pid = p.id ?? p._id;
    try {
      const res = await fetch(`${API_BASE_URL}/api/panel/productos/${pid}`, {
        method: 'DELETE',
        headers: { ...authHeader() },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error(data.message || 'No se pudo eliminar');
      if (editando?.id === String(pid)) {
        setEditando(null);
      }
      UIkit.notification({ message: 'Producto eliminado', status: 'success', pos: 'top-center' });
      cargar();
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
    }
  };

  const abrirEditar = (p) => {
    const pid = p.id ?? p._id;
    setEditando({
      id: pid != null ? String(pid) : '',
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      precio: digitosPrecio(String(Math.round(Number(p.precio ?? 0)))),
      categoriaId: String(p.categoriaId || '').trim(),
      stock: String(p.stock ?? 0),
      imagen: p.imagen != null ? String(p.imagen) : '',
      disponible: p.disponible !== false,
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
        Gestión de productos
      </h1>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <>
          {hasPermiso('crear') && (
            <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
              <h3 className="uk-card-title" style={{ color: '#C98A40' }}>
                Nuevo producto
              </h3>
              <form className="uk-form-stacked uk-grid-small" data-uk-grid noValidate onSubmit={crear}>
                <div className="uk-width-1-2@m">
                  <label className="uk-form-label">Nombre</label>
                  <input
                    className="uk-input"
                    value={nuevo.nombre}
                    onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="uk-width-1-2@m">
                  <label className="uk-form-label">Categoría</label>
                  <select
                    className="uk-select"
                    value={nuevo.categoriaId}
                    onChange={(e) => setNuevo({ ...nuevo, categoriaId: e.target.value })}
                    required
                  >
                    <option value="">— Elegir —</option>
                    {catsActivas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="uk-width-1-1">
                  <label className="uk-form-label">Descripción</label>
                  <textarea
                    className="uk-textarea"
                    rows={3}
                    value={nuevo.descripcion}
                    onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                    required
                  />
                </div>
                <div className="uk-width-1-4@m">
                  <label className="uk-form-label">Precio (COP, solo números)</label>
                  <input
                    className="uk-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Ej. 5000"
                    value={nuevo.precio}
                    onChange={(e) =>
                      setNuevo({ ...nuevo, precio: digitosPrecio(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="uk-width-1-4@m">
                  <label className="uk-form-label">Stock</label>
                  <input
                    className="uk-input"
                    type="number"
                    min={0}
                    value={nuevo.stock}
                    onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })}
                  />
                </div>
                <div className="uk-width-1-4@m uk-flex uk-flex-middle">
                  <label className="uk-margin-small-right">
                    <input
                      type="checkbox"
                      className="uk-checkbox"
                      checked={nuevo.disponible}
                      onChange={(e) =>
                        setNuevo({ ...nuevo, disponible: e.target.checked })
                      }
                    />{' '}
                    Disponible
                  </label>
                </div>
                <div className="uk-width-1-1">
                  <label className="uk-form-label">URL imagen (opcional)</label>
                  <input
                    className="uk-input"
                    value={nuevo.imagen}
                    onChange={(e) => setNuevo({ ...nuevo, imagen: e.target.value })}
                  />
                </div>
                <div className="uk-width-1-1">
                  <button
                    type="submit"
                    className="uk-button uk-button-primary"
                    style={{ borderRadius: '25px' }}
                  >
                    Crear producto
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-divider uk-table-small uk-table-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Visible</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id ?? p._id}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{p.precio}</td>
                    <td>{p.stock}</td>
                    <td>{p.disponible ? 'Sí' : 'No'}</td>
                    <td className="uk-text-nowrap">
                      {hasPermiso('editar') && (
                        <button
                          type="button"
                          className="uk-button uk-button-default uk-button-small uk-margin-small-right"
                          onClick={() => abrirEditar(p)}
                        >
                          Editar
                        </button>
                      )}
                      {hasPermiso('eliminar') && (
                        <button
                          type="button"
                          className="uk-button uk-button-danger uk-button-small"
                          onClick={() => eliminar(p)}
                        >
                          Eliminar
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
              maxWidth: 560,
              margin: '2rem auto',
              maxHeight: 'calc(100vh - 4rem)',
              overflow: 'auto',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-producto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-small-bottom">
              <h2 id="titulo-editar-producto" className="uk-modal-title uk-margin-remove">
                Editar producto
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
                <label className="uk-form-label">Nombre</label>
                <input
                  className="uk-input"
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                />
              </div>
              <div className="uk-margin">
                <label className="uk-form-label">Categoría</label>
                <select
                  className="uk-select"
                  value={editando.categoriaId}
                  onChange={(e) =>
                    setEditando({ ...editando, categoriaId: e.target.value })
                  }
                >
                  {opcionesEdicionCategoria.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                      {c.estado === 'inactiva' ? ' (inactiva)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="uk-margin">
                <label className="uk-form-label">Descripción</label>
                <textarea
                  className="uk-textarea"
                  rows={3}
                  value={editando.descripcion}
                  onChange={(e) =>
                    setEditando({ ...editando, descripcion: e.target.value })
                  }
                />
              </div>
              <div className="uk-margin uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Precio (COP, solo números)</label>
                  <input
                    className="uk-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Ej. 5000"
                    value={editando.precio}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        precio: digitosPrecio(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="uk-width-1-2">
                  <label className="uk-form-label">Stock</label>
                  <input
                    className="uk-input"
                    type="number"
                    min={0}
                    value={editando.stock}
                    onChange={(e) =>
                      setEditando({ ...editando, stock: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="uk-margin uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2 uk-flex uk-flex-middle">
                  <label>
                    <input
                      type="checkbox"
                      className="uk-checkbox"
                      checked={editando.disponible}
                      onChange={(e) =>
                        setEditando({ ...editando, disponible: e.target.checked })
                      }
                    />{' '}
                    Disponible
                  </label>
                </div>
              </div>
              <div className="uk-margin">
                <label className="uk-form-label">URL imagen</label>
                <input
                  className="uk-input"
                  value={editando.imagen ?? ''}
                  onChange={(e) =>
                    setEditando({ ...editando, imagen: e.target.value })
                  }
                />
              </div>
              <p className="uk-text-right">
                <button
                  type="button"
                  className="uk-button uk-button-default"
                  onClick={cerrarEdicion}
                >
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
