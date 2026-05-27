import { Router } from 'express';
import { ClaseController } from '../controllers/clase.controller.js';

const router = Router();

router.post('/', ClaseController.create);
router.get('/', ClaseController.getAll);
router.patch('/:id', ClaseController.update);
router.delete('/:id', ClaseController.delete);

export default router;