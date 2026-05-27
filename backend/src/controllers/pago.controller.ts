import { Request, Response } from 'express';
import { PagoService } from '../services/pago.service';
import { GenerarCheckoutDto } from '../types/generar-checkout.dto.js';

const pagoService = new PagoService();

export class PagoController {
  async generarCheckoutSession(req: Request, res: Response): Promise<void> {
    // Permite recibir id_reserva por body o params
    const id_reserva: unknown = req.body.id_reserva ?? req.params.id_reserva;
    
    const parseResult = GenerarCheckoutDto.safeParse({ id_reserva });
    
    if (!parseResult.success) {
      res.status(400).json({
        error: 'id_reserva inválido',
        detalles: parseResult.error.flatten(),
      });
      return;
    }

    try {
      const { url } = await pagoService.generarCheckoutSession(parseResult.data.id_reserva);
      
      // Devuelve la URL para que la aplicación de escritorio redirija al usuario al navegador
      res.status(200).json({ url });
    } catch (err) {
      res.status(500).json({
        error: 'Error al generar la sesión de pago',
        detalles: err instanceof Error ? err.message : err,
      });
    }
  }
}