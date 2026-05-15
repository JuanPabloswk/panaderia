import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";
import carritoIcon from "../assets/carrito.png";
import '../styles/nav.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

UIkit.use(Icons);

function Navbar() {
    const categorias = ['Desayunos', 'Panadería', 'Pastelería', 'Bebidas'];
    const { cart, clearCart } = useCart();
    const { isAuthenticated, isEmpleado, usuario, logout } = useAuth();
    const navigate = useNavigate();
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

    useEffect(() => {
        setTimeout(() => UIkit.update(), 100);
    }, [isAuthenticated]);

    const handleLogout = () => {
        clearCart();
        logout();
        UIkit.notification({ message: 'Sesión cerrada', status: 'primary', pos: 'top-center', timeout: 2000 });
        navigate('/');
    };

    return (
        <nav key={isAuthenticated ? 'auth-nav' : 'noauth-nav'} className="uk-navbar-container uk-navbar-transparent uk-position-fixed uk-position-top uk-width-1-1" data-uk-navbar="true">
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
                                            {categorias.map((cat) => (
                                                <li key={cat}>
                                                <NavLink to={`/Productos/${encodeURIComponent(cat)}`} className="uk-link-reset">
                                                    {cat}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <NavLink to="/" className="uk-navbar-item uk-logo">
                            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ width: "160px", height: "80px" }}>
                                <img src={logo} alt="logo" className="uk-preserve-width uk-responsive" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                            </div>
                        </NavLink>
                        <div className="uk-navbar-center-right">
                            <ul className="uk-navbar-nav">
                                <li><NavLink to="/Contacto" className="uk-link-reset">Contáctanos</NavLink></li>
                                <li><NavLink to="/Nosotros" className="uk-link-reset">Nuestra historia</NavLink></li>

                                {isAuthenticated ? (
                                    <li>
                                        <NavLink to="#" className="uk-link-reset">
                                            {usuario?.primerNombre || 'Usuario'}
                                        </NavLink>
                                        <div className="uk-navbar-dropdown">
                                            <ul className="uk-nav uk-navbar-dropdown-nav">
                                                {isEmpleado ? (
                                                    <li><NavLink to="/admin" className="uk-link-reset">Panel Admin</NavLink></li>
                                                ) : (
                                                    <>
                                                        <li><NavLink to="/perfil" className="uk-link-reset">Mi Perfil</NavLink></li>
                                                        <li><NavLink to="/mis-pedidos" className="uk-link-reset">Mis Pedidos</NavLink></li>
                                                    </>
                                                )}
                                                <li className="uk-nav-divider"></li>
                                                <li><a onClick={handleLogout} style={{ cursor: 'pointer', color: '#e74c3c' }}>Cerrar Sesión</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                ) : (
                                    <li><NavLink to="/login" className="uk-link-reset">Iniciar Sesión</NavLink></li>
                                )}

                                <li>
                                    <NavLink to="/checkout" className="uk-link-reset cart-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <img src={carritoIcon} alt="Carrito" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                        {totalItems > 0 && (
                                            <span className="cart-badge">{totalItems}</span>
                                        )}
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
