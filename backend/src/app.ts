import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

// 1. Middlewares Globales

// 2. Configuramos CORS para apuntar a tu Frontend en Vercel
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:8081',
      'http://localhost:3000',
      process.env.CLIENT_BASE_URL || 'https://reservafit-xi.vercel.app',
      'https://reservafit-vi.vercel.app',
      'https://reservafit-xi.vercel.app',
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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