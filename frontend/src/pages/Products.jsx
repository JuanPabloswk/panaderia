import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'; 
import { API_BASE_URL } from '../config/api.js';
import '../styles/products.css';
import UIkit from 'uikit';
import { useCart } from '../context/CartContext.jsx';

function Product({ producto, onSelect }) {
    const imgUrl = (producto.imagen || '').trim();

    const handleClick = () => {
        const productoImagen = { ...producto, imgUrl: imgUrl };
        onSelect(productoImagen);
    }
    return (
        <div className="product-card uk-card uk-card-default">
            <div className="imagen-card uk-card-media-top">
                {imgUrl ? (
                    <img src={imgUrl} alt={producto.nombre} />
                ) : (
                    <div className="uk-placeholder uk-text-center">Sin imagen</div>
                )}
            </div>
            <div className="uk-card-body">
                <h2 className="uk-card-title">{producto.nombre}</h2>
                <div className='precio-button'>
                    <h2>
                        {producto.precio.toLocaleString('es-CO', { 
                            style: 'currency', 
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </h2>
                    <button className="uk-button uk-button-default" onClick={handleClick}>Agregar</button>
                </div>
            </div>
        </div>
    );
}

function Modal ({ producto, onAddToCart }) {
    const buttonRef = useRef(null);
    
    useEffect(() => {
        const btn = buttonRef.current;
        if (btn && producto && onAddToCart) {
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productoParaCarrito = {
                    id: producto.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    categoria: producto.categoria,
                    categoriaSlug: producto.categoriaSlug,
                    imagen: producto.imagen,
                    imgUrl: producto.imagen || '',
                };
                
                onAddToCart(productoParaCarrito);
                
                UIkit.modal("#modal-producto").hide();
                
                setTimeout(() => {
                    UIkit.notification({
                        message: `✓ ${producto.nombre} agregado al carrito`,
                        status: 'success',
                        pos: 'top-center',
                        timeout: 3000
                    });
                }, 300);
            };
            
            btn.addEventListener('click', handleClick);
            return () => {
                btn.removeEventListener('click', handleClick);
            };
        }
    }, [producto, onAddToCart]);
    
    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!producto || !onAddToCart) {
            return;
        }
        
        const productoParaCarrito = {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            categoria: producto.categoria,
            categoriaSlug: producto.categoriaSlug,
            imagen: producto.imagen,
            imgUrl: producto.imagen || '',
        };
        
        onAddToCart(productoParaCarrito);
        
        UIkit.modal("#modal-producto").hide();
        
        setTimeout(() => {
            UIkit.notification({
                message: `✓ ${producto.nombre} agregado al carrito`,
                status: 'success',
                pos: 'top-center',
                timeout: 3000
            });
        }, 300);
    };

    return (
        <div>
            <div id="modal-producto" data-uk-modal>
                <div className="uk-modal-dialog uk-margin-auto-vertical uk-modal-body modal-custom-grid">
                    <div className="uk-grid-collapse uk-child-width-1-2@m uk-flex-middle" data-uk-grid>
                        <div className="imagen-modal-contenedor">
                            {producto?.imagen ? (
                                <img src={producto.imagen} alt={producto?.nombre} />
                            ) : (
                                <div className="uk-placeholder uk-text-center">Sin imagen</div>
                            )}
                        </div>
                        <div className='modal-content-right uk-padding'>
                            <h1 className="uk-modal-title">{producto?.nombre}</h1>
                            <p>{producto?.descripcion}</p>
                            {producto?.precio && (
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#584125', marginTop: '20px' }}>
                                    {producto.precio.toLocaleString('es-CO', { 
                                        style: 'currency', 
                                        currency: 'COP',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}
                                </p>
                            )}
                            <div className="uk-text-right" style={{ marginTop: '20px' }}>
                                <button 
                                    className="uk-button uk-button-default uk-modal-close" 
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    ref={buttonRef}
                                    className="uk-button uk-button-primary" 
                                    type="button"
                                    onClick={handleSave}
                                    style={{ marginLeft: '10px', borderRadius: '25px' }}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default function Products() {
    const { categoria } = useParams();
    const [fuenteProductos, setFuenteProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [catalogoEstado, setCatalogoEstado] = useState('loading');
    const [retryTick, setRetryTick] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        let cancelado = false;
        setCatalogoEstado('loading');
        fetch(`${API_BASE_URL}/api/productos`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('api'))))
            .then((data) => {
                if (cancelado) return;
                const lista = Array.isArray(data.productos) ? data.productos : [];
                if (lista.length === 0) {
                    setFuenteProductos([]);
                    setCatalogoEstado('error');
                    return;
                }
                setFuenteProductos(lista);
                setCatalogoEstado('ok');
            })
            .catch(() => {
                if (!cancelado) {
                    setFuenteProductos([]);
                    setCatalogoEstado('error');
                }
            });
        return () => {
            cancelado = true;
        };
    }, [retryTick]);

    useEffect(() => {
        if (categoria) {
            const url = categoria.toLowerCase();
            const lista = fuenteProductos.filter((p) => {
                const slug = (p.categoriaSlug || '').toLowerCase();
                const nombreCat = (p.categoria || '').toLowerCase();
                return slug === url || nombreCat === url;
            });
            setProductosFiltrados(lista);
        } else {
            setProductosFiltrados(fuenteProductos);
        }
    }, [categoria, fuenteProductos]);

    const handleSelect = (producto) => {
        setProductoSeleccionado(producto);
        UIkit.modal("#modal-producto").show();
    }

    if (catalogoEstado === 'loading') {
        return (
            <div className="uk-container uk-margin-large-top uk-text-center">
                <h1 className="titulo-productos">Nuestros productos</h1>
                <p className="uk-text-lead" style={{ color: '#584125' }}>Cargando catálogo…</p>
            </div>
        );
    }

    if (catalogoEstado === 'error') {
        return (
            <div className="uk-container uk-margin-large-top uk-text-center">
                <h1 className="titulo-productos">Nuestros productos</h1>
                <p className="uk-text-lead uk-margin" style={{ color: '#584125' }}>
                    No se pudo cargar el catálogo. Comprueba que el backend esté en marcha y que{' '}
                    <code>MONGODB_URI</code> sea correcto en <code>backend/.env</code>.
                </p>
                <button
                    type="button"
                    className="uk-button uk-button-primary"
                    style={{ borderRadius: '25px' }}
                    onClick={() => setRetryTick((n) => n + 1)}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className='titulo-productos'>Nuestros productos</h1>
            {productosFiltrados.length === 0 ? (
                <div className="uk-container uk-text-center uk-margin">
                    <p className="uk-text-lead" style={{ color: '#584125' }}>
                        No hay productos en esta categoría.
                    </p>
                    <a href="/Productos" className="uk-button uk-button-default" style={{ borderRadius: '25px' }}>
                        Ver todas las categorías
                    </a>
                </div>
            ) : (
            <div className="products uk-grid-column-small uk-grid-row-medium uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center" data-uk-grid>
                {productosFiltrados.map(p => (
                    <div className="producto" key={p.id}>
                        <Product producto={p} onSelect={handleSelect}/>
                    </div>
                ))}
            </div>
            )}
            <Modal producto={productoSeleccionado} onAddToCart={addToCart} />
        </div>
    )
}