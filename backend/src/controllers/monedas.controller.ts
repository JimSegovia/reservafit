import { Request, Response } from 'express';
import { MonedasService } from '../services/monedas.service.js';
import { EstadoReserva } from '@prisma/client';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export class MonedasController {
  static async handleObtenerMonedas(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = String(req.params.id_usuario);
      const result = await MonedasService.obtenerMonedas(id_usuario);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error obteniendo monedas: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async handlePagarConMonedas(req: Request, res: Response): Promise<void> {
    try {
      const { id_reserva, id_usuario } = req.body;
      if (!id_reserva || !id_usuario) {
        res.status(400).json({ error: 'Faltan id_reserva o id_usuario' });
        return;
      }
      const result = await MonedasService.pagarConMonedas(id_reserva, id_usuario);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error(`Error pagando con monedas: ${error.message}`);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async handleCancelarReserva(req: Request, res: Response): Promise<void> {
    try {
      const id_reserva = String(req.params.id_reserva);
      const { motivo } = req.body;
      const tipoMotivo = (motivo === 'admin') ? 'cancelacion_admin' : 'cancelacion_cliente';

      await prisma.reserva.update({
        where: { id_reserva },
        data: { estado: EstadoReserva.Cancelada_Por_Gimnasio },
      });

      await prisma.detalleReserva.deleteMany({
        where: { id_reserva },
      });

      await MonedasService.devolverMonedas(id_reserva, tipoMotivo);

      res.status(200).json({ success: true, message: 'Reserva cancelada. Se devolvieron 5 monedas.' });
    } catch (error: any) {
      logger.error(`Error cancelando reserva: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
