import { Request, Response } from 'express';
import { DetalleReservaService } from '../services/detalleReserva.service.js';

export class DetalleReservaController {
  
  static async getOcupados(req: Request, res: Response): Promise<void> {
    try {
      const id_detalle_clase = req.params.id as string;
      
      const cuposOcupados = await DetalleReservaService.listarCuposOcupados(id_detalle_clase);
      
      res.status(200).json({
        mensaje: 'Cupos consultados con éxito',
        data: cuposOcupados // Retornará algo como: { data: [2, 7, 8] }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}