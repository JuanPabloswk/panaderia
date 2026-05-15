const express = require('express');
const dbReady = require('../middleware/dbReady');
const { verificarToken, authorizePermisos } = require('../middleware/authMiddleware');
const panelProductos = require('./panelProductos.routes');
const panelUsuarios = require('./panelUsuarios.routes');
const panelCategorias = require('../controllers/panelCategoriasController');

const router = express.Router();

router.use(dbReady);
router.use(verificarToken);

router.get(
  '/categorias',
  authorizePermisos('crear', 'editar', 'eliminar'),
  panelCategorias.listar
);

router.use('/productos', panelProductos);
router.use('/usuarios', panelUsuarios);

module.exports = router;
