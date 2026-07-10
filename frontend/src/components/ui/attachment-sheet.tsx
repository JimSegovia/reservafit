import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { GalleryThumbnail } from './gallery-thumbnail';
import { useAttachment, GalleryAsset } from '@/hooks/use-attachment';

const { width: screenWidth } = Dimensions.get('window');

interface AttachmentSheetProps {
  visible: boolean;
  onClose: () => void;
  onAttach: (uris: string[]) => void;
}

export function AttachmentSheet({ visible, onClose, onAttach }: AttachmentSheetProps) {
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const isWeb = Platform.OS === 'web';

  // File input refs (web only)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const {
    recentPhotos,
    isLoadingGallery,
    hasMore,
    loadRecentPhotos,
    loadMorePhotos,
    resetGallery,
    galleryPermission,
    requestGalleryPermission
  } = useAttachment();

  useEffect(() => {
    if (visible) {
      if (!isWeb) {
        loadRecentPhotos();
      }
      setSelectedUris([]);
    } else {
      if (!isWeb) {
        resetGallery();
      }
      setSelectedUris([]);
    }
  }, [visible]);

  // Crear inputs file para web
  useEffect(() => {
    if (!isWeb || !visible) return;

    // Input para galería
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileChange);
    document.body.appendChild(fileInput);
    fileInputRef.current = fileInput;

    // Input para cámara
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment';
    cameraInput.style.display = 'none';
    cameraInput.addEventListener('change', handleCameraFileChange);
    document.body.appendChild(cameraInput);
    cameraInputRef.current = cameraInput;

    return () => {
      fileInput.removeEventListener('change', handleFileChange);
      document.body.removeChild(fileInput);
      cameraInput.removeEventListener('change', handleCameraFileChange);
      document.body.removeChild(cameraInput);
      fileInputRef.current = null;
      cameraInputRef.current = null;
    };
  }, [visible, isWeb]);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      // Store file reference for upload
      (window as any).__uploadFile = file;
      onAttach([url]);
    }
    target.value = '';
  };

  const handleCameraFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      (window as any).__uploadFile = file;
      onAttach([url]);
    }
    target.value = '';
  };

  const handleSelectPhoto = (uri: string) => {
    setSelectedUris(prev => {
      if (prev.includes(uri)) {
        return prev.filter(u => u !== uri);
      }
      return [uri];
    });
  };

  const handleAttach = () => {
    if (selectedUris.length > 0) {
      onAttach(selectedUris);
    }
  };

  const renderThumbnail = ({ item }: { item: GalleryAsset }) => (
    <GalleryThumbnail
      uri={item.uri}
      selected={selectedUris.includes(item.uri)}
      onSelect={() => handleSelectPhoto(item.uri)}
      recyclingKey={item.id}
    />
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={styles.sheet}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Seleccionar imagen</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color="#1F0F08" />
              </TouchableOpacity>
            </View>

            {isWeb ? (
              <>
                <TouchableOpacity
                  onPress={() => cameraInputRef.current?.click()}
                  style={styles.cameraBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={24} color="#FF7A00" />
                  <Text style={styles.cameraBtnText}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => fileInputRef.current?.click()}
                  style={styles.uploadBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="cloud-upload-outline" size={24} color="#FF7A00" />
                  <Text style={styles.cameraBtnText}>Subir archivo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowCamera(true)}
                  style={styles.cameraBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={24} color="#FF7A00" />
                  <Text style={styles.cameraBtnText}>Tomar foto</Text>
                </TouchableOpacity>

                <View style={styles.galleryContainer}>
                  {galleryPermission !== 'granted' ? (
                    <View style={styles.permissionContainer}>
                      <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                      <Text style={styles.permissionText}>
                        Se necesita permiso para acceder a tus fotos
                      </Text>
                      <TouchableOpacity
                        onPress={requestGalleryPermission}
                        style={styles.permissionButton}
                      >
                        <Text style={styles.permissionButtonText}>Otorgar permiso</Text>
                      </TouchableOpacity>
                    </View>
                  ) : isLoadingGallery && recentPhotos.length === 0 ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#FF7A00" />
                      <Text style={styles.loadingText}>Cargando fotos...</Text>
                    </View>
                  ) : recentPhotos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                      <Text style={styles.emptyText}>No hay fotos disponibles</Text>
                    </View>
                  ) : (
                    <FlatList
                      data={recentPhotos}
                      renderItem={renderThumbnail}
                      keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={styles.galleryGrid}
                      onEndReached={loadMorePhotos}
                      onEndReachedThreshold={0.5}
                      ListFooterComponent={
                        hasMore ? (
                          <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color="#FF7A00" />
                          </View>
                        ) : null
                      }
                    />
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleAttach}
                  disabled={selectedUris.length === 0}
                  style={[
                    styles.attachButton,
                    selectedUris.length === 0 && styles.attachButtonDisabled
                  ]}
                >
                  <Text style={[
                    styles.attachButtonText,
                    selectedUris.length === 0 && styles.attachButtonTextDisabled
                  ]}>
                    {selectedUris.length > 0
                      ? `Adjuntar ${selectedUris.length} foto${selectedUris.length > 1 ? 's' : ''}`
                      : 'Selecciona una foto'
                    }
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Native camera */}
      {showCamera && !isWeb && (
        <InlineCamera
          onCapture={(uri: string) => {
            setShowCamera(false);
            onAttach([uri]);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}

/**
 * Inline camera component with dynamic import of expo-camera (native only).
 */
function InlineCamera({ onCapture, onClose }: { onCapture: (uri: string) => void; onClose: () => void }) {
  const [moduleLoaded, setModuleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<string>('back');
  const cameraRef = useRef<any>(null);
  const CameraViewRef = useRef<any>(null);

  useEffect(() => {
    loadModule();
  }, []);

  async function loadModule() {
    try {
      const mod = await import('expo-camera');
      CameraViewRef.current = mod.CameraView;
      const permResult = await mod.Camera.requestCameraPermissionsAsync();
      if (!permResult.granted) {
        setError('Se necesita permiso para usar la cámara');
      }
    } catch (e) {
      setError('Error al cargar la cámara');
    } finally {
      setModuleLoaded(true);
    }
  }

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: true,
      });
      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (e) {
      setError('Error al tomar foto');
    }
  }, [onCapture]);

  if (!moduleLoaded) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FF7A00" />
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.centerBox}>
            <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadModule} style={styles.permissionButton}>
              <Text style={styles.permissionButtonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const CameraView = CameraViewRef.current;

  return (
    <Modal visible transparent={false} animationType="slide">
      <View style={styles.fullscreen}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={cameraType}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
              style={styles.iconBtn}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture} style={styles.captureOuter}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <View style={styles.iconBtn} />
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 16,
    backgroundColor: '#FFF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFDCC2',
  },
  cameraBtnText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7A00',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  galleryContainer: {
    flex: 1,
    minHeight: 300,
    paddingHorizontal: 16,
  },
  galleryGrid: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  permissionText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  permissionButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF7A00',
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerBox: {
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  smallBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  smallBtnText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  attachButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FF7A00',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  attachButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  attachButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  attachButtonTextDisabled: {
    color: '#9CA3AF',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bottomRow: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
  },
});
