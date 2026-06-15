import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import api from '@/api/api';

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

  const [occupiedList, setOccupiedList] = useState<number[]>([]);

  // If no booking is active, go back
  useEffect(() => {
    if (!currentBooking) {
      router.replace('/(client)/(tabs)/classes');
    }
  }, [currentBooking]);

  // Fetch occupied seats from the backend
  useEffect(() => {
    const fetchOccupied = async () => {
      if (!currentBooking?.id_detalle_clase) return;
      try {
        const response = await api.get(`/detalles-reserva/ocupados/${currentBooking.id_detalle_clase}`);
        setOccupiedList(response.data.data || []);
      } catch (err) {
        console.error('Error fetching occupied seats:', err);
      }
    };
    fetchOccupied();
  }, [currentBooking]);

  // Countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentBooking) return null;

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
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}>
      <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => {
          clearBooking();
          router.back();
        }}>
          <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-black uppercase">{currentBooking.className}</Text>
          <Text className="text-xs text-gray-500 font-bold mt-0.5">
            {currentBooking.day.split(' ')[0]}, {currentBooking.time} • Instructor: {currentBooking.instructorName} • S/ {currentBooking.pricePerSeat.toFixed(2)} c/u
          </Text>
        </View>
      </Animated.View>

      {/* Step Indicator (H3) */}
      <View className="flex-row items-center justify-center mb-6 gap-x-2 px-2">
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-orange-200 items-center justify-center"><Text className="text-[10px] font-bold text-orange-800">1</Text></View>
          <Text className="text-[10px] text-gray-500 font-bold ml-1">Clase</Text>
        </View>
        <View className="w-4 h-[2px] bg-primary" />
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center"><Text className="text-[10px] font-bold text-white">2</Text></View>
          <Text className="text-[10px] text-primary font-bold ml-1">Asientos</Text>
        </View>
        <View className="w-4 h-[2px] bg-gray-200" />
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-500">3</Text></View>
          <Text className="text-[10px] text-gray-500 font-bold ml-1">Pago</Text>
        </View>
      </View>

      {/* Sala Unique Card */}
      <Animated.View entering={FadeInDown.duration(200).delay(50)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
        <View className="mb-4">
          <View className="flex-row items-center">
            <Text className="text-base font-extrabold text-black mr-1">Sala Única</Text>
            <Tooltip content="Presiona un número de asiento libre (blanco) para seleccionarlo. Los ocupados (gris) no se pueden elegir." />
          </View>
          <Text className="text-xs text-gray-400 font-bold mt-1">Cupos: 30 alumnos</Text>
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
        <Button
          label="Continuar con el pago"
          onPress={handleContinue}
          disabled={currentBooking.selectedSeats.length === 0}
          variant="primary"
        />
      </Animated.View>

      {/* Countdown */}
      <Animated.View entering={FadeIn.duration(200).delay(210)} className="flex-row items-center justify-center py-2 mb-4 mt-2">
        <Ionicons name="time-outline" size={16} color="#FF7A00" />
        <Text className="text-xs text-gray-500 font-semibold ml-1.5">
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
          <Text className="text-[14px] text-gray-500 mt-2 font-bold">Precio por asiento: S/ {currentBooking.pricePerSeat.toFixed(2)}</Text>
        </View>
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <Text className="text-[18px] font-bold text-black mb-2">Instructor: {currentBooking.instructorName}</Text>
          <Text className="text-[14px] text-gray-600">Capacidad: 30 espacios</Text>
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
        
        {/* Step Indicator Desktop */}
        <View className="flex-row items-center justify-center my-6 gap-x-2 px-2">
          <View className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-orange-200 items-center justify-center"><Text className="text-xs font-bold text-orange-800">1</Text></View>
            <Text className="text-xs text-gray-500 font-bold ml-1">Clase</Text>
          </View>
          <View className="w-8 h-[2px] bg-primary" />
          <View className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center"><Text className="text-xs font-bold text-white">2</Text></View>
            <Text className="text-xs text-primary font-bold ml-1">Asientos</Text>
          </View>
          <View className="w-8 h-[2px] bg-gray-200" />
          <View className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center"><Text className="text-xs font-bold text-gray-500">3</Text></View>
            <Text className="text-xs text-gray-500 font-bold ml-1">Pago</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-4 mt-4">
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
            <Text className="text-[20px] font-bold text-orange-950">Reserva bloqueada por {formatTime(currentBooking.timeLeft)}</Text>
          </View>
        </View>
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <View className="flex-row items-center mb-2">
            <Text className="text-[20px] font-bold text-black mr-1">Asientos seleccionados</Text>
            <Tooltip content="Selecciona tus asientos haciendo clic en los casilleros disponibles del mapa." />
          </View>
          <Text className="text-[22px] font-extrabold mb-6 text-primary">{currentBooking.selectedSeats.join(', ') || '-'}</Text>
          <Button
            label="Pagar reserva"
            onPress={handleContinue}
            disabled={currentBooking.selectedSeats.length === 0}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );

  if (isWeb) {
    return <ClientDesktopShell title={currentBooking.className} subtitle={`${currentBooking.day.split(' ')[0]}, ${currentBooking.time}`}>{desktopContent}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{mobileContent}</SafeAreaView>;
}
