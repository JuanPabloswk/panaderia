import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { API_BASE_URL } from '../config/api.js';

const TOKEN_KEY = 'panaderia_token';
const USER_KEY = 'panaderia_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'No se pudo iniciar sesión');
    }
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async ({ email, password, primerNombre, apellido }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, primerNombre, apellido }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'No se pudo registrar');
    }
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const authHeader = useCallback(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const hasPermiso = useCallback(
    (perm) => Array.isArray(user?.permisos) && user.permisos.includes(perm),
    [user]
  );

  const puedePanelProductos = useMemo(
    () =>
      ['crear', 'editar', 'eliminar'].some((p) =>
        Array.isArray(user?.permisos) ? user.permisos.includes(p) : false
      ),
    [user]
  );

  const puedeGestionarUsuarios = useMemo(
    () => hasPermiso('gestionar_usuarios'),
    [hasPermiso]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      authHeader,
      hasPermiso,
      puedePanelProductos,
      puedeGestionarUsuarios,
    }),
    [
      token,
      user,
      login,
      register,
      logout,
      authHeader,
      hasPermiso,
      puedePanelProductos,
      puedeGestionarUsuarios,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
