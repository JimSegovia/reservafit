import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CalendarScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  
  // Selected Date (defaults to May 12, 2026)
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
        { start: '5 PM', end: '6 PM', class: { id: 'c7', title: 'Zumba', teacher: 'Con Profesor A', colorBg: 'bg-orange-100 border-l-4 border-orange-500', colorText: 'text-orange-800' } },
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
      // Sunday: No classes
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
    // Monday first index
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
    router.push({
      pathname: '/(client)/(tabs)/classes/detail',
      params: { id: classId }
    });
  };

  const content = (
<ScrollView 
         contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} 
         showsVerticalScrollIndicator={false}
       >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)/classes')}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-black">Calendario</Text>
        </Animated.View>

        {/* Week Heading (Actúa como toggle para el calendario anual) */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-4">
          <TouchableOpacity 
            onPress={() => {
              // Sincronizar el mes y año del calendario con la fecha seleccionada antes de abrir
              setCurrentCalendarMonth(selectedDate.getMonth());
              setCurrentCalendarYear(selectedDate.getFullYear());
              setShowYearCalendar(!showYearCalendar);
            }}
            className="flex-row items-center bg-white border border-gray-200 px-4 py-2.5 rounded-full shadow-sm"
          >
            <Text className="text-base font-bold text-black mr-2">
              {formatWeekRange(monday)}
            </Text>
            <Ionicons 
              name={showYearCalendar ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#FF7A00" 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Calendar Anual Desplegable */}
        {showYearCalendar && (
          <Animated.View 
            entering={FadeInDown.duration(200)} 
            className="bg-white border border-gray-200 rounded-3xl p-5 mb-6 shadow-md"
          >
            {/* Month selector header */}
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

            {/* Weekdays legend */}
            <View className="flex-row justify-between mb-2 border-b border-gray-100 pb-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dayL, idx) => (
                <Text key={idx} className="w-[13%] text-center text-xs font-extrabold text-gray-400">
                  {dayL}
                </Text>
              ))}
            </View>

            {/* Monthly grid */}
            <View className="flex-row flex-wrap justify-between gap-y-2">
              {gridCells.map((cellDate, idx) => {
                if (!cellDate) {
                  return <View key={idx} className="w-[13%] aspect-square" />;
                }

                const isSelected = cellDate.getDate() === selectedDate.getDate() &&
                                   cellDate.getMonth() === selectedDate.getMonth() &&
                                   cellDate.getFullYear() === selectedDate.getFullYear();
                
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setSelectedDate(cellDate);
                      setShowYearCalendar(false);
                    }}
                    className={`w-[13%] aspect-square items-center justify-center rounded-xl ${
                      isSelected ? 'bg-primary shadow-sm shadow-orange-500/20' : 'bg-gray-50'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                      {cellDate.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Days Horizontal Scroll/List */}
        <Animated.View entering={FadeInDown.duration(200).delay(100)} className="flex-row justify-between mb-6 px-1">
          {weekDays.map((day, idx) => {
            const isSelected = day.date.getDate() === selectedDate.getDate() && 
                               day.date.getMonth() === selectedDate.getMonth() &&
                               day.date.getFullYear() === selectedDate.getFullYear();
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedDate(day.date)}
                className={`items-center p-2 rounded-xl w-[45px] ${
                  isSelected ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <Text className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                  {day.label}
                </Text>
                <Text className={`text-base font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-black'}`}>
                  {day.num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Hourly Grid */}
        <Animated.View entering={FadeInDown.duration(200).delay(150)} className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-6">
          {timeBlocks.length === 0 || timeBlocks.every(tb => !tb.class) ? (
            <View className="py-12 items-center justify-center bg-white">
              <Ionicons name="calendar-outline" size={40} color="lightgray" />
              <Text className="text-gray-400 font-bold text-sm mt-3">No hay clases programadas para hoy</Text>
            </View>
          ) : (
            timeBlocks.map((block, idx) => (
              <View
                key={idx}
                className={`flex-row min-h-[70px] border-b border-gray-200 last:border-b-0`}
              >
                {/* Hour Label */}
                <View className="w-24 border-r border-gray-200 items-center justify-center p-2 bg-gray-50/50">
                  <Text className="text-xs font-bold text-black">{block.start} - {block.end}</Text>
                </View>

                {/* Class Box */}
                <View className="flex-1 p-2 justify-center">
                  {block.class ? (
                    <TouchableOpacity
                      onPress={() => handleClassClick(block.class!.id)}
                      className={`rounded-xl p-3 flex-row justify-between items-center ${block.class.colorBg}`}
                    >
                      <View>
                        <Text className={`font-bold text-sm ${block.class.colorText}`}>
                          {block.class.title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Ionicons name="person" size={10} color="gray" />
                          <Text className="text-[10px] text-gray-500 ml-1">
                            {block.class.teacher}
                          </Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="gray" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </Animated.View>

        {/* Footer Warning Info */}
        <Animated.View entering={FadeInDown.duration(200).delay(200)} className="flex-row items-center justify-center py-2 mb-4">
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text className="text-xs text-gray-500 font-bold ml-1">
            Las reservas deben ser 3 horas antes
          </Text>
        </Animated.View>
      </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="Calendario" subtitle="Mi semana">{content}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
