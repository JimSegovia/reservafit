import { DetalleReservaRepository } from '../repositories/detalleReserva.repository.js';
import { CreateDetalleReservaDTO } from '../types/detalleReserva.dto.js';

export class DetalleReservaService {

  static async listarCuposOcupados(id_detalle_clase: string) {
    if (!id_detalle_clase) {
      throw new Error('El ID del detalle de la clase es obligatorio.');
    }
    
    return await DetalleReservaRepository.obtenerCuposOcupados(id_detalle_clase);
  }

  static async asignarCupo(data: CreateDetalleReservaDTO) {
    // 1. Validamos que tengamos todos los datos necesarios
    if (!data.id_reserva || !data.id_detalle_clase || !data.numero_cupo) {
      throw new Error('Faltan datos obligatorios para asignar el cupo físico.');
    }

    // 2. Verificamos que el asiento no haya sido tomado justo ahora
    const cuposActuales = await this.listarCuposOcupados(data.id_detalle_clase);
    
    if (cuposActuales.includes(data.numero_cupo)) {
      throw new Error(`El cupo número ${data.numero_cupo} ya ha sido ocupado por otro usuario.`);
    }

    // 3. Si está libre, lo registramos en la base de datos
    return await DetalleReservaRepository.crear(data);
  }

  static async liberarCuposDeReserva(id_reserva: string) {
    if (!id_reserva) {
      throw new Error('El ID de la reserva es obligatorio para liberar sus cupos.');
    }
    
    // Elimina todos los asientos físicos amarrados a esa reserva cancelada
    return await DetalleReservaRepository.eliminarPorReserva(id_reserva);
  }
}