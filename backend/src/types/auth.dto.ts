import { Rol } from '@prisma/client';

export interface RegisterDTO {
  nombres: string;
  apellidos: string;
  celular?: string;
  correo_electronico: string;
  contrasena: string;
  rol?: Rol; // Opcional, por defecto Prisma le pondrá 'Cliente'
}

export interface LoginDTO {
  correo_electronico: string;
  contrasena: string;
}