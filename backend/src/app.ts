import express, { Application } from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { envs } from './config/env.js'; // 1. Importamos tus variables validadas

const app: Application = express();

// 1. Middlewares Globales

// 2. Configuramos CORS para apuntar a tu Frontend en Vercel
app.use(cors({
  origin: [envs.CLIENT_BASE_URL, 'http://localhost:8081'], 
  credentials: true // Permite que se envíen headers de autorización (como tu JWT) sin problemas
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