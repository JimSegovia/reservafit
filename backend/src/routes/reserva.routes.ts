import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';

const router = Router();
const reservaController = new ReservaController();

// Ruta POST para crear la reserva
router.post('/reservas', (req, res) => reservaController.registrarReserva(req, res));
router.get('/', (req, res) => reservaController.obtenerTodasReservas(req, res));
router.patch('/:id', (req, res) => reservaController.actualizarEstadoReserva(req, res));

export default router;