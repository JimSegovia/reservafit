import { Resend } from 'resend';
import { envs } from '../config/env.js';
import { logger } from '../config/logger.js';

const resend = new Resend(envs.RESEND_API_KEY);

export class MailService {
  static async enviarCodigoVerificacion(correo: string, codigo: string): Promise<boolean> {
    try {
      logger.info(`[MailService] Enviando código OTP a ${correo}...`);
      
      const response = await resend.emails.send({
        from: 'ReservaFit <onboarding@resend.dev>', // Dominio de prueba gratuito de Resend
        to: [correo],
        subject: 'Código de Verificación - ReservaFit',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #FF7A00; font-size: 28px; margin: 0;">ReservaFit</h1>
            </div>
            <h2 style="color: #333333; font-size: 20px; border-bottom: 2px solid #FF7A00; padding-bottom: 8px;">¡Verifica tu dirección de correo electrónico!</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hola,</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">Gracias por registrarte en ReservaFit. Para completar la creación de tu cuenta y activar tu perfil, por favor ingresa el siguiente código de seguridad (OTP) de 6 dígitos en la aplicación:</p>
            <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #1F2937;">${codigo}</span>
            </div>
            <p style="font-size: 14px; color: #6B7280; line-height: 1.5;">Este código expirará en 10 minutos. Si tú no solicitaste este registro, por favor ignora este mensaje.</p>
            <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">ReservaFit App &copy; 2026. Todos los derechos reservados.</p>
          </div>
        `,
      });

      if (response.error) {
        logger.error('[MailService] Error retornado por la API de Resend:', response.error);
        return false;
      }

      logger.info(`[MailService] Código OTP enviado con éxito a ${correo}. ID de correo: ${response.data?.id}`);
      return true;
    } catch (error) {
      logger.error('[MailService] Error crítico al intentar enviar el correo electrónico:', error);
      return false;
    }
  }
}
