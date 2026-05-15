import { useState, useEffect } from 'react';
import { obtenerPedidos, actualizarEstadoPedido, eliminarPedido } from '../../services/pedidos.service';
import UIkit from 'uikit';

const estadoColores = {
  confirmado: '#3498db', preparacion: '#9b59b6',
  listo: '#2ecc71', pendiente: '#f39c12', entregado: '#27ae60', cancelado: '#e74c3c',
};

const cadenaEstados = ['confirmado', 'preparacion', 'listo', 'entregado'];

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = {};
        if (filtro) params.estado = filtro;
        const res = await obtenerPedidos(params);
        setPedidos(res.data.data);
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    };
    fetch();
  }, [filtro]);

  const avanzarEstado = async (pedido) => {
    const idx = cadenaEstados.indexOf(pedido.estado);
    if (idx === -1 || idx >= cadenaEstados.length - 1) return;
    const nuevoEstado = cadenaEstados[idx + 1];
    try {
      await actualizarEstadoPedido(pedido._id, nuevoEstado);
      setPedidos((prev) => prev.map((p) => p._id === pedido._id ? { ...p, estado: nuevoEstado } : p));
      UIkit.notification({ message: `Pedido → ${nuevoEstado}`, status: 'success', pos: 'top-center' });
    } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
  };

  const cancelarPedido = async (id) => {
    try {
      await actualizarEstadoPedido(id, 'cancelado');
      setPedidos((prev) => prev.map((p) => p._id === id ? { ...p, estado: 'cancelado' } : p));
      UIkit.notification({ message: 'Pedido cancelado', status: 'warning', pos: 'top-center' });
    } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
  };

  const handleDelete = async (id) => {
    UIkit.modal.confirm('¿Eliminar este pedido permanentemente?').then(async () => {
      try {
        await eliminarPedido(id);
        setPedidos((prev) => prev.filter((p) => p._id !== id));
        UIkit.notification({ message: 'Pedido eliminado', status: 'success', pos: 'top-center' });
      } catch (error) { UIkit.notification({ message: 'Error', status: 'danger', pos: 'top-center' }); }
    });
  };

  if (loading) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;

  return (
    <div>
      <h3 style={{ color: '#584125' }}>Pedidos ({pedidos.length})</h3>

      <div className="uk-margin-bottom">
        <select className="uk-select uk-width-1-4@s" value={filtro} onChange={(e) => { setFiltro(e.target.value); setLoading(true); }}>
          <option value="">Todos</option>
          {cadenaEstados.concat('cancelado', 'pendiente').map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-hover uk-table-divider uk-table-middle">
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Items</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Pago</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p._id}>
                <td style={{ fontSize: '12px', color: '#584125' }}>{p._id.slice(-8).toUpperCase()}</td>
                <td style={{ color: '#584125' }}>{p.cliente?.primerNombre} {p.cliente?.apellido}</td>
                <td style={{ color: '#584125' }}>{p.items.length}</td>
                <td style={{ color: '#584125' }}>${p.total?.toLocaleString('es-CO')}</td>
                <td style={{ color: '#584125', fontSize: '13px' }}>{new Date(p.fechaPedido).toLocaleDateString('es-CO')}</td>
                <td><span className="uk-label" style={{ backgroundColor: estadoColores[p.estado] || '#999', color: '#fff' }}>{p.estado}</span></td>
                <td style={{ color: '#584125' }}>{p.metodoPago}</td>
                <td>
                  {p.estado !== 'entregado' && p.estado !== 'cancelado' && p.estado !== 'pendiente' && (
                    <button className="uk-button uk-button-small uk-button-primary" style={{ borderRadius: '25px', marginRight: '5px' }}
                      onClick={() => avanzarEstado(p)}>Avanzar</button>
                  )}
                  {p.estado !== 'cancelado' && p.estado !== 'entregado' && (
                    <button className="uk-button uk-button-small uk-button-danger" style={{ borderRadius: '25px', marginRight: '5px' }}
                      onClick={() => cancelarPedido(p._id)}>Cancelar</button>
                  )}
                  <button className="uk-button uk-button-small uk-button-default" style={{ borderRadius: '25px' }}
                    onClick={() => handleDelete(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPedidos;
