import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller.js';

const router = Router();

// Definimos los endpoints para instructores
router.post('/', InstructorController.create);
router.get('/', InstructorController.getAll);

export default router;