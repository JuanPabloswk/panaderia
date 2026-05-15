import api from './api';

export const loginCliente = (email, password) =>
  api.post('/auth/clientes/login', { email, password });

export const registerCliente = (data) =>
  api.post('/auth/clientes/register', data);

export const loginEmpleado = (email, password) =>
  api.post('/auth/empleados/login', { email, password });
