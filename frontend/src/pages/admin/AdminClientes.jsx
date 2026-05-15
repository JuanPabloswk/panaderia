import { useState, useEffect } from 'react';
import { obtenerClientes, eliminarCliente } from '../../services/clientes.service';
import UIkit from 'uikit';

function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await obtenerClientes();
        setClientes(res.data.data);
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    };
    fetch();
  }, []);

  const filtrados = clientes.filter((c) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return c.primerNombre?.toLowerCase().includes(q) || c.apellido?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  const handleDelete = async (id, nombre) => {
    UIkit.modal.confirm(`¿Eliminar cliente "${nombre}"?`).then(async () => {
      try {
        await eliminarCliente(id);
        setClientes((prev) => prev.filter((c) => c._id !== id));
        UIkit.notification({ message: 'Cliente eliminado', status: 'success', pos: 'top-center' });
      } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
    });
  };

  if (loading) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;

  return (
    <div>
      <h3 style={{ color: '#584125' }}>Clientes ({clientes.length})</h3>
      <div className="uk-margin-bottom">
        <input className="uk-input uk-width-1-3@s" type="text" placeholder="Buscar por nombre o email..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-hover uk-table-divider uk-table-middle">
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Pedidos</th><th>Registro</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c._id}>
                <td style={{ color: '#584125' }}>{c.primerNombre} {c.apellido}</td>
                <td style={{ color: '#584125' }}>{c.email}</td>
                <td style={{ color: '#584125' }}>{c.telefono || '-'}</td>
                <td style={{ color: '#584125' }}>{c.pedidos?.length || 0}</td>
                <td style={{ color: '#584125', fontSize: '13px' }}>{new Date(c.createdAt).toLocaleDateString('es-CO')}</td>
                <td><button className="uk-button uk-button-small uk-button-danger" onClick={() => handleDelete(c._id, `${c.primerNombre} ${c.apellido}`)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminClientes;
