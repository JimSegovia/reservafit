import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validarEsquema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../types/auth.dto.js';

const router = Router();

// Endpoint: POST /api/auth/register (Protegido con Zod)
router.post('/register', validarEsquema(registerSchema), AuthController.register);

// Endpoint: POST /api/auth/login (Protegido con Zod)
router.post('/login', validarEsquema(loginSchema), AuthController.login);

export default router;