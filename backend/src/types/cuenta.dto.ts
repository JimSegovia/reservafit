import { Rol } from '@prisma/client';

export interface UpdateCuentaDTO {
  correo_electronico?: string;
  contrasena?: string; // Usamos "contrasena" sin 'ñ' como lo mapeaste en Prisma
  rol?: Rol;
  estado_verificacion?: boolean;
  codigo_otp?: string | null;
  expiracion_otp?: Date | null;
}