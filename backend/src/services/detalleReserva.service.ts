import { DetalleReservaRepository } from '../repositories/detalleReserva.repository.js';

export class DetalleReservaService {
  
  static async listarCuposOcupados(id_detalle_clase: string) {
    if (!id_detalle_clase) {
      throw new Error('El ID del detalle de la clase es obligatorio.');
    }
    
    // Retorna un arreglo simple de números, ej: [1, 5, 12, 14]
    const cupos = await DetalleReservaRepository.obtenerCuposOcupados(id_detalle_clase);
    return cupos;
  }

  // Nota: La lógica de crear y eliminar Detalles de Reserva la haremos 
  // más adelante usando prisma.$transaction() dentro de ReservaService.
}