import { z } from 'zod';

export const GenerarCheckoutDto = z.object({
  id_reserva: z.string().uuid()
});

export type GenerarCheckoutInput = z.infer<typeof GenerarCheckoutDto>;

// Este DTO se utiliza para validar la entrada al generar una sesión de checkout, asegurando que el id_reserva sea un UUID válido.
