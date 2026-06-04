// backend/src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export const handlePaymentCheckout = async (req: Request, res: Response) => {
  try {
    const { amount, description } = req.body;
    
    // Log para verificar qué datos recibe el backend desde el cliente
    console.log("Pedida de checkout recibida:", { amount, description });

    const result = await PaymentService.createPreference({ amount, description });
    
    return res.status(200).json({
      success: true,
      initPoint: result.initPoint
    });
  } catch (error: any) {
    // ESTO ES LO CRÍTICO: Imprime en la consola negra de Node el por qué da error 500
    console.error("❌ Error en handlePaymentCheckout:", error.message || error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al procesar el pago'
    });
  }
};