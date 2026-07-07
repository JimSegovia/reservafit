import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz de Express para poder "pegarle" los datos del usuario a la petición
export interface AuthRequest extends Request {
  usuario?: any; // Idealmente el payload de tu JWT, ej: { id_cuenta: string, rol: string }
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de seguridad.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret';
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'El token proporcionado es inválido o ha expirado.' });
  }
};

export const verificarAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.usuario || req.usuario.rol !== 'Administrador') {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    return;
  }
  next();
};