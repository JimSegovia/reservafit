import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Tooltip } from '@/components/ui/tooltip';

export default function ClassesSelectorScreen() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  // Filter states
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter logic
  const categoryClasses = classes.filter((cls) => {
    if (cls.id !== 'c7' && cls.id !== 'c8' && cls.id !== 'c9') return false;
    
    // Filter by day
    if (selectedDay !== 'Todos') {
      const scheduleLower = cls.schedule.toLowerCase();
      const dayLower = selectedDay.toLowerCase();
      // schedule may contain 'Lunes', 'Martes', 'Miercoles', etc.
      // normalize 'miercoles' for easy search
      const normalizedSchedule = scheduleLower.replace('miércoles', 'miercoles').replace('sábado', 'sabado');
      const normalizedDay = dayLower.replace('miércoles', 'miercoles').replace('sábado', 'sabado');
      if (!normalizedSchedule.includes(normalizedDay)) return false;
    }

    // Filter by theme/title category
    if (selectedTheme !== 'Todos') {
      const titleLower = cls.title.toLowerCase();
      const themeLower = selectedTheme.toLowerCase();
      if (!titleLower.includes(themeLower)) return false;
    }

    return true;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Clases actualizadas.', 'success');
    }, 1200);
  };

  const handleFilterDay = (day: string) => {
    setSelectedDay(day);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleFilterTheme = (theme: string) => {
    setSelectedTheme(theme);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const daysFilterOptions = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const themeFilterOptions = ['Todos', 'Salsa', 'Bachata', 'Zumba', 'Reageton'];

  const SkeletonCard = () => (
    <View className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-6 animate-pulse">
      <View className="w-full h-32 bg-gray-200" />
      <View className="p-4 items-center">
        <View className="w-28 h-5 bg-gray-250 rounded-full mb-3" />
        <View className="w-40 h-3 bg-gray-200 rounded-full mb-4" />
        <View className="w-full h-[1px] bg-gray-100 my-2" />
        <View className="flex-row justify-between w-full px-2 mt-1">
          <View className="w-20 h-3 bg-gray-200 rounded-full" />
          <View className="w-16 h-3 bg-gray-200 rounded-full" />
        </View>
      </View>
    </View>
  );

  const desktopContent = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Filters in Desktop */}
      <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <Text className="text-[16px] font-bold text-black mb-3">Filtros de búsqueda</Text>
        <View className="flex-row flex-wrap gap-4 mb-4">
          <View className="flex-1 min-w-[200px]">
            <View className="flex-row items-center mb-2">
              <Text className="text-xs text-gray-500 font-bold">Filtrar por Día</Text>
              <Tooltip content="Muestra únicamente las clases que se dictan el día seleccionado." className="ml-1" />
            </View>
            <View className="flex-row flex-wrap gap-2">
              {daysFilterOptions.map(day => (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleFilterDay(day)}
                  className={`px-3 py-1.5 rounded-lg border text-xs ${selectedDay === day ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                >
                  <Text className={`text-xs font-bold ${selectedDay === day ? 'text-white' : 'text-gray-700'}`}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-1 min-w-[200px]">
            <View className="flex-row items-center mb-2">
              <Text className="text-xs text-gray-500 font-bold">Filtrar por Disciplina</Text>
              <Tooltip content="Filtra las clases según la disciplina o tipo de actividad (ej. Salsa, Zumba)." className="ml-1" />
            </View>
            <View className="flex-row flex-wrap gap-2">
              {themeFilterOptions.map(theme => (
                <TouchableOpacity
                  key={theme}
                  onPress={() => handleFilterTheme(theme)}
                  className={`px-3 py-1.5 rounded-lg border text-xs ${selectedTheme === theme ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                >
                  <Text className={`text-xs font-bold ${selectedTheme === theme ? 'text-white' : 'text-gray-700'}`}>{theme}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-[18px] font-bold text-black">Selecciona el tipo de clase</Text>
            <Text className="text-gray-500 font-medium mt-1 text-[13px]">Elige la clase que más te guste y reserva tu cupo</Text>
          </View>
        </View>
        
        {loading ? (
          <View className="flex-row gap-x-3 mt-4">
            <View className="flex-1"><SkeletonCard /></View>
            <View className="flex-1"><SkeletonCard /></View>
            <View className="flex-1"><SkeletonCard /></View>
          </View>
        ) : categoryClasses.length === 0 ? (
          <View className="py-12 items-center justify-center">
            <Ionicons name="search-outline" size={48} color="#FF7A00" className="opacity-40" />
            <Text className="text-gray-500 font-bold text-base mt-4">No se encontraron clases con los filtros seleccionados.</Text>
            <TouchableOpacity onPress={() => { setSelectedDay('Todos'); setSelectedTheme('Todos'); }} className="bg-primary px-6 py-2.5 rounded-full mt-4">
              <Text className="text-white font-bold text-sm">Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4 mt-4">
            {categoryClasses.map((cls) => (
              <View key={cls.id} className="w-[31%] border border-gray-200 rounded-2xl overflow-hidden bg-white">
                <Image source={{ uri: cls.id === 'c7' ? 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop' : cls.id === 'c8' ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop' }} className="w-full h-44 object-cover" />
                <View className="p-4">
                  <Text className="text-[16px] font-extrabold text-black">{cls.title}</Text>
                  <Text className="text-gray-500 mt-2 leading-5 text-[13px] min-h-[60px]">{cls.id === 'c7' ? 'Ritmo, sabor y diversión. Aprende los pasos básicos y avanza a tu ritmo' : cls.id === 'c8' ? 'Conecta y disfruta. Desde lo básico hasta combinaciones avanzadas' : 'Energía y movimiento. Quema calorías mientras te diviertes.'}</Text>
                  
                  {/* Visual relevant details on card (H6) */}
                  <View className="mt-3 gap-y-1.5 border-t border-b border-gray-100 py-3 my-2">
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="#FF7A00" className="mr-1.5" />
                      <Text className="text-[13px] text-gray-500 font-semibold">{cls.schedule}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="person-outline" size={14} color="#FF7A00" className="mr-1.5" />
                      <Text className="text-[13px] text-gray-500 font-semibold">Profesor: {cls.instructorName}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="wallet-outline" size={14} color="#FF7A00" className="mr-1.5" />
                      <Text className="text-[13px] text-primary font-bold">Precio: S/ {cls.price.toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/classes/schedules')} className="bg-primary rounded-xl py-3 items-center mt-3">
                    <Text className="text-white font-bold text-sm">Ver horarios</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="Mis clases" subtitle="Elige el tipo de clase que quieres reservar o consulta el calendario.">{desktopContent}</ClientDesktopShell>;
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7A00']} />}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(200)} className="mb-4">
          <Text className="text-2xl font-extrabold text-black text-center mt-2">
            Reserva tu próxima clase
          </Text>
        </Animated.View>

        {/* Tab Headers */}
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

        {/* Filters Panel Mobile */}
        <View className="mb-6">
          {/* Day Filters Horizontal */}
          <View className="flex-row items-center mb-2 ml-1">
            <Text className="text-xs text-gray-500 font-bold">Filtrar por Día</Text>
            <Tooltip content="Muestra únicamente las clases que se dictan el día seleccionado." className="ml-1" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-x-2 pb-3 mb-2">
            {daysFilterOptions.map(day => (
              <TouchableOpacity
                key={day}
                onPress={() => handleFilterDay(day)}
                className={`px-4 py-2 rounded-full border ${selectedDay === day ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
              >
                <Text className={`text-xs font-bold ${selectedDay === day ? 'text-white' : 'text-gray-700'}`}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Theme Filters Horizontal */}
          <View className="flex-row items-center mb-2 ml-1">
            <Text className="text-xs text-gray-500 font-bold">Filtrar por Disciplina</Text>
            <Tooltip content="Filtra las clases según la disciplina o tipo de actividad (ej. Salsa, Zumba)." className="ml-1" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-x-2 pb-1">
            {themeFilterOptions.map(theme => (
              <TouchableOpacity
                key={theme}
                onPress={() => handleFilterTheme(theme)}
                className={`px-4 py-2 rounded-full border ${selectedTheme === theme ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
              >
                <Text className={`text-xs font-bold ${selectedTheme === theme ? 'text-white' : 'text-gray-700'}`}>{theme}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Catalog List */}
        <View className="gap-y-6 mb-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : categoryClasses.length === 0 ? (
            <View className="py-12 items-center justify-center bg-white rounded-3xl border border-gray-100 p-6">
              <Ionicons name="search-outline" size={40} color="#FF7A00" className="opacity-40" />
              <Text className="text-gray-500 font-bold text-sm text-center mt-3">No hay clases que coincidan con la búsqueda.</Text>
              <TouchableOpacity onPress={() => { setSelectedDay('Todos'); setSelectedTheme('Todos'); }} className="bg-primary px-6 py-2.5 rounded-full mt-4">
                <Text className="text-white font-bold text-xs">Limpiar filtros</Text>
              </TouchableOpacity>
            </View>
          ) : (
            categoryClasses.map((cls, idx) => (
              <Animated.View
                key={cls.id}
                entering={FadeInDown.duration(200).delay(idx * 40)}
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
                  <Text className="text-lg font-extrabold text-black mb-1">{cls.title}</Text>

                  {/* Sub-info layout (H6) */}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="calendar-outline" size={14} color="#FF7A00" className="mr-1" />
                    <Text className="text-gray-400 text-xs font-semibold">
                      {cls.id === 'c7'
                        ? 'Lunes - Miércoles - Viernes'
                        : cls.id === 'c8'
                        ? 'Martes - Jueves - Sábado'
                        : 'Lunes - Jueves - Viernes'}
                    </Text>
                  </View>

                  {/* Instructor and Price visible on Card (H6) */}
                  <View className="flex-row justify-between w-full border-t border-gray-100 pt-3 px-2 mb-2">
                    <Text className="text-xs font-semibold text-gray-500">Instructor: {cls.instructorName}</Text>
                    <Text className="text-xs font-bold text-primary">Precio: S/ {cls.price.toFixed(2)}</Text>
                  </View>

                  {/* View Details Link */}
                  <TouchableOpacity
                    onPress={() => {
                      if (cls.id === 'c7') {
                        router.push(`/(client)/(tabs)/classes/schedules`);
                      } else {
                        router.push(`/(client)/(tabs)/classes/detail?id=${cls.id}`);
                      }
                    }}
                    className="py-2.5 w-full items-center border-t border-gray-50 mt-2"
                  >
                    <Text className="text-primary font-bold text-sm">Ver horarios y reservar</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
