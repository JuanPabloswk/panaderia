import panadero from "../assets/panaderoHorneandoPan.jpg";
import fondoP from "../assets/fondoPanadero.jpg";
import magdalena from "../assets/magdalenas.png";
import pasteles from "../assets/pasteles.png";
import galletas from "../assets/galletas.png";
import helados from "../assets/helados.png";
import dulce from "../assets/dulces.png";
import croasan from "../assets/croasan.png";
import '../styles/ourStory.css'
function OurStory() {
  return (
    <div>

        <section>
        {/* Encabezado con fondo */}
            <div className="uk-section uk-section-muted uk-padding-remove">
                <div 
                className="uk-background-cover uk-flex uk-flex-center uk-flex-middle uk-text-center"
                style={{minHeight: "30vh", backgroundImage: `linear-gradient(rgba(212,160,23,0.6), rgba(0,0,0,0.4)), url(${fondoP})`}}>
                <div>
                    <h2 className="uk-heading-medium uk-text-bold">SOBRE NOSOTROS</h2>  
                    <p className="uk-text-lead">
                    Echa un vistazo a nuestra panadería y descubre cómo trabajamos.
                    </p>
                </div>
                </div>
            </div>

            {/* Contenido con texto e imagen */}
            <div className="uk-section uk-section-default" style={{backgroundColor: "#775045ff"}}>
                <div className="uk-container">
                <div
                    className="uk-grid-large uk-flex-middle"
                    data-uk-grid
                >
                    <div className="uk-width-1-2@s">
                    <p className="uk-text-bold">
                        Bakery Store se formó en 1977 cuando los panaderos de todas las
                        residencias universitarias de Denver se consolidaron en un solo
                        grupo.
                    </p>
                    <p>
                        Nos enorgullece producir productos decorados a mano, como panes,
                        bagels, pasteles y galletas hechos desde cero, que se sirven en el
                        campus militar. Nuestro equipo está formado por panaderos expertos
                        con más de 150 años de experiencia.
                    </p>
                
                    <p>
                        Productos de panadería, que ofrecen el dulce sabor de casa.
                    </p>
                
                    </div>

                    <div className="uk-width-1-2@s uk-flex uk-flex-center">
                        <img 
                            src={panadero} alt="Panadero" 
                            className="uk-border-rounded uk-box-shadow-large"
                            style={{ width: "100%", maxWidth: "450px" }}>
                        </img>
                    </div>
                </div>
                </div>
            </div>
        </section>

        <section className="uk-section uk-section-muted uk-text-center" style={{backgroundColor: "#b0acacff" }}>
            <div className="uk-container">  

                <h3 className="uk-text-bold uk-text-uppercase" style={{color: "black"}} >Servicios que ofrecemos</h3>
                <p className="uk-text-meta" style={{color: "black"}}>Sorprende a tu persona especial con un delicioso pastel.</p>

                <div className="uk-grid-match uk-child-width-1-3@m uk-child-width-1-2@s uk-grid-small" data-uk-grid>

                    <div style={{ display: "flex", alignItems: "stretch" }}>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={magdalena} alt="Magdalenas" style={{ height: "25vh", objectFit: "contain" }}/>
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">MAGDALENAS</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                    <div>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={pasteles} alt="Pasteles" style={{ height: "25vh", objectFit: "contain" }} />
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">PASTELES</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                    <div>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={galletas} alt="Galletas" style={{ height: "25vh", objectFit: "contain" }} />
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">GALLETAS</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                    <div>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={helados} alt="Helados" style={{ height: "25vh", objectFit: "contain" }}/>
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">HELADOS</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                    <div>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={dulce} alt="Dulce" style={{ height: "25vh", objectFit: "contain" }}/>
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">DULCE</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                    <div>
                        <div className="uk-card uk-card-default uk-card-body uk-box-shadow-hover-large uk-height-match" style={{minHeight: "10vh", maxHeight: "65vh"}}>
                        <img src={croasan} alt="Croasan"  style={{ height: "25vh", objectFit: "contain" }}/>
                        <h4 className="uk-margin-small-top uk-text-bold uk-text-warning">CUERNO</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit amet magna.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>


    </div>
  )
}

export default OurStory;