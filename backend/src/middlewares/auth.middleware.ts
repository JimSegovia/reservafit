import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz de Express para poder "pegarle" los datos del usuario a la petición
export interface AuthRequest extends Request {
  usuario?: any; // Idealmente el payload de tu JWT, ej: { id_cuenta: string, rol: string }
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Buscamos la cabecera "Authorization"
  const authHeader = req.headers['authorization'];
  
  // 2. Extraemos el token (Formato esperado: "Bearer eyJhbGciOiJIUz...")
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de seguridad.' });
    return;
  }

  try {
    // IMPORTANTE: Asegúrate de tener JWT_SECRET en tu archivo config/env.ts
    const secret = process.env.JWT_SECRET || 'super_secret'; 
    
    // 3. Verificamos la firma y expiración del token
    const decoded = jwt.verify(token, secret);
    
    // 4. Inyectamos los datos decodificados en la petición
    req.usuario = decoded;
    
    // 5. ¡Pase adelante!
    next();
  } catch (error) {
    res.status(403).json({ error: 'El token proporcionado es inválido o ha expirado.' });
  }
};