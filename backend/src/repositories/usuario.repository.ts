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
    expiracionOtp: Date,
    codigoReferidoPropio?: string,
    idReferidor?: string
  ) {
    // Agregamos 'Prisma.TransactionClient' al parámetro 'tx' para que TypeScript y Railway no arrojen error
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          celular: data.celular,
          codigo_referido: codigoReferidoPropio,
          id_referidor: idReferidor,
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
            detalles_reserva: true,
            detalle_clase: {
              include: {
                clase: {
                  select: { id_clase: true, nombre: true, descripcion: true, imagen_url: true, precio: true }
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

  static async obtenerClientesConMonedas(search?: string, page = 1, limit = 20) {
    const where: any = {
      cuentas: { some: { rol: 'Cliente' } },
    };

    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { cuentas: { some: { correo_electronico: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [clientes, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: {
          id_usuario: true,
          nombres: true,
          apellidos: true,
          celular: true,
          codigo_referido: true,
          cuentas: { select: { correo_electronico: true } },
          monedas_cliente: { select: { saldo_monedas: true } },
        },
        orderBy: { nombres: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.usuario.count({ where }),
    ]);

    return {
      data: clientes.map((c) => ({
        id_usuario: c.id_usuario,
        nombres: c.nombres,
        apellidos: c.apellidos,
        email: c.cuentas[0]?.correo_electronico || '',
        celular: c.celular,
        codigo_referido: c.codigo_referido,
        saldo_monedas: c.monedas_cliente?.saldo_monedas ?? 0,
      })),
      total,
      page,
      limit,
    };
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

  static async actualizarOtp(correo: string, codigoOtp: string, expiracionOtp: Date) {
    return prisma.cuenta.update({
      where: { correo_electronico: correo },
      data: {
        codigo_otp: codigoOtp,
        expiracion_otp: expiracionOtp,
      }
    });
  }

  static async actualizarContrasena(correo: string, contrasenaHasheada: string) {
    return prisma.cuenta.update({
      where: { correo_electronico: correo },
      data: {
        contrasena: contrasenaHasheada,
      }
    });
  }

  static async limpiarOtp(correo: string) {
    return prisma.cuenta.update({
      where: { correo_electronico: correo },
      data: {
        codigo_otp: null,
        expiracion_otp: null,
      }
    });
  }

  static async buscarPorCodigoReferido(codigo: string) {
    return prisma.usuario.findFirst({
      where: { codigo_referido: codigo },
    });
  }

  static async asignarCodigoReferido(id: string, codigo: string) {
    return prisma.usuario.update({
      where: { id_usuario: id },
      data: { codigo_referido: codigo },
    });
  }
}