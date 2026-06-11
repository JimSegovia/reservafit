import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { RegisterDTO, LoginDTO } from '../types/auth.dto.js';

export class AuthController {

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDTO = req.body;

      // Llamamos al servicio
      const nuevoRegistro = await AuthService.registrarUsuario(data);

      res.status(201).json({
        mensaje: 'Usuario registrado con éxito',
        data: nuevoRegistro
      });

    } catch (error: any) {
      // Si el servicio lanza un error (ej. "correo ya registrado"), lo atrapamos aquí
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginDTO = req.body;
      const resultado = await AuthService.loginUsuario(data);

      res.status(200).json({
        mensaje: 'Login exitoso',
        ...resultado
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}