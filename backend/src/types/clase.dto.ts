export interface CreateClaseDTO {
  nombre: string;
  descripcion: string;
  dia: string;
  imagen_url?: string;
}

export interface UpdateClaseDTO {
  nombre?: string;
  descripcion?: string;
  dia?: string;
  imagen_url?: string;
}