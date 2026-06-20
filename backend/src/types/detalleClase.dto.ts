import { EstadoClase } from '@prisma/client';

export interface CreateDetalleClaseDTO {
  id_clase: string;
  id_instructor: string;
  fecha_hora_inicio: string; 
  fecha_hora_fin: string;
  dia: string;
  tematica?: string;
}

export interface UpdateDetalleClaseDTO {
  id_clase?: string;
  id_instructor?: string;
  fecha_hora_inicio?: string;
  fecha_hora_fin?: string;
  estado?: EstadoClase;
  cupos?: number;
  dia?: string;
  tematica?: string;
}