const mongoose = require('mongoose');
const { HttpError } = require('./httpError');

function dbReady(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(
      new HttpError(
        503,
        'Base de datos no disponible. Define MONGODB_URI y reinicia el servidor.',
        'DB_UNAVAILABLE'
      )
    );
  }
  next();
}

module.exports = dbReady;
