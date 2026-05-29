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
      orderBy: { nombre: 'asc' } // Ordenamos alfabéticamente por el campo correcto
    });
  }
}