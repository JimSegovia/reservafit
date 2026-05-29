import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ClientPaymentsHistoryScreen() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const content = (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: isWeb ? 0 : 24, paddingVertical: isWeb ? 0 : 16, paddingBottom: 30 }} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-black">Historial</Text>
      </Animated.View>

      {/* Sub tab headers (Pagos) */}
      <Animated.View entering={FadeIn.duration(200).delay(50)} className="flex-row border-b border-gray-200 mb-6">
        <View className="flex-1 pb-3 border-b-2 border-primary">
          <Text className="text-primary font-bold text-center text-base">Pagos</Text>
        </View>
      </Animated.View>

      {/* Table */}
      <View className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        <View className="flex-row border-b border-gray-200 py-4 px-8 bg-[#faf7f2]">
          <Text className="flex-1 text-center text-[18px] font-extrabold text-gray-700">Fecha</Text>
          <Text className="flex-1 text-center text-[18px] font-extrabold text-gray-700">Clase</Text>
          <Text className="flex-1 text-center text-[18px] font-extrabold text-gray-700">Pago</Text>
          <Text className="flex-1 text-center text-[18px] font-extrabold text-gray-700">Estado</Text>
        </View>
        <View className="px-8 py-4">
          {reservations.map((res, idx) => {
            const isPaid = res.status === 'Pagado';
            return (
              <View key={res.id} className={`flex-row items-center py-5 ${idx !== reservations.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <Text className="flex-1 text-center text-[14px] font-semibold text-black">{res.date}. {res.time.split(' ')[0] || '6:00 PM'}</Text>
                <Text className="flex-1 text-center text-[14px] font-semibold text-black">{res.className}</Text>
                <Text className="flex-1 text-center text-[14px] font-semibold text-black">S/. {res.price.toFixed(2)}</Text>
                <View className="flex-1 items-center"><View className={`px-4 py-2 rounded-xl ${isPaid ? 'bg-green-50' : 'bg-orange-50'}`}><Text className={`text-[13px] font-bold ${isPaid ? 'text-green-700' : 'text-orange-700'}`}>{res.status}</Text></View></View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  return (
    isWeb
      ? <ClientDesktopShell title="Historial de Pagos" subtitle="">{content}</ClientDesktopShell>
      : <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>
  );
}
