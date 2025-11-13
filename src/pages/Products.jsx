import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'; 
import { productos as todosLosProductos } from '../data/productos.js';
import '../styles/products.css';
import UIkit from 'uikit';
import { useCart } from '../context/CartContext';

function Product({ producto, onSelect }) {
    const [imgUrl, setImgUrl] = useState("");
    useEffect(() => {
        fetch(`https://api.unsplash.com/search/photos?query=${producto.queryImage}&client_id=lN-NVtpQ8v2ziR294YR2wlgX_HzU-s4wadfPIy1-DMU&per_page=1`)
        .then(response => response.json())
        .then(data => setImgUrl(data.results[0].urls.small))
    }, [producto.queryImage]);

    const handleClick = () => {
        const productoImagen = {...producto, imgUrl: imgUrl}; 
        onSelect(productoImagen);
    }
    return (
        <div className="product-card uk-card uk-card-default">
            <div className="imagen-card uk-card-media-top">
                {imgUrl ? (
                    <img src={imgUrl} alt={producto.nombre} />
                ) : (
                    <div className="uk-placeholder uk-text-center">Cargando imagen...</div>
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
                    queryImage: producto.queryImage,
                    categoria: producto.categoria,
                    imgUrl: producto.imgUrl
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
            queryImage: producto.queryImage,
            categoria: producto.categoria,
            imgUrl: producto.imgUrl
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
                            {producto?.imgUrl ? (
                                <img src={producto.imgUrl} alt={producto?.nombre} />
                            ) : (
                                <div className="uk-placeholder uk-text-center">Cargando imagen...</div>
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
                                    style={{ marginLeft: '10px' }}
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
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if(categoria) {
            const productos = todosLosProductos.filter(
                (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
            );
            setProductosFiltrados(productos);
        } else {
            setProductosFiltrados(todosLosProductos);
        }
    }, [categoria]);

    const handleSelect = (producto) => {
        setProductoSeleccionado(producto);
        UIkit.modal("#modal-producto").show();
    }

    return (
        <div>
            <h1 className='titulo-productos'>Nuestros productos</h1>
            <div className="products uk-grid-column-small uk-grid-row-medium uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center" data-uk-grid>
                {productosFiltrados.map(p => (
                    <div className="producto" key={p.id}>
                        <Product producto={p} onSelect={handleSelect}/>
                    </div>
                ))}
            </div>
            <Modal producto={productoSeleccionado} onAddToCart={addToCart} />
        </div>
    )
}