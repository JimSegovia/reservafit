import { Router } from 'express';
import { MonedasController } from '../controllers/monedas.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id_usuario', verificarToken, MonedasController.handleObtenerMonedas);
router.post('/pagar', verificarToken, MonedasController.handlePagarConMonedas);
router.patch('/cancelar/:id_reserva', verificarToken, MonedasController.handleCancelarReserva);

export default router;
