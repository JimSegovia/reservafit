import { Router } from 'express';
import { DetalleReservaController } from '../controllers/detalleReserva.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint para el mapa de asientos en la app móvil
// GET: /api/detalles-reserva/ocupados/:id
router.get('/ocupados/:id', verificarToken, DetalleReservaController.getOcupados);

export default router;