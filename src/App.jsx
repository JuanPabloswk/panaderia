import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import OurStory from './pages/OurStory';
import Contacto from './pages/Contacto';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import "leaflet/dist/leaflet.css";

 
function App() {
  return (
  <CartProvider>
    <ScrollToTop />
    
    <Navbar />
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Nosotros" element={<OurStory />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/Productos/:categoria" element={<Products />} />
        <Route path="/Productos" element={<Products />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/checkout" element={<Checkout />} />
    </Routes>
    <Footer />

  </CartProvider>
  );
}

export default App;