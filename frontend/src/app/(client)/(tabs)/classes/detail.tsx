import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function ClassDetailScreen() {
  const router = useRouter();
  const { id, day, time, id_detalle_clase } = useLocalSearchParams();
  const classes = useAppStore((state) => state.classes);
  const startBooking = useAppStore((state) => state.startBooking);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  // If no ID is passed, default to 'c10' (Baile funcional) to match V7 mockup exactly!
  const classId = (id as string) || 'c10';
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  const handleEnroll = () => {
    // Start checkout booking process
    startBooking({
      classId: classItem.id,
      id_detalle_clase: (id_detalle_clase as string) || undefined,
      className: classItem.title,
      day: (day as string) || classItem.days?.[0] || 'LUNES 12/05',
      time: (time as string) || classItem.slots?.[0] || classItem.schedule.split(' ').slice(-2).join(' ') || '6:00 PM - 7:00 PM',
      instructorName: classItem.instructorName,
      pricePerSeat: classItem.price
    });

    // Go to Seat Selector V10 (lies outside tabs to hide bottom bar!)
    router.push('/(client)/position');
  };

  const capacityPercentage = Math.round((classItem.enrolled / classItem.capacity) * 100);

  // Shared value for progress bar animation
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(capacityPercentage / 100, { duration: 800 });
  }, [capacityPercentage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const content = (
<ScrollView 
         contentContainerStyle={{ flexGrow: 1, flex: 1, paddingBottom: 30 }}
         showsVerticalScrollIndicator={false}
       >
        {/* Header Hero Image with Back Button */}
        <Animated.View entering={FadeIn.duration(200)} className="relative w-full h-64 bg-gray-200">
          <Image
            source={
              classItem.title.toLowerCase().includes('zumba')
                ? require('../../../../../assets/images/zumba.jpg')
                : classItem.title.toLowerCase().includes('salsa')
                ? require('../../../../../assets/images/Salsa.jpeg')
                : require('../../../../../assets/images/bachata.jpg')
            }
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Content Body */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="px-6 py-6 bg-cream rounded-t-[30px] -mt-6 flex-1">
          {/* Header Title Row */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-extrabold text-black flex-1 mr-2">{classItem.title}</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full border border-green-300">
              <Text className="text-green-700 text-xs font-bold">Disponible</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 text-sm leading-relaxed mb-6">
            Entrenamiento cardiovascular de alta intensidad guiado por un instructor. Mejora tu resistencia, quema calorías, fortalece tu cuerpo y pásala bien con una rutina de baile.
          </Text>

          {/* Metadata Grid */}
          <View className="gap-y-4 mb-8">
            {/* Instructor */}
            <Animated.View entering={FadeInDown.duration(200).delay(100)} className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="person-outline" size={20} color="#FF7A00" />
              </View>
              <View className="w-9 h-9 rounded-full bg-amber-700 items-center justify-center mr-2">
                <Text className="text-white font-bold text-xs">
                  {classItem.instructorName.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">Instructor</Text>
                <Text className="text-sm font-extrabold text-black">{classItem.instructorName}</Text>
              </View>
            </Animated.View>

            {/* Día */}
            <Animated.View entering={FadeInDown.duration(200).delay(130)} className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={20} color="#FF7A00" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">Día</Text>
                <Text className="text-sm font-extrabold text-black">
                  {(day as string) || classItem.days?.[0] || 'Lunes 09/05'}
                </Text>
              </View>
            </Animated.View>

            {/* Horario */}
            <Animated.View entering={FadeInDown.duration(200).delay(160)} className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="time-outline" size={20} color="#FF7A00" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">Horario</Text>
                <Text className="text-sm font-extrabold text-black">
                  {(time as string) || classItem.slots?.[0] || '6:00 PM - 7:00 PM'}
                </Text>
              </View>
            </Animated.View>

            {/* Cupos (Capacity Progress bar) */}
            <Animated.View entering={FadeInDown.duration(200).delay(190)} className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="people-outline" size={20} color="#FF7A00" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-end mb-1">
                  <View>
                    <Text className="text-[10px] text-gray-400 font-bold uppercase">Cupos</Text>
                    <Text className="text-sm font-extrabold text-black">
                      {classItem.enrolled}/{classItem.capacity} inscritos
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-black">{capacityPercentage}%</Text>
                </View>
                {/* Progress bar */}
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <Animated.View
                    style={animatedStyle}
                    className="h-full bg-primary"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Temática */}
            {classItem.theme ? (
              <Animated.View entering={FadeInDown.duration(200).delay(220)} className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="color-palette-outline" size={20} color="#FF7A00" />
                </View>
                <View>
                  <Text className="text-[10px] text-gray-400 font-bold uppercase">Temática</Text>
                  <View className="bg-pink-100 px-3 py-0.5 rounded-full border border-pink-200 mt-0.5">
                    <Text className="text-pink-700 text-xs font-bold">{classItem.theme}</Text>
                  </View>
                </View>
              </Animated.View>
            ) : null}
          </View>

          {/* Action Button */}
          <Animated.View entering={FadeInDown.duration(200).delay(250)}>
            <TouchableOpacity
              onPress={handleEnroll}
              activeOpacity={0.7}
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-3"
            >
              <Text className="text-white text-base font-bold">Inscribirse</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text className="text-gray-500 text-xs text-center leading-relaxed px-4">
            Tu cupo sera reservado por 10 minutos para completar el pago
          </Text>
        </Animated.View>
      </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title={classItem.title} subtitle="Detalle de clase">{content}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
