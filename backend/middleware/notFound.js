const { HttpError } = require('./httpError');

function notFound(req, res, next) {
  next(new HttpError(404, 'Recurso no encontrado', 'NOT_FOUND'));
}

module.exports = notFound;
