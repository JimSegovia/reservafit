import prisma from '../config/prisma.js';
import { MetodoPago, EstadoPago } from '@prisma/client';
import { CreatePagoDTO } from '../types/pagos.dto.js';

export class PagoRepository {
  
  static async crearIntentoDePago(data: CreatePagoDTO) {
    return await prisma.pago.create({
      data: {
        id_reserva: data.id_reserva,
        id_preferencia_mp: data.id_preferencia_mp, // Actualizado con tu nueva BD
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
}