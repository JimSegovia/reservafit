import express, { Application } from 'express';
import cors from 'cors';
<<<<<<< HEAD
import routerApi from './routes/index.js';
import { PaymentsController } from './controllers/payments.controller.js';
=======
import routerApi from './routes/index.js'; // Tu enrutador maestro
>>>>>>> 4e4db6600766f027fe11d75739bbf4b359766587

const app: Application = express();

app.use(cors());
<<<<<<< HEAD
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), PaymentsController.handleWebhook);
app.use(express.json()); // Permite capturar los req.body en formato JSON
=======
>>>>>>> 4e4db6600766f027fe11d75739bbf4b359766587

// Toda la API pasa por index.ts
app.use('/api', routerApi);

// Capturador de 404 (siempre al final)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

export default app;
