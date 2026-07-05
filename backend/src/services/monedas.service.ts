import { MonedasRepository } from '../repositories/monedas.repository.js';
import { EstadoReserva, EstadoClase } from '@prisma/client';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export class MonedasService {
  static async obtenerMonedas(id_usuario: string) {
    const saldo = await MonedasRepository.obtenerSaldo(id_usuario);
    const historial = await MonedasRepository.obtenerHistorial(id_usuario);
    return { saldo: saldo.saldo_monedas, historial };
  }

  static async pagarConMonedas(id_reserva: string, id_usuario: string) {
    return prisma.$transaction(async (tx) => {
      const monedas = await tx.monedasCliente.findUnique({
        where: { id_usuario },
      });

      const reserva = await tx.reserva.findUnique({
        where: { id_reserva },
        select: { cantidad_cupos: true },
      });

      const totalMonedas = (reserva?.cantidad_cupos || 1) * 5;

      if (!monedas || monedas.saldo_monedas < totalMonedas) {
        throw new Error(`Saldo insuficiente. Necesitas ${totalMonedas} monedas para ${reserva?.cantidad_cupos || 1} cupos.`);
      }

      await tx.monedasCliente.update({
        where: { id_usuario },
        data: { saldo_monedas: { decrement: totalMonedas } },
      });

      await tx.historialMonedas.create({
        data: { id_usuario, cantidad: -totalMonedas, tipo: 'gastada_clase', id_reserva },
      });

      await tx.reserva.update({
        where: { id_reserva },
        data: { estado: EstadoReserva.Confirmada },
      });

      logger.info(`Reserva ${id_reserva} pagada con monedas por usuario ${id_usuario} (${totalMonedas} monedas)`);
      return { success: true, saldo_restante: monedas.saldo_monedas - totalMonedas };
    });
  }

  static async devolverMonedas(id_reserva: string, motivo: 'cancelacion_cliente' | 'cancelacion_admin' | 'minimo_no_alcanzado') {
    const reserva = await prisma.reserva.findUnique({
      where: { id_reserva },
    });

    if (!reserva) throw new Error('Reserva no encontrada');

    const tipoHistorial =
      motivo === 'cancelacion_cliente' ? 'ganada_cancelacion' :
      motivo === 'cancelacion_admin' ? 'devuelta_admin' :
      'devuelta_minimo';

    const totalMonedas = 5 * reserva.cantidad_cupos;

    await MonedasRepository.sumarMonedas(reserva.id_usuario, totalMonedas);
    await MonedasRepository.registrarHistorial(reserva.id_usuario, totalMonedas, tipoHistorial, id_reserva);

    logger.info(`Monedas devueltas: reserva ${id_reserva}, usuario ${reserva.id_usuario}, motivo ${motivo}, total ${totalMonedas}`);
  }

  static async verificarBonoFidelidad(id_usuario: string) {
    const pagosExitosos = await prisma.historialMonedas.count({
      where: {
        id_usuario,
        tipo: 'gastada_clase',
      },
    });

    // También contamos compras con dinero exitosas
    const comprasDinero = await prisma.pago.count({
      where: {
        reserva: { id_usuario, estado: EstadoReserva.Confirmada },
        estado_pago: 'Exitoso',
      },
    });

    const totalCompras = pagosExitosos + comprasDinero;

    const bonosOtorgados = await MonedasRepository.contarComprasExitosas(id_usuario);
    const bonosEsperados = Math.floor(totalCompras / 3);

    if (bonosEsperados > bonosOtorgados) {
      const bonosFaltantes = bonosEsperados - bonosOtorgados;
      for (let i = 0; i < bonosFaltantes; i++) {
        await MonedasRepository.sumarMonedas(id_usuario, 5);
        await MonedasRepository.registrarHistorial(id_usuario, 5, 'ganada_compra_bono');
      }
      logger.info(`Bono fidelidad: +${bonosFaltantes * 5} monedas para usuario ${id_usuario} (${totalCompras} compras totales)`);
    }
  }

  static async cancelarClasePorMinimo(id_detalle_clase: string) {
    await prisma.$transaction(async (tx) => {
      const reservasConfirmadas = await tx.reserva.findMany({
        where: {
          id_detalle_clase,
          estado: EstadoReserva.Confirmada,
        },
      });

      if (reservasConfirmadas.length === 0) return;

      for (const res of reservasConfirmadas) {
        const totalMonedas = 5 * res.cantidad_cupos;

        await tx.monedasCliente.upsert({
          where: { id_usuario: res.id_usuario },
          create: { id_usuario: res.id_usuario, saldo_monedas: totalMonedas },
          update: { saldo_monedas: { increment: totalMonedas } },
        });

        await tx.historialMonedas.create({
          data: { id_usuario: res.id_usuario, cantidad: totalMonedas, tipo: 'devuelta_minimo', id_reserva: res.id_reserva },
        });

        await tx.reserva.update({
          where: { id_reserva: res.id_reserva },
          data: { estado: EstadoReserva.Cancelada_Por_Gimnasio },
        });

        await tx.detalleReserva.deleteMany({
          where: { id_reserva: res.id_reserva },
        });
      }

      await tx.detalleClase.update({
        where: { id_detalle_clase },
        data: { estado: EstadoClase.Cancelada },
      });

      logger.info(`Clase ${id_detalle_clase} cancelada por mínimo no alcanzado. ${reservasConfirmadas.length} reservas reembolsadas en monedas.`);
    });
  }
}
