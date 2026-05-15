import api from './api';

export const obtenerProductos = (params = {}) =>
  api.get('/productos', { params });

export const obtenerProducto = (id) =>
  api.get(`/productos/${id}`);

export const crearProducto = (formData) =>
  api.post('/productos', formData);

export const actualizarProducto = (id, data) =>
  api.put(`/productos/${id}`, data);

export const subirImagenProducto = (id, formData) =>
  api.patch(`/productos/${id}/imagen`, formData);

export const eliminarProducto = (id) =>
  api.delete(`/productos/${id}`);

export const obtenerCategorias = (params = {}) =>
  api.get('/categorias', { params });

export const crearCategoria = (data) =>
  api.post('/categorias', data);

export const actualizarCategoria = (id, data) =>
  api.put(`/categorias/${id}`, data);

export const eliminarCategoria = (id) =>
  api.delete(`/categorias/${id}`);

export const cambiarEstadoCategoria = (id, estado) =>
  api.patch(`/categorias/${id}/estado`, { estado });
