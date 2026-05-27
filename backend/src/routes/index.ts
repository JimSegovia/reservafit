import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instructorRoutes from './instructor.routes.js';
import claseRoutes from './clase.routes.js'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/instructores', instructorRoutes);
router.use('/clases', claseRoutes); 

export default router;