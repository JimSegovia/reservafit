import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { parseDateTime } from '@/utils/date';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function HorariosDisponiblesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const classes = useAppStore((state) => state.classes);
  const agenda = useAppStore((state) => state.agenda);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const classId = (id as string) || classes[0]?.id || 'c7';
  const classItem = classes.find((c) => c.id === classId) || classes[0];

  const classSessions = useMemo(() => {
    return agenda.filter((a: any) => a.id_clase === classItem?.id);
  }, [agenda, classItem]);

  // Helper to format the session day and date (e.g. Lunes 12/05)
  const getFormattedSessionDay = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayLabel = dayNames[d.getDay()];
    const dayNum = d.getDate().toString().padStart(2, '0');
    const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${dayLabel} ${dayNum}/${monthNum}`;
  };

  const futureSessions = useMemo(() => {
    const today = new Date();
    // Start of today (00:00:00) to allow booking classes that are later today
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    return classSessions.filter((s: any) => {
      const sDate = parseDateTime(s.fecha_hora_inicio);
      return sDate >= startOfToday;
    });
  }, [classSessions]);

  const sortedSessions = useMemo(() => {
    const sorted = [...futureSessions];
    sorted.sort((a: any, b: any) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime());
    return sorted;
  }, [futureSessions]);

  const slots = useMemo(() => {
    return sortedSessions.map((s: any) => {
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
      const teacher = s.instructor ? `Con ${s.instructor.nombre} ${s.instructor.apellidos}` : 'Sin profesor asignado';
      const enrolledCount = s._count?.detalles_reserva || 0;
      
      let status = s.estado || 'Disponible';
      if (enrolledCount >= s.cupos) {
        status = 'Lleno';
      }

      return {
        id_detalle_clase: s.id_detalle_clase,
        id_clase: s.id_clase,
        dateLabel: getFormattedSessionDay(s.fecha_hora_inicio),
        time: timeStr,
        teacher: teacher,
        enrolled: `${enrolledCount}/${s.cupos || 30} inscritos`,
        status: status as 'Disponible' | 'Lleno' | 'Cancelada'
      };
    });
  }, [sortedSessions]);

  const handleSlotSelect = (slot: typeof slots[0]) => {
    if (slot.status === 'Lleno' || slot.status === 'Cancelada') return;
    
    router.push({
      pathname: '/(client)/(tabs)/classes/detail',
      params: { 
        id: slot.id_clase, 
        day: slot.dateLabel, 
        time: slot.time,
        id_detalle_clase: slot.id_detalle_clase
      }
    });
  };

  const content = (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: isWeb ? 0 : 24, paddingVertical: isWeb ? 0 : 16, paddingBottom: 30 }} 
      showsVerticalScrollIndicator={Platform.OS === 'web' && width >= 768}
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

      {/* Slots List */}
      <View className="gap-y-4 mb-6">
        {slots.length === 0 ? (
          <View className="py-12 items-center justify-center bg-white rounded-2xl border border-gray-200 p-6">
            <Ionicons name="calendar-outline" size={40} color="lightgray" />
            <Text className="text-gray-400 font-medium text-sm mt-3 text-center px-4">
              No hay horarios disponibles programados para esta clase en las próximas semanas.
            </Text>
          </View>
        ) : (
          slots.map((slot, index) => {
            let badgeBg = 'bg-gray-100';
            let badgeText = isNative ? 'text-gray-600' : 'text-gray-500';
            let badgeBorder = 'border-gray-200';

            if (slot.status === 'Disponible') {
              badgeBg = 'bg-green-50';
              badgeText = 'text-green-700';
              badgeBorder = 'border-green-200';
            } else if (slot.status === 'Lleno') {
              badgeBg = 'bg-red-50';
              badgeText = 'text-red-700';
              badgeBorder = 'border-red-200';
            } else if (slot.status === 'Cancelada') {
              badgeBg = 'bg-blue-50';
              badgeText = 'text-blue-700';
              badgeBorder = 'border-blue-200';
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
                    <Text className="text-xs font-extrabold text-primary uppercase mb-0.5">{slot.dateLabel}</Text>
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
          })
        )}
      </View>

      {/* Footer info text */}
      <Animated.View entering={FadeInDown.duration(200).delay(120)} className="items-center mt-2 mb-4">
        <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-xs font-bold text-center mb-1`}>
          Mínimo para la clase: 7 personas
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
