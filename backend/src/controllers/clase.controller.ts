import { Request, Response } from 'express';
import { ClaseService } from '../services/clase.service.js';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.dto.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

export class ClaseController {
  
  // Crear una nueva clase
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion, imagen_url, precio } = req.body;
      const data: CreateClaseDTO = { nombre, descripcion, imagen_url, precio };
      const nuevaClase = await ClaseService.registrarClase(data);
      
      res.status(201).json({
        mensaje: 'Clase base creada con éxito',
        data: nuevaClase
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener el catálogo de clases
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const lista = await ClaseService.listarClases();
      res.status(200).json({ data: lista });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Actualizar una clase existente
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { nombre, descripcion, imagen_url, precio } = req.body;
      const data: UpdateClaseDTO = { nombre, descripcion, imagen_url, precio };
      
      const claseActualizada = await ClaseService.modificarClase(id, data);
      
      res.status(200).json({
        mensaje: 'Clase actualizada con éxito',
        data: claseActualizada
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Eliminar una clase
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      
      await ClaseService.eliminarClase(id);
      
      res.status(200).json({
        mensaje: 'Clase eliminada de forma permanente'
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Subir imagen de una clase
  static async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      
      // Verificar que se recibió un archivo
      if (!req.file) {
        res.status(400).json({ error: 'No se recibió ningún archivo de imagen' });
        return;
      }

      // Verificar que la clase existe
      const claseExistente = await ClaseService.listarClases()
        .then(clases => clases.find(c => c.id_clase === id))
        .catch(() => null);
      
      if (!claseExistente) {
        res.status(404).json({ error: 'Clase no encontrada' });
        return;
      }

      // Si la clase ya tiene una imagen, eliminarla de Cloudinary
      if (claseExistente.imagen_url) {
        const oldPublicId = CloudinaryService.extractPublicId(claseExistente.imagen_url);
        if (oldPublicId) {
          await CloudinaryService.deleteImage(oldPublicId).catch(() => {
            // Si falla la eliminación, continuar con la subida de la nueva imagen
          });
        }
      }

      // Subir nueva imagen a Cloudinary
      const publicId = `clase-${id}`;
      const imageUrl = await CloudinaryService.uploadImage(req.file, publicId);

      // Actualizar la clase con la URL de la imagen
      await ClaseService.modificarClase(id, { imagen_url: imageUrl });

      res.status(200).json({
        mensaje: 'Imagen de la clase subida con éxito',
        data: { imagen_url: imageUrl }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}