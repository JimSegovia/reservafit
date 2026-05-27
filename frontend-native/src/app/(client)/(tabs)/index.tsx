import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ClientHomeScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const reservations = useAppStore((state) => state.reservations);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/landing');
  };

  // Filter reservations for this client (excluding refunds)
  const clientReservations = reservations.filter(
    (res) => res.status === 'Pagado'
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="body-outline" size={28} color="#FF7A00" />
            <Text className="text-2xl font-bold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="black" />
          </TouchableOpacity>
        </Animated.View>

        {/* Salutation */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="mb-6">
          <Text className="text-2xl font-extrabold text-black">
            ¡Hola, {user?.name || 'Ana Pérez'}! 👋
          </Text>
        </Animated.View>

        {/* List of Reserved Classes */}
        <Animated.Text entering={FadeInDown.duration(200).delay(100)} className="text-gray-500 font-bold text-center text-sm tracking-wide mb-4">
          Estas son tus Clases Reservadas
        </Animated.Text>

        <View className="gap-y-4 mb-6">
          {clientReservations.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(200).delay(150)} className="bg-white border border-gray-100 rounded-3xl p-8 items-center justify-center">
              <Ionicons name="calendar-outline" size={48} color="#FF7A00" className="opacity-50" />
              <Text className="text-gray-500 text-sm mt-3 text-center">
                No tienes reservas activas para esta semana.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(client)/(tabs)/classes')}
                className="bg-primary px-6 py-3 rounded-full mt-4"
              >
                <Text className="text-white font-bold text-sm">Explorar clases</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            clientReservations.map((res, idx) => (
              <Animated.View
                key={res.id}
                entering={FadeInDown.duration(200).delay(150 + idx * 50)}
                className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm"
              >
                {/* Visual Image Header */}
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop' }}
                  className="w-full h-24 object-cover"
                />
                
                <View className="p-4 items-center">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="people-outline" size={16} color="#FF7A00" />
                    <Text className="text-lg font-bold text-black ml-1.5">{res.className}</Text>
                  </View>
                  
                  <Text className="text-base font-extrabold text-black mb-1.5">
                    {res.time}
                  </Text>
                  
                  <View className="flex-row justify-between w-full border-t border-gray-100 pt-3 mt-1 px-2">
                    <Text className="text-sm font-semibold text-gray-500">
                      Cupos: {res.seats.join(', ')}
                    </Text>
                    <Text className="text-sm font-semibold text-gray-500">
                      Profesor: {res.className.toLowerCase().includes('salsa') ? 'Profesor B' : 'Profesor A'}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
