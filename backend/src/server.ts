import { envs } from './config/env.js';
import { logger } from './config/logger.js';
import app from './app.js';
import prisma from './config/prisma.js';
import { iniciarCronJobs } from './utils/cron.util.js'; // Ajustado con el nombre correcto

const PORT = envs.PORT; // Usamos la variable validada, no process.env

async function bootstrap() {
  try {
    // 1. Validamos la conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Conexión nativa a la base de datos establecida de forma segura.');

    // 2. Iniciamos el recolector de basura de reservas vencidas
    iniciarCronJobs();
    logger.info('[CRON] Tareas programadas en ejecución.');

    // 3. Inicializamos la escucha del servidor HTTP
    app.listen(PORT, () => {
      logger.info(`Servidor de ReservaFit corriendo de manera exitosa en el puerto ${PORT}`);
    });
    
  } catch (error) {
    logger.error('Error crítico al inicializar los servicios del backend:', error);
    process.exit(1); // Detiene la ejecución si no hay base de datos disponible
  }
}

bootstrap();