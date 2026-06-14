import { CuentaRepository } from '../repositories/cuenta.repository.js';
import { UpdateCuentaDTO } from '../types/cuenta.dto.js';
import { hashPassword } from '../utils/bcrypt.util.js';

export class CuentaService {
  
  static async obtenerDetalleCuenta(id_cuenta: string) {
    const cuenta = await CuentaRepository.buscarPorId(id_cuenta);
    if (!cuenta) {
      throw new Error('La cuenta no existe.');
    }
    
    // Extraemos la contraseña para no enviarla al frontend por seguridad
    const { contrasena, ...cuentaSegura } = cuenta;
    return cuentaSegura;
  }

  static async modificarSeguridadCuenta(id_cuenta: string, data: UpdateCuentaDTO) {
    const cuentaExistente = await CuentaRepository.buscarPorId(id_cuenta);
    if (!cuentaExistente) {
      throw new Error('La cuenta que intentas modificar no existe.');
    }

    // VITAL: Si el frontend o el administrador envía una nueva contraseña, la encriptamos
    if (data.contrasena) {
      data.contrasena = await hashPassword(data.contrasena);
    }

    const cuentaActualizada = await CuentaRepository.actualizar(id_cuenta, data);
    
    // Retornamos los datos limpios sin el hash de la contraseña
    const { contrasena, ...cuentaSegura } = cuentaActualizada;
    return cuentaSegura;
  }

  static async eliminarCuenta(id_cuenta: string) {
    const cuentaExistente = await CuentaRepository.buscarPorId(id_cuenta);
    if (!cuentaExistente) {
      throw new Error('La cuenta que intentas eliminar no existe.');
    }
    
    await CuentaRepository.eliminar(id_cuenta);
    return true;
  }
}