import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

// 1. Middlewares Globales
app.use(cors());
app.use(express.json()); 

// 2. Enrutador Principal
app.use('/api', routerApi);

// 3. Capturador de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

// 4. Manejador Global de Errores (Red de Seguridad)
app.use(errorHandler);

export default app;