import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Definimos los endpoints para instructores
router.post('/', verificarToken, InstructorController.create);
router.get('/', InstructorController.getAll);
router.patch('/:id', verificarToken, InstructorController.update);
router.delete('/:id', verificarToken, InstructorController.delete);

// Endpoint para subir foto del instructor
router.post('/:id/foto', verificarToken, upload.single('image'), InstructorController.uploadPhoto);

export default router;