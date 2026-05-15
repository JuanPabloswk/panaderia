import api from './api';

export const obtenerPedidos = (params = {}) =>
  api.get('/pedidos', { params });

export const obtenerPedido = (id) =>
  api.get(`/pedidos/${id}`);

export const crearPedido = (data) =>
  api.post('/pedidos', data);

export const actualizarPedido = (id, data) =>
  api.put(`/pedidos/${id}`, data);

export const actualizarEstadoPedido = (id, estado) =>
  api.patch(`/pedidos/${id}/estado`, { estado });

export const eliminarPedido = (id) =>
  api.delete(`/pedidos/${id}`);

export const obtenerPedidosPorCliente = (clienteId) =>
  api.get(`/pedidos/cliente/${clienteId}`);
