import { createContext, useContext, useState, useEffect } from 'react';
import { loginCliente, registerCliente, loginEmpleado } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  const login = async (email, password, tipo) => {
    try {
      const service = tipo === 'empleado' ? loginEmpleado : loginCliente;
      const res = await service(email, password);
      const data = res.data.data;
      const userData = data.cliente || data.empleado;
      setToken(data.token);
      setUsuario({ ...userData, rol: userData.rol || 'cliente', tipo });
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al iniciar sesión';
      return { ok: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerCliente(userData);
      const data = res.data.data;
      setToken(data.token);
      setUsuario({ ...data.cliente, rol: 'cliente', tipo: 'cliente' });
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al registrarse';
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = !!token && !!usuario;
  const isAdmin = usuario?.rol === 'admin';
  const isEmpleado = usuario?.rol && ['admin', 'gerente', 'panadero', 'vendedor', 'administrativo'].includes(usuario.rol);

  return (
    <AuthContext.Provider value={{
      usuario, token, login, register, logout,
      isAuthenticated, isAdmin, isEmpleado,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
