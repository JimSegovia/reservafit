import { ClaseRepository } from '../repositories/clase.repository.js';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.dto.js';

export class ClaseService {
  
  static async registrarClase(data: CreateClaseDTO) {
    return await ClaseRepository.crear(data);
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
    return await ClaseRepository.actualizar(id, data);
  }

  static async eliminarClase(id: string) {
    const claseExistente = await ClaseRepository.buscarPorId(id);
    if (!claseExistente) {
      throw new Error('La clase que intentas eliminar no existe.');
    }
    return await ClaseRepository.eliminar(id);
  }
}