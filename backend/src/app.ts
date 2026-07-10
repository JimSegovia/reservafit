import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

app.set('trust proxy', 1);

// 1. Middlewares Globales

// 2. CORS: permitir cualquier origen (la autenticación es via JWT Bearer, no cookies)
app.use(cors({
  origin: true,
  credentials: true
}));

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