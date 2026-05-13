const mongoose = require('mongoose');
const { HttpError } = require('./httpError');

function errorBody(message, code) {
  return { ok: false, message, code };
}

/**
 * Middleware Express (4 argumentos). Debe registrarse al final de la cadena.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err instanceof HttpError) {
    return res
      .status(err.statusCode)
      .json(errorBody(err.message, err.code));
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res
      .status(400)
      .json(errorBody(msg || 'Datos inválidos', 'VALIDATION_ERROR'));
  }

  if (err instanceof mongoose.Error.CastError && err.path === '_id') {
    return res
      .status(400)
      .json(errorBody('Identificador inválido', 'INVALID_ID'));
  }

  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'campo';
    const msg =
      field === 'email'
        ? 'El correo ya está registrado'
        : 'Ya existe un registro con esos datos';
    return res.status(400).json(errorBody(msg, 'DUPLICATE_KEY'));
  }

  const status =
    typeof err.status === 'number'
      ? err.status
      : typeof err.statusCode === 'number'
        ? err.statusCode
        : 500;

  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const isServer = safeStatus >= 500;
  const message = isServer
    ? 'Error interno del servidor'
    : err.message || 'Solicitud incorrecta';

  return res
    .status(safeStatus)
    .json(
      errorBody(
        message,
        err.code && typeof err.code === 'string' ? err.code : 'INTERNAL_ERROR'
      )
    );
}

module.exports = errorHandler;
