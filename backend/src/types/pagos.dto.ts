import { z } from 'zod';

// Escudo para la validación de la petición HTTP con Zod
export const checkoutSchema = z.object({
  id_reserva: z.string().uuid('El ID de reserva no es un formato válido'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().min(3, 'La descripción es obligatoria'),
});

// Estructura de datos para transferir entre Controlador y Servicio (Mercado Pago)
export interface PreferencePayload {
  id_reserva: string;
  amount: number;
  description: string;
}

// Estructura de datos para transferir entre Servicio y Repositorio (Base de Datos)
export interface CreatePagoDTO {
  id_reserva: string;
  id_preferencia_mp: string;
  monto: number;
  metodo_pago: 'Yape' | 'Efectivo';
}