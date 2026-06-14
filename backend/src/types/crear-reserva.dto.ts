import { z } from 'zod';

export const CrearReservaDto = z.object({
  id_usuario: z.string().uuid("El ID de usuario debe ser un UUID válido"),
  id_detalle_clase: z.string().uuid("El ID del detalle de clase debe ser un UUID válido"),
  numero_cupo: z.number().int().positive("El número de cupo debe ser un entero positivo"),
});

export type CrearReservaType = z.infer<typeof CrearReservaDto>;