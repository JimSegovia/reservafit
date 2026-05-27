import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js'; // Tu enrutador maestro

const app: Application = express();

app.use(cors());

// Toda la API pasa por index.ts
app.use('/api', routerApi);

// Capturador de 404 (siempre al final)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

export default app;