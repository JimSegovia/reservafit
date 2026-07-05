import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import api from '@/api/api';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function PagoExitosoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reservations = useAppStore((state) => state.reservations);
  const fetchReservations = useAppStore((state) => state.fetchReservations);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const externalReference = (params.external_reference as string) || '';

  const [verifying, setVerifying] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const storedId = Platform.OS === 'web' ? localStorage.getItem('pending_payment_reserva_id') : null;
    const reservaId = externalReference || storedId || '';

    const verify = async () => {
      if (!reservaId) {
        setVerifying(false);
        return;
      }
      try {
        const response = await api.get(`/pagos/verify/${reservaId}`);
        if (response.data.status === 'approved') {
          setConfirmed(true);
          if (Platform.OS === 'web') localStorage.removeItem('pending_payment_reserva_id');
          await fetchReservations();
        }
      } catch (err) {
        console.error('Error verificando pago:', err);
      }
      setVerifying(false);
    };

    verify();
  }, [externalReference]);

  const latestReservation = reservations[reservations.length - 1] || reservations[0];

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
          {verifying ? (
            <>
              <ActivityIndicator size="large" color="#FF7A00" style={{ marginBottom: 20 }} />
              <Text className="text-lg font-extrabold text-black text-center">
                Verificando tu pago...
              </Text>
              <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-2 text-[13px] leading-relaxed px-4`}>
                Estamos confirmando tu pago con Mercado Pago. Esto puede tomar unos segundos.
              </Text>
            </>
          ) : confirmed ? (
            <>
              <Animated.View entering={ZoomIn.duration(200).springify()} className="w-20 h-20 rounded-full bg-green-500 items-center justify-center shadow-lg shadow-green-500/20">
                <Ionicons name="checkmark" size={52} color="white" />
              </Animated.View>
              <Animated.Text entering={FadeInDown.duration(200).delay(50)} className="text-xl font-extrabold text-black text-center mt-6">
                ¡Pago realizado{'\n'}con éxito!
              </Animated.Text>
              <Animated.Text entering={FadeInDown.duration(200).delay(80)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-3 text-[13px] leading-relaxed px-4`}>
                Tu reserva ha sido confirmada. Hemos enviado los detalles a tu correo.
              </Animated.Text>
            </>
          ) : (
            <>
              <Animated.View entering={ZoomIn.duration(200).springify()} className="w-20 h-20 rounded-full bg-amber-500 items-center justify-center shadow-lg shadow-amber-500/20">
                <Ionicons name="time-outline" size={52} color="white" />
              </Animated.View>
              <Animated.Text entering={FadeInDown.duration(200).delay(50)} className="text-lg font-extrabold text-black text-center mt-6">
                Verificando pago
              </Animated.Text>
              <Animated.Text entering={FadeInDown.duration(200).delay(80)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-center mt-3 text-[13px] leading-relaxed px-4`}>
                Tu pago está siendo procesado. Te notificaremos cuando se confirme.
              </Animated.Text>
            </>
          )}
        </View>

        {confirmed && latestReservation ? (
          <Animated.View entering={FadeInDown.duration(200).delay(110)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-10 mx-2">
            <View className="gap-y-3.5">
              <View className="flex-row justify-between">
                <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold text-[13px]`}>Clase</Text>
                <Text className="text-black font-extrabold text-[13px]">{latestReservation.className}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold text-[13px]`}>Horario</Text>
                <Text className="text-black font-extrabold text-[13px]">{latestReservation.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold text-[13px]`}>Asiento(s)</Text>
                <Text className="text-black font-extrabold text-[13px]">
                  {latestReservation.seats.join(', ')}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold text-[13px]`}>Fecha</Text>
                <Text className="text-black font-extrabold text-[13px]">{latestReservation.date}</Text>
              </View>
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.duration(200).delay(140)}>
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
