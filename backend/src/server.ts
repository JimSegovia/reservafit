import { envs } from './config/env.js';
import { logger } from './config/logger.js';
import app from './app.js';
import prisma from './config/prisma.js';
import { iniciarCronJobs } from './utils/cron.util.js'; // Ajustado con el nombre correcto

const PORT = envs.PORT; // Usamos la variable validada, no process.env

async function bootstrap() {
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Clases" ADD COLUMN IF NOT EXISTS "precio" DECIMAL(10,2) NOT NULL DEFAULT 5`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Monedas_Cliente" (
        "id_monedas_cliente" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "id_usuario" UUID UNIQUE NOT NULL REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE,
        "saldo_monedas" INTEGER NOT NULL DEFAULT 0
      )`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Historial_Monedas" (
        "id_historial" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "id_usuario" UUID NOT NULL,
        "cantidad" INTEGER NOT NULL,
        "tipo" VARCHAR(50) NOT NULL,
        "id_reserva" UUID,
        "fecha" TIMESTAMP(6) NOT NULL DEFAULT NOW()
      )`
    );
    logger.info('Schema verificado.');

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