import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerPedidos } from '../services/pedidos.service';
import UIkit from 'uikit';

const estadoColores = {
  pendiente: '#f39c12',
  confirmado: '#3498db',
  preparacion: '#9b59b6',
  listo: '#2ecc71',
  entregado: '#27ae60',
  cancelado: '#e74c3c',
};

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const params = {};
        if (filtro) params.estado = filtro;
        const res = await obtenerPedidos(params);
        setPedidos(res.data.data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        UIkit.notification({
          message: 'Error al cargar pedidos',
          status: 'danger',
          pos: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [filtro]);

  return (
    <div className="uk-section" style={{ minHeight: '70vh' }}>
      <div className="uk-container">
        <h1 className="uk-text-center" style={{ color: '#C98A40', fontWeight: 'bold', fontSize: '45px', marginBottom: '30px' }}>
          Mis Pedidos
        </h1>

        <div className="uk-margin-bottom">
          <select className="uk-select uk-width-1-4@s" value={filtro} onChange={(e) => { setFiltro(e.target.value); setLoading(true); }}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="preparacion">En preparación</option>
            <option value="listo">Listo</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {loading ? (
          <div className="uk-text-center uk-margin-large"><div data-uk-spinner="ratio: 2"></div></div>
        ) : pedidos.length === 0 ? (
          <div className="uk-text-center uk-margin-large">
            <p className="uk-text-lead" style={{ color: '#584125' }}>No tienes pedidos aún</p>
            <Link to="/Productos" className="uk-button uk-button-primary" style={{ borderRadius: '25px', marginTop: '20px' }}>
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="uk-grid-small uk-child-width-1-1" data-uk-grid>
            {pedidos.map((pedido) => (
              <div key={pedido._id}>
                <Link to={`/mis-pedidos/${pedido._id}`} className="uk-link-reset">
                  <div className="uk-card uk-card-default uk-card-body uk-border-rounded" style={{ transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="uk-grid-small uk-flex-middle" data-uk-grid>
                      <div className="uk-width-expand">
                        <p style={{ margin: 0, color: '#584125' }}>
                          <strong>Pedido:</strong> {pedido._id.slice(-8).toUpperCase()} |
                          <strong> Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleDateString('es-CO')} |
                          <strong> Items:</strong> {pedido.items.length}
                        </p>
                      </div>
                      <div className="uk-width-auto uk-text-right">
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#584125' }}>
                          {pedido.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="uk-width-auto">
                        <span className="uk-label" style={{ backgroundColor: estadoColores[pedido.estado] || '#999', color: '#fff' }}>
                          {pedido.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPedidos;
