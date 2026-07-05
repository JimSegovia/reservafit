import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller.js';
import { validarEsquema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../types/auth.dto.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas cuentas creadas. Intenta de nuevo en 1 hora.' },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de verificación. Intenta de nuevo en 15 minutos.' },
});

const forgotPwdLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});

router.post('/register', registerLimiter, validarEsquema(registerSchema), AuthController.register);
router.post('/login', loginLimiter, validarEsquema(loginSchema), AuthController.login);
router.post('/verify-otp', otpLimiter, validarEsquema(verifyOtpSchema), AuthController.verifyOtp);
router.post('/forgot-password', forgotPwdLimiter, validarEsquema(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validarEsquema(resetPasswordSchema), AuthController.resetPassword);

export default router;