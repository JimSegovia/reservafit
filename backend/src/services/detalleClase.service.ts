import { DetalleClaseRepository } from '../repositories/detalleClase.repository.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';
import prisma from '../config/prisma.js';

export class DetalleClaseService {
  
  static async verificarCruceDeHorarios(fechaInicio: Date, fechaFin: Date, idDetalleClaseExcluir?: string) {
    const cruces = await prisma.detalleClase.findMany({
      where: {
        AND: [
          {
            fecha_hora_inicio: {
              lt: fechaFin
            }
          },
          {
            fecha_hora_fin: {
              gt: fechaInicio
            }
          },
          ...(idDetalleClaseExcluir ? [{
            id_detalle_clase: {
              not: idDetalleClaseExcluir
            }
          }] : [])
        ]
      },
      include: {
        clase: true
      }
    });

    if (cruces.length > 0) {
      const nombresClases = cruces.map(c => c.clase?.nombre || 'Clase').join(', ');
      throw new Error(`Ya existe una sesión de clase programada en este horario que se cruza con esta sesión (Cruza con: ${nombresClases}).`);
    }
  }

  static async programarClase(data: CreateDetalleClaseDTO) {
    const inicio = new Date(data.fecha_hora_inicio);
    const fin = new Date(data.fecha_hora_fin);
    
    await DetalleClaseService.verificarCruceDeHorarios(inicio, fin);
    
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

    const inicio = data.fecha_hora_inicio ? new Date(data.fecha_hora_inicio) : agendaExistente.fecha_hora_inicio;
    const fin = data.fecha_hora_fin ? new Date(data.fecha_hora_fin) : agendaExistente.fecha_hora_fin;

    if (data.fecha_hora_inicio || data.fecha_hora_fin) {
      await DetalleClaseService.verificarCruceDeHorarios(inicio, fin, id);
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