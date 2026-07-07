import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { MonedasRepository } from '../repositories/monedas.repository.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { generateReferralCode } from '../utils/referral.util.js';
import { RegisterDTO, LoginDTO } from '../types/auth.dto.js';
import { MailService } from './mail.service.js';
import prisma from '../config/prisma.js';

export class AuthService {
  
  static async registrarUsuario(data: RegisterDTO) {
    const cuentaExistente = await UsuarioRepository.buscarPorCorreo(data.correo_electronico);
    if (cuentaExistente) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const contrasenaHasheada = await hashPassword(data.contrasena);

    const codigoOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracionOtp = new Date(Date.now() + 10 * 60 * 1000);

    const codigoPropio = generateReferralCode();

    let idReferidor: string | undefined;

    if (data.codigo_referido) {
      const referidor = await prisma.usuario.findFirst({
        where: { codigo_referido: data.codigo_referido.toUpperCase() },
        select: { id_usuario: true },
      });

      if (referidor) {
        idReferidor = referidor.id_usuario;
        await MonedasRepository.sumarMonedas(referidor.id_usuario, 1);
        await MonedasRepository.registrarHistorial(referidor.id_usuario, 1, 'ganada_referido');
        console.log(`[AuthService] +1 moneda a referidor ${referidor.id_usuario} por código ${data.codigo_referido}`);
      }
    }

    const result = await UsuarioRepository.crearUsuarioConCuenta(data, contrasenaHasheada, codigoOtp, expiracionOtp, codigoPropio, idReferidor);

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

  static async solicitarRestablecimiento(correo: string) {
    const cuenta = await UsuarioRepository.buscarPorCorreo(correo);
    if (!cuenta) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      return { mensaje: 'Si el correo existe, recibirás un código de restablecimiento.' };
    }

    const codigoOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracionOtp = new Date(Date.now() + 10 * 60 * 1000);

    await UsuarioRepository.actualizarOtp(correo, codigoOtp, expiracionOtp);

    MailService.enviarCodigoRestablecimiento(correo, codigoOtp).catch((err) => {
      console.error('[AuthService] Error de envío de correo de restablecimiento en segundo plano:', err);
    });

    return { mensaje: 'Si el correo existe, recibirás un código de restablecimiento.' };
  }

  static async restablecerContrasena(correo: string, codigo: string, nuevaContrasena: string) {
    const cuenta = await UsuarioRepository.buscarPorCorreo(correo);
    if (!cuenta) {
      throw new Error('La cuenta no existe.');
    }

    if (!cuenta.codigo_otp || !cuenta.expiracion_otp) {
      throw new Error('No se ha solicitado ningún código de restablecimiento.');
    }

    if (cuenta.codigo_otp !== codigo) {
      throw new Error('El código de verificación es incorrecto.');
    }

    if (new Date() > cuenta.expiracion_otp) {
      throw new Error('El código de verificación ha expirado. Por favor, solicita uno nuevo.');
    }

    const contrasenaHasheada = await hashPassword(nuevaContrasena);
    await UsuarioRepository.actualizarContrasena(correo, contrasenaHasheada);
    await UsuarioRepository.limpiarOtp(correo);

    return { mensaje: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' };
  }
}