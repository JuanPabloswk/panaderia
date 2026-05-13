const express = require('express');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const dbReady = require('../middleware/dbReady');
const { serializeProducto, slugify, categoriaActiva } = require('../utils/serializeProducto');

const router = express.Router();

router.use(dbReady);

const populateCategoria = {
  path: 'categoria',
  select: 'nombre slug descripcion imagen estado',
};

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res, next) => {
  try {
    const list = await Producto.find({ disponible: true })
      .populate(populateCategoria)
      .sort({ nombre: 1 })
      .lean();
    const productos = list
      .filter((doc) => categoriaActiva(doc.categoria))
      .map(serializeProducto);
    res.json({ productos });
  } catch (err) {
    next(err);
  }
});

router.get('/categoria/:categoria', async (req, res, next) => {
  try {
    const raw = String(req.params.categoria || '').trim();
    const param = raw.toLowerCase();

    const cat = await Categoria.findOne({
      estado: 'activa',
      $or: [
        { slug: param },
        { slug: slugify(raw) },
        { nombre: new RegExp(`^${escapeRegex(raw)}$`, 'i') },
      ],
    }).lean();

    if (!cat) {
      return res.json({ productos: [], categoria: raw });
    }

    const list = await Producto.find({
      categoria: cat._id,
      disponible: true,
    })
      .populate(populateCategoria)
      .sort({ nombre: 1 })
      .lean();

    const productos = list
      .filter((doc) => categoriaActiva(doc.categoria))
      .map(serializeProducto);
    res.json({ productos, categoria: cat.nombre || cat.slug });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
