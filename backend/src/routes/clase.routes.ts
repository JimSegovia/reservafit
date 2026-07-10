import { Router } from 'express';
import { ClaseController } from '../controllers/clase.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/', verificarToken, ClaseController.create);
router.get('/', ClaseController.getAll);
router.patch('/:id', verificarToken, ClaseController.update);
router.delete('/:id', verificarToken, ClaseController.delete);

// Endpoint para subir imagen de la clase
router.post('/:id/imagen', verificarToken, upload.single('image'), ClaseController.uploadImage);

export default router;