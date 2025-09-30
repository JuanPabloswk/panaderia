import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import OurStory from './pages/OurStory';
import Navbar from './components/Navbar';

 
function App() {
  return (
  <>
    <Navbar />
    <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/nosotros" element={<OurStory />} />
    </Routes>
  </>
  );
}

export default App;