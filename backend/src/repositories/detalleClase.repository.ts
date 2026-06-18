import prisma from '../config/prisma.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';

export class DetalleClaseRepository {
  
  static async crear(data: CreateDetalleClaseDTO) {
    return prisma.detalleClase.create({
      data: {
        id_clase: data.id_clase,
        id_instructor: data.id_instructor,
        // Convertimos el texto (string) que manda el frontend a un objeto Date real de Node.js
        fecha_hora_inicio: new Date(data.fecha_hora_inicio),
        fecha_hora_fin: new Date(data.fecha_hora_fin),
        tematica: data.tematica || null
      }
    });
  }

  static async obtenerTodos() {
    return prisma.detalleClase.findMany({
      orderBy: { fecha_hora_inicio: 'asc' }, // Ordenamos por fecha (de las más próximas en adelante)
      include: {
        clase: true,       // Trae los datos de la tabla Clases
        instructor: true   // Trae los datos de la tabla Instructores
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