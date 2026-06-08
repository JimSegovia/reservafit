import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { UpdateUsuarioDTO } from '../types/usuario.dto.js';

export class UsuarioService {
  
  static async obtenerPerfil(id: string) {
    const usuario = await UsuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }
    return usuario;
  }

  static async modificarPerfil(id: string, data: UpdateUsuarioDTO) {
    const usuarioExistente = await UsuarioRepository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('El usuario que intentas modificar no existe.');
    }
    
    return await UsuarioRepository.actualizar(id, data);
  }

  static async eliminarPerfil(id: string) {
    const usuarioExistente = await UsuarioRepository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('El usuario que intentas eliminar no existe.');
    }
    
    await UsuarioRepository.eliminar(id);
    return true;
  }

  static async listarTodos() {
    return await UsuarioRepository.obtenerTodos();
  }
}