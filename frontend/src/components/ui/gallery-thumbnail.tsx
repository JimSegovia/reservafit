import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

interface GalleryThumbnailProps {
  uri: string;
  selected: boolean;
  onSelect: () => void;
  recyclingKey?: string;
}

/**
 * Thumbnail de imagen de galería con estado de selección
 * Muestra borde verde + check animado cuando está seleccionada
 */
export function GalleryThumbnail({ 
  uri, 
  selected, 
  onSelect,
  recyclingKey 
}: GalleryThumbnailProps) {
  // Animación del check
  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(selected ? 1 : 0, { damping: 15 }),
      transform: [
        { scale: withSpring(selected ? 1 : 0.5, { damping: 15 }) }
      ]
    };
  });

  // Animación del borde
  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: withSpring(selected ? 3 : 0, { damping: 15 }),
    };
  });

  return (
    <TouchableOpacity 
      onPress={onSelect}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View style={[styles.imageContainer, animatedBorderStyle]}>
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={recyclingKey}
          transition={200}
        />
        
        {/* Check overlay cuando está seleccionada */}
        <Animated.View style={[styles.checkContainer, animatedCheckStyle]}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#22C55E', // green-500
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
