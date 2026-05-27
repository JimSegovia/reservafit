import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instructorRoutes from './instructor.routes.js';
import claseRoutes from './clase.routes.js';
import detalleClaseRoutes from './detalleClase.routes.js'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/instructores', instructorRoutes);
router.use('/clases', claseRoutes);
router.use('/agenda', detalleClaseRoutes); 

export default router;