import { CuentaRepository } from '../repositories/cuenta.repository.js';
import { UpdateCuentaDTO } from '../types/cuenta.dto.js';
import { hashPassword } from '../utils/bcrypt.util.js';

export class CuentaService {
  
  static async obtenerCuenta(id: string) {
    const cuenta = await CuentaRepository.buscarPorId(id);
    if (!cuenta) {
      throw new Error('La cuenta no existe.');
    }
    
    // Extraemos la contraseña para no enviarla al frontend por seguridad
    const { contrasena, ...cuentaSegura } = cuenta;
    return cuentaSegura;
  }

  static async modificarCuenta(id: string, data: UpdateCuentaDTO) {
    const cuentaExistente = await CuentaRepository.buscarPorId(id);
    if (!cuentaExistente) {
      throw new Error('La cuenta que intentas modificar no existe.');
    }

    // Si el frontend envía una nueva contraseña, debemos encriptarla antes de guardarla
    if (data.contrasena) {
      data.contrasena = await hashPassword(data.contrasena);
    }

    const cuentaActualizada = await CuentaRepository.actualizar(id, data);
    
    // Retornamos los datos sin la contraseña
    const { contrasena, ...cuentaSegura } = cuentaActualizada;
    return cuentaSegura;
  }

  static async eliminarCuenta(id: string) {
    const cuentaExistente = await CuentaRepository.buscarPorId(id);
    if (!cuentaExistente) {
      throw new Error('La cuenta que intentas eliminar no existe.');
    }
    return await CuentaRepository.eliminar(id);
  }
}