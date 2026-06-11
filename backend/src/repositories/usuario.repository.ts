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
      where: { correo_electronico: correo }
    });
  }

  // 2. Crear Usuario y Cuenta en una sola transacción
  static async crearUsuarioConCuenta(data: RegisterDTO, contrasenaHasheada: string) {
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
          rol: data.rol || 'Cliente'
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
        cuenta: {
          select: { correo_electronico: true, rol: true, estado_verificacion: true }
        },
        reservas: {
          include: { detalle_clase: { include: { clase: true } } }
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
}