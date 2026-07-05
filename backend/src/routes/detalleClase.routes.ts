import { Router } from 'express';
import { DetalleClaseController } from '../controllers/detalleClase.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, DetalleClaseController.create);
router.get('/', DetalleClaseController.getAll);
router.patch('/:id', verificarToken, DetalleClaseController.update);
router.delete('/:id', verificarToken, DetalleClaseController.delete);

export default router;