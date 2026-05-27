import { Request, Response } from 'express';
import { ClaseService } from '../services/clase.service.js';
import { CreateClaseDTO } from '../types/clase.dto.js';

export class ClaseController {
  
  // Crear una nueva clase
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateClaseDTO = req.body;
      const nuevaClase = await ClaseService.registrarClase(data);
      
      res.status(201).json({
        mensaje: 'Clase base creada con éxito',
        data: nuevaClase
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener el catálogo de clases
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const lista = await ClaseService.listarClases();
      res.status(200).json({ data: lista });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Actualizar una clase existente
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;
      
      const claseActualizada = await ClaseService.modificarClase(id, data);
      
      res.status(200).json({
        mensaje: 'Clase actualizada con éxito',
        data: claseActualizada
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Eliminar una clase
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      
      await ClaseService.eliminarClase(id);
      
      res.status(200).json({
        mensaje: 'Clase eliminada de forma permanente'
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}