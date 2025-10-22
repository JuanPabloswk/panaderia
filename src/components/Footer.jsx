import '../styles/footer.css'
import Map from './Map.jsx';
// 1. Importar el componente Link
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
      <section className="uk-section uk-section-default">
        <div className="uk-container">
          <h2 className="uk-heading-line uk-text-center">
            <span>Encuéntranos</span>
          </h2>
          <div className='general-mapa' data-uk-grid>
            
            <Map />

            <div className='mapa-info'>
              <div>
                <h2>Bogotá</h2>
                <p>Avenida calle 127. Barrio Prado veraniego</p>
                <p>Avenida Caracas. Barrio Chapinero</p>
              </div>
              <div style={{marginTop: "70px"}}>
                <h2>Neiva</h2>
                <p>Centro Comercial San Pedro Plaza</p>
                <p>Carrera 5 # 12-41 Barrio Sevilla</p>
              </div>
              
            </div>
          </div> 
        </div>
      </section>
      
      {/*se agrega vinculo de preguntas frecuentes*/}
      <footer className="uk-section uk-section-secondary uk-section-xsmall uk-text-center">
        <div className="uk-container">
          <p className="uk-text-small uk-text-muted">
            <Link to="/preguntas-frecuentes" className="uk-link-reset">
              Preguntas Frecuentes
            </Link>
          </p>
          <p className="uk-text-small uk-text-muted">
             © 2025 Panaderia. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Footer;