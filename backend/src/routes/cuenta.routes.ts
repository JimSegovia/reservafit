import { Router } from 'express';
import { CuentaController } from '../controllers/cuenta.controller.js';

const router = Router();

// Rutas dinámicas por ID de la cuenta
router.get('/:id', CuentaController.getCuenta);
router.patch('/:id', CuentaController.updateAdministrativo);
router.delete('/:id', CuentaController.delete);

export default router;