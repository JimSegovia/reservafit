import prisma from '../config/prisma.js';
import { RegisterDTO } from '../types/auth.types.js';

export class UsuarioRepository {
  
  // 1. Verificar si el correo ya está registrado en Cuentas
  static async buscarPorCorreo(correo: string) {
    return prisma.cuenta.findUnique({
      where: { correo_electronico: correo }
    });
  }

  // 2. Crear Usuario y Cuenta en una sola transacción
  static async crearUsuarioConCuenta(data: RegisterDTO, contrasenaHasheada: string) {
    // Usamos una transacción para que, si falla la cuenta, el usuario tampoco se cree
    return prisma.$transaction(async (tx) => {
      
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
          contrasena: contrasenaHasheada, // ¡Guardamos el hash, no el texto plano!
          rol: data.rol || 'Cliente'
        }
      });

      // Retornamos los datos combinados, pero OMITIMOS la contraseña por seguridad
      const { contrasena, ...cuentaSinPassword } = nuevaCuenta;
      return { usuario: nuevoUsuario, cuenta: cuentaSinPassword };
    });
  }
}