import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import OurStory from './pages/OurStory';
import Contacto from './pages/Contacto';
import Navbar from './components/Navbar';

import './App.css'
 
function App() {
  return (
  <>
    <Navbar />
    <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Nosotros" element={<OurStory />} />
        <Route path="/Contacto" element={<Contacto />} />
    </Routes>
  </>
  );
}

export default App;