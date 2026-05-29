import { Request, Response } from 'express';
import { stripe, toAmountInCents } from '../services/stripe.service.js';

interface CreatePaymentIntentBody {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export class PaymentsController {
  static async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency = 'pen', metadata = {} } = req.body as CreatePaymentIntentBody;

      if (!amount || Number.isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'El monto es requerido y debe ser mayor a 0.' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: toAmountInCents(amount),
        currency,
        automatic_payment_methods: { enabled: true },
        metadata,
      });

      return res.status(200).json({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el PaymentIntent.';
      return res.status(500).json({ error: message });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).json({ error: 'Webhook no configurado correctamente.' });
    }

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Firma de webhook inválida.';
      return res.status(400).json({ error: message });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        console.log('[STRIPE] Pago exitoso:', paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        console.log('[STRIPE] Pago fallido:', paymentIntent.id);
        break;
      }
      default:
        console.log(`[STRIPE] Evento no manejado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  }
}
