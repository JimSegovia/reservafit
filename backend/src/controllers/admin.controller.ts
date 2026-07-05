import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { MonedasRepository } from '../repositories/monedas.repository.js';
import { logger } from '../config/logger.js';

export class AdminController {
  static async getAllClientes(req: Request, res: Response): Promise<void> {
    try {
      const search = String(req.query.search || '');
      const page = parseInt(String(req.query.page || '1'));
      const limit = parseInt(String(req.query.limit || '20'));
      const result = await AdminService.listarClientes(search, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error listando clientes: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async ajustarMonedas(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, cantidad, motivo } = req.body;

      if (!id_usuario || !cantidad || !motivo) {
        res.status(400).json({ error: 'Faltan id_usuario, cantidad o motivo' });
        return;
      }

      const cantidadNum = parseInt(cantidad);
      if (isNaN(cantidadNum) || cantidadNum === 0) {
        res.status(400).json({ error: 'Cantidad inválida' });
        return;
      }

      if (cantidadNum > 0) {
        await MonedasRepository.sumarMonedas(id_usuario, cantidadNum);
      } else {
        await MonedasRepository.restarMonedas(id_usuario, Math.abs(cantidadNum));
      }

      await MonedasRepository.registrarHistorial(id_usuario, cantidadNum, 'ajuste_admin');

      const saldo = await MonedasRepository.obtenerSaldo(id_usuario);

      logger.info(`Admin ajustó ${cantidadNum} monedas a usuario ${id_usuario}. Motivo: ${motivo}`);

      res.status(200).json({ success: true, nuevo_saldo: saldo.saldo_monedas });
    } catch (error: any) {
      logger.error(`Error ajustando monedas: ${error.message}`);
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
