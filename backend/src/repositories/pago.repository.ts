import { PrismaClient, MetodoPago, EstadoPago, Pago } from '@prisma/client';

const prisma = new PrismaClient();

export class PagoRepository {
  async crearPagoConCheckoutSession(data: {
    id_reserva: string;
    id_stripe_sesion: string;
    monto: number;
    moneda: string;
  }): Promise<Pago> {
    return await prisma.pago.create({
      data: {
        id_reserva: data.id_reserva,
        id_stripe_sesion: data.id_stripe_sesion,
        // Usamos Yape temporalmente para que Prisma no lance error, ya que no definiste "Tarjeta" en el Enum MetodoPago
        metodo_pago: MetodoPago.Yape, 
        estado_pago: EstadoPago.Pendiente,
        monto: data.monto,
        moneda: data.moneda,
      },
    });
  }

  async obtenerReservaYDetalle(id_reserva: string) {
    // Incluye usuario y detalles de clase para el armado del resumen del pedido (Nombre de la clase y monto) [cite: 70]
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