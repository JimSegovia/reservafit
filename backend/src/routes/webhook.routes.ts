import express, { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const webhookRouter = Router();
const webhookController = new WebhookController();

// ATENCIÓN: El middleware express.raw va AQUÍ específicamente para preservar el Buffer
webhookRouter.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }), 
  (req, res) => webhookController.procesarWebhookStripe(req, res)
);

export default webhookRouter;