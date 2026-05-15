import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import Contacto from './pages/Contacto';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import MisPedidos from './pages/MisPedidos';
import DetallePedido from './pages/DetallePedido';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProductos from './pages/admin/AdminProductos';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminClientes from './pages/admin/AdminClientes';
import AdminEmpleados from './pages/admin/AdminEmpleados';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="site-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'gerente', 'panadero', 'vendedor']}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="empleados" element={<AdminEmpleados />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Nosotros" element={<OurStory />} />
            <Route path="Contacto" element={<Contacto />} />
            <Route path="Productos/:categoria" element={<Products />} />
            <Route path="Productos" element={<Products />} />
            <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="perfil" element={<ProtectedRoute roles={['cliente']}><Perfil /></ProtectedRoute>} />
            <Route path="mis-pedidos" element={<ProtectedRoute roles={['cliente']}><MisPedidos /></ProtectedRoute>} />
            <Route path="mis-pedidos/:id" element={<ProtectedRoute roles={['cliente']}><DetallePedido /></ProtectedRoute>} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
