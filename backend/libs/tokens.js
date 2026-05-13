const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'claveSuperSecreta';
}

function signToken(payload, options = {}) {
  const expiresIn =
    options.expiresIn ?? process.env.JWT_EXPIRES_IN ?? '2h';
  const { expiresIn: _ignored, ...rest } = options;
  return jwt.sign(payload, getJwtSecret(), { expiresIn, ...rest });
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token ausente o inválido');
  }
  return jwt.verify(token.trim(), getJwtSecret());
}

function verifyAccessToken(headerOrToken) {
  if (!headerOrToken || typeof headerOrToken !== 'string') {
    throw new Error('Token ausente o inválido');
  }
  const trimmed = headerOrToken.trim();
  if (/^Bearer\s+/i.test(trimmed)) {
    return verifyToken(trimmed.replace(/^Bearer\s+/i, '').trim());
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return verifyToken(parts[1]);
  }
  return verifyToken(trimmed);
}

module.exports = {
  signToken,
  signAccessToken: signToken,
  verifyToken,
  verifyAccessToken,
  getJwtSecret,
};
