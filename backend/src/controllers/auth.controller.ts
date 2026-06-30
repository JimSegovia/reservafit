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

  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { correo_electronico, codigo_otp } = req.body;
      const result = await AuthService.verificarCuenta(correo_electronico, codigo_otp);
      
      res.status(200).json({ 
        mensaje: 'Cuenta verificada exitosamente', 
        data: result 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { correo_electronico } = req.body;
      const result = await AuthService.solicitarRestablecimiento(correo_electronico);

      res.status(200).json({
        mensaje: result.mensaje,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { correo_electronico, codigo_otp, contrasena } = req.body;
      const result = await AuthService.restablecerContrasena(correo_electronico, codigo_otp, contrasena);

      res.status(200).json({
        mensaje: result.mensaje,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}