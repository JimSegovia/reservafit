import { Platform } from 'react-native';

/**
 * Convierte URIs con esquema ph:, ph-upload: o assets-library: a archivos JPEG locales
 * usando expo-image-manipulator (import dinámico para evitar errores SSR).
 */
export async function copyAssetToLocal(uri: string): Promise<string> {
  const needsConversion =
    uri.startsWith('ph:') ||
    uri.startsWith('ph-upload:') ||
    uri.startsWith('assets-library:');

  if (!needsConversion) {
    return uri;
  }

  try {
    const ImageManipulator = await import('expo-image-manipulator');
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [],
      {
        compress: 0.92,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error('Error converting asset to local file:', error);
    throw new Error('No se pudo convertir la imagen para subida');
  }
}

export function getImageMimeType(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'heic':
    case 'heif':
      return 'image/heic';
    default:
      return 'image/jpeg';
  }
}

export function generateFileName(prefix: string, uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}.${extension}`;
}
