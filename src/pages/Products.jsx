import {useState, useEffect} from 'react'
import { productos } from '../data/productos.js';
import '../styles/products.css';

function Product({ producto }) {
    const [imgUrl, setImgUrl] = useState("");
    useEffect(() => {
        fetch(`https://api.unsplash.com/search/photos?query=${producto.queryImage}&client_id=lN-NVtpQ8v2ziR294YR2wlgX_HzU-s4wadfPIy1-DMU&per_page=1`)
        .then(response => response.json())
        .then(data => setImgUrl(data.results[0].urls.small))
    }, [producto.queryImage]);
  return (
            <div className="uk-card uk-card-default">
                <div className="uk-card-media-top">
                    <img src={imgUrl} alt={producto.nombre} />
                </div>
                <div className="uk-card-body">
                    <h3 className="uk-card-title">{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                </div>
            </div>
  );
}

export default function Products() {

    return (
            <div>
                <h1>Nuestros productos</h1>
                <div className="products uk-grid-column-small uk-grid-row-medium uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center" data-uk-grid>
                    {productos.map(p => (
                        <div className="producto" key={p.id}>
                            <Product producto={p} />
                        </div>
                    ))}
                </div>
            </div>
    )
}