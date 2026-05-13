class HttpError extends Error {
  /**
   * @param {number} statusCode - HTTP 4xx / 5xx
   * @param {string} message - Mensaje para el cliente
   * @param {string} [code] - Código estable para el front (ej. TOKEN_MISSING)
   */
  constructor(statusCode, message, code = 'HTTP_ERROR') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = { HttpError };
