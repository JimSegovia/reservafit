import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { EmptyState } from '@/components/ui/empty-state';

import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function AdminBookingsHistoryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isNative = Platform.OS !== 'web';
  const reservations = useAppStore((state) => state.reservations);

  const [activeTab, setActiveTab] = useState<'Reservas' | 'Pagos'>('Reservas');

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: isMobile ? 80 : 30 }} 
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.replace('/(admin)')}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Historial</Text>
            <Text className="text-2xl font-extrabold text-black mt-0.5">Historial</Text>
          </View>
        </Animated.View>

        {/* Tab Selection (Reservas / Pagos) */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="flex-row border-b border-gray-200 mb-6 bg-white rounded-xl p-1.5 shadow-sm">
          <TouchableOpacity
            onPress={() => setActiveTab('Reservas')}
            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'Reservas' ? 'bg-primary' : 'bg-transparent'}`}
          >
            <Text
              className={`font-bold text-center text-sm ${
                activeTab === 'Reservas' ? isNative ? 'text-secondary' : 'text-white' : 'text-gray-500'
              }`}
            >
              Reservas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('Pagos')}
            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'Pagos' ? 'bg-primary' : 'bg-transparent'}`}
          >
            <Text
              className={`font-bold text-center text-sm ${
                activeTab === 'Pagos' ? isNative ? 'text-secondary' : 'text-white' : 'text-gray-500'
              }`}
            >
              Pagos
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* History List */}
        <View className="gap-y-4 mb-6">
          {reservations.length === 0 ? (
            <EmptyState
              variant="no-bookings"
              title="Sin historial de reservas"
              message="No hay registros de reservas en el sistema."
            />
          ) : (
            reservations.map((res, idx) => {
              const isPaid = res.status === 'Pagado';
              return (
                <Animated.View
                  key={res.id}
                  entering={FadeInDown.duration(200).delay(idx < 6 ? 80 + idx * 30 : 0)}
                  layout={LinearTransition}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-2">
                    <Text className="text-xs text-gray-400 font-bold mb-1">
                      {res.date}. {res.time.split(' ')[0] || '6:00 PM'}
                    </Text>
                    <Text className="text-base font-extrabold text-black">{res.className}</Text>
                    
                    {/* Dynamic Detail based on Active Tab */}
                    {activeTab === 'Reservas' ? (
                      <Text className="text-xs text-gray-500 font-semibold mt-1">
                        Cliente: {res.clientName}
                      </Text>
                    ) : (
                      <Text className="text-xs text-gray-400 font-bold mt-1">
                        Celular: {res.clientPhone}
                      </Text>
                    )}
                  </View>

                  <View className="items-end">
                    <Text className="text-base font-bold text-black mb-1.5">S/ {res.price.toFixed(2)}</Text>
                    
                    <View
                      className={`px-3 py-1 rounded-full border ${
                        isPaid ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-350'
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
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
