import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Opcional: para un desplazamiento más agradable
    });
  }, [pathname]); // Dependencia: re-ejecutar cuando la ruta cambia

  return null;
}

export default ScrollToTop;