import Stripe from 'stripe';
import { EstadoPago, EstadoReserva } from '@prisma/client';
import prisma from '../config/prisma';

export class WebhookService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-04-22.dahlia', 
  });
  
  private STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

  async procesarCheckoutSessionCompleted(request: { rawBody: Buffer; signature: string | string[] | undefined }) {
    // 1. SOLUCIÓN: Usamos ReturnType. TypeScript extraerá el tipo exacto que 
    // devuelve constructEvent sin tener que usar el namespace Stripe.Event.
    let event: ReturnType<typeof this.stripe.webhooks.constructEvent>;

    try {
      if (!request.signature) throw new Error('No signature provided');
      
      event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        request.signature,
        this.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error('Invalid Stripe signature');
    }

    const id_evento = event.id;
    
    const yaProcesado = await prisma.webHookProcesado.findFirst({
      where: { id_evento },
    });
    
    if (yaProcesado) {
      return { yaProcesado: true };
    }

    if (event.type !== 'checkout.session.completed') {
      return { procesado: true }; 
    }

    // 2. SOLUCIÓN: Usamos Tipado Estructural. En vez de buscar Stripe.Checkout.Session, 
    // le decimos exactamente qué forma tiene el objeto que necesitamos.
    const session = event.data.object as { id: string; metadata?: Record<string, string> };
    const id_stripe_session = session.id;
    const id_reserva = session.metadata?.id_reserva;

    if (!id_reserva) {
        throw new Error('Metadata id_reserva missing in session');
    }

    await prisma.$transaction(async (tx) => {
      await tx.webHookProcesado.create({
        data: {
          id_evento,
          tipo_evento: event.type,
        },
      });

      const pago = await tx.pago.findUnique({
        where: { id_stripe_sesion: id_stripe_session },
      });

      if (!pago) throw new Error('Pago no encontrado');

      await tx.pago.update({
        where: { id_pago: pago.id_pago },
        data: { estado_pago: EstadoPago.Exitoso },
      });

      await tx.reserva.update({
        where: { id_reserva },
        data: { estado: EstadoReserva.Confirmada },
      });

      await tx.webHookProcesado.update({
        where: { id_evento },
        data: { id_pago: pago.id_pago },
      });
    });

    return { procesado: true };
  }
}