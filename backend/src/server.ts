import 'dotenv/config';
import { logger } from './config/logger.js';
import app from './app.js';
import prisma from './config/prisma.js';
import { iniciarCronJobs } from './utils/cron.js';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Validamos la conexión lanzando una consulta rápida antes de levantar el puerto
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión nativa a la base de datos en Railway establecida de forma segura.');

    // Inicializamos la escucha del servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor de ReservaFit corriendo de manera exitosa en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error crítico al inicializar los servicios del backend:', error);
    process.exit(1); // Detiene la ejecución si no hay base de datos disponible
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);

  // Iniciamos el recolector de basura de reservas vencidas
  iniciarCronJobs();
  console.log('⏱️  [CRON] Tareas programadas en ejecución');
});

bootstrap();