import '../styles/faq.css'; 

function PreguntasFrecuentes() {
  return (
    <div className='faq-container'>
      <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
        
        <h1 className="uk-heading-line uk-text-center uk-margin-large-bottom">
          <span>Preguntas Frecuentes</span>
        </h1>
        <h2 className="uk-text-center uk-text-lead uk-text-muted">
          Respuestas rápidas sobre nuestros productos y servicios de panadería.
        </h2>

        <div className="uk-margin-xlarge-top" data-uk-grid>
          <div className="uk-width-1-1">
            <ul data-uk-accordion="multiple: true">
              
              <li className="uk-open">
                <a className="uk-accordion-title faq-title" href="#">
                  ¿Utilizan ingredientes orgánicos o integrales?
                </a>
                <div className="uk-accordion-content">
                  <p>
                    Sí, en La Hornaza priorizamos la calidad. Ofrecemos una línea
                    especializada de panes elaborados con harinas orgánicas certificadas
                    e ingredientes integrales. Consulta nuestro menú de productos
                    saludables para conocer las opciones disponibles.
                  </p>
                </div>
              </li>
              
              <li>
                <a className="uk-accordion-title faq-title" href="#">
                  Quiero una torta personalizada para una boda, ¿con cuánto tiempo debo encargarla?
                </a>
                <div className="uk-accordion-content">
                  <p>
                    Para tortas de gran envergadura o pedidos para bodas,
                    solicitamos un encargo mínimo de tres (3) semanas de anticipación. 
                    Esto nos permite coordinar el diseño, los ingredientes y asegurar la
                    calidad y la frescura de todos nuestros productos para su evento especial.
                  </p>
                </div>
              </li>

              <li>
                <a className="uk-accordion-title faq-title" href="#">
                  ¿Tienen opciones para personas con dietas especiales (sin gluten, veganas)?
                </a>
                <div className="uk-accordion-content">
                  <p>
                    ¡Absolutamente! Contamos con una sección dedicada a productos veganos, 
                    que incluye panes de masa madre y algunos postres. También tenemos 
                    opciones sin gluten. Sin embargo, debido a que trabajamos con harinas 
                    en el mismo espacio, no podemos garantizar la ausencia total de trazas. 
                    Por favor, consulte al personal antes de ordenar.
                  </p>
                </div>
              </li>

              <li>
                <a className="uk-accordion-title faq-title" href="#">
                  ¿Cuáles son sus horarios de atención en las sucursales de Bogotá?
                </a>
                <div className="uk-accordion-content">
                  <p>
                    Nuestras sucursales en Bogotá (Prado Veraniego y Chapinero)
                    operan de lunes a domingo de 6:00 a.m. a 8:00 p.m. 
                    La sucursal del Centro Comercial San Pedro Plaza en Neiva tiene 
                    horarios sujetos al centro comercial.
                  </p>
                </div>
              </li>

              <li>
                <a className="uk-accordion-title faq-title" href="#">
                  ¿Cómo puedo contratar el camión para un evento corporativo?
                </a>
                <div className="uk-accordion-content">
                  <p>
                    El camión está disponible para eventos corporativos, 
                    festivales o reuniones privadas. Para verificar disponibilidad y cotizar 
                    nuestro servicio de catering móvil, le pedimos que complete el formulario 
                    en la sección "Contacto" o nos envíe un correo a 
                    <a href="mailto:catering@mipanaderia.com"> catering@la hornaza.com</a>.
                  </p>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreguntasFrecuentes;