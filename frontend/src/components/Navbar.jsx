import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import carritoIcon from "../assets/carrito.png";
import '../styles/nav.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

UIkit.use(Icons);

const navLinkClass = ({ isActive }) =>
  `uk-link-reset nav-link${isActive ? ' nav-link-active' : ''}`;

function Navbar() {
  const categorias = ['desayunos', 'panaderia', 'pasteleria', 'bebidas'];
  const { cart } = useCart();
  const {
    isAuthenticated,
    user,
    logout,
    puedePanelProductos,
    puedeGestionarUsuarios,
  } = useAuth();
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  const displayName =
    [user?.primerNombre, user?.apellido].filter(Boolean).join(' ').trim() ||
    user?.username ||
    user?.email ||
    '';

  return (
    <nav className="uk-navbar-container uk-navbar-transparent uk-position-fixed uk-position-top uk-width-1-1 navbar-panaderia">
      <div className="uk-container">
        {/* UIkit espera la clase `uk-navbar` en el mismo nodo que `data-uk-navbar` para enlazar dropdowns. */}
        <div
          className="uk-navbar uk-width-1-1 navbar-panaderia-uk-root"
          data-uk-navbar="delay-hide: 200"
        >
          <div className="uk-navbar-center navbar-panaderia-inner">
            <div className="uk-navbar-center-left">
              <ul className="uk-navbar-nav navbar-nav-cluster">
                <li>
                  <NavLink to="/" className={navLinkClass} end>
                    Inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Productos" className={navLinkClass}>
                    Menú
                  </NavLink>
                  <div className="uk-navbar-dropdown nav-dropdown-panel">
                    <ul className="uk-nav uk-navbar-dropdown-nav nav-dropdown-list">
                      {categorias.map((cat) => (
                        <li key={cat}>
                          <NavLink
                            to={`/Productos/${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                            className={navLinkClass}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

            <NavLink to="/" className="uk-navbar-item uk-logo navbar-logo-link" end>
              <div className="navbar-logo-wrap">
                <img
                  src={logo}
                  alt="Panadería — inicio"
                  className="uk-preserve-width uk-responsive navbar-logo-img"
                />
              </div>
            </NavLink>

            <div className="uk-navbar-center-right">
              <ul className="uk-navbar-nav navbar-nav-cluster">
                <li>
                  <NavLink to="/Contacto" className={navLinkClass}>
                    Contáctanos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Nosotros" className={navLinkClass}>
                    Nuestra historia
                  </NavLink>
                </li>
                {isAuthenticated &&
                  (puedePanelProductos || puedeGestionarUsuarios) && (
                  <li>
                    <a
                      href="#"
                      className="uk-link-reset nav-link"
                      aria-haspopup="true"
                      aria-label="Panel de trabajo"
                    >
                      Panel
                    </a>
                    <div className="uk-navbar-dropdown nav-dropdown-panel">
                      <ul className="uk-nav uk-navbar-dropdown-nav nav-dropdown-list">
                        {puedePanelProductos && (
                          <li>
                            <NavLink
                              to="/panel/productos"
                              className={navLinkClass}
                            >
                              Gestión de productos
                            </NavLink>
                          </li>
                        )}
                        {puedeGestionarUsuarios && (
                          <li>
                            <NavLink
                              to="/panel/usuarios"
                              className={navLinkClass}
                            >
                              Gestión de usuarios
                            </NavLink>
                          </li>
                        )}
                      </ul>
                    </div>
                  </li>
                )}
                <li>
                  {isAuthenticated ? (
                    <div className="nav-auth">
                      <span className="nav-user-name" title={displayName}>
                        {displayName}
                      </span>
                      <button
                        type="button"
                        className="uk-button uk-button-text uk-link-reset nav-logout-btn"
                        onClick={() => logout()}
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                      >
                        <img
                          src="/cerrarSesion.svg"
                          alt=""
                          width={22}
                          height={22}
                          decoding="async"
                        />
                      </button>
                    </div>
                  ) : (
                    <NavLink to="/login" className={navLinkClass}>
                      Entrar
                    </NavLink>
                  )}
                </li>
                <li>
                  <NavLink
                    to="/checkout"
                    className={({ isActive }) =>
                      `uk-link-reset cart-link${isActive ? ' cart-link-active' : ''}`
                    }
                    aria-label="Ir al carrito de compras"
                  >
                    <img
                      src={carritoIcon}
                      alt=""
                      className="navbar-cart-icon"
                      width={24}
                      height={24}
                      decoding="async"
                    />
                    <span className="navbar-cart-label">Carrito</span>
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
