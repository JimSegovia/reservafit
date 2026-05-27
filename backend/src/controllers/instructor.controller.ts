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
      res.status(404).json({ error: error.message });
    }
  }
}