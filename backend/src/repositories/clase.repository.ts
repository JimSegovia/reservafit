import prisma from '../config/prisma.js';
import { CreateClaseDTO } from '../types/clase.dto.js';

export class ClaseRepository {
  
  static async crear(data: CreateClaseDTO) {
    return prisma.clase.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        dia: data.dia,
        tematica: data.tematica,
        imagen_url: data.imagen_url
      }
    });
  }

  static async obtenerTodas() {
    return prisma.clase.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  static async buscarPorId(id: string) {
    return prisma.clase.findUnique({
      where: { id_clase: id }
    });
  }

  static async actualizar(id: string, data: any) {
    return prisma.clase.update({
      where: { id_clase: id },
      data
    });
  }

  static async eliminar(id: string) {
    return prisma.clase.delete({
      where: { id_clase: id }
    });
  }
}