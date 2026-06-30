import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

function RowDetail({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  const isNative = Platform.OS !== 'web';
  return (
    <View className="flex-row justify-between items-center">
      <Text className={`${isNative ? 'text-gray-600' : 'text-gray-500'} text-sm font-medium`}>{label}</Text>
      <Text className={`text-gray-900 text-sm ${bold ? 'font-extrabold text-base' : 'font-semibold'}`}>{value}</Text>
    </View>
  );
}

export default function ClientPaymentsHistoryScreen() {
  const router = useRouter();
  const reservations = useAppStore((state) => state.reservations);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const getShortTime = (range: string) => range.split('-')[0]?.trim() || '6:00 PM';

  const getStatusStyles = (status: 'Pagado' | 'Pendiente' | 'Cancelado') => {
    if (status === 'Pagado') {
      return {
        container: 'bg-emerald-100',
        text: 'text-emerald-800',
      };
    }

    if (status === 'Pendiente') {
      return {
        container: 'bg-amber-100',
        text: 'text-amber-800',
      };
    }

    return {
      container: 'bg-red-100',
      text: 'text-red-800',
    };
  };

  const [selectedReceipt, setSelectedReceipt] = useState<typeof reservations[0] | null>(null);

  const content = (
    <View style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: isWeb ? 0 : 20,
          paddingTop: isWeb ? 0 : 10,
          paddingBottom: 30,
        }} 
        showsVerticalScrollIndicator={false}
      >
        {isWeb ? (
          <>
            <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center mb-5">
              <TouchableOpacity
                onPress={() => router.replace('/(client)/(tabs)')}
                hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-200 mr-3"
              >
                <Ionicons name="arrow-back" size={18} color="#111827" />
              </TouchableOpacity>
              <Text className="text-2xl font-extrabold text-black">Historial</Text>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(220).delay(40)} className="flex-row border-b border-gray-200 mb-6 px-1">
              <View className="pb-3 border-b-2 border-primary min-w-[120px]">
                <Text className={`${isNative ? 'text-primary-text-strong' : 'text-primary'} font-bold text-center text-base`}>Pagos</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(260).delay(60)} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <View className="flex-row border-b border-gray-200 py-4 px-8 bg-[#f8f6f1]">
                <Text className="flex-[1.4] text-left text-[16px] font-extrabold text-gray-700">Fecha</Text>
                <Text className="flex-[1.2] text-left text-[16px] font-extrabold text-gray-700">Clase</Text>
                <Text className="flex-1 text-left text-[16px] font-extrabold text-gray-700">Monto</Text>
                <Text className="flex-1 text-left text-[16px] font-extrabold text-gray-700">Estado</Text>
                <Text className="w-[110px] text-center text-[16px] font-extrabold text-gray-700">Acciones</Text>
              </View>

              <View className="px-8 py-2">
                {reservations.map((res, idx) => {
                  const statusStyle = getStatusStyles(res.status);
                  return (
                    <View
                      key={res.id}
                      className={`flex-row items-center py-4 ${idx !== reservations.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <Text className="flex-[1.4] text-[14px] font-semibold text-black">{res.date} · {getShortTime(res.time)}</Text>
                      <Text className="flex-[1.2] text-[14px] font-semibold text-black">{res.className}</Text>
                      <Text className="flex-1 text-[14px] font-extrabold text-black">S/ {res.price.toFixed(2)}</Text>

                      <View className="flex-1">
                        <View className={`self-start px-4 py-1.5 rounded-full ${statusStyle.container}`}>
                          <Text className={`text-[12px] font-bold ${statusStyle.text}`}>{res.status}</Text>
                        </View>
                      </View>

                      <View className="w-[110px] flex-row justify-center gap-x-2">
                        <TouchableOpacity onPress={() => setSelectedReceipt(res)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }} className="w-9 h-9 rounded-lg bg-orange-50 items-center justify-center border border-orange-200">
                          <Ionicons name="document-text-outline" size={17} color="#c2410c" />
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }} className="w-9 h-9 rounded-lg bg-orange-50 items-center justify-center border border-orange-200">
                          <Ionicons name="print-outline" size={17} color="#c2410c" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View className="flex-row items-center justify-between border-t border-gray-200 px-7 py-4 bg-[#fcfbf8]">
                <Text className="text-sm text-gray-600 font-medium">Pagina 1 de {Math.max(1, Math.ceil(reservations.length / 10))}</Text>
                <View className="flex-row gap-x-2">
                  <TouchableOpacity className="px-4 py-2 rounded-xl border border-gray-300 bg-white flex-row items-center">
                    <Ionicons name="chevron-back" size={16} color="#374151" />
                    <Text className="text-sm font-semibold text-gray-700 ml-1">Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-4 py-2 rounded-xl border border-gray-300 bg-white flex-row items-center">
                    <Text className="text-sm font-semibold text-gray-700 mr-1">Next</Text>
                    <Ionicons name="chevron-forward" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center justify-between mb-5 mt-1">
              <TouchableOpacity
                onPress={() => router.replace('/(client)/(tabs)')}
                hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-200"
              >
                <Ionicons name="arrow-back" size={18} color="#111827" />
              </TouchableOpacity>

              <Text className="text-[22px] font-extrabold text-black">Historial</Text>

              <TouchableOpacity
                onPress={() => router.push('/profile')}
                hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center border border-gray-200"
              >
                <Ionicons name="person-circle-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(220).delay(40)} className="flex-row border-b border-gray-200 mb-5">
              <View className="pb-3 border-b-2 border-primary min-w-[95px]">
                <Text className={`${isNative ? 'text-primary-text-strong' : 'text-primary'} font-bold text-center text-base`}>Pagos</Text>
              </View>
            </Animated.View>

            <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
              {reservations.map((res, idx) => {
                const statusStyle = getStatusStyles(res.status);
                return (
                  <Animated.View
                    key={res.id}
                    entering={ZoomIn.duration(220).delay(idx * 40)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-[12px] font-medium text-gray-600">{res.date} · {getShortTime(res.time)}</Text>
                      <View className={`px-3 py-1 rounded-full ${statusStyle.container}`}>
                        <Text className={`text-[12px] font-bold ${statusStyle.text}`}>{res.status}</Text>
                      </View>
                    </View>

                    <Text className="text-[24px] leading-7 font-extrabold text-black mb-1">{res.className}</Text>
                    <Text className="text-[33px] leading-9 font-extrabold text-black mb-2">S/ {res.price.toFixed(2)}</Text>

                    <TouchableOpacity onPress={() => setSelectedReceipt(res)} className="self-start flex-row items-center px-3 py-2 rounded-xl bg-orange-50 border border-orange-200">
                      <Ionicons name="document-text-outline" size={16} color="#c2410c" />
                      <Text className="text-[13px] text-gray-700 font-semibold ml-1.5">Recibo PDF</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedReceipt}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <Animated.View entering={ZoomIn.duration(180)} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            <View className="bg-primary px-6 py-5 flex-row items-center justify-between">
              <Text className="text-white font-extrabold text-lg">Recibo de Pago</Text>
              <TouchableOpacity onPress={() => setSelectedReceipt(null)}>
                <Ionicons name="close-circle" size={26} color="white" />
              </TouchableOpacity>
            </View>

            {selectedReceipt && (
              <View className="px-6 py-5 gap-y-4">
                <View className="items-center pb-3 border-b border-gray-100">
                  <Ionicons 
                    name={selectedReceipt.status === 'Pagado' ? 'checkmark-circle' : selectedReceipt.status === 'Pendiente' ? 'time' : 'close-circle'} 
                    size={44} 
                    color={selectedReceipt.status === 'Pagado' ? '#16a34a' : selectedReceipt.status === 'Pendiente' ? '#d97706' : '#dc2626'} 
                  />
                  <Text className={`font-bold text-sm mt-1 ${selectedReceipt.status === 'Pagado' ? 'text-emerald-700' : selectedReceipt.status === 'Pendiente' ? 'text-amber-700' : 'text-red-700'}`}>
                    {selectedReceipt.status}
                  </Text>
                </View>

                <RowDetail label="Clase" value={selectedReceipt.className} />
                <RowDetail label="Fecha" value={`${selectedReceipt.date} · ${selectedReceipt.time}`} />
                <RowDetail label="Asiento(s)" value={selectedReceipt.seats?.join(', ') || '-'} />
                <RowDetail label="Cliente" value={selectedReceipt.clientName || '-'} />
                <RowDetail label="Celular" value={selectedReceipt.clientPhone || '-'} />
                <RowDetail label="Monto" value={`S/ ${selectedReceipt.price.toFixed(2)}`} bold />

                <TouchableOpacity
                  onPress={() => setSelectedReceipt(null)}
                  className="mt-2 py-3 rounded-xl bg-primary items-center"
                >
                  <Text className="text-white font-bold text-base">Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );

  return (
    isWeb
      ? <ClientDesktopShell title="Historial de Pagos" subtitle="">{content}</ClientDesktopShell>
      : <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>
  );
}
