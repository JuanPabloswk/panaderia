import { Router } from 'express';
import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  cambiarEstadoCategoria,
} from '../controllers/categoria.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { parseFormData } from '../middlewares/parseFormData.middleware.js';
import { crearCategoriaSchema, actualizarCategoriaSchema } from '../schema/categoria.schema.js';
import { upload } from '../libs/multer.lib.js';

const router = Router();

router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoria);
router.post('/', authenticate, authorize('admin', 'gerente'), upload.single('imagen'), parseFormData, validate(crearCategoriaSchema), crearCategoria);
router.put('/:id', authenticate, authorize('admin', 'gerente'), upload.single('imagen'), parseFormData, validate(actualizarCategoriaSchema), actualizarCategoria);
router.patch('/:id/estado', authenticate, authorize('admin', 'gerente'), cambiarEstadoCategoria);
router.delete('/:id', authenticate, authorize('admin'), eliminarCategoria);

export default router;
