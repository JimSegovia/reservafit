import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service.js';

export class UsuarioController {
  
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const perfil = await UsuarioService.obtenerPerfil(id);
      res.status(200).json({ data: perfil });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;
      
      const perfilActualizado = await UsuarioService.modificarPerfil(id, data);
      res.status(200).json({ mensaje: 'Perfil actualizado con éxito', data: perfilActualizado });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await UsuarioService.eliminarPerfil(id);
      res.status(200).json({ mensaje: 'Usuario y cuenta eliminados permanentemente' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioService.listarTodos();
      res.status(200).json({ data: usuarios });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}