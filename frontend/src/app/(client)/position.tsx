import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function PositionSelectorScreen() {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const occupiedSeats = useAppStore((state) => state.occupiedSeats);
  const selectSeat = useAppStore((state) => state.selectSeat);
  const deselectSeat = useAppStore((state) => state.deselectSeat);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const clearBooking = useAppStore((state) => state.clearBooking);

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

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-4">
        {/* Header */}
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
    </SafeAreaView>
  );
}
