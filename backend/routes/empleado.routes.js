import { Router } from 'express';
import {
  obtenerEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerMiPerfil,
} from '../controllers/empleado.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { crearEmpleadoSchema, actualizarEmpleadoSchema } from '../schema/empleado.schema.js';

const router = Router();

router.get('/perfil', authenticate, obtenerMiPerfil);
router.get('/', authenticate, authorize('admin', 'gerente'), obtenerEmpleados);
router.get('/:id', authenticate, authorize('admin', 'gerente'), obtenerEmpleado);
router.post('/', authenticate, authorize('admin', 'gerente'), validate(crearEmpleadoSchema), crearEmpleado);
router.put('/:id', authenticate, authorize('admin', 'gerente'), validate(actualizarEmpleadoSchema), actualizarEmpleado);
router.delete('/:id', authenticate, authorize('admin'), eliminarEmpleado);

export default router;
