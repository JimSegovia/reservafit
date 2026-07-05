import { Request, Response } from 'express';
import { PagoService } from '../services/pagos.service.js';
import { logger } from '../config/logger.js';
import { envs } from '../config/env.js';
import crypto from 'crypto';

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
      const reqQuery = req.query as Record<string, string>;
      const { data } = req.body || {};

      let eventId = reqQuery.id || '';
      let eventTopic = reqQuery.topic || reqQuery.type || 'payment';

      if (!eventId && data?.id) {
        eventId = String(data.id);
      }

      if (!eventId) {
        res.status(400).json({ error: 'Falta id del evento' });
        return;
      }

      // Validar firma de MercadoPago si el cliente secreto está configurado
      if (envs.MERCADO_PAGO_CLIENT_SECRET) {
        const signature = req.headers['x-signature'] as string;
        if (!signature) {
          res.status(401).json({ error: 'Falta firma x-signature' });
          return;
        }

        const parts = signature.split(',');
        let ts = '';
        let v1 = '';
        for (const part of parts) {
          const [key, value] = part.trim().split('=');
          if (key === 'ts') ts = value;
          if (key === 'v1') v1 = value;
        }

        const payload = `id:${eventId};ts:${ts}`;
        const hash = crypto.createHmac('sha256', envs.MERCADO_PAGO_CLIENT_SECRET).update(payload).digest('hex');

        if (v1 !== hash) {
          logger.warn(`Webhook con firma inválida: id=${eventId}`);
          res.status(401).json({ error: 'Firma inválida' });
          return;
        }
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
      const id_reserva = String(req.params.id_reserva);

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