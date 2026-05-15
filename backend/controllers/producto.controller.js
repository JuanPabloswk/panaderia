import Producto from '../models/producto.model.js';

export const obtenerProductos = async (req, res, next) => {
  try {
    const { categoria, disponible, busqueda, precioMin, precioMax } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (disponible !== undefined) filtro.disponible = disponible === 'true';
    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = Number(precioMin);
      if (precioMax) filtro.precio.$lte = Number(precioMax);
    }
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
      ];
    }

    const productos = await Producto.find(filtro)
      .populate('categoria', 'nombre estado')
      .sort({ nombre: 1 });

    res.json({ ok: true, data: productos });
  } catch (error) {
    next(error);
  }
};

export const obtenerProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria', 'nombre descripcion');
    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    if (req.file) req.body.imagen = `/uploads/${req.file.filename}`;
    const producto = await Producto.create(req.body);
    const populated = await producto.populate('categoria', 'nombre');
    res.status(201).json({ ok: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    if (req.file) req.body.imagen = `/uploads/${req.file.filename}`;
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const subirImagenProducto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'Debe seleccionar una imagen' });
    }
    const imagen = `/uploads/${req.file.filename}`;
    const producto = await Producto.findByIdAndUpdate(req.params.id, { imagen }, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
