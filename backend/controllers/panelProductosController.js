const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const {
  serializeProductoPanel,
  categoriaActiva,
} = require('../utils/serializeProducto');
const { HttpError } = require('../middleware/httpError');
const { parsePrecioEntero } = require('../libs/parsePrecioEntero');

const populateCategoria = {
  path: 'categoria',
  select: 'nombre slug descripcion imagen estado',
};

function normalizeObjectId(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
}

function parseIngredientes(b) {
  if (Array.isArray(b.ingredientes)) {
    return b.ingredientes.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof b.ingredientes === 'string' && b.ingredientes.trim()) {
    return b.ingredientes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

async function assertCategoriaActiva(catId) {
  const cat = await Categoria.findById(catId).lean();
  if (!cat) {
    throw new HttpError(400, 'Categoría no encontrada', 'CATEGORIA_NOT_FOUND');
  }
  if (!categoriaActiva(cat)) {
    throw new HttpError(400, 'La categoría no está activa', 'CATEGORIA_INACTIVA');
  }
  return cat;
}

async function listar(req, res, next) {
  try {
    const list = await Producto.find()
      .populate(populateCategoria)
      .sort({ nombre: 1 })
      .lean();
    res.json({ productos: list.map(serializeProductoPanel) });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    const doc = await Producto.findById(id).populate(populateCategoria).lean();
    if (!doc) {
      return next(new HttpError(404, 'Producto no encontrado', 'NOT_FOUND'));
    }
    res.json({ producto: serializeProductoPanel(doc) });
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const b = req.body || {};
    const nombre = String(b.nombre || '').trim();
    const descripcion = String(b.descripcion || '').trim();
    const catId = normalizeObjectId(b.categoriaId ?? b.categoria);
    const precio = parsePrecioEntero(b.precio);
    const stock = Number(b.stock);

    if (!nombre || !descripcion) {
      throw new HttpError(
        400,
        'Nombre y descripción son obligatorios',
        'VALIDATION'
      );
    }
    if (!Number.isFinite(precio) || precio < 0) {
      throw new HttpError(
        400,
        'Precio inválido: solo números enteros, sin puntos ni comas',
        'VALIDATION'
      );
    }
    if (!catId) {
      throw new HttpError(400, 'Categoría inválida', 'VALIDATION');
    }
    if (!Number.isFinite(stock) || stock < 0) {
      throw new HttpError(400, 'Stock inválido', 'VALIDATION');
    }

    await assertCategoriaActiva(catId);

    const doc = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen: b.imagen != null ? String(b.imagen).trim() || null : null,
      stock,
      peso: b.peso != null ? String(b.peso).trim() : '',
      ingredientes: parseIngredientes(b),
      calificacion: Math.max(0, Number(b.calificacion) || 0),
      categoria: catId,
      disponible: b.disponible !== false,
    });
    const fresh = await Producto.findById(doc._id)
      .populate(populateCategoria)
      .lean();
    res.status(201).json({ producto: serializeProductoPanel(fresh) });
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    const doc = await Producto.findById(id);
    if (!doc) {
      return next(new HttpError(404, 'Producto no encontrado', 'NOT_FOUND'));
    }

    const b = req.body || {};
    if (b.precio != null) {
      const precio = parsePrecioEntero(b.precio);
      if (!Number.isFinite(precio) || precio < 0) {
        throw new HttpError(
          400,
          'Precio inválido: solo números enteros, sin puntos ni comas',
          'VALIDATION'
        );
      }
      doc.precio = precio;
    }
    if (b.stock != null) {
      const stock = Number(b.stock);
      if (!Number.isFinite(stock) || stock < 0) {
        throw new HttpError(400, 'Stock inválido', 'VALIDATION');
      }
      doc.stock = stock;
    }
    const rawCat = b.categoriaId ?? b.categoria;
    const catStr = rawCat != null ? String(rawCat).trim() : '';
    if (catStr !== '') {
      const catId = normalizeObjectId(rawCat);
      if (!catId) {
        throw new HttpError(400, 'Categoría inválida', 'VALIDATION');
      }
      const mismoQueActual =
        doc.categoria && String(doc.categoria) === String(catId);
      if (!mismoQueActual) {
        await assertCategoriaActiva(catId);
      }
      doc.categoria = catId;
    }
    if (b.nombre != null) doc.nombre = String(b.nombre).trim();
    if (b.descripcion != null) doc.descripcion = String(b.descripcion).trim();
    if (b.imagen !== undefined) {
      doc.imagen = b.imagen != null ? String(b.imagen).trim() || null : null;
    }
    if (b.peso != null) doc.peso = String(b.peso).trim();
    if (b.ingredientes !== undefined) doc.ingredientes = parseIngredientes(b);
    if (b.calificacion != null) {
      doc.calificacion = Math.max(0, Number(b.calificacion) || 0);
    }
    if (b.disponible !== undefined) doc.disponible = Boolean(b.disponible);

    if (!String(doc.nombre || '').trim() || !String(doc.descripcion || '').trim()) {
      throw new HttpError(
        400,
        'Nombre y descripción son obligatorios',
        'VALIDATION'
      );
    }

    await doc.save();
    const fresh = await Producto.findById(doc._id)
      .populate(populateCategoria)
      .lean();
    res.json({ producto: serializeProductoPanel(fresh) });
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    const deleted = await Producto.findByIdAndDelete(id);
    if (!deleted) {
      return next(new HttpError(404, 'Producto no encontrado', 'NOT_FOUND'));
    }
    res.json({ ok: true, message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
