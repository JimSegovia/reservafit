import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/clientes', verificarToken, AdminController.getAllClientes);
router.post('/ajustar-monedas', verificarToken, AdminController.ajustarMonedas);

export default router;
