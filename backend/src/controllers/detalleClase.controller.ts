import { Request, Response } from 'express';
import { DetalleClaseService } from '../services/detalleClase.service.js';
import { CreateDetalleClaseDTO, UpdateDetalleClaseDTO } from '../types/detalleClase.dto.js';

export class DetalleClaseController {
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateDetalleClaseDTO = req.body;
      const nuevaAgenda = await DetalleClaseService.programarClase(data);
      
      res.status(201).json({
        mensaje: 'Clase programada en la agenda exitosamente',
        data: nuevaAgenda
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const agenda = await DetalleClaseService.obtenerAgenda();
      res.status(200).json({ data: agenda });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data: UpdateDetalleClaseDTO = req.body;
      
      const agendaActualizada = await DetalleClaseService.modificarAgenda(id, data);
      
      res.status(200).json({
        mensaje: 'Agenda actualizada con éxito',
        data: agendaActualizada
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      
      await DetalleClaseService.eliminarDeAgenda(id);
      
      res.status(200).json({
        mensaje: 'Clase eliminada de la agenda permanentemente'
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
  
}