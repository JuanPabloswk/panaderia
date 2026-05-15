const express = require('express');
const { authorizePermisos } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/panelUsuariosController');

const router = express.Router();

router.get('/', authorizePermisos('gestionar_usuarios'), ctrl.listar);
router.post('/', authorizePermisos('gestionar_usuarios'), ctrl.crear);
router.get('/:id', authorizePermisos('gestionar_usuarios'), ctrl.obtener);
router.put('/:id', authorizePermisos('gestionar_usuarios'), ctrl.actualizar);
router.delete('/:id', authorizePermisos('gestionar_usuarios'), ctrl.eliminar);

module.exports = router;
