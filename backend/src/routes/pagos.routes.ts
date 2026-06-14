import { Router } from 'express';
import { PagoController } from '../controllers/pagos.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarEsquema } from '../middlewares/validator.middleware.js';
import { checkoutSchema } from '../types/pagos.dto.js';

const router = Router();

// Ruta protegida por JWT y validada por Zod
router.post(
  '/checkout', 
  verificarToken, 
  validarEsquema(checkoutSchema), 
  PagoController.handlePaymentCheckout
);

export default router;