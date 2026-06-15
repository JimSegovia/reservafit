import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validarEsquema = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next(); // Si todo está bien, dejamos pasar la petición
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Error de validación de datos',
          detalles: error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
          })),
        });
        return;
      }
      next(error); 
    }
  };
};