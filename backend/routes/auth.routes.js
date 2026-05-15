const express = require('express');
const dbReady = require('../middleware/dbReady');
const { verificarToken, authorizePermisos } = require('../middleware/authMiddleware');
const { register, login, createEmpleado } = require('../controllers/authController');

const router = express.Router();

router.use(dbReady);

router.post('/register', register);
router.post('/login', login);

/**
 * Alta de personal en la colección `usuarios` (rol `empleado` o `admin`).
 * Requiere permiso `gestionar_usuarios` (rol admin).
 */
router.post(
  '/empleados',
  verificarToken,
  authorizePermisos('gestionar_usuarios'),
  createEmpleado
);

module.exports = router;
