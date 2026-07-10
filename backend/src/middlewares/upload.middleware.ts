import multer from 'multer';

// Configuración de Multer: almacenamiento en memoria (sin disco)
// El buffer se stream directo a Cloudinary
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceptar solo tipos de imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

// Instancia de Multer configurada
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB máximo
  },
});
