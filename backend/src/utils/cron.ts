import cron from 'node-cron';
import { EstadoReserva } from '@prisma/client';
import prisma from '../config/prisma';

export function iniciarCronJobs() {
  // Ejecuta cada minuto
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
          await prisma.$transaction(async (tx) => {
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
          console.log(`[CRON] Reserva ${id_reserva} cancelada y cupos liberados.`);
        } catch (err) {
          // Maneja errores individuales para no detener el bucle
          console.error(`[CRON] Error al cancelar reserva ${id_reserva}:`, err);
        }
      }
    } catch (err) {
      // Error global en la consulta (no cancela el proceso completo)
      console.error('[CRON] Error general al procesar reservas vencidas:', err);
    }
  });
}