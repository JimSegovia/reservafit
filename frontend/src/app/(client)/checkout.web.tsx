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
  const showToast = useAppStore((state) => state.showToast);
  
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking, router]);

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

      <View className="items-center mt-2 mb-4">
        <Image source={require('@/assets/images/mercadopagologo.png')} style={{ width: 64, height: 64, borderRadius: 32 }} />
        <Text className="text-[14px] text-center mt-3 text-gray-600">Paga de forma segura con Mercado Pago.</Text>
      </View>

      <View className="bg-[#fdeedb] rounded-[24px] p-4 mx-auto w-full max-w-[460px]">
        <Text className="text-[18px] font-extrabold text-black mb-3">Resumen de tu clase</Text>
        <View className="bg-white rounded-[16px] p-4 border border-[#f5e0c8] gap-y-2.5">
          <View className="flex-row justify-between"><Text className="text-[14px] text-gray-500 font-semibold">Clase</Text><Text className="text-[14px] font-bold text-black">{currentBooking.className}</Text></View>
          <View className="flex-row justify-between"><Text className="text-[14px] text-gray-500 font-semibold">Horario</Text><Text className="text-[14px] font-bold text-black">{currentBooking.time}</Text></View>
          <View className="flex-row justify-between"><Text className="text-[14px] text-gray-500 font-semibold">Asiento(s)</Text><Text className="text-[14px] font-bold text-black">{currentBooking.selectedSeats.join(', ')}</Text></View>
          <View className="flex-row justify-between"><Text className="text-[14px] text-gray-500 font-semibold">Fecha</Text><Text className="text-[14px] font-bold text-black">{currentBooking.day}</Text></View>
          <View className="flex-row justify-between"><Text className="text-[14px] text-gray-500 font-semibold">Instructor</Text><Text className="text-[14px] font-bold text-black">{currentBooking.instructorName}</Text></View>
        </View>

        <View className="mt-4 flex-row justify-between items-center bg-white/50 p-3 rounded-xl">
          <Text className="text-[14px] font-bold text-gray-600">Total a pagar:</Text>
          <Text className="text-[26px] font-extrabold text-primary">S/ {currentBooking.totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePay}
          disabled={isSubmitDisabled}
          className={`bg-primary rounded-2xl py-4 items-center justify-center mt-5 ${isSubmitDisabled ? 'opacity-50' : ''}`}
          style={{ minHeight: 52 }}
        >
          <Text className="text-white text-[16px] font-bold">Pagar</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-4 gap-x-2">
          <Ionicons name="time-outline" size={16} color="#FF7A00" />
          <Text className="text-[12px] text-gray-500 font-semibold">Reserva bloqueada por 10:00 minutos</Text>
        </View>
      </View>

      <Modal transparent visible={showPopup} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full max-w-[380px] bg-white rounded-[24px] p-5 items-center shadow-2xl border border-gray-150">
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