const bcrypt = require('bcryptjs');

const DEFAULT_ROUNDS = 10;

function bcryptRounds() {
  const n = Number(process.env.BCRYPT_ROUNDS);
  if (!Number.isFinite(n) || n < 6 || n > 15) {
    return DEFAULT_ROUNDS;
  }
  return n;
}

function hashPassword(plain) {
  if (typeof plain !== 'string') {
    throw new Error('La contraseña debe ser texto');
  }
  return bcrypt.hash(plain, bcryptRounds());
}

function comparePassword(plain, hash) {
  if (typeof plain !== 'string' || typeof hash !== 'string') {
    throw new Error('Contraseña y hash deben ser texto');
  }
  return bcrypt.compare(plain, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
