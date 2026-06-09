import { Request, Response } from 'express';
import { PagoService } from '../services/pagos.service.js';
import { logger } from '../config/logger.js';

export class PagoController {
  
  static async handlePaymentCheckout(req: Request, res: Response): Promise<void> {
    try {
      // Los datos ya vienen validados por el middleware de Zod
      const { id_reserva, amount, description } = req.body;
      
      const result = await PagoService.generarCheckout({ id_reserva, amount, description });
      
      res.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error: any) {
      logger.error(`Error en handlePaymentCheckout: ${error.message}`);
      
      res.status(500).json({
        success: false,
        error: error.message || 'Error interno al procesar el pago'
      });
    }
  }
}