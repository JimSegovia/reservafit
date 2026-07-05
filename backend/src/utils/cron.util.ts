import cron from 'node-cron';
import { EstadoReserva, EstadoPago, Prisma } from '@prisma/client'; 
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js'; 

export function iniciarCronJobs() {
  // Se ejecuta cada minuto
  cron.schedule('* * * * *', async () => {
    const ahora = new Date();
    
    try {
      // 1. Buscar reservas vencidas no pagadas
      const reservasVencidas = await prisma.reserva.findMany({
        where: {
          estado: EstadoReserva.Pendiente_pago,
          fecha_expiracion_pago: { lt: ahora },
        },
        select: { id_reserva: true },
      });

      for (const { id_reserva } of reservasVencidas) {
        try {
          // Verificar si hay un pago exitoso asociado (pudo haberse pagado justo a tiempo)
          const pagoExitoso = await prisma.pago.findFirst({
            where: {
              id_reserva,
              estado_pago: EstadoPago.Exitoso,
            },
          });

          if (pagoExitoso) {
            // El pago ya se completó, confirmar la reserva en lugar de cancelarla
            await prisma.reserva.update({
              where: { id_reserva },
              data: { estado: EstadoReserva.Confirmada },
            });
            logger.info(`[CRON] Reserva ${id_reserva} confirmada (pago exitoso encontrado post-timeout).`);
            continue;
          }

          // Tipamos (tx) explícitamente para que el build en Railway no falle
          await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 2a. Actualizar reserva a Cancelada_Timeout
            await tx.reserva.update({
              where: { id_reserva },
              data: { estado: EstadoReserva.Cancelada_Timeout },
            });
            
            // 2b. Eliminar detalles vinculados para liberar cupo físico
            await tx.detalleReserva.deleteMany({
              where: { id_reserva },
            });
          });
          
          logger.info(`[CRON] Reserva ${id_reserva} cancelada por timeout. Cupos liberados.`);
        } catch (err) {
          logger.error(`[CRON] Error al cancelar reserva ${id_reserva}:`, err);
        }
      }
    } catch (err) {
      logger.error('[CRON] Error crítico al procesar reservas vencidas:', err);
    }
  });
}