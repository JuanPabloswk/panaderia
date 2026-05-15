const Categoria = require('../models/Categoria');

async function listar(req, res, next) {
  try {
    const categorias = await Categoria.find()
      .sort({ nombre: 1 })
      .select('nombre slug estado')
      .lean();
    res.json({
      categorias: categorias.map((c) => ({
        id: c._id.toString(),
        nombre: c.nombre,
        slug: c.slug || '',
        estado: c.estado || 'activa',
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
