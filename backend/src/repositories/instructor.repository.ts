import prisma from '../config/prisma.js';
import { CreateInstructorDTO } from '../types/instructor.dto.js';

export class InstructorRepository {
  
  static async crear(data: CreateInstructorDTO) {
    // Si tu tabla en schema.prisma se llama "Instructores", usa prisma.instructores
    return prisma.instructor.create({ 
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        foto_url: data.foto_url
      }
    });
  }

  static async obtenerTodos() {
    return prisma.instructor.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  static async buscarPorId(id: string) {
    return prisma.instructor.findUnique({
      where: { id_instructor: id }
    });
  }

  static async actualizar(id: string, data: any) {
    return prisma.instructor.update({
      where: { id_instructor: id },
      data
    });
  }

  static async eliminar(id: string) {
    return prisma.instructor.delete({
      where: { id_instructor: id }
    });
  }
}