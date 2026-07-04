import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function PagoPendienteScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const handleGoHome = () => {
    router.replace('/(client)/(tabs)');
  };

  const content = (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: isWeb ? 0 : 24,
        paddingVertical: 16,
        paddingBottom: 30
      }}
      showsVerticalScrollIndicator={Platform.OS === 'web' && width >= 768}
    >
      <View className={isWeb ? 'w-full max-w-md self-center' : 'w-full'}>
        <View className="items-center mb-8">
          <Animated.View entering={ZoomIn.duration(200).springify()} className="w-20 h-20 rounded-full bg-amber-500 items-center justify-center shadow-lg shadow-amber-500/20">
            <Ionicons name="time-outline" size={52} color="white" />
          </Animated.View>
          <Animated.Text entering={FadeInDown.duration(200).delay(50)} className="text-xl font-extrabold text-black text-center mt-6">
            Pago en proceso
          </Animated.Text>
          <Animated.Text entering={FadeInDown.duration(200).delay(80)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-3 text-[13px] leading-relaxed px-4`}>
            Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme. Esto puede tomar unos minutos.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.duration(200).delay(110)} className="mb-10 mx-2">
          <TouchableOpacity
            onPress={handleGoHome}
            activeOpacity={0.7}
            className="w-full bg-primary py-3 rounded-2xl items-center shadow-lg shadow-orange-500/20"
          >
            <Text className="text-white text-[15px] font-bold">Ir al inicio</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="" subtitle="">{content}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
