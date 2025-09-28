function OurStory() {
  return (
    <div>
        <Navbar />
        <section className="uk-section uk-section-default">
            <div className="uk-container">
                <div className="uk-grid-large uk-flex-middle" data-uk-grid>
                   
                    <div>
                        <img 
                        src='/assets/our-story.jpg' 
                        alt='OurStory' 
                        className="uk-border-rounded"data-uk-img
                        />
                    </div>
                    /*texto*/   
                    <div className="uk-width-1-2@s">
                        <h2 className="uk-heading-small">Our Story</h2>
                        <p>
                            Desde nuestros inicios, hemos horneado con pasión y dedicación,
                            ofreciendo a nuestros clientes pan fresco, pasteles artesanales y
                            dulces únicos. Nuestra misión es crear momentos especiales en cada
                            bocado.
                        </p>
                        <p>
                            Hoy, seguimos manteniendo la tradición de combinar ingredientes de
                            calidad con el arte de la panadería, brindando productos que hacen
                            sonreír a quienes los disfrutan.
                        </p>
                        <a className="uk-button uk-button-primary" href="/about">
                            Leer más
                        </a>
    
                    </div>

                </div>
            </div>
        </section>
    </div>
  )
}

export default OurStory