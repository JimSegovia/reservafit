import cron from 'node-cron';
import { EstadoReserva, EstadoPago, EstadoClase, Prisma } from '@prisma/client'; 
import prisma from '../config/prisma.js';
import { MonedasService } from '../services/monedas.service.js';
import { logger } from '../config/logger.js'; 

export function iniciarCronJobs() {
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
          const pagoExitoso = await prisma.pago.findFirst({
            where: {
              id_reserva,
              estado_pago: EstadoPago.Exitoso,
            },
          });

          if (pagoExitoso) {
            await prisma.reserva.update({
              where: { id_reserva },
              data: { estado: EstadoReserva.Confirmada },
            });
            logger.info(`[CRON] Reserva ${id_reserva} confirmada (pago exitoso encontrado post-timeout).`);
            continue;
          }

          await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.reserva.update({
              where: { id_reserva },
              data: { estado: EstadoReserva.Cancelada_Timeout },
            });
            await tx.detalleReserva.deleteMany({
              where: { id_reserva },
            });
          });
          
          logger.info(`[CRON] Reserva ${id_reserva} cancelada por timeout. Cupos liberados.`);
        } catch (err) {
          logger.error(`[CRON] Error al cancelar reserva ${id_reserva}:`, err);
        }
      }

      // 2. Cancelar clases que no alcanzaron el minimo de 7 personas (3 horas antes)
      const tresHorasFuturo = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);
      const rangoInicio = new Date(tresHorasFuturo.getTime() - 30000);
      const rangoFin = new Date(tresHorasFuturo.getTime() + 30000);

      const clasesPorEmpezar = await prisma.detalleClase.findMany({
        where: {
          estado: EstadoClase.Disponible,
          fecha_hora_inicio: { gte: rangoInicio, lte: rangoFin },
        },
      });

      for (const clase of clasesPorEmpezar) {
        const count = await prisma.reserva.count({
          where: {
            id_detalle_clase: clase.id_detalle_clase,
            estado: EstadoReserva.Confirmada,
          },
        });

        if (count < 7) {
          try {
            await MonedasService.cancelarClasePorMinimo(clase.id_detalle_clase);
          } catch (err) {
            logger.error(`[CRON] Error al cancelar clase por minimo ${clase.id_detalle_clase}:`, err);
          }
        }
      }
    } catch (err) {
      logger.error('[CRON] Error crítico al procesar reservas vencidas:', err);
    }
  });
}