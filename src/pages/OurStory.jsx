import panadero from "../assets/panaderoHorneandoPan.jpg";
import mujeresPan from "../assets/mujeresPan.jpg";
import fondoP from "../assets/fondoPanadero.jpg";
import '../styles/ourStory.css'
import Gallery3D from "../components/Gallery3D";
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
                    <p className="uk-text-lead" style={{color: "white"}}>
                    Echa un vistazo a nuestra panadería y descubre cómo trabajamos.
                    </p>
                </div>
                </div>
            </div>

            {/* Contenido con texto e imagen */}
            <div className="uk-section uk-section-default" style={{backgroundColor: "#6e4f46ff"}}>
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

        <section className="uk-section" style={{backgroundColor: "#d9d2c9ff", fontSize: "15px"}}>
            <div className="uk-container uk-container-expand">

                {/* Fila 1 */}
                <div className="uk-grid-collapse uk-child-width-1-2@m" data-uk-grid>
                    
                    {/* Imagen */}
                    <div className="uk-inline uk-border-rounded uk-overflow-hidden uk-box-shadow-large" style={{ width: "100%", maxWidth: "50%", aspectRatio: "16/9" }}>
                        <iframe
                        width="100%"
                        height="100%"
                        src="https://youtube.com/embed/ViMZwtKyi7M?si=2uEa_YwJmQ2gE5OD"
                        title="Bakery video"
                        style={{ border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        ></iframe>
                    </div>

                    {/* Texto */}
                    <div className="uk-width-1-2@m uk-padding-large">
                        <h2 className="uk-text-bold uk-text-brown" style={{ color: "#4a2c07" }}>
                            Nuestra panadería es una de las más antiguas de Estados Unidos.
                        </h2>

                        <p className="uk-text-muted uk-text-large" style={{ color: "#5a4b3c" }}>
                            En nuestra tienda disponemos de una amplia gama de pan, pasteles y dulces 
                            por encargo, además de bases para pasteles y cajas para comprar.
                        </p>

                        <ul className="uk-list uk-list-bullet" style={{ color: "#5a4b3c" }}>
                            <li>
                            <span style={{ color: "#d4a017", marginRight: "8px" }}>➤</span>
                            Servicios premium y más allá de tus expectativas
                            </li>
                            <li>
                            <span style={{ color: "#d4a017", marginRight: "8px" }}>➤</span>
                            Nos esforzamos por mantener una buena selección de nuestros productos en la tienda.
                            </li>
                            <li>
                            <span style={{ color: "#d4a017", marginRight: "8px" }}>➤</span>
                            Nuestros talentosos panaderos también elaboran pasteles de celebración personalizados.
                            </li>
                            <li>
                            <span style={{ color: "#d4a017", marginRight: "8px" }}>➤</span>
                            Disponemos de un menú para llevar que ofrece delicias para el desayuno.
                            </li>
                        </ul>

                        <p className="uk-text-small" style={{ color: "#5a4b3c" }}>
                            Nuestras tiendas abren <strong>Lunes y Viernes de 8am a 7pm</strong>,  y los sabados
                            de 8:30am a 3pm, con excepción de los días festivos.
                        </p>

                        <button className="uk-button uk-button-default"
                            style={{
                            border: "1px solid #4a2c07",
                            color: "#4a2c07",
                            fontWeight: "bold",
                            marginTop: "10px",
                            }}>
                            MIRA EL VIDEO
                        </button>
                    </div>
                </div>

                {/* Fila 2 */}
                <div className="uk-grid-collapse uk-child-width-1-2@m uk-margin-remove-top" data-uk-grid>
                   
                    {/* Texto */}
                    <div className="uk-width-1-2@m uk-padding-large">
                        <p className="uk-text-uppercase uk-text-small" style={{ color: "#8b6b4f", letterSpacing: "1px" }}>
                            ¿Sabías que?
                        </p>

                        <h2 className="uk-text-bold" style={{ color: "#4a2c07", marginTop: "0" }}>
                            Nosotros comenzamos hace 55 años
                        </h2>

                        <p style={{ color: "#5a4b3c" }}>
                            La panadería fue fundada en 1966 por John y Jessy Smith. Horneaban deliciosos 
                            panes y pasteles para la tienda, y Jessy atendía a los clientes. Más tarde, 
                            su hijo y su esposa, Natalia, se unieron y comenzaron a repartir pan a los 
                            alrededores. Tuvieron una hija, Melany, que trabajó con su familia después 
                            de terminar la escuela y finalmente se hizo cargo de la panadería.
                        </p>

                        <p style={{ color: "#5a4b3c" }}>
                            Hoy, la panadería está dirigida por Chris, la quinta generación de panaderos
                            de la familia. Chris completó su formación avanzada en el City College y 
                            cuenta con un gran equipo de apasionados panaderos, todos con amplia 
                            experiencia en panadería, pastelería y repostería.
                        </p>


                        
                        <button
                            className="uk-button uk-button-default"
                            style={{
                            border: "1px solid #4a2c07",
                            color: "#4a2c07",
                            fontWeight: "bold",
                            marginTop: "10px",
                            }}
                        >
                            LEE LA HISTORIA COMPLETA
                        </button>
                    </div>

                    {/* Imagen */}
                    <div>
                        <img
                        src={mujeresPan}
                        alt="Panadería artesanal"
                        className="uk-width-1-1 uk-border-rounded"
                        style={{ height: "100%", objectFit: "cover", border: "1px solid #000" }}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Galería */}
        <section className="uk-section uk-section-default uk-text-center">
            <div className="uk-container">
                <h2 className="uk-heading-medium uk-text-bold" style={{ color: "#ffffffff" }}>
                NUESTRA GALLERIA
                </h2>
                <p className="uk-text-lead" style={{ color: "#d4ae8dff" }}>
                Fotos de nuestras deliciosas y creativas creaciones
                </p>

                {/* Imagenes */}
                <div
                className="uk-grid-small uk-child-width-1-3@s uk-child-width-1-3@m uk-flex-center"
                data-uk-grid
                >
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-15.jpg"
                        alt="Pan artesanal"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-13.jpg"
                        alt="Pan rústico"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-5.jpg"
                        alt="Croissants"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-20.jpg"
                        alt="Pasteles"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-12.jpg"
                        alt="Muffins"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                    <div>
                        <img
                        src="https://preview.milingona.co/themes/bakery/shop/wp-content/uploads/2017/12/img-1.jpg"
                        alt="Pan fresco"
                        className="uk-border-rounded uk-box-shadow-hover-large"
                        />
                    </div>
                </div>
            </div>
        </section>

        <Gallery3D />


    </div>
  )
}

export default OurStory;