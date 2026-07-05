import { Request, Response } from 'express';
import { PagoService } from '../services/pagos.service.js';
import { logger } from '../config/logger.js';

export class PagoController {
  
  static async handlePaymentCheckout(req: Request, res: Response): Promise<void> {
    try {
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

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { topic, id, type } = req.query;
      const { data } = req.body || {};

      let eventId = id as string;
      let eventTopic = (topic || type || 'payment') as string;

      if (!eventId && data?.id) {
        eventId = data.id;
      }

      if (!eventId) {
        res.status(400).json({ error: 'Falta id del evento' });
        return;
      }

      await PagoService.procesarWebhook(eventTopic, eventId);

      res.status(200).json({ message: 'Webhook procesado' });
    } catch (error: any) {
      logger.error(`Error en handleWebhook: ${error.message}`);
      res.status(500).json({ error: 'Error interno al procesar webhook' });
    }
  }

  static async handleVerifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id_reserva } = req.params;

      if (!id_reserva) {
        res.status(400).json({ error: 'Falta id_reserva' });
        return;
      }

      const result = await PagoService.verificarEstadoPago(id_reserva);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error en handleVerifyPayment: ${error.message}`);
      res.status(500).json({ error: 'Error interno al verificar pago' });
    }
  }
}