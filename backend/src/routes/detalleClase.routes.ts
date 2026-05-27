import { Router } from 'express';
import { DetalleClaseController } from '../controllers/detalleClase.controller.js';

const router = Router();

router.post('/', DetalleClaseController.create);
router.get('/', DetalleClaseController.getAll);
router.patch('/:id', DetalleClaseController.update);
router.delete('/:id', DetalleClaseController.delete);

export default router;