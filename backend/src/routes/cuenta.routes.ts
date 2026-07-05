import { Router } from 'express';
import { CuentaController } from '../controllers/cuenta.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas dinámicas por ID de la cuenta
router.get('/:id', verificarToken, CuentaController.getCuenta);
router.patch('/:id', verificarToken, CuentaController.updateAdministrativo);
router.delete('/:id', verificarToken, CuentaController.delete);

export default router;