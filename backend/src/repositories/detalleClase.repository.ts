import prisma from '../config/prisma.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';

function obtenerDiaSemana(fecha: Date): string {
  const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}

export class DetalleClaseRepository {
  
  static async crear(data: CreateDetalleClaseDTO) {
    const inicio = new Date(data.fecha_hora_inicio);
    return prisma.detalleClase.create({
      data: {
        id_clase: data.id_clase,
        id_instructor: data.id_instructor,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: new Date(data.fecha_hora_fin),
        Dia: obtenerDiaSemana(inicio),
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
    const { dia, ...resto } = data as any;
    const datosActualizar: any = { ...resto };

    if (data.fecha_hora_inicio) {
      const inicio = new Date(data.fecha_hora_inicio);
      datosActualizar.fecha_hora_inicio = inicio;
      datosActualizar.Dia = obtenerDiaSemana(inicio);
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