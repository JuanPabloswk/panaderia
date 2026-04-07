import '../styles/home.css'
import Slider from '../components/Slider.jsx'
import panaderiaHome from '../assets/panaderiaHome.png'
import tortaHome from '../assets/tortaHome.png'
import jugoHome from '../assets/jugoHome.png'
import cateringHome from '../assets/cateringHome.png'
import camionHome from '../assets/camionHome.png'
import bodaHome from '../assets/bodaHome.png'


function Card({imagen, title, description}) {
  return (
    <div>
          <div>
              <div className="home-card uk-card uk-card-default uk-card-body">
                  <img src={imagen} alt="" style={{height: "90px"}}/>
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
          <Card imagen={panaderiaHome} title="PANADERIA" description="¡Tenemos todos tus panes tradicionales favoritos, los 7 días de la semana! Puedes elegir entre una gran variedad de galletas, pasteles y tartas."/>
          <Card imagen={tortaHome} title="TORTAS" description="Nos especializamos en pasteles personalizados para todas las ocasiones. Puede elegir entre una gran variedad de diseños para crear el pastel perfecto para usted."/>
          <Card imagen={jugoHome} title="JUGOS" description="Elige entre una gran variedad de frutas y verduras para preparar tu zumo favorito. También puedes disfrutar de un sencillo zumo de naranja recién exprimido."/>
        </div>
        <div className="cards uk-child-width-expand@s uk-grid uk-grid-match uk-text-center" data-uk-grid>
          <Card imagen={cateringHome} title="CATERING" description="Ofrecemos servicios de catering para todo tipo de eventos, desde bodas hasta actos empresariales. Ofrecemos nuestra auténtica comida para llevar o para servir en el lugar del evento."/>
          <Card imagen={camionHome} title="CAMION DE SONRISAS" description="Nuestro nuevo y fantástico equipo saldrá a la calle con nuestros mejores productos seleccionados para ti y mucho más."/>
          <Card imagen={bodaHome} title="BODAS" description="Desde elegantes tartas de boda hasta deliciosas cestas de regalo, podemos ayudarte a crear una boda perfecta y única."/>
        </div>
      </div>
    </div>
  )
}
