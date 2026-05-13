export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      campo: e.path,
      mensaje: e.message,
    }));
    return res.status(400).json({ ok: false, error: 'Error de validación', detalles: errors });
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ ok: false, error: `El ${campo} ya existe` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ ok: false, error: 'ID inválido' });
  }

  if (err.message?.includes('Solo se permiten imágenes')) {
    return res.status(400).json({ ok: false, error: err.message });
  }

  return res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Error interno del servidor',
  });
};
