import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ClassesSelectorScreen() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  // Filter only classes that correspond to client view categories (c7, c8, c9)
  const categoryClasses = classes.filter(
    (cls) => cls.id === 'c7' || cls.id === 'c8' || cls.id === 'c9'
  );

  const desktopContent = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <Text className="text-[18px] font-bold text-black">Selecciona el tipo de clase</Text>
        <Text className="text-gray-500 font-medium mt-1 text-[13px]">Elige la clase que más te guste y reserva tu cupo</Text>
        <View className="flex-row gap-x-3 mt-4">
          {categoryClasses.map((cls) => (
            <View key={cls.id} className="flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <Image source={{ uri: cls.id === 'c7' ? 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop' : cls.id === 'c8' ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop' }} className="w-full h-44 object-cover" />
              <View className="p-4">
                <Text className="text-[15px] font-bold text-black">{cls.title}</Text>
                <Text className="text-gray-500 mt-2 leading-5 text-[13px]">{cls.id === 'c7' ? 'Ritmo, sabor y diversión. Aprende los pasos básicos y avanza a tu ritmo' : cls.id === 'c8' ? 'Conecta y disfruta. Desde lo básico hasta combinaciones avanzadas' : 'Energía y movimiento. Quema calorías mientras te diviertes.'}</Text>
                <Text className="text-gray-500 mt-3 text-[13px]">Lunes - Miércoles - Viernes</Text>
                <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/classes/schedules')} className="bg-primary rounded-md py-3 items-center mt-4">
                  <Text className="text-white font-bold text-base">Ver horarios</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-white rounded-2xl border border-gray-200 p-5">
        <Text className="text-[18px] font-bold text-black mb-4">Despliegue semanal</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View className="flex-row">
              <View className="w-[120px]" />
              {['Lunes 13', 'Martes 14', 'Miercoles 15', 'Jueves 16', 'Viernes 17', 'Sábado 18', 'Domingo 19', 'Lunes 20'].map((d) => (
                <View key={d} className="w-[140px] border border-gray-200 items-center justify-center py-4">
                  <Text className="text-[16px] font-bold text-black text-center">{d.split(' ')[0]}</Text>
                  <Text className="text-[16px] font-bold text-black text-center">{d.split(' ')[1]}</Text>
                </View>
              ))}
            </View>
            {['4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'].map((time, idx) => (
              <View key={time} className="flex-row">
                <View className="w-[120px] border border-gray-200 items-center justify-center px-3">
                  <Text className="text-[16px] font-semibold text-black text-center leading-5">{time}</Text>
                </View>
                {Array.from({ length: 8 }).map((_, col) => (
                  <View key={`${time}-${col}`} className="w-[140px] border border-gray-200 p-2 items-center justify-center">
                    {((idx + col) % 2 === 0) ? (
                      <View className={`rounded-xl px-3 py-4 ${((idx + col) % 3 === 0) ? 'bg-orange-300' : 'bg-green-300'}`}>
                        <Text className="text-black font-semibold text-center text-[13px]">{((idx + col) % 3 === 0) ? 'Salsa' : 'Bachata'}</Text>
                        <Text className="text-black font-semibold text-center text-[12px]">Profesor {String.fromCharCode(65 + ((idx + col) % 7))}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="Mis clases" subtitle="Elige el tipo de clase que quieres reservar o consulta el calendario.">{desktopContent}</ClientDesktopShell>;
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
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
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
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
