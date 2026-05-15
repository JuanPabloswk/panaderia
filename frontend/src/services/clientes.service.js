import api from './api';

export const obtenerClientes = (params = {}) =>
  api.get('/clientes', { params });

export const obtenerCliente = (id) =>
  api.get(`/clientes/${id}`);

export const actualizarCliente = (id, data) =>
  api.put(`/clientes/${id}`, data);

export const eliminarCliente = (id) =>
  api.delete(`/clientes/${id}`);

export const obtenerPerfil = () =>
  api.get('/clientes/perfil');

export const actualizarPerfil = (data) =>
  api.put('/clientes/perfil', data);

export const obtenerEmpleados = (params = {}) =>
  api.get('/empleados', { params });

export const obtenerEmpleado = (id) =>
  api.get(`/empleados/${id}`);

export const crearEmpleado = (data) =>
  api.post('/empleados', data);

export const actualizarEmpleado = (id, data) =>
  api.put(`/empleados/${id}`, data);

export const eliminarEmpleado = (id) =>
  api.delete(`/empleados/${id}`);

export const obtenerMiPerfilEmpleado = () =>
  api.get('/empleados/perfil');
