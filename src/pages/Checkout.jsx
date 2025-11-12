import { useCart } from '../context/CartContext';
import '../styles/checkout.css';
import UIkit from 'uikit';

function Checkout() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const handleQuantityChange = (productId, newQuantity, productName) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      UIkit.notification({
        message: `${productName} eliminado del carrito`,
        status: 'warning',
        pos: 'top-center',
        timeout: 2000
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      UIkit.notification({
        message: 'Tu carrito está vacío',
        status: 'warning',
        pos: 'top-center'
      });
      return;
    }
    
    UIkit.notification({
      message: '¡Gracias por tu compra! En un futuro implementaremos el proceso de pago.',
      status: 'success',
      pos: 'top-center',
      timeout: 5000
    });
    
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
          <h1 className="checkout-title">Carrito de Compras</h1>
          <div className="uk-text-center uk-margin-large">
            <p className="uk-text-lead" style={{ color: '#584125' }}>
              Tu carrito está vacío
            </p>
            <a href="/Productos" className="uk-button uk-button-primary" style={{ marginTop: '20px' }}>
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
          {/* Lista de productos */}
          <div className="uk-width-2-3@m">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item uk-card uk-card-default uk-margin-bottom">
                  <div className="uk-card-body">
                    <div className="uk-grid-small uk-flex-middle" data-uk-grid>
                      <div className="uk-width-auto">
                        {item.imgUrl ? (
                          <img 
                            src={item.imgUrl} 
                            alt={item.nombre} 
                            className="cart-item-image"
                          />
                        ) : (
                          <div className="uk-placeholder" style={{ width: '100px', height: '100px' }}>
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="uk-width-expand">
                        <h3 className="uk-card-title" style={{ color: '#C98A40', margin: 0 }}>
                          {item.nombre}
                        </h3>
                        <p style={{ color: '#584125', marginTop: '5px' }}>
                          {item.descripcion}
                        </p>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button
                              className="uk-button uk-button-small uk-button-default"
                              onClick={() => handleQuantityChange(item.id, item.cantidad - 1, item.nombre)}
                            >
                              -
                            </button>
                            <span className="quantity-display">{item.cantidad}</span>
                            <button
                              className="uk-button uk-button-small uk-button-default"
                              onClick={() => handleQuantityChange(item.id, item.cantidad + 1, item.nombre)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="uk-button uk-button-small uk-button-danger"
                            onClick={() => {
                              removeFromCart(item.id);
                              UIkit.notification({
                                message: `${item.nombre} eliminado del carrito`,
                                status: 'warning',
                                pos: 'top-center',
                                timeout: 2000
                              });
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="uk-width-auto">
                        <p className="item-price">
                          {(item.precio * item.cantidad).toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}
                        </p>
                        {item.cantidad > 1 && (
                          <p className="item-unit-price">
                            {item.precio.toLocaleString('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="uk-width-1-3@m">
            <div className="cart-summary uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title" style={{ color: '#C98A40' }}>
                Resumen del Pedido
              </h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.cantidad, 0)} items)</span>
                  <span>
                    {getTotalPrice().toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row total-row">
                  <span><strong>Total</strong></span>
                  <span>
                    <strong>
                      {getTotalPrice().toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="summary-actions">
                <button
                  className="uk-button uk-button-primary uk-width-1-1"
                  onClick={handleCheckout}
                  style={{ marginBottom: '10px' }}
                >
                  Proceder al Pago
                </button>
                <button
                  className="uk-button uk-button-default uk-width-1-1"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </button>
                <a
                  href="/Productos"
                  className="uk-button uk-button-text uk-width-1-1"
                  style={{ marginTop: '10px' }}
                >
                  Seguir Comprando
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

