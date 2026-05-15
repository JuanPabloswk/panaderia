import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerPedido } from '../services/pedidos.service';
import UIkit from 'uikit';

const estadoColores = {
  pendiente: '#f39c12',
  confirmado: '#3498db',
  preparacion: '#9b59b6',
  listo: '#2ecc71',
  entregado: '#27ae60',
  cancelado: '#e74c3c',
};

const API_BASE = 'http://localhost:4000';

function DetallePedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await obtenerPedido(id);
        setPedido(res.data.data);
      } catch (error) {
        console.error('Error al cargar pedido:', error);
        UIkit.notification({
          message: 'Error al cargar el pedido',
          status: 'danger',
          pos: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id]);

  if (loading) {
    return <div className="uk-text-center uk-margin-large"><div data-uk-spinner="ratio: 2"></div></div>;
  }

  if (!pedido) {
    return (
      <div className="uk-section uk-text-center">
        <p className="uk-text-lead" style={{ color: '#584125' }}>Pedido no encontrado</p>
        <Link to="/mis-pedidos" className="uk-button uk-button-primary" style={{ borderRadius: '25px' }}>Volver a Mis Pedidos</Link>
      </div>
    );
  }

  return (
    <div className="uk-section" style={{ minHeight: '70vh' }}>
      <div className="uk-container uk-container-small">
        <Link to="/mis-pedidos" className="uk-button uk-button-text" style={{ color: '#C98A40', marginBottom: '20px' }}>&larr; Mis Pedidos</Link>

        <div className="uk-card uk-card-default uk-card-body uk-border-rounded">
          <div className="uk-flex uk-flex-between uk-flex-middle" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ color: '#C98A40', fontWeight: 'bold', margin: 0 }}>Pedido #{pedido._id.slice(-8).toUpperCase()}</h2>
              <p style={{ color: '#584125', margin: '5px 0 0' }}>
                {new Date(pedido.fechaPedido).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className="uk-label" style={{ backgroundColor: estadoColores[pedido.estado] || '#999', color: '#fff', fontSize: '16px', padding: '8px 20px' }}>
              {pedido.estado}
            </span>
          </div>

          <hr />

          <div className="uk-grid-small" data-uk-grid>
            <div className="uk-width-1-2@s">
              <h4 style={{ color: '#584125' }}>Información del Pedido</h4>
              <p style={{ color: '#584125', margin: '5px 0' }}><strong>Método de pago:</strong> {pedido.metodoPago}</p>
              <p style={{ color: '#584125', margin: '5px 0' }}><strong>Tipo de entrega:</strong> {pedido.tipoEntrega === 'domicilio' ? 'Domicilio' : 'Recoger en tienda'}</p>
              {pedido.notasEspeciales && <p style={{ color: '#584125', margin: '5px 0' }}><strong>Notas:</strong> {pedido.notasEspeciales}</p>}
            </div>
            <div className="uk-width-1-2@s">
              {pedido.direccionEntrega?.calle && (
                <>
                  <h4 style={{ color: '#584125' }}>Dirección de Entrega</h4>
                  <p style={{ color: '#584125', margin: '5px 0' }}>{pedido.direccionEntrega.calle}</p>
                  <p style={{ color: '#584125', margin: '5px 0' }}>
                    {pedido.direccionEntrega.ciudad}, {pedido.direccionEntrega.departamento} - {pedido.direccionEntrega.pais}
                  </p>
                  {pedido.direccionEntrega.referencia && <p style={{ color: '#584125', margin: '5px 0' }}>Ref: {pedido.direccionEntrega.referencia}</p>}
                </>
              )}
            </div>
          </div>

          <hr />

          <h4 style={{ color: '#584125' }}>Productos</h4>
          <table className="uk-table uk-table-divider">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="uk-text-center">Cantidad</th>
                <th className="uk-text-right">Precio Unit.</th>
                <th className="uk-text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="uk-flex uk-flex-middle" style={{ gap: '10px' }}>
                      {item.producto?.imagen && (
                        <img src={`${API_BASE}${item.producto.imagen}`} alt={item.producto.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      )}
                      <span style={{ color: '#584125' }}>{item.producto?.nombre || 'Producto'}</span>
                    </div>
                  </td>
                  <td className="uk-text-center" style={{ color: '#584125' }}>{item.cantidad}</td>
                  <td className="uk-text-right" style={{ color: '#584125' }}>
                    {item.precioUnitario.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                  </td>
                  <td className="uk-text-right" style={{ color: '#584125', fontWeight: 'bold' }}>
                    {(item.precioUnitario * item.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <div className="uk-text-right">
            <p style={{ color: '#584125', fontSize: '16px' }}>
              <strong>Subtotal:</strong> {pedido.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            </p>
            {pedido.descuentoTotal > 0 && (
              <p style={{ color: '#e74c3c', fontSize: '16px' }}>
                <strong>Descuento:</strong> -{pedido.descuentoTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
              </p>
            )}
            <h3 style={{ color: '#584125', marginTop: '10px' }}>
              <strong>Total:</strong> {pedido.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;
