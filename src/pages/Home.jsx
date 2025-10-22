import '../styles/home.css'
import Slider from '../components/Slider.jsx'
import '../styles/card.css'

function Card({icon, title, description}) {
  return (
    <div>
          <div>
              <div className="home-card uk-card uk-card-default uk-card-body">
                  <span uk-icon={`icon: ${icon}; ratio:2`}></span>
                  <h3 className="uk-card-title">{title}</h3>
                  <p style={{color: "black"}}>{description}</p>
              </div>
          </div>
    </div>
  )
}

export default function Home() {
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
    </div>
  )
}
