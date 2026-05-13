const numericFields = ['precio', 'stock', 'descuento', 'calificacion', 'salario', 'subtotal', 'descuentoTotal', 'total', 'precioUnitario', 'cantidad'];
const booleanFields = ['disponible', 'newsletter'];
const jsonArrayFields = ['ingredientes', 'permisos', 'items'];

export const parseFormData = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next();
  }

  for (const key of Object.keys(req.body)) {
    const value = req.body[key];

    if (value === '' || value === null || value === undefined) {
      continue;
    }

    if (numericFields.includes(key) || key.endsWith('Min') || key.endsWith('Max')) {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        req.body[key] = parsed;
      }
    }

    if (booleanFields.includes(key)) {
      if (value === 'true') req.body[key] = true;
      else if (value === 'false') req.body[key] = false;
    }

    if (jsonArrayFields.includes(key)) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          req.body[key] = parsed;
        }
      } catch {
      }
    }
  }

  next();
};
