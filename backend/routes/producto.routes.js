import { Router } from 'express';
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/producto.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate, validateWithFile } from '../middlewares/validate.middleware.js';
import { parseFormData } from '../middlewares/parseFormData.middleware.js';
import { crearProductoSchema, actualizarProductoSchema } from '../schema/producto.schema.js';
import { upload } from '../libs/multer.lib.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', authenticate, authorize('admin', 'gerente', 'panadero'), upload.single('imagen'), parseFormData, validate(crearProductoSchema), crearProducto);
router.put('/:id', authenticate, authorize('admin', 'gerente', 'panadero'), upload.single('imagen'), parseFormData, validateWithFile(actualizarProductoSchema), actualizarProducto);
router.delete('/:id', authenticate, authorize('admin', 'gerente'), eliminarProducto);

export default router;
