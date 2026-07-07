import { Request, Response } from 'express';
import { MonedasService } from '../services/monedas.service.js';
import { EstadoReserva, Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import { MonedasRepository } from '../repositories/monedas.repository.js';
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

      const authReq = req as any;
      if (authReq.usuario?.id_usuario !== id_usuario) {
        res.status(403).json({ success: false, error: 'No puedes pagar con monedas de otro usuario.' });
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

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const reserva = await tx.reserva.findUnique({
          where: { id_reserva },
          select: { estado: true, id_usuario: true, cantidad_cupos: true },
        });

        if (!reserva) throw new Error('Reserva no encontrada');

        const estabaConfirmada = reserva.estado === EstadoReserva.Confirmada;

        await tx.reserva.update({
          where: { id_reserva },
          data: { estado: EstadoReserva.Cancelada_Por_Gimnasio },
        });

        await tx.detalleReserva.deleteMany({
          where: { id_reserva },
        });

        if (estabaConfirmada) {
          const totalMonedas = 5 * reserva.cantidad_cupos;
          await tx.monedasCliente.upsert({
            where: { id_usuario: reserva.id_usuario },
            create: { id_usuario: reserva.id_usuario, saldo_monedas: totalMonedas },
            update: { saldo_monedas: { increment: totalMonedas } },
          });
          await tx.historialMonedas.create({
            data: { id_usuario: reserva.id_usuario, cantidad: totalMonedas, tipo: tipoMotivo, id_reserva },
          });
          logger.info(`Monedas devueltas: reserva ${id_reserva}, usuario ${reserva.id_usuario}, motivo ${tipoMotivo}, total ${totalMonedas}`);
        }
      });

      res.status(200).json({ success: true, message: 'Reserva cancelada.' });
    } catch (error: any) {
      logger.error(`Error cancelando reserva: ${error.message}`);
      if (error.message === 'Reserva no encontrada') {
        res.status(404).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
