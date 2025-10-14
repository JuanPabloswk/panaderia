import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import '../styles/nav.css';

UIkit.use(Icons);

function Navbar() {
  return (
    <nav className="uk-navbar-container uk-navbar-transparent uk-position-fixed uk-position-top uk-width-1-1" data-uk-navbar="true">
        <div className="uk-container">
            <div data-uk-navbar>

                <div className="uk-navbar-center">

                    <div className="uk-navbar-center-left">
                        <ul className="uk-navbar-nav">
                            <li><NavLink to="/" className="uk-link-reset">Inicio</NavLink></li>
                            <li>
                                <NavLink to="/Productos" className="uk-link-reset">Menú</NavLink>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li><NavLink to="/Desayunos" className="uk-link-reset">Desayunos</NavLink></li>
                                        <li><NavLink to="/Panaderia" className="uk-link-reset">Panadería</NavLink></li>
                                        <li><NavLink to="/Pasteleria" className="uk-link-reset">Pastelería</NavLink></li>
                                        <li><NavLink to="/Bebidas" className="uk-link-reset">Bebidas</NavLink></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                        <NavLink to="/" className="uk-navbar-item uk-logo">
                            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ width: "160px", height: "80px" }} >
                                <img src={logo} alt="logo" className="uk-preserve-width uk-responsive" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                            </div>
                        </NavLink>
                    <div className="uk-navbar-center-right" >
                        <ul className="uk-navbar-nav">
                            <li><NavLink to="/Contacto" className="uk-link-reset">Contáctanos</NavLink></li>
                            <li><NavLink to="/Nosotros" className="uk-link-reset">Nuestra historia</NavLink></li>
                            <li><NavLink to="/checkout" className="uk-link-reset"><span className="uk-icon uk-icon-shopping-cart"></span></NavLink></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar