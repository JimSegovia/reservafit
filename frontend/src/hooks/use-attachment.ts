import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

export interface GalleryAsset {
  id: string;
  uri: string;
}

/**
 * Hook para manejar permisos de cámara/galería y carga de fotos recientes.
 * En web usa file inputs; en native usa expo-media-library/expo-camera (dinámicos).
 */
export function useAttachment() {
  const [recentPhotos, setRecentPhotos] = useState<GalleryAsset[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [galleryPermission, setGalleryPermission] = useState<any>(null);

  const mediaLibraryRef = useRef<any>(null);

  // Cargar expo-media-library solo en native
  useEffect(() => {
    if (Platform.OS === 'web') {
      setGalleryPermission('granted');
      return;
    }
    (async () => {
      try {
        const mod = await import('expo-media-library');
        mediaLibraryRef.current = mod;
      } catch (e) {
        console.error('Failed to load expo-media-library:', e);
      }
    })();
  }, []);

  const requestGalleryPermission = useCallback(async () => {
    if (Platform.OS === 'web') {
      return { status: 'granted' } as any;
    }
    const mod = mediaLibraryRef.current;
    if (!mod) {
      const m = await import('expo-media-library');
      mediaLibraryRef.current = m;
      const response = await m.requestPermissionsAsync();
      setGalleryPermission(response?.status ?? null);
      return response;
    }
    const response = await mod.requestPermissionsAsync();
    setGalleryPermission(response?.status ?? null);
    return response;
  }, []);

  const loadRecentPhotos = useCallback(async () => {
    if (Platform.OS === 'web') return;
    const mod = mediaLibraryRef.current;
    if (!mod) return;

    let status = galleryPermission;
    if (status !== 'granted') {
      const response = await mod.MediaLibrary.requestPermissionsAsync();
      status = response?.status;
      setGalleryPermission(status);
    }

    if (status !== 'granted') return;

    setIsLoadingGallery(true);
    try {
      const assetsData = await mod.getAssetsAsync({
        first: 30,
        mediaType: ['photo'],
        sortBy: ['creationTime'],
      });
      const photos: GalleryAsset[] = assetsData.assets.map((asset: any) => ({
        id: asset.id,
        uri: asset.uri,
      }));
      setRecentPhotos(photos);
      setEndCursor(assetsData.endCursor);
      setHasMore(assetsData.hasNextPage);
    } catch (error) {
      console.error('Error loading recent photos:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  }, [galleryPermission]);

  const loadMorePhotos = useCallback(async () => {
    if (Platform.OS === 'web' || isLoadingGallery || !hasMore || !endCursor) return;
    const mod = mediaLibraryRef.current;
    if (!mod) return;
    setIsLoadingGallery(true);
    try {
      const assetsData = await mod.getAssetsAsync({
        first: 30,
        after: endCursor,
        mediaType: ['photo'],
        sortBy: ['creationTime'],
      });
      const photos: GalleryAsset[] = assetsData.assets.map((asset: any) => ({
        id: asset.id,
        uri: asset.uri,
      }));
      setRecentPhotos(prev => [...prev, ...photos]);
      setEndCursor(assetsData.endCursor);
      setHasMore(assetsData.hasNextPage);
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  }, [isLoadingGallery, hasMore, endCursor]);

  const resetGallery = useCallback(() => {
    setRecentPhotos([]);
    setEndCursor(undefined);
    setHasMore(true);
  }, []);

  return {
    recentPhotos,
    isLoadingGallery,
    hasMore,
    loadRecentPhotos,
    loadMorePhotos,
    resetGallery,
    cameraPermission: null,
    requestCameraPermission: async () => {
      if (Platform.OS === 'web') return { granted: true } as any;
      const mod = await import('expo-camera');
      return await mod.Camera.requestCameraPermissionsAsync();
    },
    galleryPermission,
    requestGalleryPermission,
  };
}
