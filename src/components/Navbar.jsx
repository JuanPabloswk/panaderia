import React from 'react'
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import '../styles/nav.css';

UIkit.use(Icons);

function Navbar() {
  return (
    <nav className="uk-navbar-container">
        <div className="uk-container">
            <div data-uk-navbar>

                <div className="uk-navbar-center">

                    <div className="uk-navbar-center-left">
                        <ul className="uk-navbar-nav">
                            <li><a href="#" >Inicio</a></li>
                            <li><a href="#" >Nuestra historia</a></li>
                            <li><a href="#" >Menu</a></li>
                        </ul>
                    </div>
                    <a className="uk-navbar-item uk-logo" href="#">Logo</a>
                    <div className="uk-navbar-center-right">
                        <ul className="uk-navbar-nav">
                            <li>
                                <a href="#">Tienda</a>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li><a href="#">Contactanos</a></li>
                                        <li><a href="#">Item</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li><a href="#">Contactanos</a></li>
                            <li><a href="#">Comprar ahora</a></li>
                            <li><a href="#"><span data-uk-icon="icon: cart"></span></a></li>


                        </ul>
                        
                    </div>

                </div>

            </div>
        </div>
    </nav>
  )
}

export default Navbar