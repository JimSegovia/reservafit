import { PrismaClient, Prisma, EstadoReserva, Reserva, DetalleReserva } from '@prisma/client';

const prisma = new PrismaClient();

export class ReservaRepository {
  /**
   * Crea una reserva y asegura el cupo usando una transacción interactiva.
   * Lanza un error si el constraint de asiento_unico es violado.
   */
  async crearReserva(
    id_usuario: string,
    id_detalle_clase: string,
    numero_cupo: number
  ): Promise<{ reserva: Reserva; detalleReserva: DetalleReserva }> {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Creamos la cabecera de la reserva con expiración a 10 min
      const reserva = await tx.reserva.create({
        data: {
          id_usuario,
          id_detalle_clase,
          cantidad_cupos: 1,
          estado: EstadoReserva.Pendiente_pago,
          fecha_expiracion_pago: new Date(Date.now() + 10 * 60 * 1000)
        }
      });

      // 2. Intentamos insertar el detalle usando el ID generado
      try {
        const detalleReserva = await tx.detalleReserva.create({
          data: {
            id_reserva: reserva.id_reserva,
            id_detalle_clase,
            numero_cupo,
          }
        });

        return { reserva, detalleReserva };
      } catch (err: any) {
        // Capturamos específicamente la violación de unicidad de Prisma (P2002)
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          throw new Error('Cupo no disponible');
        }
        throw err; // Propagamos cualquier otro error inesperado
      }
    });
  }
}