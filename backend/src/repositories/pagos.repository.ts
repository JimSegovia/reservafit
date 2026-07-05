import prisma from '../config/prisma.js';
import { MetodoPago, EstadoPago, EstadoReserva } from '@prisma/client';
import { CreatePagoDTO } from '../types/pagos.dto.js';

export class PagoRepository {
  
  static async crearIntentoDePago(data: CreatePagoDTO) {
    return await prisma.pago.create({
      data: {
        id_reserva: data.id_reserva,
        id_preferencia_mp: data.id_preferencia_mp,
        metodo_pago: MetodoPago[data.metodo_pago],
        estado_pago: EstadoPago.Pendiente,
        monto: data.monto,
        moneda: 'PEN',
      },
    });
  }

  static async obtenerReservaYDetalle(id_reserva: string) {
    return await prisma.reserva.findUnique({
      where: { id_reserva },
      include: {
        usuario: true,
        detalle_clase: {
          include: {
            clase: true,
          },
        },
      },
    });
  }

  static async buscarPagoPorReserva(id_reserva: string) {
    return await prisma.pago.findFirst({
      where: { id_reserva },
      orderBy: { id_pago: 'desc' },
    });
  }

  static async buscarPagoPorPreferencia(id_preferencia_mp: string) {
    return await prisma.pago.findUnique({
      where: { id_preferencia_mp },
    });
  }

  static async actualizarEstadoPago(id_pago: string, estado: EstadoPago, id_pago_mp?: string) {
    return await prisma.pago.update({
      where: { id_pago },
      data: {
        estado_pago: estado,
        ...(id_pago_mp && { id_pago_mp }),
      },
    });
  }

  static async confirmarReserva(id_reserva: string) {
    return await prisma.reserva.update({
      where: { id_reserva },
      data: { estado: EstadoReserva.Confirmada },
    });
  }

  static async registrarWebhook(id_evento: string, tipo_evento: string, id_pago?: string) {
    return await prisma.webHookProcesado.create({
      data: { id_evento, tipo_evento, id_pago },
    });
  }

  static async webhookYaProcesado(id_evento: string) {
    const encontrado = await prisma.webHookProcesado.findUnique({
      where: { id_evento },
    });
    return !!encontrado;
  }
}