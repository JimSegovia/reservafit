import { ClaseRepository } from '../repositories/clase.repository.js';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.dto.js';
import prisma from '../config/prisma.js';
import { Prisma } from '@prisma/client';
import { logger } from '../config/logger.js';

export class ClaseService {
  
  static async registrarClase(data: CreateClaseDTO) {
    const clase = await ClaseRepository.crear(data);
    return clase;
  }

  static async listarClases() {
    const clases = await ClaseRepository.obtenerTodas();
    if (clases.length === 0) {
      throw new Error('No hay clases registradas en el catálogo.');
    }
    return clases;
  }

  static async modificarClase(id: string, data: UpdateClaseDTO) {
    const claseExistente = await ClaseRepository.buscarPorId(id);
    if (!claseExistente) {
      throw new Error('La clase que intentas modificar no existe.');
    }

    const claseActualizada = await ClaseRepository.actualizar(id, data);

    // If description changed, we might need to update the instructor in the DetalleClase
    let instructorName = '';
    try {
      if (data.descripcion && data.descripcion.startsWith('{')) {
        const parsed = JSON.parse(data.descripcion);
        instructorName = parsed.instructorName;
      }
    } catch (e) {
      console.error('Error parsing class description JSON:', e);
    }

    if (instructorName) {
      // Find or create instructor
      let instructor = await prisma.instructor.findFirst({
        where: {
          OR: [
            { nombre: { contains: instructorName, mode: 'insensitive' } },
            { apellidos: { contains: instructorName, mode: 'insensitive' } }
          ]
        }
      });

      if (!instructor) {
        const names = instructorName.split(' ');
        instructor = await prisma.instructor.create({
          data: {
            nombre: names[0] || 'Profesor',
            apellidos: names.slice(1).join(' ') || 'General',
            foto_url: JSON.stringify({ specialty: 'General', status: 'Activo' })
          }
        });
      }

      // Update instructor in DetalleClase
      await prisma.detalleClase.updateMany({
        where: { id_clase: id },
        data: { id_instructor: instructor.id_instructor }
      });
    }

    return claseActualizada;
  }

  static async eliminarClase(id: string) {
    const claseExistente = await ClaseRepository.buscarPorId(id);
    if (!claseExistente) {
      throw new Error('La clase que intentas eliminar no existe.');
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const detallesClase = await tx.detalleClase.findMany({
        where: { id_clase: id }
      });
      
      const idsDetalleClase = detallesClase.map(d => d.id_detalle_clase);

      const reservas = await tx.reserva.findMany({
        where: { id_detalle_clase: { in: idsDetalleClase } }
      });
      const idsReservas = reservas.map(r => r.id_reserva);

      const pagos = await tx.pago.findMany({
        where: { id_reserva: { in: idsReservas } }
      });
      const idsPagos = pagos.map(p => p.id_pago);

      if (idsPagos.length > 0) {
        await tx.reembolso.deleteMany({ where: { id_pago: { in: idsPagos } } });
        await tx.webHookProcesado.deleteMany({ where: { id_pago: { in: idsPagos } } });
        await tx.pago.deleteMany({ where: { id_reserva: { in: idsReservas } } });
      }

      if (idsReservas.length > 0) {
        await tx.detalleReserva.deleteMany({ where: { id_reserva: { in: idsReservas } } });
        await tx.reserva.deleteMany({ where: { id_reserva: { in: idsReservas } } });
      }

      await tx.detalleClase.deleteMany({ where: { id_clase: id } });

      await tx.clase.delete({ where: { id_clase: id } });
    });

    logger.info(`Clase ${id} eliminada exitosamente con cascada.`);
    return true;
  }
}