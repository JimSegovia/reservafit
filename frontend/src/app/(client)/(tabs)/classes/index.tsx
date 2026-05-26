import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ClassesSelectorScreen() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);

  // Filter only classes that correspond to client view categories (c7, c8, c9)
  const categoryClasses = classes.filter(
    (cls) => cls.id === 'c7' || cls.id === 'c8' || cls.id === 'c9'
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(200)} className="mb-4">
          <Text className="text-2xl font-extrabold text-black text-center mt-2">
            Reserva tu Proxima Clase
          </Text>
        </Animated.View>

        {/* Tab Headers (Categorías / Calendario) */}
        <Animated.View entering={FadeIn.duration(200).delay(50)} className="flex-row border-b border-gray-200 mb-6">
          <TouchableOpacity className="flex-1 pb-3 border-b-2 border-primary">
            <Text className="text-primary font-bold text-center text-base">Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(client)/(tabs)/classes/calendar')}
            className="flex-1 pb-3"
          >
            <Text className="text-gray-400 font-bold text-center text-base">Calendario</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Catalog List */}
        <View className="gap-y-6 mb-6">
          {categoryClasses.map((cls, idx) => (
            <Animated.View
              key={cls.id}
              entering={FadeInDown.duration(200).delay(100 + idx * 50)}
              className="bg-white border border-gray-155 rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Image */}
              <Image
                source={{
                  uri:
                    cls.id === 'c7'
                      ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop'
                      : cls.id === 'c8'
                      ? 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop'
                }}
                className="w-full h-32 object-cover"
              />

              <View className="p-4 items-center">
                {/* Title */}
                <Text className="text-lg font-bold text-black mb-2">{cls.title}</Text>

                {/* Sub-info layout from mockup */}
                <View className="flex-row items-center mb-3">
                  <View className="flex-row items-center mr-3">
                    {/* Small mockup team icon */}
                    <Text className="text-orange-500 text-xs font-bold mr-1">👥👥</Text>
                    <Text className="text-primary text-xs font-extrabold">Esta Semana</Text>
                  </View>
                  <Text className="text-gray-400 text-xs font-medium">
                    {cls.id === 'c7'
                      ? 'Lunes - Miercoles - Viernes'
                      : cls.id === 'c8'
                      ? 'Martes - Jueves - Sábado'
                      : 'Lunes - Jueves - Viernes'}
                  </Text>
                </View>

                {/* View Details Link */}
                <TouchableOpacity
                  onPress={() => {
                    // For Zumba, we can show schedules (V8), for others show detail directly (V7)
                    if (cls.id === 'c7') {
                      router.push(`/(client)/(tabs)/classes/schedules`);
                    } else {
                      router.push(`/(client)/(tabs)/classes/detail?id=${cls.id}`);
                    }
                  }}
                  className="py-1 w-full items-center border-t border-gray-100 mt-2 pt-3"
                >
                  <Text className="text-primary font-bold text-sm">Ver detalles</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
