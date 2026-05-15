import { useState, useEffect } from 'react';
import { obtenerProductos, crearProducto, actualizarProducto, subirImagenProducto, eliminarProducto, obtenerCategorias } from '../../services/productos.service';
import UIkit from 'uikit';

const API_BASE = 'http://localhost:4000';

const formVacio = { nombre: '', descripcion: '', precio: '', stock: '', categoria: '', descuento: '0', peso: '', disponible: 'true' };

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ ...formVacio });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([obtenerProductos(), obtenerCategorias()]);
        setProductos(prodRes.data.data);
        setCategorias(catRes.data.data.filter((c) => c.estado === 'activa'));
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setEditando(null);
    setFormData({ ...formVacio });
    setFile(null);
    setPreviewUrl(null);
  };

  const openCreate = () => { resetForm(); setMostrarForm(true); };

  const openEdit = (p) => {
    setEditando(p._id);
    setFormData({
      nombre: p.nombre, descripcion: p.descripcion,
      precio: p.precio.toString(), stock: p.stock.toString(),
      categoria: p.categoria?._id || p.categoria,
      descuento: (p.descuento || 0).toString(), peso: p.peso || '',
      disponible: p.disponible ? 'true' : 'false',
    });
    setFile(null);
    setPreviewUrl(p.imagen ? `${API_BASE}${p.imagen}` : null);
    setMostrarForm(true);
  };

  const closeForm = () => { setMostrarForm(false); resetForm(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        const jsonData = {};
        Object.entries(formData).forEach(([k, v]) => {
          if (v !== '' && v !== null && v !== undefined) jsonData[k] = v;
        });
        delete jsonData.imagen;
        await actualizarProducto(editando, jsonData);
        if (file) {
          const fd = new FormData();
          fd.append('imagen', file);
          await subirImagenProducto(editando, fd);
        }
        UIkit.notification({ message: 'Producto actualizado', status: 'success', pos: 'top-center' });
      } else {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
        });
        if (file) fd.append('imagen', file);
        await crearProducto(fd);
        UIkit.notification({ message: 'Producto creado', status: 'success', pos: 'top-center' });
      }
      closeForm();
      const res = await obtenerProductos();
      setProductos(res.data.data);
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Error';
      UIkit.notification({ message: msg, status: 'danger', pos: 'top-center', timeout: 5000 });
    }
  };

  const handleDelete = async (id, nombre) => {
    UIkit.modal.confirm(`¿Eliminar "${nombre}"?`).then(async () => {
      try {
        await eliminarProducto(id);
        setProductos((prev) => prev.filter((p) => p._id !== id));
        UIkit.notification({ message: 'Producto eliminado', status: 'success', pos: 'top-center' });
      } catch (error) { UIkit.notification({ message: 'Error al eliminar', status: 'danger', pos: 'top-center' }); }
    });
  };

  if (loading) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;

  return (
    <div>
      <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
        <h3 style={{ color: '#584125', margin: 0 }}>Productos ({productos.length})</h3>
        <button className="uk-button uk-button-primary" style={{ borderRadius: '25px' }} onClick={openCreate}>+ Nuevo Producto</button>
      </div>

      {mostrarForm && (
        <div className="uk-card uk-card-default uk-card-body uk-margin-bottom uk-border-rounded">
          <h3 style={{ color: '#C98A40', marginTop: 0 }}>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="uk-margin">
              <input className="uk-input" type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <div className="uk-margin">
              <textarea className="uk-textarea" rows="3" placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required></textarea>
            </div>
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-3@s">
                <input className="uk-input" type="number" step="any" placeholder="Precio" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} required />
              </div>
              <div className="uk-width-1-3@s">
                <input className="uk-input" type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
              <div className="uk-width-1-3@s">
                <input className="uk-input" type="number" placeholder="Dto %" value={formData.descuento} onChange={(e) => setFormData({ ...formData, descuento: e.target.value })} />
              </div>
            </div>
            <div className="uk-grid-small uk-margin" data-uk-grid>
              <div className="uk-width-1-2@s">
                <select className="uk-select" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} required>
                  <option value="">Categoría</option>
                  {categorias.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="uk-width-1-2@s">
                <input className="uk-input" type="text" placeholder="Peso" value={formData.peso} onChange={(e) => setFormData({ ...formData, peso: e.target.value })} />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label">Imagen</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <div className="uk-form-custom">
                  <input type="file" accept="image/*" onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) { setFile(f); setPreviewUrl(URL.createObjectURL(f)); }
                  }} />
                  <span className="uk-button uk-button-default" style={{ borderRadius: '25px' }}>{file ? file.name : 'Seleccionar'}</span>
                </div>
                {previewUrl && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={previewUrl} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }} />
                    <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', backgroundColor: '#e74c3c', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: '22px', textAlign: 'center', padding: 0 }}>×</button>
                  </div>
                )}
              </div>
            </div>
            <div className="uk-margin">
              <label><input className="uk-checkbox" type="checkbox" checked={formData.disponible === 'true'} onChange={(e) => setFormData({ ...formData, disponible: e.target.checked ? 'true' : 'false' })} /> Disponible</label>
            </div>
            <div className="uk-text-right">
              <button type="button" className="uk-button uk-button-default" style={{ borderRadius: '25px', marginRight: '10px' }} onClick={closeForm}>Cancelar</button>
              <button type="submit" className="uk-button uk-button-primary" style={{ borderRadius: '25px' }}>{editando ? 'Guardar Cambios' : 'Crear Producto'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-hover uk-table-divider uk-table-middle">
          <thead>
            <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td>{p.imagen ? <img src={`${API_BASE}${p.imagen}`} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /> : <span style={{ color: '#aaa' }}>Sin img</span>}</td>
                <td style={{ color: '#584125' }}>{p.nombre}</td>
                <td style={{ color: '#584125' }}>${p.precio?.toLocaleString('es-CO')}</td>
                <td><span className={`uk-label ${p.stock <= 5 ? 'uk-label-danger' : 'uk-label-success'}`}>{p.stock}</span></td>
                <td style={{ color: '#584125' }}>{p.categoria?.nombre || '-'}</td>
                <td><span className={`uk-label ${p.disponible ? 'uk-label-success' : 'uk-label-danger'}`}>{p.disponible ? 'Disponible' : 'No'}</span></td>
                <td>
                  <button className="uk-button uk-button-small uk-button-default" style={{ marginRight: '5px' }} onClick={() => openEdit(p)}>Editar</button>
                  <button className="uk-button uk-button-small uk-button-danger" onClick={() => handleDelete(p._id, p.nombre)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductos;
