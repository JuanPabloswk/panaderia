function slugify(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

function categoriaActiva(cat) {
  if (cat == null) return false;
  if (typeof cat !== 'object') return true;
  if (cat.estado === 'inactiva') return false;
  return true;
}

/**
 * Formato enviado al front.
 */
function serializeProducto(doc) {
  const cat = doc.categoria;
  let categoriaNombre = '';
  let categoriaSlug = '';
  let categoriaDescripcion = '';
  let categoriaImagen = null;
  let categoriaEstado = 'activa';

  if (cat && typeof cat === 'object' && cat._id) {
    categoriaNombre = cat.nombre || '';
    categoriaSlug = (cat.slug || slugify(categoriaNombre)).toLowerCase();
    categoriaDescripcion = cat.descripcion || '';
    categoriaImagen = cat.imagen ?? null;
    categoriaEstado = cat.estado || 'activa';
  }

  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    descripcion: doc.descripcion,
    precio: doc.precio,
    imagen: doc.imagen ?? null,
    stock: doc.stock,
    descuento: doc.descuento ?? 0,
    peso: doc.peso,
    ingredientes: Array.isArray(doc.ingredientes) ? doc.ingredientes : [],
    calificacion: doc.calificacion ?? 0,
    categoria: categoriaNombre,
    categoriaSlug,
    categoriaDescripcion,
    categoriaImagen,
    categoriaEstado,
    disponible: doc.disponible !== false,
  };
}

module.exports = { serializeProducto, slugify, categoriaActiva };
