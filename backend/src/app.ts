import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import { PaymentsController } from './controllers/payments.controller.js';

const app: Application = express();

app.use(cors());
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), PaymentsController.handleWebhook);
app.use(express.json()); // Permite capturar los req.body en formato JSON

// Toda la API pasa por index.ts
app.use('/api', routerApi);

// Capturador de 404 (siempre al final)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

export default app;
