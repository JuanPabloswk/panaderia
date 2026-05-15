import Categoria from '../models/categoria.model.js';

export const obtenerCategorias = async (req, res, next) => {
  try {
    const { estado } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado;

    const categorias = await Categoria.find(filtro).sort({ nombre: 1 });
    res.json({ ok: true, data: categorias });
  } catch (error) {
    next(error);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    }
    res.json({ ok: true, data: categoria });
  } catch (error) {
    next(error);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    if (req.file) req.body.imagen = `/uploads/${req.file.filename}`;
    const categoria = await Categoria.create(req.body);
    res.status(201).json({ ok: true, data: categoria });
  } catch (error) {
    next(error);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    if (req.file) req.body.imagen = `/uploads/${req.file.filename}`;
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!categoria) {
      return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    }
    res.json({ ok: true, data: categoria });
  } catch (error) {
    next(error);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    }
    res.json({ ok: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoCategoria = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { estado },
      { returnDocument: 'after', runValidators: true }
    );
    if (!categoria) {
      return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    }
    res.json({ ok: true, data: categoria });
  } catch (error) {
    next(error);
  }
};
