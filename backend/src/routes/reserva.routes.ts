import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';

const router = Router();
const reservaController = new ReservaController();

// Ruta POST para crear la reserva
router.post('/reservas', (req, res) => reservaController.registrarReserva(req, res));

export default router;