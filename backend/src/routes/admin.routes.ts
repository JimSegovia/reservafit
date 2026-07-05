import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/clientes', verificarToken, verificarAdmin, AdminController.getAllClientes);
router.post('/ajustar-monedas', verificarToken, verificarAdmin, AdminController.ajustarMonedas);

export default router;
