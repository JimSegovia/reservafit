import prisma from '../config/prisma.js';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.dto.js';

export class ClaseRepository {
  
  static async crear(data: CreateClaseDTO) {
    return prisma.clase.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        imagen_url: data.imagen_url
      }
    });
  }

  static async obtenerTodas() {
    return prisma.clase.findMany({
      select: { id_clase: true, nombre: true, descripcion: true, imagen_url: true },
      orderBy: { nombre: 'asc' }
    });
  }

  static async buscarPorId(id: string) {
    return prisma.clase.findUnique({
      where: { id_clase: id },
      select: { id_clase: true, nombre: true, descripcion: true, imagen_url: true }
    });
  }

  static async actualizar(id: string, data: UpdateClaseDTO) {
    return prisma.clase.update({
      where: { id_clase: id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.imagen_url !== undefined && { imagen_url: data.imagen_url })
      }
    });
  }

  static async eliminar(id: string) {
    return prisma.clase.delete({
      where: { id_clase: id }
    });
  }
}