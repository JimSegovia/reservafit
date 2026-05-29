import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

export default function PositionSelectorScreen() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const occupiedSeats = useAppStore((state) => state.occupiedSeats);
  const selectSeat = useAppStore((state) => state.selectSeat);
  const deselectSeat = useAppStore((state) => state.deselectSeat);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const clearBooking = useAppStore((state) => state.clearBooking);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  // If no booking is active, go back
  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking]);

  // Countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentBooking) return null;

  const lockKey = `${currentBooking.classId}_${currentBooking.day}_${currentBooking.time}`;
  const occupiedList = occupiedSeats[lockKey] || [];

  const handleSeatPress = (seatNum: number) => {
    if (occupiedList.includes(seatNum)) return;
    
    if (currentBooking.selectedSeats.includes(seatNum)) {
      deselectSeat(seatNum);
    } else {
      selectSeat(seatNum);
    }
  };

  const handleContinue = () => {
    if (currentBooking.selectedSeats.length === 0) return;
    router.push('/(client)/checkout');
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate 30 seats
  const seatNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  const mobileContent = (
    <ScrollView contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}>
      <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => {
            clearBooking();
            router.back();
          }}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-extrabold text-black uppercase">{currentBooking.className}</Text>
            <Text className="text-xs text-gray-500 font-bold">
              {currentBooking.day.split(' ')[0]}, {currentBooking.time}
            </Text>
          </View>
        </Animated.View>

        {/* Sala Unique Card */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
          <View className="mb-4">
            <Text className="text-base font-extrabold text-black">Sala Única</Text>
            <Text className="text-xs text-gray-400 font-bold">Cupos: 30 alumnos</Text>
          </View>

          {/* Seat Grid Map 6 columns */}
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {seatNumbers.map((seatNum, idx) => {
              const isOccupied = occupiedList.includes(seatNum);
              const isSelected = currentBooking.selectedSeats.includes(seatNum);

              let bgStyle = 'bg-white border-gray-300';
              let textStyle = 'text-black';

              if (isOccupied) {
                bgStyle = 'bg-gray-300 border-gray-300';
                textStyle = 'text-gray-500';
              } else if (isSelected) {
                bgStyle = 'bg-primary border-primary';
                textStyle = 'text-white';
              }

              return (
                <Animated.View 
                  key={seatNum} 
                  entering={ZoomIn.duration(150).delay(50 + idx * 8)} 
                  className="w-[14%] aspect-square"
                >
                  <TouchableOpacity
                    onPress={() => handleSeatPress(seatNum)}
                    disabled={isOccupied}
                    className={`w-full h-full border rounded-xl items-center justify-center ${bgStyle}`}
                  >
                    <Text className={`text-sm font-bold ${textStyle}`}>{seatNum}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Legend */}
        <Animated.View entering={FadeIn.duration(200).delay(150)} className="flex-row justify-around mb-8">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full border border-gray-350 bg-white mr-1.5" />
            <Text className="text-xs font-bold text-gray-500">Disponible</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-primary mr-1.5" />
            <Text className="text-xs font-bold text-gray-500">Seleccionado</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-gray-300 mr-1.5" />
            <Text className="text-xs font-bold text-gray-500">Ocupado</Text>
          </View>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View entering={FadeInDown.duration(200).delay(180)}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={currentBooking.selectedSeats.length === 0}
            activeOpacity={0.8}
            className={`w-full py-4 rounded-2xl items-center shadow-lg mb-4 ${
              currentBooking.selectedSeats.length === 0
                ? 'bg-gray-300 shadow-none'
                : 'bg-primary shadow-orange-500/20'
            }`}
          >
            <Text className="text-white text-base font-bold">Continuar con el pago</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Countdown */}
        <Animated.View entering={FadeIn.duration(200).delay(210)} className="flex-row items-center justify-center py-2 mb-4">
          <Ionicons name="time-outline" size={16} color="black" />
          <Text className="text-xs text-black font-semibold ml-1.5">
            Reserva bloqueada por {formatTime(currentBooking.timeLeft)} min
          </Text>
        </Animated.View>
    </ScrollView>
  );

  const desktopContent = (
    <View className="flex-row gap-x-6">
      <View className="w-[260px]">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 w-12 h-12 items-center justify-center">
          <Ionicons name="arrow-back" size={34} color="black" />
        </TouchableOpacity>
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <Text className="text-[22px] font-bold text-black uppercase">{currentBooking.className}</Text>
          <Text className="text-[16px] text-gray-600 mt-1">{currentBooking.day.split(' ')[0]}, {currentBooking.time}</Text>
        </View>
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <Text className="text-[18px] font-bold text-black mb-5">Profesor C</Text>
          <Text className="text-[14px] text-gray-600">Cupos: 30 espacios</Text>
        </View>
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <View className="flex-row items-center mb-5"><View className="w-5 h-5 rounded-full border border-black mr-4" /><Text className="text-[15px]">Disponible</Text></View>
          <View className="flex-row items-center mb-5"><View className="w-5 h-5 rounded-full bg-primary mr-4" /><Text className="text-[15px] text-primary">Seleccionado</Text></View>
          <View className="flex-row items-center"><View className="w-5 h-5 rounded-full bg-gray-300 mr-4" /><Text className="text-[15px] text-gray-500">Ocupado</Text></View>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
        <Text className="text-[30px] font-bold text-black text-center uppercase">{currentBooking.className}</Text>
        <Text className="text-[18px] text-gray-600 text-center mt-1">De {currentBooking.time}</Text>
        <View className="flex-row flex-wrap justify-between gap-y-4 mt-8">
          {seatNumbers.map((seatNum, idx) => {
            const isOccupied = occupiedList.includes(seatNum);
            const isSelected = currentBooking.selectedSeats.includes(seatNum);
            const bgStyle = isOccupied ? 'bg-gray-300 border-gray-300' : isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300';
            const textStyle = isOccupied ? 'text-gray-500' : isSelected ? 'text-white' : 'text-black';
            return (
              <Animated.View key={seatNum} entering={ZoomIn.duration(120).delay(20 + idx * 5)} className="w-[13%] aspect-square">
                <TouchableOpacity onPress={() => handleSeatPress(seatNum)} disabled={isOccupied} className={`w-full h-full border rounded-xl items-center justify-center ${bgStyle}`}>
                  <Text className={`text-xl font-bold ${textStyle}`}>{seatNum}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View className="w-[300px]">
        <View className="bg-[#f7e1c7] rounded-2xl p-5 mb-6 border border-[#f1d0ae]">
          <View className="flex-row items-center gap-x-4">
            <Ionicons name="time-outline" size={30} color="#333" />
            <Text className="text-[22px] font-medium">Reserva bloqueada por 10 minutos</Text>
          </View>
          <View className="h-3 bg-gray-200 rounded-full mt-6 overflow-hidden"><View className="h-full w-[58%] bg-primary" /></View>
        </View>
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-[22px] mb-2">Cupos seleccionados:</Text>
          <Text className="text-[22px] font-bold mb-6">{currentBooking.selectedSeats.join(', ') || '-'}</Text>
          <TouchableOpacity onPress={handleContinue} disabled={currentBooking.selectedSeats.length === 0} className={`rounded-xl py-4 items-center ${currentBooking.selectedSeats.length === 0 ? 'bg-gray-300' : 'bg-primary'}`}>
            <Text className="text-white text-[18px] font-bold">Pagar reserva</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isWeb) {
    return <ClientDesktopShell title={currentBooking.className} subtitle={`${currentBooking.day.split(' ')[0]}, ${currentBooking.time}`}>{desktopContent}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{mobileContent}</SafeAreaView>;
}
