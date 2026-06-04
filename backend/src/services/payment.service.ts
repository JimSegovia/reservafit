// backend/src/services/payment.service.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';

interface PreferencePayload {
  amount: number;
  description: string;
}

export class PaymentService {
  static async createPreference(payload: PreferencePayload) {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN no está configurado en el backend.');
    }

    try {
      const client = new MercadoPagoConfig({ 
        accessToken: accessToken.trim() 
      });

      const preferenceService = new Preference(client);

      // Usamos dominios con estructura válida para que producción no los rebote
      const response = await preferenceService.create({
        body: {
          items: [
            {
              id: 'clase-gym-01',
              title: String(payload.description),
              quantity: 1,
              unit_price: Number(payload.amount),
              currency_id: 'PEN'
            }
          ],
          back_urls: {
            success: 'https://reservafit-test.com/success',
            failure: 'https://reservafit-test.com/classes',
            pending: 'https://reservafit-test.com/classes'
          },
          auto_return: 'approved'
        }
      });

      if (!response || !response.init_point) {
        throw new Error('Mercado Pago no devolvió un init_point válido.');
      }

      return { initPoint: response.init_point };

    } catch (error: any) {
      // Si Mercado Pago te devuelve un objeto de error estructurado, lo imprimimos completo
      if (error.cause && error.cause.message) {
        console.error("❌ Error de validación de Mercado Pago (Cause):", JSON.stringify(error.cause, null, 2));
      } else {
        console.error("❌ Error dentro del SDK de Mercado Pago:", error);
      }
      throw error;
    }
  }
}