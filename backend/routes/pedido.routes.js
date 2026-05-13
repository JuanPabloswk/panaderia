import { Router } from 'express';
import {
  obtenerPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  obtenerPedidosPorCliente,
} from '../controllers/pedido.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  crearPedidoSchema,
  actualizarPedidoSchema,
  actualizarEstadoPedidoSchema,
} from '../schema/pedido.schema.js';

const router = Router();

router.get('/', authenticate, obtenerPedidos);
router.get('/cliente/:clienteId', authenticate, authorize('admin', 'gerente', 'vendedor'), obtenerPedidosPorCliente);
router.get('/:id', authenticate, obtenerPedido);
router.post('/', authenticate, validate(crearPedidoSchema), crearPedido);
router.put('/:id', authenticate, authorize('admin', 'gerente', 'vendedor'), validate(actualizarPedidoSchema), actualizarPedido);
router.patch('/:id/estado', authenticate, authorize('admin', 'gerente', 'vendedor', 'panadero'), validate(actualizarEstadoPedidoSchema), actualizarEstadoPedido);
router.delete('/:id', authenticate, authorize('admin'), eliminarPedido);

export default router;
