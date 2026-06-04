import Stripe from 'stripe';
import { PagoRepository } from '../repositories/pago.repository.js';
import { envs } from '../config/env.js'; // Importamos tu nuevo objeto validador

// ¡Mira qué limpio queda! TypeScript ya sabe que es un string válido.
const stripe = new Stripe(envs.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia', 
});

const CLIENT_BASE_URL = envs.CLIENT_BASE_URL;

export class PagoService {
  private pagoRepository = new PagoRepository();

  async generarCheckoutSession(id_reserva: string): Promise<{ url: string }> {
    // 1. Buscar datos de la reserva y clase
    const reserva = await this.pagoRepository.obtenerReservaYDetalle(id_reserva);

    if (!reserva || !reserva.detalle_clase || !reserva.detalle_clase.clase) {
      throw new Error('Reserva inválida o no encontrada');
    }

    const { detalle_clase, cantidad_cupos } = reserva;
    const unitAmountCentavos = 2000; // S/ 20.00

    // 2. SOLUCIÓN: Eliminamos la anotación explícita de tipo para evitar el conflicto de namespaces.
    // TypeScript inferirá la estructura correctamente al pasarla en el paso 3.
    const line_items = [
      {
        price_data: {
          currency: 'PEN',
          unit_amount: unitAmountCentavos,
          product_data: {
            name: detalle_clase.clase.nombre,
            description: detalle_clase.clase.descripcion,
            images: detalle_clase.clase.imagen_url ? [detalle_clase.clase.imagen_url] : undefined,
          },
        },
        quantity: cantidad_cupos,
      },
    ];

    // 3. Crear sesión en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items, // TypeScript valida la forma aquí directamente de manera segura
      success_url: `${CLIENT_BASE_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_BASE_URL}/pago-cancelado`,
      metadata: {
        id_reserva,
      },
    });

    // 4. Registrar el pago en base de datos (estado pendiente)
    await this.pagoRepository.crearPagoConCheckoutSession({
      id_reserva,
      id_stripe_sesion: session.id,
      monto: (unitAmountCentavos * cantidad_cupos) / 100, 
      moneda: 'PEN',
    });

    // 5. Retornar URL de Stripe
    return { url: session.url as string };
  }
}