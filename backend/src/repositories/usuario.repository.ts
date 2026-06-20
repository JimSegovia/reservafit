import prisma from '../config/prisma.js';
import { RegisterDTO } from '../types/auth.dto.js';
import { UpdateUsuarioDTO } from '../types/usuario.dto.js';
import { Prisma } from '@prisma/client';
export class UsuarioRepository {

  // ====================================================================
  // MÉTODOS DE AUTENTICACIÓN 
  // ====================================================================

  // 1. Verificar si el correo ya está registrado en Cuentas
  static async buscarPorCorreo(correo: string) {
    return prisma.cuenta.findUnique({
      where: { correo_electronico: correo },
      include: { usuario: true }
    });
  }

  // 2. Crear Usuario y Cuenta en una sola transacción
  static async crearUsuarioConCuenta(
    data: RegisterDTO, 
    contrasenaHasheada: string,
    codigoOtp: string,
    expiracionOtp: Date
  ) {
    // Agregamos 'Prisma.TransactionClient' al parámetro 'tx' para que TypeScript y Railway no arrojen error
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          celular: data.celular,
        }
      });

      const nuevaCuenta = await tx.cuenta.create({
        data: {
          id_usuario: nuevoUsuario.id_usuario,
          correo_electronico: data.correo_electronico,
          contrasena: contrasenaHasheada,
          rol: data.rol || 'Cliente',
          codigo_otp: codigoOtp,
          expiracion_otp: expiracionOtp,
          estado_verificacion: false
        }
      });

      const { contrasena, ...cuentaSinPassword } = nuevaCuenta;
      return { usuario: nuevoUsuario, cuenta: cuentaSinPassword };
    });
  }

  // ====================================================================
  // MÉTODOS DE GESTIÓN DE PERFIL 
  // ====================================================================

  static async buscarPorId(id: string) {
    return prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: {
        cuentas: {
          select: { correo_electronico: true, rol: true, estado_verificacion: true }
        },
        reservas: {
          include: { 
            detalle_clase: { 
              include: { 
                clase: {
                  // Le decimos explícitamente qué columnas traer, sin tocar 'dia'
                  select: { id_clase: true, nombre: true, descripcion: true, imagen_url: true }
                } 
              } 
            } 
          }
        }
      }
    });
  }

  static async actualizar(id: string, data: UpdateUsuarioDTO) {
    return prisma.usuario.update({
      where: { id_usuario: id },
      data
    });
  }

  static async eliminar(id: string) {
    return prisma.usuario.delete({
      where: { id_usuario: id }
    });
  }

  static async obtenerTodos() {
    return prisma.usuario.findMany({
      include: { cuentas: { select: { correo_electronico: true, rol: true } } }
    });
  }

  // 3. Activar cuenta y limpiar OTP
  static async activarCuenta(correo: string) {
    return prisma.cuenta.update({
      where: { correo_electronico: correo },
      data: {
        estado_verificacion: true,
        codigo_otp: null,
        expiracion_otp: null
      }
    });
  }
}