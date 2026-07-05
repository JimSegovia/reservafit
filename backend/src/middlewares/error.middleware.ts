import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

const ERROR_STATUS_MAP: Record<string, number> = {
  'no existe': 404,
  'no encontrad': 404,
  'ya está registrado': 409,
  'no disponible': 409,
  'saldo insuficiente': 400,
  'inválido': 400,
  'obligatorio': 400,
  'debe tener': 400,
  'debe ser': 400,
};

function getErrorStatus(message: string): number {
  const lower = message.toLowerCase();
  for (const [pattern, status] of Object.entries(ERROR_STATUS_MAP)) {
    if (lower.includes(pattern)) return status;
  }
  return 500;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Error en la ruta: ${req.method} ${req.url}: ${err.message}`);

  const status = getErrorStatus(err.message);

  res.status(status).json({
    error: process.env.NODE_ENV === 'production' && status === 500
      ? 'Error interno del servidor'
      : err.message,
  });
};