import { useState, useEffect } from 'react';
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria, cambiarEstadoCategoria } from '../../services/productos.service';
import UIkit from 'uikit';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await obtenerCategorias();
        setCategorias(res.data.data);
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    };
    fetch();
  }, []);

  const resetForm = () => { setEditando(null); setFormData({ nombre: '', descripcion: '' }); };
  const openCreate = () => { resetForm(); setMostrarForm(true); };
  const openEdit = (c) => { setEditando(c._id); setFormData({ nombre: c.nombre, descripcion: c.descripcion }); setMostrarForm(true); };
  const closeForm = () => { setMostrarForm(false); resetForm(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarCategoria(editando, formData);
        UIkit.notification({ message: 'Categoría actualizada', status: 'success', pos: 'top-center' });
      } else {
        await crearCategoria(formData);
        UIkit.notification({ message: 'Categoría creada', status: 'success', pos: 'top-center' });
      }
      closeForm();
      const res = await obtenerCategorias();
      setCategorias(res.data.data);
    } catch (error) {
      UIkit.notification({ message: error.response?.data?.error || 'Error', status: 'danger', pos: 'top-center' });
    }
  };

  const toggleEstado = async (c) => {
    const nuevoEstado = c.estado === 'activa' ? 'inactiva' : 'activa';
    try {
      await cambiarEstadoCategoria(c._id, nuevoEstado);
      const res = await obtenerCategorias();
      setCategorias(res.data.data);
      UIkit.notification({ message: `Categoría ${nuevoEstado}`, status: 'success', pos: 'top-center' });
    } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
  };

  const handleDelete = async (id, nombre) => {
    UIkit.modal.confirm(`¿Eliminar "${nombre}"?`).then(async () => {
      try {
        await eliminarCategoria(id);
        setCategorias((prev) => prev.filter((c) => c._id !== id));
        UIkit.notification({ message: 'Categoría eliminada', status: 'success', pos: 'top-center' });
      } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
    });
  };

  if (loading) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;

  return (
    <div>
      <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
        <h3 style={{ color: '#584125', margin: 0 }}>Categorías ({categorias.length})</h3>
        <button className="uk-button uk-button-primary" style={{ borderRadius: '25px' }} onClick={openCreate}>+ Nueva</button>
      </div>

      {mostrarForm && (
        <div className="uk-card uk-card-default uk-card-body uk-margin-bottom uk-border-rounded">
          <h3 style={{ color: '#C98A40', marginTop: 0 }}>{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="uk-margin">
              <input className="uk-input" type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <div className="uk-margin">
              <textarea className="uk-textarea" rows="3" placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required></textarea>
            </div>
            <div className="uk-text-right">
              <button type="button" className="uk-button uk-button-default" style={{ borderRadius: '25px', marginRight: '10px' }} onClick={closeForm}>Cancelar</button>
              <button type="submit" className="uk-button uk-button-primary" style={{ borderRadius: '25px' }}>{editando ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      )}

      <table className="uk-table uk-table-hover uk-table-divider">
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c._id}>
              <td style={{ color: '#584125' }}>{c.nombre}</td>
              <td style={{ color: '#584125' }}>{c.descripcion}</td>
              <td><span className={`uk-label ${c.estado === 'activa' ? 'uk-label-success' : 'uk-label-danger'}`} onClick={() => toggleEstado(c)} style={{ cursor: 'pointer' }}>{c.estado}</span></td>
              <td>
                <button className="uk-button uk-button-small uk-button-default" style={{ marginRight: '5px' }} onClick={() => openEdit(c)}>Editar</button>
                <button className="uk-button uk-button-small uk-button-danger" onClick={() => handleDelete(c._id, c.nombre)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategorias;
