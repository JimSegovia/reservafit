"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const stripe_service_js_1 = require("../services/stripe.service.js");
class PaymentsController {
    static async createPaymentIntent(req, res) {
        try {
            const { amount, currency = 'pen', metadata = {} } = req.body;
            if (!amount || Number.isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'El monto es requerido y debe ser mayor a 0.' });
            }
            const paymentIntent = await stripe_service_js_1.stripe.paymentIntents.create({
                amount: (0, stripe_service_js_1.toAmountInCents)(amount),
                currency,
                automatic_payment_methods: { enabled: true },
                metadata,
            });
            return res.status(200).json({
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo crear el PaymentIntent.';
            return res.status(500).json({ error: message });
        }
    }
    static async handleWebhook(req, res) {
        const signature = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!signature || !webhookSecret) {
            return res.status(400).json({ error: 'Webhook no configurado correctamente.' });
        }
        let event;
        try {
            event = stripe_service_js_1.stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Firma de webhook inválida.';
            return res.status(400).json({ error: message });
        }
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('[STRIPE] Pago exitoso:', paymentIntent.id);
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.log('[STRIPE] Pago fallido:', paymentIntent.id);
                break;
            }
            default:
                console.log(`[STRIPE] Evento no manejado: ${event.type}`);
        }
        return res.status(200).json({ received: true });
    }
}
exports.PaymentsController = PaymentsController;
