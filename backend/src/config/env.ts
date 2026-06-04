import 'dotenv/config'; 
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  
  STRIPE_SECRET_KEY: env.get('STRIPE_SECRET_KEY').required().asString(),
  CLIENT_BASE_URL: env.get('CLIENT_BASE_URL').required().asString(),
};