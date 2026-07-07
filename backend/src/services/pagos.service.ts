import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { envs } from '../config/env.js';
import { logger } from '../config/logger.js';
import { PagoRepository } from '../repositories/pagos.repository.js';
import { MonedasService } from './monedas.service.js';
import { PreferencePayload } from '../types/pagos.dto.js';
import { EstadoPago } from '@prisma/client';

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

  static async verificarEstadoPago(id_reserva: string) {
    const pago = await PagoRepository.buscarPagoPorReserva(id_reserva);
    if (!pago) {
      return { status: 'not_found', message: 'No se encontró pago para esta reserva' };
    }

    if (pago.estado_pago === EstadoPago.Exitoso) {
      return { status: 'approved', message: 'Pago confirmado' };
    }

    if (pago.id_preferencia_mp) {
      try {
        const client = new MercadoPagoConfig({ accessToken: envs.MERCADO_PAGO_ACCESS_TOKEN });
        const paymentService = new Payment(client);

        const searchResponse = await paymentService.search({
          options: { limit: 1, criteria: 'desc' },
        });

        if (searchResponse && (searchResponse as any).results?.length > 0) {
          const mpPayment = (searchResponse as any).results.find(
            (p: any) => p.external_reference === id_reserva
          );
          if (mpPayment && mpPayment.status === 'approved') {
            await PagoRepository.actualizarEstadoPago(pago.id_pago, EstadoPago.Exitoso, String(mpPayment.id));
            await PagoRepository.confirmarReserva(id_reserva);
            const reservaDetalle = await PagoRepository.obtenerReservaYDetalle(id_reserva);
            if (reservaDetalle?.id_usuario) {
              await MonedasService.verificarBonoFidelidad(reservaDetalle.id_usuario);
            }
            logger.info(`Pago verificado y confirmado para reserva ${id_reserva}`);
          }
        }

        return { status: 'pending', message: 'Pago aún no confirmado' };
      } catch (err) {
        logger.error('Error al consultar estado en MercadoPago:', err);
      }
    }

    return { status: 'pending', message: 'Pago aún no procesado' };
  }

  static async procesarWebhook(topic: string, id: string) {
    try {
      const yaProcesado = await PagoRepository.webhookYaProcesado(id);
      if (yaProcesado) {
        logger.info(`Webhook ${id} ya procesado anteriormente. Ignorado.`);
        return;
      }

      const client = new MercadoPagoConfig({ accessToken: envs.MERCADO_PAGO_ACCESS_TOKEN });
      const paymentService = new Payment(client);

      const mpPayment = await paymentService.get({ id });

      if (!mpPayment || !mpPayment.id || !mpPayment.external_reference) {
        logger.warn(`Webhook con ID de pago no encontrado o sin external_reference en MP: ${id}`);
        await PagoRepository.registrarWebhook(id, topic);
        return;
      }

      const id_reserva = mpPayment.external_reference;
      const pago = await PagoRepository.buscarPagoPorReserva(id_reserva);

      if (!pago) {
        logger.warn(`Webhook: no se encontró pago para reserva ${id_reserva}`);
        await PagoRepository.registrarWebhook(id, topic);
        return;
      }

      if (mpPayment.status === 'approved') {
        await PagoRepository.actualizarEstadoPago(pago.id_pago, EstadoPago.Exitoso, String(mpPayment.id));
        await PagoRepository.confirmarReserva(id_reserva);
        const reservaDetalle = await PagoRepository.obtenerReservaYDetalle(id_reserva);
        if (reservaDetalle?.id_usuario) {
          await MonedasService.verificarBonoFidelidad(reservaDetalle.id_usuario);
        }
        logger.info(`Webhook: pago ${id} aprobado. Reserva ${id_reserva} confirmada.`);
      } else if (mpPayment.status === 'rejected' || mpPayment.status === 'cancelled') {
        await PagoRepository.actualizarEstadoPago(pago.id_pago, EstadoPago.Fallido, String(mpPayment.id));
        logger.info(`Webhook: pago ${id} rechazado/cancelado para reserva ${id_reserva}.`);
      }

      await PagoRepository.registrarWebhook(id, topic, pago.id_pago);
    } catch (error: any) {
      logger.error(`Error procesando webhook ${id}:`, error.message);
      await PagoRepository.registrarWebhook(id, topic).catch(() => {});
    }
  }
}