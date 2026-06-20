import prisma from '../config/prisma.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';

export class DetalleClaseRepository {
  
  static async crear(data: CreateDetalleClaseDTO) {
    return prisma.detalleClase.create({
      data: {
        id_clase: data.id_clase,
        id_instructor: data.id_instructor,
        fecha_hora_inicio: new Date(data.fecha_hora_inicio),
        fecha_hora_fin: new Date(data.fecha_hora_fin),
        dia: data.dia,
        tematica: data.tematica || null
      }
    });
  }

  static async obtenerTodos() {
    return prisma.detalleClase.findMany({
      orderBy: { fecha_hora_inicio: 'asc' },
      include: {
        clase: true,
        instructor: true,
        _count: {
          select: { detalles_reserva: true }
        }
      }
    });
  }

  static async buscarPorId(id: string) {
    return prisma.detalleClase.findUnique({
      where: { id_detalle_clase: id }
    });
  }

  static async actualizar(id: string, data: UpdateDetalleClaseDTO) {
    // Preparamos los datos aislando las fechas para convertirlas
    const datosActualizar: any = { ...data };

    if (data.fecha_hora_inicio) {
      datosActualizar.fecha_hora_inicio = new Date(data.fecha_hora_inicio);
    }
    if (data.fecha_hora_fin) {
      datosActualizar.fecha_hora_fin = new Date(data.fecha_hora_fin);
    }

    return prisma.detalleClase.update({
      where: { id_detalle_clase: id },
      data: datosActualizar
    });
  }

  static async eliminar(id: string) {
    return prisma.detalleClase.delete({
      where: { id_detalle_clase: id }
    });
  }

}