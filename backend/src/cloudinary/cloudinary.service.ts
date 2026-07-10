import cloudinary, { CLOUDINARY_UPLOAD_FOLDER } from './cloudinary.config.js';
import { Readable } from 'stream';
import { logger } from '../config/logger.js';

export class CloudinaryService {
  /**
   * Sube una imagen a Cloudinary desde un buffer de Multer
   * @param file - Archivo de Multer (con buffer en memoria)
   * @param publicId - Identificador único para la imagen en Cloudinary
   * @returns URL segura de la imagen subida
   */
  static async uploadImage(
    file: Express.Multer.File,
    publicId: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Crear un stream legible desde el buffer del archivo
      const stream = Readable.from(file.buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_UPLOAD_FOLDER,
          public_id: publicId,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          overwrite: true, // Sobrescribir si ya existe
        },
        (error, result) => {
          if (error) {
            logger.error('Error subiendo imagen a Cloudinary:', error);
            reject(new Error(`Error subiendo imagen: ${error.message}`));
            return;
          }

          if (!result || !result.secure_url) {
            reject(new Error('No se recibió URL segura de Cloudinary'));
            return;
          }

          logger.info(`Imagen subida exitosamente: ${result.secure_url}`);
          resolve(result.secure_url);
        }
      );

      // Pipear el stream al upload stream de Cloudinary
      stream.pipe(uploadStream);
    });
  }

  /**
   * Elimina una imagen de Cloudinary por su public_id
   * @param publicId - Identificador de la imagen (sin la carpeta)
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      const fullPublicId = `${CLOUDINARY_UPLOAD_FOLDER}/${publicId}`;
      const result = await cloudinary.uploader.destroy(fullPublicId);
      
      if (result.result === 'ok') {
        logger.info(`Imagen eliminada de Cloudinary: ${fullPublicId}`);
      } else {
        logger.warn(`No se pudo eliminar la imagen ${fullPublicId}: ${result.result}`);
      }
    } catch (error: any) {
      logger.error('Error eliminando imagen de Cloudinary:', error);
      throw new Error(`Error eliminando imagen: ${error.message}`);
    }
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   * @param secureUrl - URL segura de Cloudinary
   * @returns public_id (sin extensión ni carpeta)
   */
  static extractPublicId(secureUrl: string): string | null {
    try {
      // URL formato: https://res.cloudinary.com/{cloud}/image/upload/{folder}/{publicId}.{ext}
      const urlParts = secureUrl.split('/');
      const fileName = urlParts[urlParts.length - 1]; // Ej: "instructor-123.jpg"
      
      if (!fileName) return null;
      
      // Remover la extensión
      const publicId = fileName.split('.')[0];
      return publicId;
    } catch (error) {
      logger.error('Error extrayendo publicId de URL:', error);
      return null;
    }
  }
}
