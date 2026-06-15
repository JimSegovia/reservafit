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

  static async modificarInstructor(id: string, data: any) {
    const instructorExistente = await InstructorRepository.buscarPorId(id);
    if (!instructorExistente) {
      throw new Error('El instructor que intentas modificar no existe.');
    }
    return await InstructorRepository.actualizar(id, data);
  }

  static async eliminarInstructor(id: string) {
    const instructorExistente = await InstructorRepository.buscarPorId(id);
    if (!instructorExistente) {
      throw new Error('El instructor que intentas eliminar no existe.');
    }
    return await InstructorRepository.eliminar(id);
  }
}