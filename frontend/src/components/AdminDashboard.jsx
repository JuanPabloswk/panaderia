import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '', label: 'Dashboard', icon: 'home' },
  { to: 'productos', label: 'Productos', icon: 'album' },
  { to: 'categorias', label: 'Categorías', icon: 'tag' },
  { to: 'pedidos', label: 'Pedidos', icon: 'cart' },
  { to: 'clientes', label: 'Clientes', icon: 'users' },
  { to: 'empleados', label: 'Empleados', icon: 'user' },
];

function AdminDashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.style.marginTop = '0';
    return () => { document.body.style.marginTop = ''; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="uk-flex" style={{ minHeight: '100vh' }}>
      <div style={{
        width: sidebarOpen ? '250px' : '60px',
        transition: 'width 0.3s',
        backgroundColor: '#2c2c2c',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #444' }}>
          <h3 style={{ color: '#C98A40', margin: 0, fontSize: sidebarOpen ? '18px' : '14px', whiteSpace: 'nowrap' }}>
            {sidebarOpen ? 'Panel Admin' : 'PA'}
          </h3>
          {sidebarOpen && <p style={{ color: '#aaa', margin: '5px 0 0', fontSize: '12px' }}>{usuario?.email}</p>}
        </div>

        <nav style={{ flex: 1, padding: '10px 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ''}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: isActive ? '#C98A40' : '#ccc',
                backgroundColor: isActive ? 'rgba(201,138,64,0.1)' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid #C98A40' : '3px solid transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              })}
            >
              <span data-uk-icon={`icon: ${item.icon}; ratio: 1.2`}></span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '10px 0', borderTop: '1px solid #444' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none', border: 'none', color: '#aaa', cursor: 'pointer',
              padding: '10px 20px', width: '100%', textAlign: 'left',
            }}
          >
            <span data-uk-icon={`icon: chevron-${sidebarOpen ? 'left' : 'right'}; ratio: 1.2`}></span>
            {sidebarOpen && <span style={{ marginLeft: '12px' }}>Colapsar</span>}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer',
              padding: '10px 20px', width: '100%', textAlign: 'left',
            }}
          >
            <span data-uk-icon="icon: sign-out; ratio: 1.2"></span>
            {sidebarOpen && <span style={{ marginLeft: '12px' }}>Cerrar Sesión</span>}
          </button>
          <Link to="/" style={{ display: 'block', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '10px 20px', width: '100%', textAlign: 'left', textDecoration: 'none' }}>
            <span data-uk-icon="icon: world; ratio: 1.2"></span>
            {sidebarOpen && <span style={{ marginLeft: '12px' }}>Ver Sitio</span>}
          </Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '30px', backgroundColor: '#f5f5f5', overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
