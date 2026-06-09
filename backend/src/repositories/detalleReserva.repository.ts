import prisma from '../config/prisma.js';
import { CreateDetalleReservaDTO } from '../types/detalleReserva.dto.js';

export class DetalleReservaRepository {
  // Conocer qué asientos/cupos ya están tomados para una clase específica
  static async obtenerCuposOcupados(id_detalle_clase: string) {
    const detalles = await prisma.detalleReserva.findMany({
      where: { id_detalle_clase },
      select: { numero_cupo: true }
    });
    return detalles.map(d => d.numero_cupo);
  }

  static async crear(data: CreateDetalleReservaDTO) {
    return prisma.detalleReserva.create({ data });
  }

  // Si la reserva se cancela por timeout, liberamos los cupos
  static async eliminarPorReserva(id_reserva: string) {
    return prisma.detalleReserva.deleteMany({
      where: { id_reserva }
    });
  }
}