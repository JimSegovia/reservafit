import 'dotenv/config'; 
import * as env from 'env-var';

export const envs = {
  // Puerto del servidor
  PORT: env.get('PORT').default(3000).asPortNumber(),
  
  // Base de datos
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  
  // URLs del proyecto
  CLIENT_BASE_URL: env.get('CLIENT_BASE_URL').required().asString(),
  
  // Pasarela de Pagos (Mercado Pago)
  MERCADO_PAGO_ACCESS_TOKEN: env.get('MERCADO_PAGO_ACCESS_TOKEN').required().asString(),
  MERCADO_PAGO_CLIENT_SECRET: env.get('MERCADO_PAGO_CLIENT_SECRET').default('').asString(),

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),

  // Servicio de Correos (SendGrid)
  SENDGRID_API_KEY: env.get('SENDGRID_API_KEY').required().asString(),
  SENDGRID_FROM_EMAIL: env.get('SENDGRID_FROM_EMAIL').required().asString(),
  SENDGRID_FROM_NAME: env.get('SENDGRID_FROM_NAME').default('ReservaFit').asString()
};