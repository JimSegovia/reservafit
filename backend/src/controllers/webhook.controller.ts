import { Request, Response } from 'express';
import { WebhookService } from '../services/webhook.service';

const webhookService = new WebhookService();

export class WebhookController {
  async procesarWebhookStripe(req: Request, res: Response): Promise<void> {
    try {
      const result = await webhookService.procesarCheckoutSessionCompleted({
        rawBody: req.body, // Express pasará esto como Buffer gracias al middleware express.raw
        signature: req.headers['stripe-signature'],
      });

      if (result.yaProcesado) {
        res.status(200).send('[OK] Webhook ya procesado anteriormente');
        return;
      }

      res.status(200).send('[OK] Pago procesado y reserva confirmada');
    } catch (err) {
      // Por seguridad financiera, nunca devuelvas el error real a Stripe, solo loguea en tu servidor
      console.error('Error procesando Webhook de Stripe:', err);
      res.status(400).send('Webhook Error');
    }
  }
}