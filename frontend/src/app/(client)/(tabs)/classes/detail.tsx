import { View, Text, Image, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown,useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';

export default function ClassDetailScreen() {
  const router = useRouter();
  const { id, day, time, id_detalle_clase } = useLocalSearchParams();
  const classes = useAppStore((state) => state.classes);
  const agenda = useAppStore((state) => state.agenda);
  const startBooking = useAppStore((state) => state.startBooking);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  // If no ID is passed, default to 'c10' (Baile funcional) to match V7 mockup exactly!
  const classId = (id as string) || 'c10';
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  const sessionItem = agenda.find((a) => a.id_detalle_clase === id_detalle_clase);
  const realTheme = sessionItem?.tematica || 'General';

  const isAvailable = useMemo(() => {
    if (!sessionItem?.fecha_hora_inicio) return false;
    const startDate = new Date(sessionItem.fecha_hora_inicio);
    if (isNaN(startDate.getTime())) return false;
    const now = new Date();
    const minStartTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return startDate >= minStartTime;
  }, [sessionItem]);

  const getFormattedDay = () => {
    if (!sessionItem?.fecha_hora_inicio) {
      return (day as string) || classItem?.days?.[0] || 'Lunes';
    }
    const d = new Date(sessionItem.fecha_hora_inicio);
    if (isNaN(d.getTime())) {
      return (day as string) || classItem?.days?.[0] || 'Lunes';
    }
    const labels = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const dayNum = d.getDate().toString().padStart(2, '0');
    const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${labels[d.getDay()]} ${dayNum}/${monthNum}`;
  };
  const realDay = getFormattedDay();

  const handleEnroll = () => {
    // Start checkout booking process
    startBooking({
      classId: classItem.id,
      id_detalle_clase: (id_detalle_clase as string) || undefined,
      className: classItem.title,
      day: realDay,
      time: (time as string) || classItem.slots?.[0] || classItem.schedule.split(' ').slice(-2).join(' ') || '6:00 PM - 7:00 PM',
      instructorName: classItem.instructorName,
      pricePerSeat: classItem.price,
      startedAt: Date.now(),
      totalSeats: 30
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
    isWeb ? (
      /* ───── DESKTOP: static view, no scroll ───── */
      <View className="flex-1 bg-cream px-6 pt-4">

        <View className="flex-row gap-8">
          {/* LEFT – Booking Card */}
            <View style={{ flex: 40 }}>
              <View className="bg-white rounded-2xl shadow-sm px-6 pt-6 pb-8 sticky top-6 gap-y-4">
                {/* Día */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="calendar-outline" size={20} color="#FF7A00" />
                  </View>
                  <View>
                    <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Día</Text>
                    <Text className="text-sm font-medium text-black">{realDay}</Text>
                  </View>
                </View>

                {/* Horario */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="time-outline" size={20} color="#FF7A00" />
                  </View>
                  <View>
                    <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Horario</Text>
                    <Text className="text-sm font-medium text-black">{(time as string) || classItem.slots?.[0] || '6:00 PM - 7:00 PM'}</Text>
                  </View>
                </View>

                {/* Instructor */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="person-outline" size={20} color="#FF7A00" />
                  </View>
                  <View>
                    <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Instructor</Text>
                    <Text className="text-sm font-medium text-black">{classItem.instructorName}</Text>
                  </View>
                </View>

                {/* Temática */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="color-palette-outline" size={20} color="#FF7A00" />
                  </View>
                  <View>
                    <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Temática</Text>
                    <Text className="text-sm font-medium text-black">{realTheme}</Text>
                  </View>
                </View>

                {/* Cupos */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="people-outline" size={20} color="#FF7A00" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-end mb-1">
                      <View>
                        <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Cupos</Text>
                        <Text className="text-sm font-medium text-black">{classItem.enrolled}/{classItem.capacity} inscritos</Text>
                      </View>
                      <Text className="text-xs font-semibold text-black">{capacityPercentage}%</Text>
                    </View>
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <Animated.View style={animatedStyle} className="h-full bg-primary" />
                    </View>
                  </View>
                </View>

                {/* CTA */}
                <TouchableOpacity
                  onPress={handleEnroll}
                  disabled={!isAvailable}
                  activeOpacity={0.7}
                  className={`w-full py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mt-2 ${!isAvailable ? 'bg-gray-300' : 'bg-primary'}`}
                >
                  <Text className={`text-base font-bold ${!isAvailable ? 'text-gray-500' : 'text-white'}`}>
                    {isAvailable ? 'Inscribirse' : 'Inscripción cerrada'}
                  </Text>
                </TouchableOpacity>

                <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-xs text-center leading-relaxed mt-4`}>
                  Tu cupo sera reservado por 10 minutos para completar el pago
                </Text>
              </View>
            </View>

            {/* RIGHT – Image + Description */}
            <View style={{ flex: 60 }}>
              <Animated.View entering={FadeIn.duration(200)} className="h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200">
                <Image
                  source={
                    classItem.image
                      ? { uri: classItem.image }
                      : classItem.title.toLowerCase().includes('zumba')
                      ? require('../../../../../assets/images/zumba.jpg')
                      : classItem.title.toLowerCase().includes('salsa')
                      ? require('../../../../../assets/images/Salsa.jpeg')
                      : require('../../../../../assets/images/bachata.jpg')
                  }
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </Animated.View>

               <Text className="text-gray-600 text-base leading-relaxed mb-8">
                {classItem.theme || 'Sin descripción'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        /* ───── MOBILE SINGLE COLUMN ───── */
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} showsVerticalScrollIndicator={Platform.OS === 'web' && width >= 768} className="flex-1 bg-cream">
          {/* Header Hero Image with Back Button */}
          <Animated.View entering={FadeIn.duration(200)} className="relative w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
            <Image
              source={
                classItem.image
                  ? { uri: classItem.image }
                  : classItem.title.toLowerCase().includes('zumba')
                  ? require('../../../../../assets/images/zumba.jpg')
                  : classItem.title.toLowerCase().includes('salsa')
                  ? require('../../../../../assets/images/Salsa.jpeg')
                  : require('../../../../../assets/images/bachata.jpg')
              }
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* Content Body */}
          <Animated.View entering={FadeInDown.duration(200).delay(50)} className="px-6 py-6 bg-cream rounded-t-[30px] -mt-6 flex-1">
            {/* Title + Status */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-black flex-1 mr-2">{classItem.title}</Text>
              <View className={`px-3 py-1 rounded-full border ${isAvailable ? 'bg-green-100 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
                <Text className={`text-xs font-medium ${isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                  {isAvailable ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-gray-600 text-sm leading-relaxed mb-6">
              {classItem.theme || 'Sin descripción'}
            </Text>

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
                  <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Instructor</Text>
                  <Text className="text-sm font-semibold text-black">{classItem.instructorName}</Text>
                </View>
              </Animated.View>

              {/* Día */}
              <Animated.View entering={FadeInDown.duration(200).delay(130)} className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="calendar-outline" size={20} color="#FF7A00" />
                </View>
                <View>
                  <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Día</Text>
                  <Text className="text-sm font-medium text-black">
                    {realDay}
                  </Text>
                </View>
              </Animated.View>

              {/* Horario */}
              <Animated.View entering={FadeInDown.duration(200).delay(160)} className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="time-outline" size={20} color="#FF7A00" />
                </View>
                <View>
                  <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Horario</Text>
                  <Text className="text-sm font-medium text-black">
                    {(time as string) || classItem.slots?.[0] || '6:00 PM - 7:00 PM'}
                  </Text>
                </View>
              </Animated.View>

              {/* Cupos */}
              <Animated.View entering={FadeInDown.duration(200).delay(190)} className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="people-outline" size={20} color="#FF7A00" />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-end mb-1">
                    <View>
                      <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Cupos</Text>
                      <Text className="text-sm font-medium text-black">
                        {classItem.enrolled}/{classItem.capacity} inscritos
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-black">{capacityPercentage}%</Text>
                  </View>
                  <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <Animated.View style={animatedStyle} className="h-full bg-primary" />
                  </View>
                </View>
              </Animated.View>

              {/* Temática */}
              <Animated.View entering={FadeInDown.duration(200).delay(220)} className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="color-palette-outline" size={20} color="#FF7A00" />
                </View>
                <View>
                  <Text className={`text-[10px] ${isNative ? 'text-gray-600' : 'text-gray-400'} font-medium uppercase`}>Temática</Text>
                  <View className="bg-orange-50 px-3 py-0.5 rounded-full border border-orange-200 mt-0.5">
                    <Text className="text-orange-600 text-xs font-medium">{realTheme}</Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            {/* CTA */}
            <Animated.View entering={FadeInDown.duration(200).delay(250)}>
              <TouchableOpacity
                onPress={handleEnroll}
                disabled={!isAvailable}
                activeOpacity={0.7}
                className={`w-full py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-3 ${!isAvailable ? 'bg-gray-300' : 'bg-primary'}`}
              >
                <Text className={`text-base font-bold ${!isAvailable ? 'text-gray-500' : 'text-white'}`}>
                  {isAvailable ? 'Inscribirse' : 'Inscripción cerrada'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-xs text-center leading-relaxed px-4`}>
              Tu cupo sera reservado por 10 minutos para completar el pago
            </Text>
          </Animated.View>
        </ScrollView>
      )
  );

  if (isWeb) {
    return (
      <ClientDesktopShell title="" subtitle="">
        <View className="flex-1">
          {/* Sticky Header */}
          <View className="bg-cream z-50 px-6 py-3 flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-black">{classItem.title}</Text>
          </View>
          {content}
        </View>
      </ClientDesktopShell>
    );
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
