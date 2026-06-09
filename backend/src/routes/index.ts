import express, { Router } from 'express';
import authRoutes from './auth.routes.js';
import usuarioRoutes from './usuario.routes.js';
import cuentaRoutes from './cuenta.routes.js';
import instructorRoutes from './instructor.routes.js';
import claseRoutes from './clase.routes.js';
import detalleClaseRoutes from './detalleClase.routes.js';
import reservaRoutes from './reserva.routes.js';
import detalleReservaRoutes from './detalleReserva.routes.js';
import pagoRoutes from './pagos.routes.js';

const router = Router();

router.use(express.json());

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/cuentas', cuentaRoutes); 
router.use('/instructores', instructorRoutes);
router.use('/clases', claseRoutes);
router.use('/agenda', detalleClaseRoutes);
router.use('/reservas', reservaRoutes);
router.use('/detalles-reserva', detalleReservaRoutes);
router.use('/pagos', pagoRoutes);

export default router;
