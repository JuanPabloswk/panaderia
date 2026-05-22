import { useState, useEffect } from 'react';
import { obtenerPedidos } from '../../services/pedidos.service';
import { obtenerProductos } from '../../services/productos.service';
import UIkit from 'uikit';

function AdminOverview() {
  const [stats, setStats] = useState({ confirmados: 0, preparacion: 0, listos: 0, entregadosHoy: 0, bajoStock: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pedidosRes, productosRes] = await Promise.all([obtenerPedidos(), obtenerProductos()]);
        const pedidos = pedidosRes.data.data;
        const hoy = new Date().toDateString();
        setStats({
          confirmados: pedidos.filter((p) => p.estado === 'confirmado').length,
          preparacion: pedidos.filter((p) => p.estado === 'preparacion').length,
          listos: pedidos.filter((p) => p.estado === 'listo').length,
          entregadosHoy: pedidos.filter((p) => p.estado === 'entregado' && new Date(p.fechaPedido).toDateString() === hoy).length,
          bajoStock: productosRes.data.data.filter((p) => p.stock <= 5).length,
        });
      } catch (error) { console.error(error) }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Por confirmar', value: stats.confirmados, color: '#3498db' },
    { title: 'En preparación', value: stats.preparacion, color: '#9b59b6' },
    { title: 'Listos', value: stats.listos, color: '#2ecc71' },
    { title: 'Entregados hoy', value: stats.entregadosHoy, color: '#27ae60' },
    { title: 'Stock bajo', value: stats.bajoStock, color: '#e74c3c' },
  ];

  return (
    <div>
      <h3 style={{ color: '#584125' }}>Resumen del día</h3>
      <div className="uk-grid-small uk-child-width-1-5@m uk-child-width-1-2@s" data-uk-grid>
        {cards.map((card) => (
          <div key={card.title}>
            <div
              className="uk-card uk-card-default uk-card-body uk-text-center uk-border-rounded"
              style={{
                borderTop: `4px solid ${card.color}`,
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: card.color, margin: 0 }}>{card.value}</p>
              <p style={{ color: '#584125', margin: '5px 0 0' }}>{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOverview;
