import { Router } from 'express';
import { PagoController } from '../controllers/pagos.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validarEsquema } from '../middlewares/validator.middleware.js';
import { checkoutSchema } from '../types/pagos.dto.js';

const router = Router();

router.post(
  '/checkout', 
  verificarToken, 
  validarEsquema(checkoutSchema), 
  PagoController.handlePaymentCheckout
);

router.post('/webhook', PagoController.handleWebhook);

router.get('/verify/:id_reserva', verificarToken, PagoController.handleVerifyPayment);

export default router;