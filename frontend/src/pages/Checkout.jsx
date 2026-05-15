import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../services/pedidos.service';
import '../styles/checkout.css';
import UIkit from 'uikit';

const API_BASE = 'http://localhost:4000';

function Checkout() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();
  const [pedidoCreado, setPedidoCreado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    metodoPago: 'efectivo',
    tipoEntrega: 'tienda',
    calle: '',
    ciudad: '',
    departamento: '',
    pais: 'Colombia',
    referencia: '',
    notasEspeciales: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (productId, newQuantity, productName) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      UIkit.notification({
        message: `${productName} eliminado del carrito`,
        status: 'warning',
        pos: 'top-center',
        timeout: 2000,
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      UIkit.notification({
        message: 'Tu carrito está vacío',
        status: 'warning',
        pos: 'top-center',
      });
      return;
    }

    if (!isAuthenticated) {
      UIkit.notification({
        message: 'Debes iniciar sesión para realizar un pedido',
        status: 'warning',
        pos: 'top-center',
      });
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        producto: item._id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      }));

      const subtotal = getTotalPrice();

      const pedidoData = {
        cliente: usuario._id,
        items,
        subtotal,
        total: subtotal,
        metodoPago: formData.metodoPago,
        tipoEntrega: formData.tipoEntrega,
        notasEspeciales: formData.notasEspeciales || undefined,
      };

      if (formData.tipoEntrega === 'domicilio') {
        pedidoData.direccionEntrega = {
          calle: formData.calle,
          ciudad: formData.ciudad,
          departamento: formData.departamento,
          pais: formData.pais,
          referencia: formData.referencia || undefined,
        };
      }

      const res = await crearPedido(pedidoData);
      setPedidoCreado(res.data.data);
      clearCart();

      UIkit.notification({
        message: '¡Pedido creado exitosamente!',
        status: 'success',
        pos: 'top-center',
        timeout: 4000,
      });
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al crear el pedido';
      UIkit.notification({
        message: msg,
        status: 'danger',
        pos: 'top-center',
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (pedidoCreado) {
    return (
      <div className="checkout-container">
        <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
          <div className="uk-card uk-card-default uk-card-body uk-text-center" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '15px' }}>
            <span data-uk-icon="icon: check; ratio: 3" style={{ color: '#27ae60' }}></span>
            <h2 style={{ color: '#27ae60', marginTop: '20px' }}>¡Pedido Confirmado!</h2>
            <p style={{ color: '#584125', fontSize: '18px' }}>Número de pedido: <strong>{pedidoCreado._id}</strong></p>
            <p style={{ color: '#584125' }}>Estado: <strong>{pedidoCreado.estado}</strong></p>
            <p style={{ color: '#584125' }}>
              Total: <strong>{pedidoCreado.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</strong>
            </p>
            <div className="uk-margin-top">
              <button className="uk-button uk-button-primary" style={{ borderRadius: '25px', marginRight: '10px' }} onClick={() => navigate('/mis-pedidos')}>
                Mis Pedidos
              </button>
              <button className="uk-button uk-button-default" style={{ borderRadius: '25px' }} onClick={() => navigate('/Productos')}>
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
          <h1 className="checkout-title">Carrito de Compras</h1>
          <div className="uk-text-center uk-margin-large">
            <p className="uk-text-lead" style={{ color: '#584125' }}>Tu carrito está vacío</p>
            <a href="/Productos" className="uk-button uk-button-primary" style={{ marginTop: '20px', borderRadius: '25px' }}>
              Ver Productos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
        <h1 className="checkout-title">Carrito de Compras</h1>

        <div className="uk-grid-large" data-uk-grid>
          <div className="uk-width-2-3@m">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item uk-card uk-card-default uk-margin-bottom">
                  <div className="uk-card-body">
                    <div className="uk-grid-small uk-flex-middle" data-uk-grid>
                      <div className="uk-width-auto">
                        {item.imagen ? (
                          <img src={`${API_BASE}${item.imagen}`} alt={item.nombre} className="cart-item-image" />
                        ) : (
                          <div className="uk-placeholder" style={{ width: '100px', height: '100px' }}>Sin imagen</div>
                        )}
                      </div>
                      <div className="uk-width-expand">
                        <h3 className="uk-card-title" style={{ color: '#C98A40', margin: 0 }}>{item.nombre}</h3>
                        <p style={{ color: '#584125', marginTop: '5px' }}>{item.descripcion}</p>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button className="uk-button uk-button-small uk-button-default" onClick={() => handleQuantityChange(item._id, item.cantidad - 1, item.nombre)}>-</button>
                            <span className="quantity-display">{item.cantidad}</span>
                            <button className="uk-button uk-button-small uk-button-default" onClick={() => handleQuantityChange(item._id, item.cantidad + 1, item.nombre)}>+</button>
                          </div>
                          <button className="uk-button uk-button-small uk-button-danger" style={{ borderRadius: '25px' }} onClick={() => { removeFromCart(item._id); UIkit.notification({ message: `${item.nombre} eliminado del carrito`, status: 'warning', pos: 'top-center', timeout: 2000 }); }}>Eliminar</button>
                        </div>
                      </div>
                      <div className="uk-width-auto">
                        <p className="item-price">
                          {(item.precio * item.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                        </p>
                        {item.cantidad > 1 && (
                          <p className="item-unit-price">
                            {item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="uk-width-1-3@m">
            <div className="cart-summary uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title" style={{ color: '#C98A40' }}>Resumen del Pedido</h3>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.cantidad, 0)} items)</span>
                  <span>{getTotalPrice().toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#584125', fontWeight: 'bold' }}>Método de pago</label>
                  <select className="uk-select" name="metodoPago" value={formData.metodoPago} onChange={handleChange}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="nequi">Nequi</option>
                  </select>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label" style={{ color: '#584125', fontWeight: 'bold' }}>Tipo de entrega</label>
                  <select className="uk-select" name="tipoEntrega" value={formData.tipoEntrega} onChange={handleChange}>
                    <option value="tienda">Recoger en tienda</option>
                    <option value="domicilio">Domicilio</option>
                  </select>
                </div>

                {formData.tipoEntrega === 'domicilio' && (
                  <div>
                    <div className="uk-margin-small">
                      <input className="uk-input" type="text" name="calle" placeholder="Calle y número" value={formData.calle} onChange={handleChange} required />
                    </div>
                    <div className="uk-grid-small" data-uk-grid>
                      <div className="uk-width-1-2@s">
                        <input className="uk-input" type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required />
                      </div>
                      <div className="uk-width-1-2@s">
                        <input className="uk-input" type="text" name="departamento" placeholder="Departamento" value={formData.departamento} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="uk-margin-small">
                      <input className="uk-input" type="text" name="referencia" placeholder="Referencia (opcional)" value={formData.referencia} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <div className="uk-margin">
                  <textarea className="uk-textarea" name="notasEspeciales" rows="3" placeholder="Notas especiales (opcional)" value={formData.notasEspeciales} onChange={handleChange}></textarea>
                </div>

                <hr className="summary-divider" />
                <div className="summary-row total-row">
                  <span><strong>Total</strong></span>
                  <span><strong>{getTotalPrice().toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</strong></span>
                </div>
              </div>

              <div className="summary-actions">
                <button className="uk-button uk-button-primary uk-width-1-1" onClick={handleCheckout} style={{ marginBottom: '10px', borderRadius: '25px' }} disabled={loading}>
                  {loading ? 'Procesando...' : 'Proceder al Pago'}
                </button>
                <button className="uk-button uk-button-default uk-width-1-1" onClick={clearCart}>Vaciar Carrito</button>
                <a href="/Productos" className="uk-button uk-button-text uk-width-1-1" style={{ marginTop: '10px' }}>Seguir Comprando</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
