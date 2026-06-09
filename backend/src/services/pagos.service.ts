import { MercadoPagoConfig, Preference } from 'mercadopago';
import { envs } from '../config/env.js';
import { logger } from '../config/logger.js';
import { PagoRepository } from '../repositories/pagos.repository.js';
import { PreferencePayload } from '../types/pagos.dto.js'; // <-- Importación limpia desde DTOs

export class PagoService {
  
  static async generarCheckout(payload: PreferencePayload) {
    try {
      const client = new MercadoPagoConfig({ 
        accessToken: envs.MERCADO_PAGO_ACCESS_TOKEN 
      });

      const preferenceService = new Preference(client);

      const response = await preferenceService.create({
        body: {
          items: [
            {
              id: payload.id_reserva,
              title: payload.description,
              quantity: 1,
              unit_price: payload.amount,
              currency_id: 'PEN'
            }
          ],
          back_urls: {
            success: `${envs.CLIENT_BASE_URL}/pago-exitoso`,
            failure: `${envs.CLIENT_BASE_URL}/pago-fallido`,
            pending: `${envs.CLIENT_BASE_URL}/pago-pendiente`
          },
          auto_return: 'approved',
          external_reference: payload.id_reserva,
        }
      });

      if (!response.id || !response.init_point) {
        throw new Error('Mercado Pago no devolvió los datos necesarios de la preferencia.');
      }

      await PagoRepository.crearIntentoDePago({
        id_reserva: payload.id_reserva,
        id_preferencia_mp: response.id,
        monto: payload.amount,
        metodo_pago: 'Yape'
      });

      logger.info(`Checkout generado exitosamente para la reserva: ${payload.id_reserva}`);

      return { initPoint: response.init_point };

    } catch (error: any) {
      logger.error('Error al generar la preferencia de Mercado Pago:', error);
      throw new Error('No se pudo generar el enlace de pago seguro.');
    }
  }
}