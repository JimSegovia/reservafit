import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller.js';

const router = Router();

router.post('/create-payment-intent', PaymentsController.createPaymentIntent);

export default router;
