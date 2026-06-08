import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';

const router = Router();

// Endpoints del CRUD de usuarios
router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getProfile);
router.patch('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

export default router;