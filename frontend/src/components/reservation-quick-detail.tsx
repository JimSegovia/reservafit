import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SeatGrid } from './seat-grid';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  time?: string;
  date?: string;
  seat?: string;
  mySeats?: number[];
  status?: string;
  onOpenFull?: () => void;
};

export function ReservationQuickDetail({ visible, onClose, title, time, date, seat, mySeats, status, onOpenFull }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="w-full max-w-[420px] bg-white rounded-3xl p-5 max-h-[85vh]">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[18px] font-bold text-black">Detalle de reserva</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}><Ionicons name="close" size={20} color="black" /></TouchableOpacity>
            </View>
            <View className="gap-y-3">
              <Text className="text-[14px] text-gray-500">Clase: <Text className="text-black font-semibold">{title}</Text></Text>
              {time ? <Text className="text-[14px] text-gray-500">Horario: <Text className="text-black font-semibold">{time}</Text></Text> : null}
              {date ? <Text className="text-[14px] text-gray-500">Fecha: <Text className="text-black font-semibold">{date}</Text></Text> : null}
              {seat ? <Text className="text-[14px] text-gray-500">Asiento(s): <Text className="text-black font-semibold">{seat}</Text></Text> : null}
              {status ? <Text className="text-[14px] text-gray-500">Estado: <Text className="text-black font-semibold">{status === 'Pendiente' ? 'Verificando pago...' : status}</Text></Text> : null}
            </View>

            {mySeats && mySeats.length > 0 ? (
              <View className="mt-5">
                <Text className="text-[12px] font-bold text-gray-400 mb-3 uppercase">Posiciones</Text>
                <SeatGrid mySeats={mySeats} readOnly />
              </View>
            ) : null}

            <View className="flex-row gap-x-3 mt-5">
              {onOpenFull ? (
                <TouchableOpacity onPress={onOpenFull} className="flex-1 bg-primary rounded-xl py-3 items-center">
                  <Text className="text-white font-semibold text-[14px]">Ver detalle</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={onClose} className="flex-1 bg-gray-200 rounded-xl py-3 items-center">
                <Text className="font-semibold text-[14px]">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
