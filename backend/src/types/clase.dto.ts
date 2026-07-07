export interface CreateClaseDTO {
  nombre: string;
  descripcion: string;
  imagen_url?: string;
  precio?: number;
}

export interface UpdateClaseDTO {
  nombre?: string;
  descripcion?: string;
  imagen_url?: string;
  precio?: number;
}