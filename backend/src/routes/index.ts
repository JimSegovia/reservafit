import { Router } from 'express';
import authRoutes from './auth.routes.js';
import paymentsRoutes from './payments.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/payments', paymentsRoutes);

export default router;
