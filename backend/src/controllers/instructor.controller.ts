import { Request, Response } from 'express';
import { InstructorService } from '../services/instructor.service.js';
import { CreateInstructorDTO } from '../types/instructor.dto.js';

export class InstructorController {
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateInstructorDTO = req.body;
      const nuevoInstructor = await InstructorService.registrarInstructor(data);
      
      res.status(201).json({
        mensaje: 'Instructor creado con éxito',
        data: nuevoInstructor
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const lista = await InstructorService.listarInstructores();
      res.status(200).json({ data: lista });
    } catch (error: any) {
      // Si el error indica que no hay instructores, podemos responder con un arreglo vacío
      if (error.message.includes('No hay instructores')) {
        res.status(200).json({ data: [] });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const instructorActualizado = await InstructorService.modificarInstructor(id, data);
      res.status(200).json({
        mensaje: 'Instructor actualizado con éxito',
        data: instructorActualizado
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await InstructorService.eliminarInstructor(id);
      res.status(200).json({
        mensaje: 'Instructor eliminado con éxito'
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}