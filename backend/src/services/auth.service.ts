import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { RegisterDTO, LoginDTO } from '../types/auth.dto.js';
import { MailService } from './mail.service.js';

export class AuthService {
  
  static async registrarUsuario(data: RegisterDTO) {
    // 1. Verificamos que el correo no exista
    const cuentaExistente = await UsuarioRepository.buscarPorCorreo(data.correo_electronico);
    if (cuentaExistente) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // 2. Encriptamos la contraseña
    const contrasenaHasheada = await hashPassword(data.contrasena);

    // 3. Generamos código OTP (6 dígitos aleatorios)
    const codigoOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracionOtp = new Date(Date.now() + 10 * 60 * 1000); // Válido por 10 minutos

    // 4. Guardamos en base de datos (Usuario + Cuenta + OTP)
    const result = await UsuarioRepository.crearUsuarioConCuenta(data, contrasenaHasheada, codigoOtp, expiracionOtp);

    // 5. Enviamos el correo de verificación de manera asíncrona
    // No bloquea la respuesta del registro si falla el envío de mail
    MailService.enviarCodigoVerificacion(data.correo_electronico, codigoOtp).catch((err) => {
      console.error('[AuthService] Error de envío de correo de registro en segundo plano:', err);
    });

    return result;
  }

  static async loginUsuario(data: LoginDTO) {
    // 1. Buscar la cuenta por correo (incluye la relación con Usuario)
    const cuenta = await UsuarioRepository.buscarPorCorreo(data.correo_electronico);
    if (!cuenta) {
      throw new Error('Credenciales inválidas.');
    }

    // 2. Verificar la contraseña
    const isPasswordValid = await comparePassword(data.contrasena, cuenta.contrasena);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.');
    }

    // 2.5. Verificar que la cuenta esté activa
    if (!cuenta.estado_verificacion) {
      throw new Error('Tu cuenta no está verificada. Por favor, ingresa el código enviado a tu correo.');
    }

    // 3. Generar Token JWT inyectando los datos vitales
    const token = generateToken({ 
      id_usuario: cuenta.id_usuario, 
      id_cuenta: cuenta.id_cuenta, 
      rol: cuenta.rol 
    });

    // 4. Retornamos el token y los datos de la cuenta (ocultando la contraseña)
    const { contrasena, ...cuentaSinPassword } = cuenta;
    return { token, cuenta: cuentaSinPassword };
  }

  static async verificarCuenta(correo: string, codigo: string) {
    // 1. Buscar la cuenta
    const cuenta = await UsuarioRepository.buscarPorCorreo(correo);
    if (!cuenta) {
      throw new Error('La cuenta no existe.');
    }

    // 2. Comprobar si ya está activa
    if (cuenta.estado_verificacion) {
      return { mensaje: 'La cuenta ya se encuentra verificada.' };
    }

    // 3. Validar OTP
    if (!cuenta.codigo_otp || !cuenta.expiracion_otp) {
      throw new Error('No se ha solicitado ningún código de verificación para esta cuenta.');
    }

    if (cuenta.codigo_otp !== codigo) {
      throw new Error('El código de verificación ingresado es incorrecto.');
    }

    if (new Date() > cuenta.expiracion_otp) {
      throw new Error('El código de verificación ha expirado. Por favor, solicita uno nuevo.');
    }

    // 4. Activar la cuenta
    return await UsuarioRepository.activarCuenta(correo);
  }
}