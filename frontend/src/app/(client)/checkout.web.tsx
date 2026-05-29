import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

export default function CheckoutScreen() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const [phone, setPhone] = useState('9XX XXX XXX');
  const [code, setCode] = useState('123456');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking, router]);

  if (!currentBooking) return null;

  const handlePay = () => setShowPopup(true);

  const handleConfirm = () => {
    confirmBooking(phone);
    setShowPopup(false);
    router.replace('/(client)/success');
  };

  const content = (
    <View className="bg-[#faf5ef] rounded-[24px] p-5 w-full max-w-[480px] mx-auto border border-gray-100 shadow-sm">
      <View className="flex-row items-start justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={38} color="black" />
        </TouchableOpacity>
        <Text className="text-[22px] font-extrabold text-black">Pagar con Yape</Text>
        <View className="w-10" />
      </View>

      <View className="items-center mt-5 mb-4">
        <View className="w-20 h-20 rounded-full bg-[#7f1bb5] items-center justify-center">
          <Text className="text-white text-2xl font-extrabold">Y</Text>
        </View>
        <Text className="text-[16px] text-center mt-4">Yape es el único medio de pago aceptado.</Text>
      </View>

      <View className="bg-[#fdeedb] rounded-[24px] p-4 mx-auto w-full max-w-[460px]">
        <Text className="text-[20px] font-extrabold text-black mb-3">Resumen del pedido</Text>
        <View className="bg-white rounded-[16px] p-4 border border-[#f5e0c8]">
          <View className="flex-row justify-between mb-3"><Text className="text-[15px]">Clase</Text><Text className="text-[15px] font-bold">{currentBooking.className}</Text></View>
          <View className="flex-row justify-between mb-3"><Text className="text-[15px]">Horario</Text><Text className="text-[15px] font-bold">{currentBooking.time}</Text></View>
          <View className="flex-row justify-between mb-3"><Text className="text-[15px]">Asiento</Text><Text className="text-[15px] font-bold">{currentBooking.selectedSeats.join(', ')}</Text></View>
          <View className="flex-row justify-between"><Text className="text-[15px]">Fecha</Text><Text className="text-[15px] font-bold">{currentBooking.day}</Text></View>
        </View>

        <View className="mt-6">
          <Text className="text-[15px] font-bold text-gray-500">Monto a pagar</Text>
          <Text className="text-[36px] font-extrabold text-primary">S/ {currentBooking.totalPrice.toFixed(2)}</Text>
        </View>

        <View className="mt-4">
          <Text className="text-[15px] font-bold text-gray-500 mb-2">Número de celular Yape</Text>
          <TextInput value={phone} onChangeText={setPhone} className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px]" />
          <Text className="text-[15px] font-bold text-gray-500 mb-2 mt-4">Código de Aprobacion</Text>
          <TextInput value={code} onChangeText={setCode} className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px]" />
        </View>

        <TouchableOpacity onPress={handlePay} className="bg-primary rounded-2xl py-3 items-center mt-5">
          <Text className="text-white text-[16px] font-semibold">Pagar con Yape</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-5 gap-x-3">
          <Ionicons name="time-outline" size={20} color="#222" />
          <Text className="text-[13px]">Reserva bloqueada por 09:45min</Text>
        </View>
      </View>

      <Modal transparent visible={showPopup} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full max-w-[380px] bg-white rounded-[24px] p-5 items-center">
            <View className="w-16 h-16 rounded-full bg-green-500 items-center justify-center mb-5">
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text className="text-[24px] font-extrabold text-center">Confirmar pago</Text>
            <Text className="text-gray-600 text-center mt-3 text-[16px]">¿Deseas confirmar el pago de tu reserva?</Text>
            <View className="flex-row gap-x-3 mt-8 w-full">
              <TouchableOpacity onPress={() => setShowPopup(false)} className="flex-1 bg-gray-200 rounded-xl py-4 items-center">
                <Text className="text-[16px] font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} className="flex-1 bg-primary rounded-xl py-4 items-center">
                <Text className="text-white text-[16px] font-semibold">Pagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return <SafeAreaView className="flex-1 bg-cream"><ClientDesktopShell title="" subtitle="">{content}</ClientDesktopShell></SafeAreaView>;
}
