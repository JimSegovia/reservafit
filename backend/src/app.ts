import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';

const app: Application = express();

// Middlewares globales indispensables
app.use(cors());
app.use(express.json()); // Permite capturar los req.body en formato JSON

// Punto de montaje central para toda la API RESTful
app.use('/api', routerApi);

// Capturador global para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

export default app;