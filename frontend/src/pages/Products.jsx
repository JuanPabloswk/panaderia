import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerProductos, obtenerCategorias } from '../services/productos.service';
import '../styles/products.css';
import UIkit from 'uikit';
import { useCart } from '../context/CartContext';

const API_BASE = 'http://localhost:4000';

function Product({ producto, onAddToCart, onViewDetail }) {
  const imgUrl = producto.imagen ? `${API_BASE}${producto.imagen}` : null;
  const precioConDescuento = producto.descuento > 0
    ? producto.precio * (1 - producto.descuento / 100)
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(producto);
    UIkit.notification({
      message: `✓ ${producto.nombre} agregado al carrito`,
      status: 'success',
      pos: 'top-center',
      timeout: 2000,
    });
  };

  return (
    <div className="product-card uk-card uk-card-default">
      <div className="imagen-card uk-card-media-top" onClick={() => onViewDetail(producto)} style={{ cursor: 'pointer' }}>
        {imgUrl ? (
          <img src={imgUrl} alt={producto.nombre} />
        ) : (
          <div className="uk-placeholder uk-text-center" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#584125' }}>
            Sin imagen
          </div>
        )}
      </div>
      <div className="uk-card-body">
        <h2 className="uk-card-title" onClick={() => onViewDetail(producto)} style={{ cursor: 'pointer' }}>{producto.nombre}</h2>
        <p style={{
          color: '#584125',
          margin: '5px 0',
          fontSize: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '42px'
        }}>
          {producto.descripcion}
        </p>
        <div className="precio-button">
          <div>
            {precioConDescuento ? (
              <>
                <h2 style={{ color: '#e74c3c', fontSize: '20px', textDecoration: 'line-through', margin: 0 }}>
                  {producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                </h2>
                <h2 style={{ margin: 0 }}>
                  {precioConDescuento.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                </h2>
              </>
            ) : (
              <h2>
                {producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
              </h2>
            )}
          </div>
          <button className="uk-button uk-button-primary" onClick={handleAdd} style={{ borderRadius: '25px' }}>Agregar</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ producto }) {
  const imgUrl = producto?.imagen ? `${API_BASE}${producto.imagen}` : null;
  const precioConDescuento = producto?.descuento > 0
    ? producto.precio * (1 - producto.descuento / 100)
    : null;

  return (
    <div id="modal-producto" data-uk-modal>
      <div className="uk-modal-dialog uk-margin-auto-vertical uk-modal-body modal-custom-grid">
        <div className="uk-grid-collapse uk-child-width-1-2@m uk-flex-middle" data-uk-grid>
          <div className="imagen-modal-contenedor">
            {imgUrl ? (
              <img src={imgUrl} alt={producto?.nombre} />
            ) : (
              <div className="uk-placeholder uk-text-center" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>Sin imagen</div>
            )}
          </div>
          <div className="modal-content-right uk-padding">
            <h1 className="uk-modal-title">{producto?.nombre}</h1>
            <p>{producto?.descripcion}</p>
            {producto?.peso && <p style={{ color: '#584125' }}><strong>Peso:</strong> {producto.peso}</p>}
            {producto?.ingredientes?.length > 0 && (
              <p style={{ color: '#584125' }}><strong>Ingredientes:</strong> {producto.ingredientes.join(', ')}</p>
            )}
            <div style={{ marginTop: '20px' }}>
              {precioConDescuento ? (
                <>
                  <p style={{ fontSize: '18px', color: '#e74c3c', textDecoration: 'line-through', margin: 0 }}>
                    {producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#584125', margin: 0 }}>
                    {precioConDescuento.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                    <span style={{ fontSize: '14px', color: '#27ae60', marginLeft: '10px' }}>-{producto.descuento}%</span>
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#584125' }}>
                  {producto?.precio?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                </p>
              )}
            </div>
            <div className="uk-text-right" style={{ marginTop: '20px' }}>
              <button className="uk-button uk-button-default uk-modal-close" type="button">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoria) {
          const catRes = await obtenerCategorias({ estado: 'activa' });
          const categorias = catRes.data.data;
          const normalizar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const cat = categorias.find(
            (c) => normalizar(c.nombre) === normalizar(categoria)
          );
          if (cat) {
            params.categoria = cat._id;
          }
        }
        const res = await obtenerProductos(params);
        setProductos(res.data.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        UIkit.notification({
          message: 'Error al cargar productos',
          status: 'danger',
          pos: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoria]);

  const handleAddToCart = (producto) => {
    const precioFinal = producto.descuento > 0
      ? producto.precio * (1 - producto.descuento / 100)
      : producto.precio;
    addToCart({
      _id: producto._id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: precioFinal,
      imagen: producto.imagen,
    });
  };

  const handleViewDetail = (producto) => {
    setProductoSeleccionado(producto);
    setTimeout(() => {
      UIkit.modal('#modal-producto').show();
    }, 50);
  };

  return (
    <div>
      <h1 className="titulo-productos">
        {categoria ? `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}` : 'Nuestros Productos'}
      </h1>
      {loading ? (
        <div className="uk-text-center uk-margin-large">
          <div data-uk-spinner="ratio: 2"></div>
          <p style={{ color: '#584125' }}>Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="uk-text-center uk-margin-large">
          <p className="uk-text-lead" style={{ color: '#584125' }}>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="products uk-grid-column-small uk-grid-row-medium uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center" data-uk-grid>
          {productos.map((p) => (
            <div className="producto" key={p._id}>
              <Product producto={p} onAddToCart={handleAddToCart} onViewDetail={handleViewDetail} />
            </div>
          ))}
        </div>
      )}
      <Modal producto={productoSeleccionado} />
    </div>
  );
}
