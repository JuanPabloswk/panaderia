import { Router } from 'express';
import {
  obtenerClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerPerfil,
  actualizarPerfil,
} from '../controllers/cliente.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { actualizarClienteSchema } from '../schema/cliente.schema.js';

const router = Router();

router.get('/perfil', authenticate, obtenerPerfil);
router.put('/perfil', authenticate, validate(actualizarClienteSchema), actualizarPerfil);
router.get('/', authenticate, authorize('admin', 'gerente'), obtenerClientes);
router.get('/:id', authenticate, authorize('admin', 'gerente', 'vendedor'), obtenerCliente);
router.put('/:id', authenticate, authorize('admin', 'gerente'), validate(actualizarClienteSchema), actualizarCliente);
router.delete('/:id', authenticate, authorize('admin'), eliminarCliente);

export default router;
