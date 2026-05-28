import { InstructorRepository } from '../repositories/instructor.repository.js';
import { CreateInstructorDTO } from '../types/instructor.dto.js';

export class InstructorService {
  
  static async registrarInstructor(data: CreateInstructorDTO) {
    return await InstructorRepository.crear(data);
  }

  static async listarInstructores() {
    const instructores = await InstructorRepository.obtenerTodos();
    if (instructores.length === 0) {
      throw new Error('No hay instructores registrados actualmente.');
    }
    return instructores;
  }
}