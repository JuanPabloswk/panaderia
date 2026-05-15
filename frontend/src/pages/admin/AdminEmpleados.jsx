import { useState, useEffect } from 'react';
import { obtenerEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from '../../services/clientes.service';
import UIkit from 'uikit';

const rolesOpciones = [
  { value: 'admin', label: 'Administrador', desc: 'Acceso total al sistema' },
  { value: 'gerente', label: 'Gerente', desc: 'Gestión de productos, pedidos, empleados' },
  { value: 'panadero', label: 'Panadero', desc: 'Gestión de productos y producción' },
  { value: 'vendedor', label: 'Vendedor', desc: 'Atención al cliente y pedidos' },
  { value: 'administrativo', label: 'Administrativo', desc: 'Tareas administrativas generales' },
];

const formVacio = {
  username: '', email: '', password: '', primerNombre: '', apellido: '',
  telefono: '', rol: 'vendedor', salario: '', estado: 'activo', permisos: [],
};

function AdminEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ ...formVacio });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await obtenerEmpleados();
        setEmpleados(res.data.data);
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    };
    fetch();
  }, []);

  const resetForm = () => { setEditando(null); setFormData({ ...formVacio }); };
  const openCreate = () => { resetForm(); setMostrarForm(true); };

  const openEdit = (e) => {
    setEditando(e._id);
    setFormData({
      username: e.username, email: e.email, password: '',
      primerNombre: e.primerNombre, apellido: e.apellido,
      telefono: e.telefono || '', rol: e.rol, salario: e.salario.toString(),
      estado: e.estado, permisos: e.permisos || [],
    });
    setMostrarForm(true);
  };

  const closeForm = () => { setMostrarForm(false); resetForm(); };

  const togglePermiso = (permiso) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter((p) => p !== permiso)
        : [...prev.permisos, permiso],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, salario: parseFloat(formData.salario) };
    if (!data.password && editando) delete data.password;
    try {
      if (editando) {
        await actualizarEmpleado(editando, data);
        UIkit.notification({ message: 'Empleado actualizado', status: 'success', pos: 'top-center' });
      } else {
        await crearEmpleado(data);
        UIkit.notification({ message: 'Empleado creado', status: 'success', pos: 'top-center' });
      }
      closeForm();
      const res = await obtenerEmpleados();
      setEmpleados(res.data.data);
    } catch (error) {
      UIkit.notification({ message: error.response?.data?.error || 'Error', status: 'danger', pos: 'top-center' });
    }
  };

  const handleDelete = async (id, nombre) => {
    UIkit.modal.confirm(`¿Eliminar empleado "${nombre}"?`).then(async () => {
      try {
        await eliminarEmpleado(id);
        setEmpleados((prev) => prev.filter((e) => e._id !== id));
        UIkit.notification({ message: 'Empleado eliminado', status: 'success', pos: 'top-center' });
      } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
    });
  };

  if (loading) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;

  return (
    <div>
      <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
        <h3 style={{ color: '#584125', margin: 0 }}>Empleados ({empleados.length})</h3>
        <button className="uk-button uk-button-primary" style={{ borderRadius: '25px' }} onClick={openCreate}>+ Nuevo</button>
      </div>

      {mostrarForm && (
        <div className="uk-card uk-card-default uk-card-body uk-margin-bottom uk-border-rounded">
          <h3 style={{ color: '#C98A40', marginTop: 0 }}>{editando ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="uk-margin">
              <label className="uk-form-label">Rol</label>
              <select className="uk-select" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                {rolesOpciones.map((r) => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
              </select>
            </div>
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2@s"><input className="uk-input" type="text" placeholder="Usuario" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required /></div>
              <div className="uk-width-1-2@s"><input className="uk-input" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            </div>
            <div className="uk-grid-small uk-margin" data-uk-grid>
              <div className="uk-width-1-2@s"><input className="uk-input" type="text" placeholder="Nombre" value={formData.primerNombre} onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })} required /></div>
              <div className="uk-width-1-2@s"><input className="uk-input" type="text" placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} required /></div>
            </div>
            <div className="uk-grid-small uk-margin" data-uk-grid>
              <div className="uk-width-1-2@s"><input className="uk-input" type="password" placeholder={editando ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editando} /></div>
              <div className="uk-width-1-2@s"><input className="uk-input" type="tel" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} /></div>
            </div>
            <div className="uk-grid-small uk-margin" data-uk-grid>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Salario</label>
                <input className="uk-input" type="text" placeholder="Salario" value={formData.salario} onChange={(e) => setFormData({ ...formData, salario: e.target.value })} required />
              </div>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Estado</label>
                <select className="uk-select" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="licencia">Licencia</option>
                </select>
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label">Permisos</label>
              <div className="uk-grid-small uk-child-width-auto" data-uk-grid>
                {['crear', 'editar', 'eliminar', 'ver', 'gestionar_empleados'].map((permiso) => (
                  <label key={permiso}>
                    <input className="uk-checkbox" type="checkbox" checked={formData.permisos.includes(permiso)} onChange={() => togglePermiso(permiso)} />{' '}
                    {permiso === 'gestionar_empleados' ? 'Gestionar empleados' : permiso.charAt(0).toUpperCase() + permiso.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="uk-text-right">
              <button type="button" className="uk-button uk-button-default" style={{ borderRadius: '25px', marginRight: '10px' }} onClick={closeForm}>Cancelar</button>
              <button type="submit" className="uk-button uk-button-primary" style={{ borderRadius: '25px' }}>{editando ? 'Guardar Cambios' : 'Crear Empleado'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-hover uk-table-divider uk-table-middle">
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Salario</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {empleados.map((e) => (
              <tr key={e._id}>
                <td style={{ color: '#584125' }}>{e.primerNombre} {e.apellido}</td>
                <td style={{ color: '#584125' }}>{e.email}</td>
                <td><span className="uk-label">{e.rol}</span></td>
                <td style={{ color: '#584125' }}>${e.salario?.toLocaleString('es-CO')}</td>
                <td><span className={`uk-label ${e.estado === 'activo' ? 'uk-label-success' : 'uk-label-warning'}`}>{e.estado}</span></td>
                <td>
                  <button className="uk-button uk-button-small uk-button-default" style={{ marginRight: '5px' }} onClick={() => openEdit(e)}>Editar</button>
                  <button className="uk-button uk-button-small uk-button-danger" onClick={() => handleDelete(e._id, `${e.primerNombre} ${e.apellido}`)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEmpleados;
