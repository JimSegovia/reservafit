import api from '@/api/api';
import { Platform } from 'react-native';
import { copyAssetToLocal, getImageMimeType, generateFileName } from '@/lib/asset-utils';

async function prepareFormData(imageUri: string): Promise<FormData> {
  const formData = new FormData();

  // Web: convertir blob:// URI a File
  if (Platform.OS === 'web' && imageUri.startsWith('blob:')) {
    // Usar el File almacenado globalmente (AttachmentSheet lo guarda en window.__uploadFile)
    const storedFile = (window as any).__uploadFile as File;
    if (storedFile) {
      formData.append('image', storedFile, generateFileName('upload', storedFile.name));
      return formData;
    }
    // Fallback: fetch blob URI
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = generateFileName('upload', imageUri);
    formData.append('image', blob, fileName);
    return formData;
  }

  // Native: convertir URI ph:// a file:// y crear FormData
  const localUri = await copyAssetToLocal(imageUri);
  const mimeType = getImageMimeType(localUri);
  const fileName = generateFileName('upload', localUri);

  formData.append('image', {
    uri: localUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return formData;
}

export async function uploadInstructorPhoto(
  instructorId: string,
  imageUri: string
): Promise<string> {
  const formData = await prepareFormData(imageUri);

  const response = await api.post(`/instructores/${instructorId}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });

  return response.data.data.foto_url;
}

export async function uploadClassImage(
  classId: string,
  imageUri: string
): Promise<string> {
  const formData = await prepareFormData(imageUri);

  const response = await api.post(`/clases/${classId}/imagen`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });

  return response.data.data.imagen_url;
}
