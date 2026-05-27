import { Request, Response } from 'express';
import { ReservaService } from '../services/reserva.service';
import { CrearReservaDto } from '../types/crear-reserva.dto';

const reservaService = new ReservaService();

export class ReservaController {
  async registrarReserva(req: Request, res: Response): Promise<void> {
    // Validación estricta del body
    const parseResult = CrearReservaDto.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Datos de entrada inválidos',
        detalles: parseResult.error.flatten(),
      });
      return;
    }

    const data = parseResult.data;

    try {
      const { reserva, detalleReserva } = await reservaService.registrarReservaInicial(data);
      
      // Retorna el JSON completo para la interfaz de escritorio
      res.status(201).json({
        reserva,
        detalleReserva,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Cupo no disponible') {
        res.status(409).json({ error: 'Cupo no disponible' });
        return;
      }
      
      res.status(500).json({ error: 'Error interno al registrar la reserva.' });
    }
  }
}