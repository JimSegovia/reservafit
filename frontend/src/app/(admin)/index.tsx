import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const classes = useAppStore((state) => state.classes);
  const instructors = useAppStore((state) => state.instructors);
  const reservations = useAppStore((state) => state.reservations);

  const [searchText, setSearchText] = useState('');

  const activeClassesCount = classes.filter(c => c.status === 'Activo').length;
  const totalReservationsCount = reservations.filter(r => r.status === 'Pagado').length;
  const activeInstructorsCount = instructors.filter(i => i.status === 'Activo').length;
  const totalIncome = reservations
    .filter(r => r.status === 'Pagado')
    .reduce((sum, r) => sum + r.price, 0);

  const kpis = [
    { label: 'Clases hoy', val: activeClassesCount, icon: 'people', color: '#3B82F6' },
    { label: 'Reservas hoy', val: totalReservationsCount, icon: 'business', color: '#FF7A00' },
    { label: 'Instructores', val: activeInstructorsCount, icon: 'person', color: '#10B981' },
    { label: 'Ingresos hoy', val: `S/ ${totalIncome}`, icon: 'wallet', color: '#6B7280' },
  ];

  const MOCK_RESERVATIONS = [
    { nombre: 'Carlos Mendoza', clase: 'Salsa', fecha: '15/06/2025', monto: 'S/ 25.00', estado: 'Pagado' },
    { nombre: 'Ana Torres', clase: 'Zumba', fecha: '15/06/2025', monto: 'S/ 30.00', estado: 'Pagado' },
    { nombre: 'Luis García', clase: 'Bachata', fecha: '14/06/2025', monto: 'S/ 25.00', estado: 'Pendiente' },
    { nombre: 'María López', clase: 'Salsa', fecha: '14/06/2025', monto: 'S/ 25.00', estado: 'Pagado' },
    { nombre: 'Diego Ramírez', clase: 'Reageton', fecha: '13/06/2025', monto: 'S/ 25.00', estado: 'Cancelado' },
    { nombre: 'Sofía Castro', clase: 'Zumba', fecha: '13/06/2025', monto: 'S/ 30.00', estado: 'Pagado' },
  ];

  const filteredReservations = MOCK_RESERVATIONS.filter(
    (r) =>
      r.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      r.clase.toLowerCase().includes(searchText.toLowerCase())
  );

  const TABLE_HEADERS = ['Nombre', 'Clase', 'Fecha', 'Monto', 'Estado'];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return { bg: 'bg-success-bg', text: 'text-success-text' };
      case 'Pendiente':
        return { bg: 'bg-warning-bg', text: 'text-warning-text' };
      case 'Cancelado':
        return { bg: 'bg-danger-bg', text: 'text-danger-text' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-cream"
      contentContainerStyle={{ padding: isMobile ? 16 : 32, paddingBottom: isMobile ? 80 : 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View className={`${isMobile ? 'flex-col gap-y-4' : 'flex-row justify-between items-center'} mb-8`}>
        <Animated.View entering={FadeInDown.duration(200)}>
          <Text className="text-2xl font-bold text-secondary">¡Hola, Admin! 👋</Text>
          <Text className="text-sm text-gray-500 font-medium mt-1">Resumen general</Text>
        </Animated.View>

        <View className={`flex-row items-center ${isMobile ? 'w-full' : ''}`} style={{ gap: 12 }}>
          <View className={`flex-row items-center bg-white rounded-full border border-gray-200 px-4 py-2.5 ${isMobile ? 'flex-1' : 'max-w-md'}`}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              className="ml-2 text-sm text-secondary flex-1"
              style={{ outlineWidth: 0 }}
            />
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-200">
            <Ionicons name="notifications-outline" size={20} color="#1F0F08" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View className={`flex-row flex-wrap mb-8`} style={{ gap: isMobile ? 12 : 16 }}>
        {kpis.map((kpi, idx) => (
          <Animated.View
            key={idx}
            entering={ZoomIn.duration(200).delay(80 + idx * 40)}
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
            style={isMobile ? { width: '48%' } : { flex: 1, minWidth: 180 }}
          >
            <View className={isMobile ? 'items-center py-4 px-3' : 'p-5'}>
              <View
                className={`${isMobile ? 'w-10 h-10 mb-2' : 'w-11 h-11 mb-4'} rounded-lg items-center justify-center`}
                style={{ backgroundColor: `${kpi.color}18` }}
              >
                <Ionicons name={kpi.icon as any} size={isMobile ? 18 : 20} color={kpi.color} />
              </View>
              <Text className={`${isMobile ? 'text-[10px] text-center' : 'text-xs'} text-secondary/50 font-semibold`}>{kpi.label}</Text>
              <Text className={`${isMobile ? 'text-lg text-center mt-0.5' : 'text-2xl mt-1'} font-bold text-secondary`}>{kpi.val}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Table Card */}
      <Animated.View entering={FadeInDown.duration(200).delay(120)} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <View className="px-6 py-5 border-b border-gray-100">
          <Text className="text-lg font-bold text-secondary">Reservas</Text>
        </View>

        {isMobile ? (
          <View className="px-4 py-2" style={{ gap: 12 }}>
            {filteredReservations.map((row, idx) => {
              const badge = getEstadoBadge(row.estado);
              return (
                <View key={idx} className="border border-gray-100 rounded-xl p-4 bg-white">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm font-bold text-secondary">{row.nombre}</Text>
                    <View className={`rounded-full px-3 py-1 ${badge.bg}`}>
                      <Text className={`text-xs font-bold ${badge.text}`}>{row.estado}</Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">{row.clase}</Text>
                    <Text className="text-xs text-gray-500">{row.fecha}</Text>
                    <Text className="text-xs font-semibold text-secondary">{row.monto}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            <View className="flex-row bg-cream px-6 py-3.5">
              <Text style={{ flex: 2 }} className="text-xs font-bold text-secondary/60">
                {TABLE_HEADERS[0]}
              </Text>
              {TABLE_HEADERS.slice(1).map((header, idx) => (
                <Text
                  key={idx}
                  style={{ flex: 1 }}
                  className="text-xs font-bold text-secondary/60"
                >
                  {header}
                </Text>
              ))}
            </View>

            {filteredReservations.map((row, idx) => {
              const badge = getEstadoBadge(row.estado);
              return (
                <View
                  key={idx}
                  className="flex-row px-6 py-4 border-b border-gray-50 items-center"
                >
                  <Text style={{ flex: 2 }} className="text-sm font-semibold text-secondary">
                    {row.nombre}
                  </Text>
                  <Text style={{ flex: 1 }} className="text-sm text-gray-500">
                    {row.clase}
                  </Text>
                  <Text style={{ flex: 1 }} className="text-sm text-gray-500">
                    {row.fecha}
                  </Text>
                  <Text style={{ flex: 1 }} className="text-sm font-semibold text-secondary">
                    {row.monto}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <View className={`rounded-full px-3 py-1 self-start ${badge.bg}`}>
                      <Text className={`text-xs font-bold ${badge.text}`}>{row.estado}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}
