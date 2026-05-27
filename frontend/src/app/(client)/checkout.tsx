import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CheckoutScreen() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const clearBooking = useAppStore((state) => state.clearBooking);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Redirection back if no booking is active
  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking]);

  // Sync Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentBooking) return null;

  const handlePay = () => {
    // Basic verification of phone number matching Peruvian cellular pattern (9 digits starting with 9)
    if (!phone || phone.length < 9) {
      setError('Por favor ingresa un número de celular Yape válido (9 dígitos).');
      return;
    }

    const reservation = confirmBooking(phone);
    if (reservation) {
      setError('');
      router.push('/(client)/success');
    } else {
      setError('Ocurrió un error al procesar el pago.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
<ScrollView 
           contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
           showsVerticalScrollIndicator={false}
         >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
            </TouchableOpacity>
            <Text className="text-xl font-extrabold text-black">Pagar con Yape</Text>
          </Animated.View>

          {/* Yape Logo */}
          <Animated.View entering={ZoomIn.duration(200).delay(50)} className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-purple-700 items-center justify-center shadow-md">
              <Text className="text-white text-3xl font-extrabold italic font-serif">yape</Text>
            </View>
            <Text className="text-gray-500 text-xs font-bold mt-3">
              Yape es el único medio de pago aceptado.
            </Text>
          </Animated.View>

          {error ? (
            <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">{error}</Animated.Text>
          ) : null}

          {/* Order Summary Card */}
          <Animated.View entering={FadeInDown.duration(200).delay(100)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
            <Text className="text-base font-extrabold text-black mb-4">Resumen del pedido</Text>

            <View className="gap-y-2 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-bold text-sm">Clase</Text>
                <Text className="text-black font-extrabold text-sm">{currentBooking.className}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-bold text-sm">Horario</Text>
                <Text className="text-black font-extrabold text-sm">{currentBooking.time}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-bold text-sm">Cupo</Text>
                <Text className="text-black font-extrabold text-sm">
                  {currentBooking.selectedSeats.join(', ')}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-bold text-sm">Fecha</Text>
                <Text className="text-black font-extrabold text-sm">
                  {currentBooking.day.split(' ').slice(1).join(' ')}
                </Text>
              </View>
            </View>

            {/* Total Block (Light orange/cream) */}
            <View className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex-row justify-between items-center mt-2">
              <View>
                <Text className="text-xs font-bold text-gray-500">Monto a pagar</Text>
                <Text className="text-3xl font-extrabold text-primary mt-0.5">
                  S/ {currentBooking.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Phone Input */}
          <Animated.View entering={FadeInDown.duration(200).delay(150)} className="mb-6">
            <Text className="text-gray-500 font-bold text-sm mb-2 ml-1">Número de celular Yape</Text>
            <TextInput
              placeholder="9XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={9}
              placeholderTextColor="#9CA3AF"
              className="w-full border border-gray-300 rounded-xl bg-white px-4 py-4 text-black text-sm"
            />
          </Animated.View>

          {/* Payment Submit Button */}
          <Animated.View entering={FadeInDown.duration(200).delay(200)}>
            <TouchableOpacity
              onPress={handlePay}
              activeOpacity={0.7}
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-4"
            >
              <Text className="text-white text-base font-bold">Pagar con Yape</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Locked Seat Timer */}
          <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row items-center justify-center py-2 mb-4">
            <Ionicons name="time-outline" size={16} color="black" />
            <Text className="text-xs text-black font-semibold ml-1.5">
              Reserva bloqueada por {formatTime(currentBooking.timeLeft)}min
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
