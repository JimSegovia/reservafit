import { z } from 'zod';
import { Rol } from '@prisma/client';

// =========================================================
// 1. ESQUEMAS ZOD (Lo que recibimos desde el Frontend vía HTTP)
// =========================================================

// Esquema para que un Administrador actualice el estado o rol de una cuenta
export const updateCuentaAdminSchema = z.object({
  rol: z.nativeEnum(Rol).optional(),
  estado_verificacion: z.boolean().optional(),
});

// =========================================================
// 2. INTERFACES INTERNAS (Lo que usa tu backend internamente)
// =========================================================

// Interfaz pura de TypeScript para el Repositorio. 
// Tiene todos los campos porque el servidor sí necesita modificar el OTP, contraseñas, etc.
export interface UpdateCuentaDTO {
  correo_electronico?: string;
  contrasena?: string; 
  rol?: Rol;
  estado_verificacion?: boolean;
  codigo_otp?: string | null;
  expiracion_otp?: Date | null;
}