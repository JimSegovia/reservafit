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

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),

  // Servicio de Correos (Nodemailer + Gmail SMTP)
  GMAIL_USER: env.get('GMAIL_USER').required().asString(),
  GMAIL_APP_PASSWORD: env.get('GMAIL_APP_PASSWORD').required().asString()
};