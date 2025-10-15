import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import OurStory from './pages/OurStory';
import Contacto from './pages/Contacto';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import Footer from './components/Footer';
import "leaflet/dist/leaflet.css";

 
function App() {
  return (
  <>
    <Navbar />
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Nosotros" element={<OurStory />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/Productos" element={<Products />} />
    </Routes>
    <Footer />

  </>
  );
}

export default App;