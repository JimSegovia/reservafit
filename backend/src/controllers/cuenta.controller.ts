import { Request, Response } from 'express';
import { CuentaService } from '../services/cuenta.service.js';

export class CuentaController {
  
  static async getCuenta(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const cuenta = await CuentaService.obtenerDetalleCuenta(id);
      
      res.status(200).json({ data: cuenta });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateAdministrativo(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body; 
      
      const cuentaActualizada = await CuentaService.modificarSeguridadCuenta(id, data);
      
      res.status(200).json({ 
        mensaje: 'Parámetros de la cuenta actualizados', 
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
      
      res.status(200).json({ mensaje: 'Cuenta eliminada exitosamente' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}