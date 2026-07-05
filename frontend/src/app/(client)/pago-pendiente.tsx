import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import api from '@/api/api';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function PagoPendienteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fetchReservations = useAppStore((state) => state.fetchReservations);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const externalReference = (params.external_reference as string) || '';
  const [attempts, setAttempts] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!externalReference) return;

    const checkPayment = async () => {
      try {
        const response = await api.get(`/pagos/verify/${externalReference}`);
        if (response.data.status === 'approved') {
          setConfirmed(true);
          if (Platform.OS === 'web') localStorage.removeItem('pending_payment_reserva_id');
          await fetchReservations();
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            router.replace('/(client)/pago-exitoso');
          }, 1500);
        }
      } catch (err) {
        console.error('Error verificando pago:', err);
      }
      setAttempts((prev) => prev + 1);
    };

    checkPayment();
    intervalRef.current = setInterval(checkPayment, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [externalReference]);

  const handleGoHome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
          {confirmed ? (
            <>
              <Animated.View entering={ZoomIn.duration(200).springify()} className="w-20 h-20 rounded-full bg-green-500 items-center justify-center shadow-lg shadow-green-500/20">
                <Ionicons name="checkmark" size={52} color="white" />
              </Animated.View>
              <Animated.Text entering={FadeInDown.duration(200).delay(50)} className="text-xl font-extrabold text-black text-center mt-6">
                ¡Pago confirmado!
              </Animated.Text>
              <Animated.Text entering={FadeInDown.duration(200).delay(80)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-3 text-[13px] leading-relaxed px-4`}>
                Redirigiendo...
              </Animated.Text>
            </>
          ) : (
            <>
              <Animated.View entering={ZoomIn.duration(200).springify()} className="w-20 h-20 rounded-full bg-amber-500 items-center justify-center shadow-lg shadow-amber-500/20">
                <ActivityIndicator size="large" color="white" />
              </Animated.View>
              <Animated.Text entering={FadeInDown.duration(200).delay(50)} className="text-xl font-extrabold text-black text-center mt-6">
                Pago en proceso
              </Animated.Text>
              <Animated.Text entering={FadeInDown.duration(200).delay(80)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-3 text-[13px] leading-relaxed px-4`}>
                Estamos verificando tu pago. Te notificaremos cuando se confirme.
                {attempts > 0 ? `\n\nVerificación #${attempts}...` : ''}
              </Animated.Text>
            </>
          )}
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
