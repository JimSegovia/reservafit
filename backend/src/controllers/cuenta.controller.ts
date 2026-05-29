import { Request, Response } from 'express';
import { CuentaService } from '../services/cuenta.service.js';
import { UpdateCuentaDTO } from '../types/cuenta.dto.js';

export class CuentaController {
  
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const cuenta = await CuentaService.obtenerCuenta(id);
      res.status(200).json({ data: cuenta });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data: UpdateCuentaDTO = req.body;
      
      const cuentaActualizada = await CuentaService.modificarCuenta(id, data);
      
      res.status(200).json({
        mensaje: 'Cuenta actualizada con éxito',
        data: cuentaActualizada
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await CuentaService.eliminarCuenta(id);
      res.status(200).json({ mensaje: 'Cuenta eliminada de forma permanente' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}