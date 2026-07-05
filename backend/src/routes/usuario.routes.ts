import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoints del CRUD de usuarios
router.get('/', verificarToken, UsuarioController.getAll);
router.get('/:id', verificarToken, UsuarioController.getProfile);
router.patch('/:id', verificarToken, UsuarioController.update);
router.delete('/:id', verificarToken, UsuarioController.delete);

export default router;