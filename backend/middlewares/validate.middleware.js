export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensaje: issue.message,
      }));

      return res.status(400).json({
        ok: false,
        error: 'Error de validación',
        detalles: errors,
      });
    }

    req.body = result.data;
    next();
  };
};

export const validateWithFile = (schema) => {
  return (req, res, next) => {
    if (!req.file && Object.keys(req.body).length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Error de validación',
        detalles: [{ campo: '', mensaje: 'Al menos un campo es requerido o debe subir una imagen' }],
      });
    }

    if (Object.keys(req.body).length > 0) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message,
        }));
        return res.status(400).json({
          ok: false,
          error: 'Error de validación',
          detalles: errors,
        });
      }
      req.body = result.data;
    }

    if (req.file) {
      req.body.imagen = `/uploads/${req.file.filename}`;
    }

    next();
  };
};
