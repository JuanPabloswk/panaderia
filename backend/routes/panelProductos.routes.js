const express = require('express');
const { authorizePermisos } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/panelProductosController');

const router = express.Router();

router.get('/', authorizePermisos('crear', 'editar', 'eliminar'), ctrl.listar);
router.post('/', authorizePermisos('crear'), ctrl.crear);
router.get('/:id', authorizePermisos('crear', 'editar', 'eliminar'), ctrl.obtener);
router.put('/:id', authorizePermisos('editar'), ctrl.actualizar);
router.delete('/:id', authorizePermisos('eliminar'), ctrl.eliminar);

module.exports = router;
