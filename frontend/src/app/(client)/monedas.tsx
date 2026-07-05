import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function MonedasScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const monedasSaldo = useAppStore((state) => state.monedasSaldo);
  const monedasHistorial = useAppStore((state) => state.monedasHistorial);
  const fetchMonedas = useAppStore((state) => state.fetchMonedas);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonedas().finally(() => setLoading(false));
  }, []);

  const tipoLabels: Record<string, string> = {
    ganada_cancelacion: 'Cancelación de clase',
    ganada_compra_bono: 'Bono de fidelidad',
    gastada_clase: 'Pago de clase',
    devuelta_admin: 'Clase cancelada (admin)',
    devuelta_minimo: 'Mínimo no alcanzado',
  };

  const content = (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: isWeb ? 0 : 24, paddingVertical: 16, paddingBottom: 30 }}
      showsVerticalScrollIndicator={Platform.OS === 'web' && width >= 768}
    >
      <View className={isWeb ? 'w-full max-w-xl self-center' : 'w-full'}>
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-black ml-3">MonedasFit</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="bg-amber-500 rounded-3xl p-6 mb-6 shadow-lg shadow-amber-500/20">
          <Text className="text-white text-sm font-bold opacity-80 mb-1">Tu saldo</Text>
          <View className="flex-row items-baseline">
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <>
                <Text className="text-white text-5xl font-extrabold">{monedasSaldo}</Text>
                <Text className="text-white text-2xl font-bold ml-2">🪙</Text>
              </>
            )}
          </View>
          <Text className="text-white text-sm mt-2 opacity-70">
            Cada clase cuesta 5 monedas
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(200).delay(100)}>
          <Text className="text-lg font-extrabold text-black mb-4">Historial de transacciones</Text>

          {monedasHistorial.length === 0 ? (
            <View className="py-12 items-center justify-center bg-white rounded-2xl border border-gray-200">
              <Ionicons name="star-outline" size={40} color="lightgray" />
              <Text className="text-gray-400 font-medium text-sm mt-3">Sin transacciones aún</Text>
            </View>
          ) : (
            <View className="gap-y-3">
              {monedasHistorial.map((t: any, index: number) => (
                <Animated.View
                  key={t.id_historial || index}
                  entering={FadeInDown.duration(200).delay(120 + index * 20)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-extrabold text-black">
                      {tipoLabels[t.tipo] || t.tipo}
                    </Text>
                    <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} mt-0.5`}>
                      {new Date(t.fecha).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${t.cantidad > 0 ? 'bg-green-100' : 'bg-red-50'}`}>
                    <Text className={`text-sm font-extrabold ${t.cantidad > 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {t.cantidad > 0 ? '+' : ''}{t.cantidad} 🪙
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return <ClientDesktopShell title="MonedasFit" subtitle="Tu saldo y historial de monedas">{content}</ClientDesktopShell>;
  }

  return <SafeAreaView className="flex-1 bg-cream">{content}</SafeAreaView>;
}
