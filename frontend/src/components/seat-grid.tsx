import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SeatGridProps {
  totalSeats?: number;
  occupiedSeats?: number[];
  mySeats?: number[];
  readOnly?: boolean;
}

const TOTAL_SEATS = 30;
const SEAT_NUMBERS = Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1);

export function SeatGrid({
  totalSeats = TOTAL_SEATS,
  occupiedSeats = [],
  mySeats = [],
  readOnly = false,
}: SeatGridProps) {
  const seatNumbers = SEAT_NUMBERS.slice(0, totalSeats);

  return (
    <View className="w-full max-w-[360px] mx-auto">
      <View className="flex-row flex-wrap justify-center gap-1.5">
        {seatNumbers.map((seatNum) => {
          const isOccupied = occupiedSeats.includes(seatNum);
          const isMine = mySeats.includes(seatNum);

          let bgStyle = 'bg-gray-100 border-gray-200';
          let textStyle = 'text-gray-400';

          if (isMine) {
            bgStyle = 'bg-primary border-primary';
            textStyle = 'text-white font-extrabold';
          } else if (isOccupied) {
            bgStyle = 'bg-gray-300 border-gray-300';
            textStyle = 'text-gray-500';
          }

          return (
            <View
              key={seatNum}
              className="w-[17%] aspect-square"
            >
              <View
                className={`w-full h-full border rounded-md items-center justify-center ${bgStyle}`}
              >
                <Text className={`text-[10px] font-semibold ${textStyle}`}>{seatNum}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {!readOnly && (
        <View className="flex-row justify-around mt-4">
          <View className="flex-row items-center">
            <View className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-gray-100 mr-1" />
            <Text className="text-[10px] font-bold text-gray-500">Disponible</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3.5 h-3.5 rounded-full bg-primary mr-1" />
            <Text className="text-[10px] font-bold text-gray-500">Seleccionado</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3.5 h-3.5 rounded-full bg-gray-300 mr-1" />
            <Text className="text-[10px] font-bold text-gray-500">Ocupado</Text>
          </View>
        </View>
      )}
    </View>
  );
}
