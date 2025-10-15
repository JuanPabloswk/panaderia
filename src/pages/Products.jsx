import {useState, useEffect} from 'react'
import { productos } from '../data/productos.js';
import '../styles/products.css';
import UIkit from 'uikit';

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
            <div className="uk-card uk-card-default">
                <div className="imagen-card uk-card-media-top">
                    {imgUrl ? (
                        <img src={imgUrl} alt={producto.nombre} />
                    ) : (
                        <div className="uk-placeholder uk-text-center">Cargando imagen...</div>
                    )}
                </div>
                <div className="uk-card-body">
                    <h3 className="uk-card-title">{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
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

function Modal ({ producto }) {
    return (
        <div>
            <div id="modal-producto" data-uk-modal>
                <div className="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
                    <div className="imagen-modal-contenedor">
                        {producto?.imgUrl ? (
                            <img src={producto.imgUrl} alt={producto?.nombre} />
                        ) : (
                            <div className="uk-placeholder uk-text-center">Cargando imagen...</div>
                        )}
                    </div>
                    <h2 className="uk-modal-title">{producto?.nombre}</h2>
                    <p>{producto?.descripcion}</p>
                    <p className="uk-text-right">
                        <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                        <button className="uk-button uk-button-primary" type="button">Save</button>
                    </p>
                </div>
            </div>
        </div>
    )
};

export default function Products() {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const handleSelect = (producto) => {
        setProductoSeleccionado(producto);
        UIkit.modal("#modal-producto").show();
    }

    return (
            <div>
                <h1>Nuestros productos</h1>
                <div className="products uk-grid-column-small uk-grid-row-medium uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center" data-uk-grid>
                    {productos.map(p => (
                        <div className="producto" key={p.id}>
                            <Product producto={p} onSelect={handleSelect}/>
                        </div>
                    ))}
                </div>
                <Modal producto={productoSeleccionado} />
            </div>
    )
}