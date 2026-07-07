import { DetalleClaseRepository } from '../repositories/detalleClase.repository.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';
import prisma from '../config/prisma.js';

export class DetalleClaseService {
  
  static async programarClase(data: CreateDetalleClaseDTO) {
    return await DetalleClaseRepository.crear(data);
  }

  static async obtenerAgenda() {
    return await DetalleClaseRepository.obtenerTodos();
  }

  static async modificarAgenda(id: string, data: UpdateDetalleClaseDTO) {
    const agendaExistente = await DetalleClaseRepository.buscarPorId(id);
    if (!agendaExistente) {
      throw new Error('El registro en la agenda no existe.');
    }
    return await DetalleClaseRepository.actualizar(id, data);
  }

  static async eliminarDeAgenda(id: string) {
    const agendaExistente = await DetalleClaseRepository.buscarPorId(id);
    if (!agendaExistente) {
      throw new Error('El registro en la agenda no existe.');
    }

    // Find all reservations for this session schedule
    const reservas = await prisma.reserva.findMany({
      where: { id_detalle_clase: id }
    });
    const idsReservas = reservas.map(r => r.id_reserva);

    // Find all payments for these reservations
    const pagos = await prisma.pago.findMany({
      where: { id_reserva: { in: idsReservas } }
    });
    const idsPagos = pagos.map(p => p.id_pago);

    // Delete related refunds
    if (idsPagos.length > 0) {
      await prisma.reembolso.deleteMany({
        where: { id_pago: { in: idsPagos } }
      });
      // Delete webhook processed records
      await prisma.webHookProcesado.deleteMany({
        where: { id_pago: { in: idsPagos } }
      });
    }

    // Delete payments
    await prisma.pago.deleteMany({
      where: { id_reserva: { in: idsReservas } }
    });

    // Delete reservation details
    await prisma.detalleReserva.deleteMany({
      where: { id_reserva: { in: idsReservas } }
    });

    // Delete reservations
    await prisma.reserva.deleteMany({
      where: { id_reserva: { in: idsReservas } }
    });

    // Finally delete from agenda
    return await DetalleClaseRepository.eliminar(id);
  }
  
}