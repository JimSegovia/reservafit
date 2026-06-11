import { z } from 'zod';

// Escudo Zod para actualizar el perfil
export const updateUsuarioSchema = z.object({
  nombres: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
  apellidos: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100).optional(),
  celular: z.string().max(20, 'Número demasiado largo').optional(),
});

export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;