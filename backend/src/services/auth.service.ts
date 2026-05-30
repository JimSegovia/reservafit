import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { RegisterDTO, LoginDTO } from '../types/auth.types.js';

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

  static async loginUsuario(data: LoginDTO) {
    // 1. Buscar la cuenta por correo
    const cuenta = await UsuarioRepository.buscarPorCorreo(data.correo_electronico);
    if (!cuenta) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Verificar la contraseña
    const isPasswordValid = await comparePassword(data.contrasena, cuenta.contrasena);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Generar token JWT
    const token = generateToken({
      id_cuenta: cuenta.id_cuenta,
      id_usuario: cuenta.id_usuario,
      rol: cuenta.rol
    });

    const { contrasena, ...cuentaSinPassword } = cuenta;

    return {
      token,
      cuenta: cuentaSinPassword
    };
  }
}