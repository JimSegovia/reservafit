import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

// En Express, un middleware de error siempre debe tener exactamente estos 4 parámetros
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Registramos el error de forma profesional
  logger.error(`Error en la ruta: ${req.method} ${req.url}`, err);

  // 2. Respondemos al frontend
  // Ocultamos los detalles técnicos si estamos en producción por seguridad
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal, intenta de nuevo.',
  });
};