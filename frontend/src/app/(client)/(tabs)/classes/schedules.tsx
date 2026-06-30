import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { parseDateTime } from '@/utils/date';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function HorariosDisponiblesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const classes = useAppStore((state) => state.classes);
  const agenda = useAppStore((state) => state.agenda);
  const occupiedSeats = useAppStore((state) => state.occupiedSeats);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const classId = (id as string) || classes[0]?.id || 'c7';
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  const classSessions = useMemo(() => {
    return agenda.filter((a: any) => a.id_clase === classItem?.id);
  }, [agenda, classItem]);

  // Dynamically generate the next 90 days from today
  const days = useMemo(() => {
    const result = [];
    const current = new Date();
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const dayNames = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    const fullDayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    for (let i = 0; i < 90; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      const day = d.getDay();
      const dayNum = d.getDate().toString().padStart(2, '0');
      const monthLabel = months[d.getMonth()];
      result.push({
        id: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        dayName: dayNames[day],
        dayNum,
        monthLabel,
        fullLabel: `${fullDayNames[day]} ${dayNum}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        date: new Date(d)
      });
    }
    return result;
  }, []);

  // Initial selected day is index 1 (second date generated, e.g. Wed May 13 or similar)
  const [selectedDay, setSelectedDay] = useState(days[1].fullLabel);

  // Auto-scroll centering logic
  useEffect(() => {
    const selectedIdx = days.findIndex(d => d.fullLabel === selectedDay);
    if (selectedIdx !== -1 && scrollRef.current) {
      const cardWidth = 74;
      const screenWidth = Dimensions.get('window').width || 375;
      const offset = selectedIdx * cardWidth - screenWidth / 2 + 32;
      
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, offset), y: 0, animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedDay, days]);

  const slots = useMemo(() => {
    const selectedDayObj = days.find(d => d.fullLabel === selectedDay);
    if (!selectedDayObj) return [];
    
    const targetDate = selectedDayObj.date;
    
    const matchingSessions = classSessions.filter((s: any) => {
      const sDate = parseDateTime(s.fecha_hora_inicio);
      return sDate.getDate() === targetDate.getDate() &&
             sDate.getMonth() === targetDate.getMonth() &&
             sDate.getFullYear() === targetDate.getFullYear();
    });

    if (matchingSessions.length > 0) {
      return matchingSessions.map((s: any) => {
        const startTime = parseDateTime(s.fecha_hora_inicio);
        const endTime = parseDateTime(s.fecha_hora_fin);
        
        const formatTime = (d: Date) => {
          let hours = d.getHours();
          const minutes = d.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          return `${hours}:${minutes} ${ampm}`;
        };

        const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        const teacher = s.instructor ? `Con ${s.instructor.nombre} ${s.instructor.apellidos}` : 'Con Instructor';
        const enrolledCount = s._count?.detalles_reserva || 0;
        
        return {
          id_detalle_clase: s.id_detalle_clase,
          time: timeStr,
          teacher: teacher,
          enrolled: `${enrolledCount}/${s.cupos || 30}`,
          status: s.estado as 'Disponible' | 'Lleno' | 'Cancelada'
        };
      });
    }

    return [
      { 
        id_detalle_clase: undefined as string | undefined, 
        time: '6:00 PM - 7:00 PM', 
        teacher: `Con ${classItem?.instructorName || 'Profesor'}`, 
        enrolled: '0/30', 
        status: 'Disponible' as const 
      }
    ];
  }, [selectedDay, classSessions, classItem, occupiedSeats, days]);

  const handleSlotSelect = (slot: typeof slots[0]) => {
    if (slot.status === 'Lleno' || slot.status === 'Cancelada') return;
    
    router.push({
      pathname: '/(client)/(tabs)/classes/detail',
      params: { 
        id: classItem.id, 
        day: selectedDay, 
        time: slot.time,
        id_detalle_clase: slot.id_detalle_clase || ''
      }
    });
  };

  const content = (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: isWeb ? 0 : 24, paddingVertical: isWeb ? 0 : 16, paddingBottom: 30 }} 
      showsVerticalScrollIndicator={false}
    >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center mb-6">
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-xl font-extrabold text-black">Horarios Disponibles</Text>
            <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold`}>Clase: {classItem?.title || 'Clase'}</Text>
          </View>
          <View className="w-10" />
        </Animated.View>

        {/* Day selection tabs (Rueda/Carrusel horizontal) */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)}>
          <ScrollView 
            ref={scrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="flex-row mb-6 py-2"
            contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
          >
            {days.map((day) => {
              const isSelected = day.fullLabel === selectedDay;
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => setSelectedDay(day.fullLabel)}
                  className={`w-16 h-20 rounded-2xl border items-center justify-between py-2.5 px-1 shadow-sm ${
                    isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                  }`}
                  style={isSelected ? { transform: [{ scale: 1.04 }] } : {}}
                >
                  <Text
                    className={`text-[9px] font-extrabold text-center uppercase tracking-wider ${
                      isSelected ? 'text-white/80' : (isNative ? 'text-gray-600' : 'text-gray-400')
                    }`}
                  >
                    {day.monthLabel}
                  </Text>
                  <Text
                    className={`text-xl font-extrabold text-center leading-none mt-0.5 ${
                      isSelected ? 'text-white' : 'text-black'
                    }`}
                  >
                    {day.dayNum}
                  </Text>
                  <Text
                    className={`text-[9px] font-extrabold text-center uppercase ${
                      isSelected ? 'text-white' : (isNative ? 'text-gray-600' : 'text-gray-500')
                    }`}
                  >
                    {day.dayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Slots List */}
        <View className="gap-y-4 mb-6">
          {slots.map((slot, index) => {
            let badgeBg = 'bg-gray-100';
            let badgeText = isNative ? 'text-gray-600' : 'text-gray-500';
            let badgeBorder = 'border-gray-200';

            if (slot.status === 'Disponible') {
              badgeBg = 'bg-green-50';
              badgeText = 'text-green-700';
              badgeBorder = 'border-green-300';
            } else if (slot.status === 'Lleno') {
              badgeBg = 'bg-red-50';
              badgeText = 'text-red-700';
              badgeBorder = 'border-red-300';
            } else if (slot.status === 'Cancelada') {
              badgeBg = 'bg-blue-50';
              badgeText = 'text-blue-700';
              badgeBorder = 'border-blue-300';
            }

            return (
              <Animated.View key={index} entering={FadeInDown.duration(200).delay(50 + index * 15)}>
                <TouchableOpacity
                  onPress={() => handleSlotSelect(slot)}
                  disabled={slot.status === 'Lleno' || slot.status === 'Cancelada'}
                  className={`bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center ${
                    slot.status === 'Lleno' || slot.status === 'Cancelada' ? 'opacity-60' : ''
                  }`}
                >
                  <View>
                    <Text className="text-base font-extrabold text-black mb-1">{slot.time}</Text>
                    <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} mb-1`}>{slot.teacher}</Text>
                    <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-400'} font-bold`}>{slot.enrolled}</Text>
                  </View>

                  <View className={`px-3 py-1 rounded-full border ${badgeBg} ${badgeBorder}`}>
                    <Text className={`text-xs font-bold ${badgeText}`}>{slot.status}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Footer info text */}
        <Animated.View entering={FadeInDown.duration(200).delay(120)} className="items-center mt-2 mb-4">
          <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-xs font-bold text-center mb-1`}>
            Minimo para la clase: 7 personas
          </Text>
          <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-xs font-bold text-center`}>
            Las reservas deben ser 3 horas antes
          </Text>
        </Animated.View>
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="Horarios Disponibles" subtitle={`Clase: ${classItem?.title || 'Clase'}`}>{content}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
