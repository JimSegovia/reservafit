import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import { RegisterDTO } from '../types/auth.types.js';

export class AuthService {
  
  static async registrarUsuario(data: RegisterDTO) {
    // 1. Verificamos que el correo no exista
    const cuentaExistente = await UsuarioRepository.buscarPorCorreo(data.correo_electronico);
    if (cuentaExistente) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // 2. Encriptamos la contraseña
    const contrasenaHasheada = await hashPassword(data.contrasena);

    // 3. Mandamos a guardar a la base de datos
    const resultado = await UsuarioRepository.crearUsuarioConCuenta(data, contrasenaHasheada);
    
    return resultado;
  }
}