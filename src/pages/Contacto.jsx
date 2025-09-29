function Contacto() {
  return (
    <div>
      <div className="uk-margin-remove">
        <iframe
          title="Ubicación Panadería La Hornaza"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.825789918881!2d-75.292403!3d2.938163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3b746fdc88c6a5%3A0xd5f108de82f10d3c!2sNeiva%2C%20Huila!5e0!3m2!1ses!2sco!4v1698500000000!5m2!1ses!2sco"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="uk-container uk-margin-large-top uk-margin-large-bottom">
        <div className="uk-grid-large uk-child-width-1-2@m" data-uk-grid>
          
          <div>
            <h4 className="uk-text-bold">DÉJANOS UN MENSAJE</h4>
            <form className="uk-form-stacked">
              
              <div className="uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2@s">
                  <input className="uk-input" type="text" placeholder="Nombre" />
                </div>
                <div className="uk-width-1-2@s">
                  <input className="uk-input" type="text" placeholder="Apellido" />
                </div>
              </div>

              <div className="uk-grid-small uk-margin" data-uk-grid>
                <div className="uk-width-1-2@s">
                  <input className="uk-input" type="text" placeholder="Teléfono" />
                </div>
                <div className="uk-width-1-2@s">
                  <input className="uk-input" type="email" placeholder="Correo electrónico" />
                </div>
              </div>

              <div className="uk-margin">
                <input className="uk-input" type="text" placeholder="Asunto" />
              </div>

              <div className="uk-margin">
                <textarea
                  className="uk-textarea"
                  rows="5"
                  placeholder="Escribe tu mensaje..."
                ></textarea>
              </div>

              <button className="uk-button uk-button-primary uk-width-1-1">
                ENVIAR MENSAJE
              </button>
            </form>
          </div>

          <div>
            <h4 className="uk-text-bold">... O CONTÁCTANOS DIRECTAMENTE</h4>
            <p>
              En <strong>Panadería La Hornaza</strong> nos encanta endulzar
              tus mañanas y tardes con pan fresco, tortas caseras y postres
              artesanales. Siempre trabajamos con ingredientes de la mejor
              calidad para ofrecerte un sabor único.
            </p>
            <p>
              Si tienes dudas sobre pedidos especiales, catering o quieres
              reservar, ¡escríbenos o visítanos directamente en nuestro local!
            </p>

            <ul className="uk-list">
              <li>
                <span data-uk-icon="receiver"></span> +57 321 456 7890
              </li>
              <li>
                <span data-uk-icon="location"></span> Calle 10 #25-36, Centro, Neiva - Huila
              </li>
              <li>
                <span data-uk-icon="mail"></span> contacto@lahornaza.com
              </li>
            </ul>

            <div className="uk-flex uk-flex-left uk-margin-top">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="uk-icon-button uk-margin-small-right"
                data-uk-icon="facebook"
              ></a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="uk-icon-button uk-margin-small-right"
                data-uk-icon="twitter"
              ></a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="uk-icon-button uk-margin-small-right"
                data-uk-icon="instagram"
              ></a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="uk-icon-button"
                data-uk-icon="youtube"
              ></a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contacto