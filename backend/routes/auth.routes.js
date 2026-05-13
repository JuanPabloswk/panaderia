import { Router } from 'express';
import {
  registrarCliente,
  loginCliente,
  loginEmpleado,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { crearClienteSchema, loginClienteSchema } from '../schema/cliente.schema.js';
import { loginEmpleadoSchema } from '../schema/empleado.schema.js';

const router = Router();

router.post('/clientes/register', validate(crearClienteSchema), registrarCliente);
router.post('/clientes/login', validate(loginClienteSchema), loginCliente);
router.post('/empleados/login', validate(loginEmpleadoSchema), loginEmpleado);

export default router;
