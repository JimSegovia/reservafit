import { z } from 'zod';

export const CrearReservaDto = z.object({
  id_usuario: z.string().uuid(),
  id_detalle_clase: z.string().uuid(),
  numero_cupo: z.number().int().min(1),
});

export type CrearReservaInput = z.infer<typeof CrearReservaDto>;