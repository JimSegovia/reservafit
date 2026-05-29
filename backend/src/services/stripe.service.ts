import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Falta STRIPE_SECRET_KEY en variables de entorno');
}

export const stripe = new Stripe(stripeSecretKey);

export function toAmountInCents(amount: number): number {
  return Math.round(amount * 100);
}
