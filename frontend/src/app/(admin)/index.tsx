import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const logout = useAppStore((state) => state.logout);
  
  const classes = useAppStore((state) => state.classes);
  const instructors = useAppStore((state) => state.instructors);
  const reservations = useAppStore((state) => state.reservations);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/landing');
  };

  // Dynamic calculations based on mock database state
  const activeClassesCount = classes.filter(c => c.status === 'Activo').length;
  const totalReservationsCount = reservations.filter(r => r.status === 'Pagado').length;
  const activeInstructorsCount = instructors.filter(i => i.status === 'Activo').length;
  const totalIncome = reservations
    .filter(r => r.status === 'Pagado')
    .reduce((sum, r) => sum + r.price, 0);

  const quickLinks = [
    { label: 'Instructores', icon: 'person-outline', route: '/(admin)/instructors' },
    { label: 'Clases', icon: 'briefcase-outline', route: '/(admin)/classes-mgmt' },
    { label: 'Historial', icon: 'receipt-outline', route: '/(admin)/bookings-history' },
    { label: 'Registrar reserva manual', icon: 'calendar-outline', route: '/(admin)/manual-booking' },
  ];

  const kpis = [
    { label: 'Clases hoy', val: activeClassesCount, icon: 'people', color: '#3B82F6' },
    { label: 'Reservas hoy', val: totalReservationsCount, icon: 'business', color: '#FF7A00' },
    { label: 'Instructores', val: activeInstructorsCount, icon: 'person', color: '#10B981' },
    { label: 'Ingresos hoy', val: `S/ ${totalIncome}`, icon: 'wallet', color: '#6B7280' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="body-outline" size={28} color="#FF7A00" />
            <Text className="text-2xl font-bold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="black" />
          </TouchableOpacity>
        </Animated.View>

        {/* Salutation */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="mb-6">
          <Text className="text-2xl font-extrabold text-black">¡Hola, Admin! 👋</Text>
          <Text className="text-sm text-gray-500 font-bold mt-1">Resumen general</Text>
        </Animated.View>

        {/* KPI Cards Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
          {kpis.map((kpi, idx) => (
            <Animated.View
              key={idx}
              entering={ZoomIn.duration(200).delay(80 + idx * 30)}
              className="w-[47%] bg-white border border-gray-150 rounded-3xl p-4 shadow-sm items-center"
            >
              <Ionicons name={kpi.icon as any} size={24} color={kpi.color} />
              <Text className="text-xs text-gray-400 font-bold mt-2">{kpi.label}</Text>
              <Text className="text-[20px] font-extrabold text-black mt-1">{kpi.val}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Quick Links Section */}
        <Animated.View entering={FadeInDown.duration(200).delay(150)} className="bg-white border border-gray-155 rounded-3xl p-5 shadow-sm mb-6">
          <Text className="text-base font-extrabold text-black mb-4">Accesos rápidos</Text>
          
          <View className="gap-y-3">
            {quickLinks.map((link, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => router.push(link.route as any)}
                className="flex-row items-center justify-between border border-gray-150 rounded-2xl p-4 bg-gray-50/50"
              >
                <View className="flex-row items-center">
                  <Ionicons name={link.icon as any} size={22} color="black" className="mr-3" />
                  <Text className="text-sm font-bold text-black">{link.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="gray" />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
