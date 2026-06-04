import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { Tooltip } from '@/components/ui/tooltip';
import { Image as ExpoImage } from 'expo-image';

export default function ClassesSelectorScreen() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  // Active Tab: 'categorias' | 'calendario'
  const [activeTab, setActiveTab] = useState<'categorias' | 'calendario'>('categorias');

  // Categorías Tab states
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calendario Tab states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 12));
  const [showYearCalendar, setShowYearCalendar] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(4); // May
  const [currentCalendarYear, setCurrentCalendarYear] = useState(2026);

  const monthsNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Helper to find the Monday of the week for a given date
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    // Sun=0, Mon=1, Tue=2, ...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(selectedDate);
  const weekDays = React.useMemo(() => {
    const labels = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        label: labels[i],
        num: d.getDate(),
        date: d
      };
    });
  }, [monday]);

  const formatWeekRange = (mondayDate: Date) => {
    const saturdayDate = new Date(mondayDate);
    saturdayDate.setDate(mondayDate.getDate() + 5);
    
    const startDay = mondayDate.getDate();
    const startMonth = monthsNames[mondayDate.getMonth()];
    const startYear = mondayDate.getFullYear();
    const endDay = saturdayDate.getDate();
    const endMonth = monthsNames[saturdayDate.getMonth()];
    
    if (mondayDate.getMonth() === saturdayDate.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
  };

  // Grid hourly blocks
  const getTimeBlocks = (date: Date) => {
    const day = date.getDay();
    if (day === 1 || day === 3 || day === 5) {
      return [
        { start: '5 PM', end: '6 PM', class: { id: 'c7', title: 'Zumba', teacher: 'Con Profesor A', colorBg: 'bg-orange-100 border-l-4 border-orange-500', colorText: 'text-orange-850' } },
        { start: '6 PM', end: '7 PM', class: null },
        { start: '7 PM', end: '8 PM', class: null },
        { start: '8 PM', end: '9 PM', class: null },
        { start: '9 PM', end: '10 PM', class: { id: 'c9', title: 'Reggaeton', teacher: 'Con Profesor C', colorBg: 'bg-blue-100 border-l-4 border-blue-500', colorText: 'text-blue-800' } },
      ];
    } else if (day === 2 || day === 4 || day === 6) {
      return [
        { start: '5 PM', end: '6 PM', class: null },
        { start: '6 PM', end: '7 PM', class: null },
        { start: '7 PM', end: '8 PM', class: { id: 'c8', title: 'Salsa', teacher: 'Con Profesor B', colorBg: 'bg-green-100 border-l-4 border-green-500', colorText: 'text-green-800' } },
        { start: '8 PM', end: '9 PM', class: null },
        { start: '9 PM', end: '10 PM', class: null },
      ];
    } else {
      return [
        { start: '5 PM', end: '6 PM', class: null },
        { start: '6 PM', end: '7 PM', class: null },
        { start: '7 PM', end: '8 PM', class: null },
        { start: '8 PM', end: '9 PM', class: null },
        { start: '9 PM', end: '10 PM', class: null },
      ];
    }
  };

  const timeBlocks = getTimeBlocks(selectedDate);

  // Yearly calendar grid cells calculation
  const gridCells = React.useMemo(() => {
    const numDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const cells = [];
    for (let i = 0; i < offset; i++) {
      cells.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
      cells.push(new Date(currentCalendarYear, currentCalendarMonth, i));
    }
    return cells;
  }, [currentCalendarMonth, currentCalendarYear]);

  const handlePrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(currentCalendarYear - 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(currentCalendarYear + 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1);
    }
  };

  const handleClassClick = (classId: string) => {
    if (classId === 'c7') {
      router.push(`/(client)/(tabs)/classes/schedules`);
    } else {
      router.push(`/(client)/(tabs)/classes/detail?id=${classId}`);
    }
  };

  // Filter logic
  const categoryClasses = classes.filter((cls) => {
    if (cls.id !== 'c7' && cls.id !== 'c8' && cls.id !== 'c9') return false;
    
    // Filter by day
    if (selectedDay !== 'Todos') {
      const scheduleLower = cls.schedule.toLowerCase();
      const dayLower = selectedDay.toLowerCase();
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
      <View className="w-full h-32 bg-gray-250" />
      <View className="p-4 items-center">
        <View className="w-28 h-5 bg-gray-200 rounded-full mb-3" />
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
      {/* Tab Selector Web */}
      <View className="flex-row border-b border-gray-200 mb-6 max-w-md mx-auto w-full bg-white p-1 rounded-xl shadow-sm">
        <TouchableOpacity
          onPress={() => setActiveTab('categorias')}
          className={`flex-1 py-3 rounded-lg ${activeTab === 'categorias' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`font-bold text-center text-sm ${activeTab === 'categorias' ? 'text-white' : 'text-gray-500'}`}>
            Categorías
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('calendario')}
          className={`flex-1 py-3 rounded-lg ${activeTab === 'calendario' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`font-bold text-center text-sm ${activeTab === 'calendario' ? 'text-white' : 'text-gray-500'}`}>
            Calendario
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'categorias' ? (
        <Animated.View entering={FadeIn.duration(200)}>
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
                    <Image 
                      source={
                        cls.id === 'c7' 
                          ? require('../../../../../../assets/images/zumba.jpg') 
                          : cls.id === 'c8' 
                          ? require('../../../../../../assets/images/Salsa.jpeg') 
                          : require('../../../../../../assets/images/bachata.jpg')
                      } 
                      className="w-full h-44 object-cover" 
                    />
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
        </Animated.View>
      ) : (
        /* Calendario View Web */
        <Animated.View entering={FadeIn.duration(200)}>
          <View className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Week Heading */}
            <View className="items-center mb-6">
              <TouchableOpacity 
                onPress={() => {
                  setCurrentCalendarMonth(selectedDate.getMonth());
                  setCurrentCalendarYear(selectedDate.getFullYear());
                  setShowYearCalendar(!showYearCalendar);
                }}
                className="flex-row items-center bg-white border border-gray-200 px-5 py-3 rounded-full shadow-sm"
              >
                <Text className="text-base font-bold text-black mr-2">
                  {formatWeekRange(monday)}
                </Text>
                <Ionicons name={showYearCalendar ? "chevron-up" : "chevron-down"} size={18} color="#FF7A00" />
              </TouchableOpacity>
            </View>

            {/* Annual Dropdown */}
            {showYearCalendar && (
              <Animated.View entering={FadeInDown.duration(200)} className="bg-white border border-gray-200 rounded-3xl p-6 mb-6 shadow-md max-w-md mx-auto w-full">
                <View className="flex-row justify-between items-center mb-4 px-1">
                  <TouchableOpacity onPress={handlePrevMonth} className="p-1">
                    <Ionicons name="chevron-back" size={20} color="black" />
                  </TouchableOpacity>
                  <Text className="text-base font-extrabold text-black uppercase">
                    {monthsNames[currentCalendarMonth]} {currentCalendarYear}
                  </Text>
                  <TouchableOpacity onPress={handleNextMonth} className="p-1">
                    <Ionicons name="chevron-forward" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between mb-2 border-b border-gray-100 pb-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dayL, idx) => (
                    <Text key={idx} className="w-[13%] text-center text-xs font-extrabold text-gray-400">{dayL}</Text>
                  ))}
                </View>
                <View className="flex-row flex-wrap justify-between gap-y-2">
                  {gridCells.map((cellDate, idx) => {
                    if (!cellDate) return <View key={idx} className="w-[13%] aspect-square" />;
                    const isSelected = cellDate.getDate() === selectedDate.getDate() && cellDate.getMonth() === selectedDate.getMonth() && cellDate.getFullYear() === selectedDate.getFullYear();
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { setSelectedDate(cellDate); setShowYearCalendar(false); }}
                        className={`w-[13%] aspect-square items-center justify-center rounded-xl ${isSelected ? 'bg-primary shadow-sm shadow-orange-500/20' : 'bg-gray-50'}`}
                      >
                        <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{cellDate.getDate()}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Week Days List */}
            <View className="flex-row justify-between mb-6 px-1 max-w-xl mx-auto w-full">
              {weekDays.map((day, idx) => {
                const isSelected = day.date.getDate() === selectedDate.getDate() && day.date.getMonth() === selectedDate.getMonth() && day.date.getFullYear() === selectedDate.getFullYear();
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDate(day.date)}
                    className={`items-center p-3 rounded-xl w-[55px] ${isSelected ? 'bg-primary shadow-sm' : 'bg-gray-55'}`}
                  >
                    <Text className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day.label}</Text>
                    <Text className={`text-lg font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-black'}`}>{day.num}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time Blocks */}
            <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-6 max-w-2xl mx-auto w-full">
              {timeBlocks.length === 0 || timeBlocks.every(tb => !tb.class) ? (
                <View className="py-12 items-center justify-center bg-white">
                  <Ionicons name="calendar-outline" size={40} color="lightgray" />
                  <Text className="text-gray-400 font-bold text-sm mt-3">No hay clases programadas para hoy</Text>
                </View>
              ) : (
                timeBlocks.map((block, idx) => (
                  <View key={idx} className="flex-row min-h-[80px] border-b border-gray-200 last:border-b-0">
                    <View className="w-32 border-r border-gray-200 items-center justify-center p-2 bg-gray-50/50">
                      <Text className="text-sm font-bold text-black">{block.start} - {block.end}</Text>
                    </View>
                    <View className="flex-1 p-2.5 justify-center">
                      {block.class ? (
                        <TouchableOpacity
                          onPress={() => handleClassClick(block.class!.id)}
                          className={`rounded-xl p-4 flex-row justify-between items-center ${block.class.colorBg}`}
                        >
                          <View>
                            <Text className={`font-bold text-base ${block.class.colorText}`}>{block.class.title}</Text>
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="person" size={12} color="gray" />
                              <Text className="text-xs text-gray-500 ml-1">{block.class.teacher}</Text>
                            </View>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="gray" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                ))
              )}
            </View>

            <View className="flex-row items-center justify-center py-2">
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text className="text-xs text-gray-500 font-bold ml-1">Las reservas deben ser realizadas al menos 3 horas antes.</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="Mis clases" subtitle="Elige el tipo de clase que quieres reservar o consulta el calendario.">{desktopContent}</ClientDesktopShell>;
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Mobile Headers */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={activeTab === 'categorias' ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7A00']} /> : undefined}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(200)} className="mb-4">
          <Text className="text-2xl font-extrabold text-black text-center mt-2">
            Reserva tu próxima clase
          </Text>
        </Animated.View>

        {/* Tab Headers Mobile */}
        <View className="flex-row border-b border-gray-200 mb-6">
          <TouchableOpacity 
            onPress={() => setActiveTab('categorias')}
            className={`flex-1 pb-3 border-b-2 ${activeTab === 'categorias' ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-center text-base ${activeTab === 'categorias' ? 'text-primary' : 'text-gray-400'}`}>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('calendario')}
            className={`flex-1 pb-3 border-b-2 ${activeTab === 'calendario' ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-center text-base ${activeTab === 'calendario' ? 'text-primary' : 'text-gray-400'}`}>Calendario</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'categorias' ? (
          <Animated.View entering={FadeIn.duration(200)}>
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
                    <Image
                      source={
                        cls.id === 'c7'
                          ? require('../../../../../../assets/images/zumba.jpg')
                          : cls.id === 'c8'
                          ? require('../../../../../../assets/images/Salsa.jpeg')
                          : require('../../../../../../assets/images/bachata.jpg')
                      }
                      className="w-full h-32 object-cover"
                    />

                    <View className="p-4 items-center">
                      <Text className="text-lg font-extrabold text-black mb-1">{cls.title}</Text>

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

                      {/* Instructor and Price visible on Card */}
                      <View className="flex-row justify-between w-full border-t border-gray-100 pt-3 px-2 mb-2">
                        <Text className="text-xs font-semibold text-gray-500">Instructor: {cls.instructorName}</Text>
                        <Text className="text-xs font-bold text-primary">Precio: S/ {cls.price.toFixed(2)}</Text>
                      </View>

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
          </Animated.View>
        ) : (
          /* Calendario View Mobile */
          <Animated.View entering={FadeIn.duration(200)}>
            {/* Week Range heading */}
            <View className="items-center mb-4 mt-2">
              <TouchableOpacity 
                onPress={() => {
                  setCurrentCalendarMonth(selectedDate.getMonth());
                  setCurrentCalendarYear(selectedDate.getFullYear());
                  setShowYearCalendar(!showYearCalendar);
                }}
                className="flex-row items-center bg-white border border-gray-200 px-4 py-2.5 rounded-full shadow-sm"
              >
                <Text className="text-sm font-bold text-black mr-2">
                  {formatWeekRange(monday)}
                </Text>
                <Ionicons name={showYearCalendar ? "chevron-up" : "chevron-down"} size={18} color="#FF7A00" />
              </TouchableOpacity>
            </View>

            {/* Annual Calendar desplegable */}
            {showYearCalendar && (
              <Animated.View entering={FadeInDown.duration(200)} className="bg-white border border-gray-200 rounded-3xl p-5 mb-6 shadow-md">
                <View className="flex-row justify-between items-center mb-4 px-1">
                  <TouchableOpacity onPress={handlePrevMonth} className="p-1">
                    <Ionicons name="chevron-back" size={20} color="black" />
                  </TouchableOpacity>
                  <Text className="text-sm font-extrabold text-black uppercase">
                    {monthsNames[currentCalendarMonth]} {currentCalendarYear}
                  </Text>
                  <TouchableOpacity onPress={handleNextMonth} className="p-1">
                    <Ionicons name="chevron-forward" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between mb-2 border-b border-gray-100 pb-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dayL, idx) => (
                    <Text key={idx} className="w-[13%] text-center text-xs font-extrabold text-gray-400">{dayL}</Text>
                  ))}
                </View>
                <View className="flex-row flex-wrap justify-between gap-y-2">
                  {gridCells.map((cellDate, idx) => {
                    if (!cellDate) return <View key={idx} className="w-[13%] aspect-square" />;
                    const isSelected = cellDate.getDate() === selectedDate.getDate() && cellDate.getMonth() === selectedDate.getMonth() && cellDate.getFullYear() === selectedDate.getFullYear();
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { setSelectedDate(cellDate); setShowYearCalendar(false); }}
                        className={`w-[13%] aspect-square items-center justify-center rounded-xl ${isSelected ? 'bg-primary shadow-sm shadow-orange-500/20' : 'bg-gray-50'}`}
                      >
                        <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{cellDate.getDate()}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Days list selector */}
            <View className="flex-row justify-between mb-6 px-1 mt-2">
              {weekDays.map((day, idx) => {
                const isSelected = day.date.getDate() === selectedDate.getDate() && day.date.getMonth() === selectedDate.getMonth() && day.date.getFullYear() === selectedDate.getFullYear();
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDate(day.date)}
                    className={`items-center p-2 rounded-xl w-[45px] ${isSelected ? 'bg-primary' : 'bg-transparent'}`}
                  >
                    <Text className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day.label}</Text>
                    <Text className={`text-base font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-black'}`}>{day.num}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time slot lists */}
            <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-6">
              {timeBlocks.length === 0 || timeBlocks.every(tb => !tb.class) ? (
                <View className="py-12 items-center justify-center bg-white">
                  <Ionicons name="calendar-outline" size={40} color="lightgray" />
                  <Text className="text-gray-400 font-bold text-sm mt-3">No hay clases programadas para hoy</Text>
                </View>
              ) : (
                timeBlocks.map((block, idx) => (
                  <View key={idx} className="flex-row min-h-[70px] border-b border-gray-200 last:border-b-0">
                    <View className="w-24 border-r border-gray-200 items-center justify-center p-2 bg-gray-50/50">
                      <Text className="text-xs font-bold text-black">{block.start} - {block.end}</Text>
                    </View>
                    <View className="flex-1 p-2 justify-center">
                      {block.class ? (
                        <TouchableOpacity
                          onPress={() => handleClassClick(block.class!.id)}
                          className={`rounded-xl p-3 flex-row justify-between items-center ${block.class.colorBg}`}
                        >
                          <View>
                            <Text className={`font-bold text-sm ${block.class.colorText}`}>{block.class.title}</Text>
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="person" size={10} color="gray" />
                              <Text className="text-[10px] text-gray-500 ml-1">{block.class.teacher}</Text>
                            </View>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color="gray" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Footer warning */}
            <View className="flex-row items-center justify-center py-2 mb-4">
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text className="text-xs text-gray-500 font-bold ml-1">Las reservas deben ser 3 horas antes</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
