import { UsuarioRepository } from '../repositories/usuario.repository.js';

export class AdminService {
  static async listarClientes(search?: string, page?: number, limit?: number) {
    return UsuarioRepository.obtenerClientesConMonedas(search, page, limit);
  }
}
