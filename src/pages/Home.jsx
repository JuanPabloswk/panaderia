import '../styles/home.css'
import Slider from '../components/Slider.jsx'
import Card from '../components/Card.jsx'
import Map from '../components/Map.jsx'

function Home() {
  return (
    <div>
      <Slider />
      <div className='info-cards'>
        <h1>Nuestros servicios</h1>
        <h2>Cubren estas areas</h2>
        
        {/* Tarjetas de servicios */}
        <div className="cards uk-child-width-expand@s uk-grid uk-grid-match uk-text-center" data-uk-grid>
          <Card icon="cart" title="PANADERIA" description="¡Tenemos todos tus panes tradicionales favoritos, los 7 días de la semana! Puedes elegir entre una gran variedad de galletas, pasteles y tartas."/>
          <Card icon="cart" title="TORTAS" description="Nos especializamos en pasteles personalizados para todas las ocasiones. Puede elegir entre una gran variedad de diseños para crear el pastel perfecto para usted."/>
          <Card icon="cart" title="JUGOS" description="Elige entre una gran variedad de frutas y verduras para preparar tu zumo favorito. También puedes disfrutar de un sencillo zumo de naranja recién exprimido."/>
        </div>
        <div className="cards uk-child-width-expand@s uk-grid uk-grid-match uk-text-center" data-uk-grid>
          <Card icon="cart" title="CATERING" description="Ofrecemos servicios de catering para todo tipo de eventos, desde bodas hasta actos empresariales. Ofrecemos nuestra auténtica comida para llevar o para servir en el lugar del evento."/>
          <Card icon="cart" title="CAMION DE SONRISAS" description="Nuestro nuevo y fantástico equipo saldrá a la calle con nuestros mejores productos seleccionados para ti y mucho más."/>
          <Card icon="cart" title="BODAS" description="Desde elegantes tartas de boda hasta deliciosas cestas de regalo, podemos ayudarte a crear una boda perfecta y única."/>
        </div>
      </div>

      {/* Mapa */}
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
      
    </div>
  )
}

export default Home