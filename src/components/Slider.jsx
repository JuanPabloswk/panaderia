import imagen1 from '/images/imagen1.jpg'
import imagen2 from '/images/imagen2.jpg'
import imagen3 from '/images/imagen3.jpg'
import '../styles/slider.css'

function Slider() {
  return (
    <div>
        <div className="uk-position-relative uk-visible-toggle uk-light slider-small" tabIndex="-1" uk-slider="clsActivated: uk-transition-active; center: true">

      <div className="uk-slider-items uk-grid">
          <div className="uk-width-1-1">
              <div className="uk-panel">
                  <img src={imagen1} width="1800" height="1200" alt="" />
                  <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-text-center uk-transition-slide-bottom">
                      <h3 className="uk-margin-remove">Bienvenidos</h3>
                      <p className="uk-margin-remove">Esta es tu panaderia de confianza con pan de calidad</p>
                  </div>
              </div>
          </div>
          <div className="uk-width-1-1">
              <div className="uk-panel">
                  <img src={imagen2} width="1800" height="1200" alt="" />
                  <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-text-center uk-transition-slide-bottom">
                      <h3 className="uk-margin-remove">Compromiso</h3>
                      <p className="uk-margin-remove">Estamos comprometidos a ofrecer pan de calidad para todos</p>
                  </div>
              </div>
          </div>
          <div className="uk-width-1-1">
              <div className="uk-panel">
                  <img src={imagen3} width="1800" height="1200" alt="" />
                  <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-text-center uk-transition-slide-bottom">
                      <h3 className="uk-margin-remove">Calidad</h3>
                      <p className="uk-margin-remove">Siempre pan fresco en la mesa para ti</p>
                  </div>
              </div>
          </div>
      </div>

      <a className="uk-position-center-left uk-position-medium uk-hidden-hover" href="#" uk-slidenav-previous="ratio:2" uk-slider-item="previous"></a>
      <a className="uk-position-center-right uk-position-medium uk-hidden-hover" href="#" uk-slidenav-next="ratio:2" uk-slider-item="next"></a>

    </div>
    </div>
  )
}

export default Slider