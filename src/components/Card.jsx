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

export default Card