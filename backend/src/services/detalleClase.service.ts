import { DetalleClaseRepository } from '../repositories/detalleClase.repository.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';

export class DetalleClaseService {
  
  static async programarClase(data: CreateDetalleClaseDTO) {
    // Validar que la fecha de inicio no sea mayor a la fecha de fin
    const inicio = new Date(data.fecha_hora_inicio);
    const fin = new Date(data.fecha_hora_fin);

    if (inicio >= fin) {
      throw new Error('La fecha de inicio no puede ser igual o mayor a la fecha de fin');
    }

    return await DetalleClaseRepository.crear(data);
  }

  static async obtenerAgenda() {
    return await DetalleClaseRepository.obtenerTodos();
  }

  static async modificarAgenda(id: string, data: UpdateDetalleClaseDTO) {
    const agendaExistente = await DetalleClaseRepository.buscarPorId(id);
    if (!agendaExistente) {
      throw new Error('El registro en la agenda no existe.');
    }

    // Si nos están enviando ambas fechas para actualizar, validamos que tengan sentido
    if (data.fecha_hora_inicio && data.fecha_hora_fin) {
      const inicio = new Date(data.fecha_hora_inicio);
      const fin = new Date(data.fecha_hora_fin);
      if (inicio >= fin) {
        throw new Error('La fecha de inicio no puede ser mayor o igual a la de fin.');
      }
    }

    return await DetalleClaseRepository.actualizar(id, data);
  }

  static async eliminarDeAgenda(id: string) {
    const agendaExistente = await DetalleClaseRepository.buscarPorId(id);
    if (!agendaExistente) {
      throw new Error('El registro en la agenda no existe.');
    }
    return await DetalleClaseRepository.eliminar(id);
  }
  
}