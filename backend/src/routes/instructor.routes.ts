import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Definimos los endpoints para instructores
router.post('/', verificarToken, InstructorController.create);
router.get('/', InstructorController.getAll);
router.patch('/:id', verificarToken, InstructorController.update);
router.delete('/:id', verificarToken, InstructorController.delete);

export default router;