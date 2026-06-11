import { z } from 'zod';
import { Rol } from '@prisma/client';

// 1. Escudo Zod para el Registro
export const registerSchema = z.object({
  nombres: z.string().min(2, 'El nombre es muy corto').max(100),
  apellidos: z.string().min(2, 'El apellido es muy corto').max(100),
  celular: z.string().max(20, 'El celular no puede exceder los 20 caracteres').optional(),
  correo_electronico: z.string().email('Debe ser un correo electrónico válido').max(150),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(150),
  rol: z.nativeEnum(Rol).optional(),
});

// 2. Escudo Zod para el Login
export const loginSchema = z.object({
  correo_electronico: z.string().email('Debe ser un correo electrónico válido'),
  contrasena: z.string().min(1, 'La contraseña es obligatoria'),
});

// 3. Tipos exportados automáticamente para usarlos en tus Services y Repositories
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;