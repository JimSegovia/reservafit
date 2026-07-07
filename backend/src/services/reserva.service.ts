import { EstadoReserva } from '@prisma/client';
import { ReservaRepository } from '../repositories/reserva.repository.js';

export class ReservaService {
  private reservaRepository = new ReservaRepository();

  /**
   * Registra una reserva inicial y su detalle de cupo elegido.
   * @throws Error('Cupo no disponible') si el cupo ya fue tomado en ese instante.
   */
  async registrarReservaInicial(input: {
    id_usuario: string;
    id_detalle_clase: string;
    numero_cupo: number;
  }) {
    const { id_usuario, id_detalle_clase, numero_cupo } = input;
    
    // Aquí el servicio delega la operación atómica al repositorio
    return await this.reservaRepository.crearReserva(
      id_usuario,
      id_detalle_clase,
      numero_cupo
    );
  }

  async listarTodas() {
    return await this.reservaRepository.obtenerTodas();
  }

  async registrarReservaBatch(input: {
    id_usuario: string;
    id_detalle_clase: string;
    numeros_cupo: number[];
  }) {
    return await this.reservaRepository.crearReservaBatch(
      input.id_usuario,
      input.id_detalle_clase,
      input.numeros_cupo
    );
  }

  async modificarEstado(id: string, estado: EstadoReserva) {
    return await this.reservaRepository.actualizarEstado(id, estado);
  }
}