import jwt from 'jsonwebtoken';
import { envs } from '../config/env.js'; // Usamos nuestra configuración blindada

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, envs.JWT_SECRET, {
    expiresIn: '1d' // El token expira en 1 día
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, envs.JWT_SECRET);
};