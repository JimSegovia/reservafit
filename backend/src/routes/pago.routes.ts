import { Router } from 'express';
import { PagoController } from '../controllers/pago.controller';

const pagoRouter = Router();
const pagoController = new PagoController();

// Aceptamos ambas formas de recibir el parámetro
pagoRouter.post('/checkout', (req, res) => pagoController.generarCheckoutSession(req, res));
pagoRouter.post('/checkout/:id_reserva', (req, res) => pagoController.generarCheckoutSession(req, res));

export default pagoRouter;