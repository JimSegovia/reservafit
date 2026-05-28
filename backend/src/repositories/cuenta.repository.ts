import prisma from '../config/prisma.js';
import { UpdateCuentaDTO } from '../types/cuenta.dto.js';

export class CuentaRepository {
  
  static async buscarPorId(id: string) {
    return prisma.cuenta.findUnique({
      where: { id_cuenta: id },
      include: { 
        usuario: true // Traemos automáticamente los datos de la tabla Usuarios
      } 
    });
  }

  static async actualizar(id: string, data: UpdateCuentaDTO) {
    return prisma.cuenta.update({
      where: { id_cuenta: id },
      data
    });
  }

  static async eliminar(id: string) {
    // Gracias al onDelete: Cascade de tu diagrama, eliminar la cuenta o al usuario limpiará ambas tablas
    return prisma.cuenta.delete({
      where: { id_cuenta: id }
    });
  }
}