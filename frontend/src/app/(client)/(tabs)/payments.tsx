import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ClientPaymentsHistoryScreen() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);

  return (
    <SafeAreaView className="flex-1 bg-cream">
<ScrollView 
         contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
         showsVerticalScrollIndicator={false}
       >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)')}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-black">Historial</Text>
        </Animated.View>

        {/* Sub tab headers (Pagos) */}
        <Animated.View entering={FadeIn.duration(200).delay(50)} className="flex-row border-b border-gray-200 mb-6">
          <View className="flex-1 pb-3 border-b-2 border-primary">
            <Text className="text-primary font-bold text-center text-base">Pagos</Text>
          </View>
        </Animated.View>

        {/* Transactions List */}
        <View className="gap-y-4 mb-6">
          {reservations.map((res, idx) => {
            const isPaid = res.status === 'Pagado';
            
            return (
              <Animated.View 
                key={res.id} 
                entering={FadeInDown.duration(200).delay(80 + idx * 40)}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-xs text-gray-400 font-bold mb-1">{res.date}. {res.time.split(' ')[0] || '6:00 PM'}</Text>
                  <Text className="text-base font-extrabold text-black">{res.className}</Text>
                </View>

                <View className="items-end">
                  <Text className="text-base font-bold text-black mb-1.5">S/. {res.price.toFixed(2)}</Text>
                  
                  <View
                    className={`px-3 py-1 rounded-full border ${
                      isPaid
                        ? 'bg-green-50 border-green-300'
                        : 'bg-orange-50 border-orange-350'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isPaid ? 'text-green-700' : 'text-orange-700'
                      }`}
                    >
                      {res.status}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
