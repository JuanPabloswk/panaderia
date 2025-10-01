import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import '../styles/nav.css';

UIkit.use(Icons);

function Navbar() {
  return (
    <nav className="uk-navbar-container">
        <div className="uk-container">
            <div data-uk-navbar>

                <div className="uk-navbar-center">

                    <div className="uk-navbar-center-left">
                        <ul className="uk-nav
                            <li><NavLink to="/" className="uk-link-reset">Inicio</NavLink></li>
                            <li><NavLink to="/Nosotros" className="uk-link-reset">Nuestra historia</NavLink></li>
                            <li><NavLink to="/products" className="uk-link-reset">Menú</NavLink></li>
                        </ul>
                    </div>
                        <NavLink to="/" className="uk-navbar-item uk-logo">
                            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ width: "160px", height: "80px" }} >
                                <img src={logo} alt="logo" className="uk-preserve-width uk-responsive" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                            </div>
                        </NavLink>
                    <div className="uk-navbar-center-right" >
                        <ul className="uk-navbar-nav">
                            <li>
                                <NavLink to="/cart" className="uk-link-reset">Tienda</NavLink>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li>
                                            <NavLink to="/contact" className="uk-link-reset">Contáctanos</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/products" className="uk-link-reset">Item</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink to="/Contacto" className="uk-link-reset">Contáctanos</NavLink>
                            </li>
                            <li>
                                <NavLink to="/favorites" className="uk-link-reset"><span data-uk-icon="icon: heart"></span></NavLink>
                            </li>
                            <li> 
                                <NavLink to="/checkout" className="uk-link-reset">Comprar ahora</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar