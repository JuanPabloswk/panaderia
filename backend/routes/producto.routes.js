import { Router } from 'express';
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  subirImagenProducto,
  eliminarProducto,
} from '../controllers/producto.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { upload } from '../libs/multer.lib.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', authenticate, authorize('admin', 'gerente', 'panadero'), upload.single('imagen'), crearProducto);
router.put('/:id', authenticate, authorize('admin', 'gerente', 'panadero'), actualizarProducto);
router.patch('/:id/imagen', authenticate, authorize('admin', 'gerente', 'panadero'), upload.single('imagen'), subirImagenProducto);
router.delete('/:id', authenticate, authorize('admin', 'gerente'), eliminarProducto);

export default router;
