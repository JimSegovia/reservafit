import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // req.body ya viene 100% validado por Zod
      const result = await AuthService.registrarUsuario(req.body);
      
      res.status(201).json({ 
        mensaje: 'Usuario registrado con éxito', 
        data: result 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.loginUsuario(req.body);
      
      res.status(200).json({ 
        mensaje: 'Inicio de sesión exitoso', 
        data: result 
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message }); // 401: No Autorizado
    }
  }
}