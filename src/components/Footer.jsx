import '../styles/footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
      <section className="uk-section footer-main-section">
        <div className="uk-container">
          <h2 className="uk-heading-line uk-text-center uk-margin-large-bottom">
            <span>Información</span>
          </h2>
          
          <div className='footer-grid uk-child-width-1-3@m uk-text-center' data-uk-grid>
            
            <div className='footer-column'>
              <h3 className="uk-text-bold">Nuestras Tiendas</h3> 
              <div className='uk-text-left uk-margin-top'>
                {/* Bogotá */}
                <h4 className='uk-text-bold uk-margin-small-bottom'>Bogotá</h4>
                <p className='uk-text-small uk-margin-remove-top'>Avenida calle 127. Barrio Prado veraniego</p>
                <p className='uk-text-small uk-margin-remove-top'>Avenida Caracas. Barrio Chapinero</p>
                {/* Neiva */}
                <h4 className='uk-text-bold uk-margin-small-bottom uk-margin-medium-top'>Neiva</h4>
                <p className='uk-text-small uk-margin-remove-top'>Centro Comercial San Pedro Plaza</p>
                <p className='uk-text-small uk-margin-remove-top'>Carrera 5 # 12-41 Barrio Sevilla</p>
              </div>
            </div>

            <div className='footer-column'>
              <h3 className="uk-text-bold">Enlaces Rápidos</h3>
              <ul className="uk-list footer-links uk-text-left uk-margin-top">
                <li><Link to="/Nosotros" className="uk-link-reset uk-text-small">Nuestra Historia</Link></li>
                <li><Link to="/Productos" className="uk-link-reset uk-text-small">Ver Productos</Link></li>
                <li><Link to="/Contacto" className="uk-link-reset uk-text-small">Contáctanos</Link></li>
                <li>
                  <Link to="/preguntas-frecuentes" className="uk-link-reset footer-faq-link uk-text-bold">
                    PREGUNTAS FRECUENTES
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMNA 3: REDES SOCIALES */}
            <div className='footer-column'>
              <h3 className="uk-text-bold">Síguenos</h3> {/* Emoji quitado */}
              <div className="uk-flex uk-flex-center uk-margin-top uk-margin-large-top">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="uk-icon-button uk-margin-small-right social-icon"
                  data-uk-icon="facebook"
                ></a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="uk-icon-button uk-margin-small-right social-icon"
                  data-uk-icon="twitter"
                ></a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="uk-icon-button uk-margin-small-right social-icon"
                  data-uk-icon="instagram"
                ></a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="uk-icon-button social-icon"
                  data-uk-icon="youtube"
                ></a>
              </div>
            </div>

          </div> 
        </div>
      </section>
      
      <footer className="uk-section uk-section-secondary uk-section-xsmall uk-text-center footer-copyright">
        <div className="uk-container">
          <p className="uk-text-small uk-text-muted uk-margin-remove">
            © 2025 Panaderia. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Footer;