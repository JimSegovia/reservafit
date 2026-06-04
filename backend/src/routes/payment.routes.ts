import { Router } from 'express';
import { handlePaymentCheckout } from '../controllers/payment.controller.js';

const router = Router();

router.post('/checkout', handlePaymentCheckout);

export default router;