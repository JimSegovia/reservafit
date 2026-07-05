import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();
const reservaController = new ReservaController();

// Ruta POST para crear la reserva
router.post('/', verificarToken, (req, res) => reservaController.registrarReserva(req, res));
router.post('/crear', verificarToken, (req, res) => reservaController.crearReservaBatch(req, res));
router.get('/', verificarToken, (req, res) => reservaController.obtenerTodasReservas(req, res));
router.patch('/:id', verificarToken, (req, res) => reservaController.actualizarEstadoReserva(req, res));

export default router;