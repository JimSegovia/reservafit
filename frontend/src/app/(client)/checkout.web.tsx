import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import { Loader } from '@/components/ui/loader';
import api from '@/api/api';

export default function CheckoutScreen() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const showToast = useAppStore((state) => state.showToast);
  
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking, router]);

  useEffect(() => {
    const interval = setInterval(() => decrementTimer(), 1000);
    return () => clearInterval(interval);
  }, [decrementTimer]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (!currentBooking) return null;

  const handlePay = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Create the reservation in the backend database
      const res = await confirmBooking('');
      if (!res) {
        showToast('No se pudo registrar la reserva. Inténtalo de nuevo.', 'error');
        setIsProcessing(false);
        return;
      }

      // 2. Call the payment checkout preference generator
      const checkoutResponse = await api.post('/pagos/checkout', {
        id_reserva: res.id_reserva,
        amount: currentBooking.totalPrice,
        description: `Clase: ${currentBooking.className} - Asientos: ${currentBooking.selectedSeats.join(', ')}`
      });

      const result = checkoutResponse.data;

      if (checkoutResponse.status === 200 && result.success && result.data?.initPoint) {
        setShowPopup(false);
        
        // Direct redirect to Mercado Pago Checkout Pro
        window.location.href = result.data.initPoint; 
      } else {
        showToast(result.error || 'No se pudo generar el enlace de Mercado Pago.', 'error');
      }

    } catch (error: any) {
      console.error("Error al conectar con el servidor de pagos:", error);
      showToast(error.response?.data?.error || 'Error de conexión con el servidor. Inténtalo de nuevo.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitDisabled = isProcessing;

  const content = (
    <View className="bg-[#faf5ef] rounded-[24px] p-5 w-full max-w-[480px] mx-auto border border-gray-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-1">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-sm font-semibold ml-1">Volver</Text>
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-black">Pagar</Text>
        <View className="w-10" />
      </View>

      {/* Step Indicator (H3: Paso 1, 2, 3) */}
      <View className="flex-row items-center justify-center mb-6 gap-x-2 px-2">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-orange-200 items-center justify-center"><Text className="text-xs font-bold text-orange-800">1</Text></View>
          <Text className="text-xs text-gray-500 font-bold ml-1">Clase</Text>
        </View>
        <View className="w-6 h-[2px] bg-orange-200" />
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-orange-200 items-center justify-center"><Text className="text-xs font-bold text-orange-800">2</Text></View>
          <Text className="text-xs text-gray-500 font-bold ml-1">Asientos</Text>
        </View>
        <View className="w-6 h-[2px] bg-primary" />
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-primary items-center justify-center"><Text className="text-xs font-bold text-white">3</Text></View>
          <Text className="text-xs text-primary font-bold ml-1">Pago</Text>
        </View>
      </View>

      {/* Ticket Summary – white elevated card */}
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <Text className="text-base font-semibold text-black mb-4">Resumen de tu clase</Text>
        <View className="gap-y-2.5 mb-4">
          <View className="flex-row justify-between"><Text className="text-sm text-gray-500 font-medium">Clase</Text><Text className="text-sm text-gray-900 font-medium">{currentBooking.className}</Text></View>
          <View className="flex-row justify-between"><Text className="text-sm text-gray-500 font-medium">Horario</Text><Text className="text-sm text-gray-900 font-medium">{currentBooking.time}</Text></View>
          <View className="flex-row justify-between"><Text className="text-sm text-gray-500 font-medium">Asiento(s)</Text><Text className="text-sm text-gray-900 font-medium">{currentBooking.selectedSeats.join(', ')}</Text></View>
          <View className="flex-row justify-between"><Text className="text-sm text-gray-500 font-medium">Fecha</Text><Text className="text-sm text-gray-900 font-medium">{currentBooking.day.charAt(0).toUpperCase() + currentBooking.day.slice(1).toLowerCase()}</Text></View>
          <View className="flex-row justify-between"><Text className="text-sm text-gray-500 font-medium">Instructor</Text><Text className="text-sm text-gray-900 font-medium">{currentBooking.instructorName}</Text></View>
        </View>
        <View className="border-t border-gray-100 pt-3 flex-row justify-between items-center">
          <Text className="text-sm font-semibold text-gray-600">Total a pagar:</Text>
          <Text className="text-2xl font-semibold text-primary">S/ {currentBooking.totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      {/* CTA Payment Button */}
      <TouchableOpacity
        onPress={handlePay}
        disabled={isSubmitDisabled}
        className={`bg-primary rounded-2xl py-4 items-center justify-center mb-4 ${isSubmitDisabled ? 'opacity-50' : ''}`}
        style={{ minHeight: 56 }}
      >
        <View className="flex-row items-center gap-x-3">
          <Image source={require('@/assets/images/mercadopagologo.png')} style={{ width: 28, height: 28, borderRadius: 14 }} />
          <Text className="text-white text-base font-bold">Pagar S/ {currentBooking.totalPrice.toFixed(2)} con Mercado Pago</Text>
        </View>
      </TouchableOpacity>

      {/* Countdown Timer */}
      <View className="flex-row items-center justify-center mb-2 gap-x-2">
        <Ionicons name="time-outline" size={16} color="#FF7A00" />
        <Text className="text-xs text-gray-500 font-medium">Reserva bloqueada por {formatTime(currentBooking.timeLeft)} minutos</Text>
      </View>

      <Modal transparent visible={showPopup} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full max-w-[380px] bg-white rounded-[24px] p-5 items-center shadow-2xl border border-gray-200">
            <View className="w-16 h-16 rounded-full bg-green-500 items-center justify-center mb-5">
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text className="text-[22px] font-extrabold text-center text-black">Confirmar pago</Text>
            <Text className="text-gray-600 text-center mt-3 text-[15px] leading-relaxed">
              ¿Deseas confirmar el pago de tu reserva por <Text className="font-extrabold text-primary">S/ {currentBooking.totalPrice.toFixed(2)}</Text>?
            </Text>
            <View className="flex-row gap-x-3 mt-8 w-full">
              <TouchableOpacity
                onPress={() => setShowPopup(false)}
                disabled={isProcessing}
                className="flex-1 bg-gray-150 rounded-xl py-4 items-center"
              >
                <Text className="text-[16px] font-bold text-gray-700">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={isProcessing}
                className="flex-1 bg-primary rounded-xl py-4 items-center justify-center"
                style={{ minHeight: 48 }}
              >
                {isProcessing ? (
                  <Loader variant="button" label="Pagando..." />
                ) : (
                  <Text className="text-white text-[16px] font-bold">Pagar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return <SafeAreaView className="flex-1 bg-cream"><ClientDesktopShell title="" subtitle="">{content}</ClientDesktopShell></SafeAreaView>;
}