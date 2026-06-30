import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validarEsquema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../types/auth.dto.js';

const router = Router();

// Endpoint: POST /api/auth/register (Protegido con Zod)
router.post('/register', validarEsquema(registerSchema), AuthController.register);

// Endpoint: POST /api/auth/login (Protegido con Zod)
router.post('/login', validarEsquema(loginSchema), AuthController.login);

// Endpoint: POST /api/auth/verify-otp (Protegido con Zod)
router.post('/verify-otp', validarEsquema(verifyOtpSchema), AuthController.verifyOtp);

// Endpoint: POST /api/auth/forgot-password (Protegido con Zod)
router.post('/forgot-password', validarEsquema(forgotPasswordSchema), AuthController.forgotPassword);

// Endpoint: POST /api/auth/reset-password (Protegido con Zod)
router.post('/reset-password', validarEsquema(resetPasswordSchema), AuthController.resetPassword);

export default router;