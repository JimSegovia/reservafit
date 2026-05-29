import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CheckoutNative() {
  const { StripeProvider, useStripe } = require('@stripe/stripe-react-native');
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

  return (
    <StripeProvider publishableKey={publishableKey}>
      <CheckoutContent useStripe={useStripe} />
    </StripeProvider>
  );
}

function CheckoutContent({ useStripe }: { useStripe: typeof import('@stripe/stripe-react-native').useStripe }) {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const user = useAppStore((state) => state.user);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentBooking) router.replace('/(client)/(tabs)/classes');
  }, [currentBooking, router]);

  useEffect(() => {
    const interval = setInterval(() => decrementTimer(), 1000);
    return () => clearInterval(interval);
  }, [decrementTimer]);

  if (!currentBooking) return null;

  const handlePay = async () => {
    if (!phone || phone.length !== 9 || !phone.startsWith('9')) {
      setError('Por favor ingresa un número de celular válido (9 dígitos).');
      return;
    }

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:300/api';

    try {
      setIsProcessing(true);
      setError('');
      const response = await fetch(`${apiBaseUrl}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentBooking.totalPrice,
          currency: 'pen',
          metadata: {
            classId: currentBooking.classId,
            className: currentBooking.className,
            day: currentBooking.day,
            time: currentBooking.time,
            seats: currentBooking.selectedSeats.join(','),
            clientPhone: phone,
            clientName: user?.name ?? 'Cliente',
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.clientSecret) throw new Error(data.error || 'No se pudo iniciar el pago con Stripe.');

      const initResult = await initPaymentSheet({
        merchantDisplayName: 'ReservaFit',
        paymentIntentClientSecret: data.clientSecret,
        defaultBillingDetails: { name: user?.name, phone, email: user?.email },
      });

      if (initResult.error) throw new Error(initResult.error.message);
      const presentResult = await presentPaymentSheet();
      if (presentResult.error) throw new Error(presentResult.error.message);

      const reservation = confirmBooking(phone);
      if (!reservation) throw new Error('El pago fue exitoso, pero no se pudo registrar la reserva.');

      router.push('/(client)/success');
    } catch (paymentError) {
      const message = paymentError instanceof Error ? paymentError.message : 'Ocurrió un error al procesar el pago.';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
            </TouchableOpacity>
            <Text className="text-xl font-extrabold text-black">Pagar con Stripe</Text>
          </Animated.View>
          <Animated.View entering={ZoomIn.duration(200).delay(50)} className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-sky-600 items-center justify-center shadow-md"><Text className="text-white text-xl font-extrabold">stripe</Text></View>
            <Text className="text-gray-500 text-xs font-bold mt-3">Paga de forma segura con tarjeta y wallets compatibles.</Text>
          </Animated.View>
          {error ? <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">{error}</Animated.Text> : null}
          <Animated.View entering={FadeInDown.duration(200).delay(100)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
            <Text className="text-base font-extrabold text-black mb-4">Resumen del pedido</Text>
            <View className="gap-y-2 mb-4">
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Clase</Text><Text className="text-black font-extrabold text-sm">{currentBooking.className}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Horario</Text><Text className="text-black font-extrabold text-sm">{currentBooking.time}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Cupo</Text><Text className="text-black font-extrabold text-sm">{currentBooking.selectedSeats.join(', ')}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Fecha</Text><Text className="text-black font-extrabold text-sm">{currentBooking.day.split(' ').slice(1).join(' ')}</Text></View>
            </View>
            <View className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex-row justify-between items-center mt-2"><View><Text className="text-xs font-bold text-gray-500">Monto a pagar</Text><Text className="text-3xl font-extrabold text-primary mt-0.5">S/ {currentBooking.totalPrice.toFixed(2)}</Text></View></View>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(200).delay(150)} className="mb-6">
            <Text className="text-gray-500 font-bold text-sm mb-2 ml-1">Número de celular de contacto</Text>
            <TextInput placeholder="9XX XXX XXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={9} placeholderTextColor="#9CA3AF" className="w-full border border-gray-300 rounded-xl bg-white px-4 py-4 text-black text-sm" />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(200).delay(200)}>
            <TouchableOpacity onPress={handlePay} disabled={isProcessing} activeOpacity={0.7} className={`w-full py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-4 ${isProcessing ? 'bg-orange-300' : 'bg-primary'}`}>
              <Text className="text-white text-base font-bold">{isProcessing ? 'Procesando...' : 'Pagar con Stripe'}</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row items-center justify-center py-2 mb-4">
            <Ionicons name="time-outline" size={16} color="black" />
            <Text className="text-xs text-black font-semibold ml-1.5">Reserva bloqueada por {formatTime(currentBooking.timeLeft)}min</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
