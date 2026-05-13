const express = require('express');
const dbReady = require('../middleware/dbReady');
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware');
const { register, login, createEmpleado } = require('../controllers/authController');

const router = express.Router();

router.use(dbReady);

router.post('/register', register);
router.post('/login', login);

/** Alta de empleados solo por un admin ya autenticado (colección `empleados`). */
router.post('/empleados', verificarToken, soloAdmin, createEmpleado);

module.exports = router;
