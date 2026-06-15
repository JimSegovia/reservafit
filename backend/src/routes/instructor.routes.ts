import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller.js';

const router = Router();

// Definimos los endpoints para instructores
router.post('/', InstructorController.create);
router.get('/', InstructorController.getAll);
router.patch('/:id', InstructorController.update);
router.delete('/:id', InstructorController.delete);

export default router;