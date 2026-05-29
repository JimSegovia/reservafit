import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ReservationQuickDetail } from '@/components/reservation-quick-detail';

type DesktopTab = 'mis-clases' | 'clases-hoy' | 'calendario';

export default function ClientHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const reservations = useAppStore((state) => state.reservations);
  const classes = useAppStore((state) => state.classes);

  const [activeTab, setActiveTab] = useState<DesktopTab>('mis-clases');
  const [quickReservation, setQuickReservation] = useState<any>(null);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/landing');
  };

  const clientReservations = reservations.filter((res) => res.status === 'Pagado');
  const dashboardClasses = useMemo(
    () => classes.filter((cls) => ['c7', 'c8', 'c9'].includes(cls.id)),
    [classes]
  );

  const weekDays = ['Lun 20', 'Mar 21', 'Mié 22', 'Jue 23', 'Vie 24', 'Sáb 25', 'Dom 26'];
  const calendarEvents = [
    { day: 0, time: '6:00 PM', title: 'Zumba', color: 'bg-orange-300' },
    { day: 0, time: '7:00 PM', title: 'Salsa', color: 'bg-purple-300' },
    { day: 2, time: '6:00 PM', title: 'Zumba', color: 'bg-orange-300' },
    { day: 2, time: '7:00 PM', title: 'Salsa', color: 'bg-purple-300' },
    { day: 4, time: '6:00 PM', title: 'Zumba', color: 'bg-orange-300' },
    { day: 4, time: '7:00 PM', title: 'Salsa', color: 'bg-purple-300' },
  ];

  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, flex: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
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

          <Animated.View entering={FadeInDown.duration(200).delay(50)} className="mb-6">
            <Text className="text-2xl font-extrabold text-black">
              ¡Hola, {user?.name || 'Ana Pérez'}! 👋
            </Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.duration(200).delay(100)} className="text-gray-500 font-bold text-center text-sm tracking-wide mb-4">
            Estas son tus Clases Reservadas
          </Animated.Text>

          <View className="gap-y-4 mb-6">
            {clientReservations.length === 0 ? (
              <Animated.View entering={FadeInDown.duration(200).delay(150)} className="bg-white border border-gray-100 rounded-3xl p-8 items-center justify-center">
                <Ionicons name="calendar-outline" size={48} color="#FF7A00" className="opacity-50" />
                <Text className="text-gray-500 text-sm mt-3 text-center">
                  No tienes reservas activas para esta semana.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(client)/(tabs)/classes')}
                  className="bg-primary px-6 py-3 rounded-full mt-4"
                >
                  <Text className="text-white font-bold text-sm">Explorar clases</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              clientReservations.map((res, idx) => (
                <Animated.View
                  key={res.id}
                  entering={FadeInDown.duration(200).delay(150 + idx * 50)}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop' }}
                    className="w-full h-24 object-cover"
                  />
                  <View className="p-4 items-center">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="people-outline" size={16} color="#FF7A00" />
                      <Text className="text-lg font-bold text-black ml-1.5">{res.className}</Text>
                    </View>
                    <Text className="text-base font-extrabold text-black mb-1.5">{res.time}</Text>
                    <View className="flex-row justify-between w-full border-t border-gray-100 pt-3 mt-1 px-2">
                      <Text className="text-sm font-semibold text-gray-500">Cupos: {res.seats.join(', ')}</Text>
                      <Text className="text-sm font-semibold text-gray-500">
                        Profesor: {res.className.toLowerCase().includes('salsa') ? 'Profesor B' : 'Profesor A'}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 flex-row">
        <View className="w-[280px] bg-[#1f0f08] px-6 py-8 justify-between">
          <View>
            <View className="flex-row items-center mb-10 mt-2">
              <Ionicons name="body-outline" size={34} color="#FF7A00" />
              <Text className="text-[30px] font-bold ml-1 text-white">
                Reserva<Text className="text-primary">Fit</Text>
              </Text>
            </View>

            <TouchableOpacity className="flex-row items-center bg-primary rounded-lg px-4 py-4 mb-4">
              <Ionicons name="home-outline" size={24} color="white" />
              <Text className="text-white font-bold ml-3 text-base">Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-4 py-4 mb-4" onPress={() => router.push('/(client)/(tabs)/classes')}>
              <Ionicons name="calendar-outline" size={24} color="white" />
              <Text className="text-white font-bold ml-3 text-base">Clases</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-4 py-4" onPress={() => router.push('/(client)/(tabs)/payments')}>
              <Ionicons name="card-outline" size={24} color="white" />
              <Text className="text-white font-bold ml-3 text-base">Pagos</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogout} className="flex-row items-center px-4 py-4 mb-2">
            <Ionicons name="log-out-outline" size={22} color="white" />
            <Text className="text-white font-bold ml-3 text-base">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 18, paddingBottom: 28 }} className="flex-1">
          <View className="flex-row justify-between items-start mb-5">
            <View>
              <Text className="text-[24px] font-bold text-black leading-7">¡Hola, {user?.name || 'Ana Pérez'}! 👋</Text>
              <Text className="text-[24px] font-bold text-black leading-7">Resumen general</Text>
            </View>
            <View className="flex-row items-center gap-x-3 mt-2">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="text-[15px] font-semibold text-black">{user?.name || 'Punch Einstein'}</Text>
              <View className="relative ml-1">
                <Ionicons name="notifications-outline" size={28} color="black" />
                <View className="absolute right-1 top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
              </View>
            </View>
          </View>

          <View className="bg-white rounded-[18px] border border-gray-200 shadow-sm overflow-hidden">
            <View className="flex-row border-b border-gray-200">
              {[
                { key: 'mis-clases', label: 'Mis clases' },
                { key: 'clases-hoy', label: 'Clases de hoy' },
                { key: 'calendario', label: 'Calendario' },
              ].map((tab, idx) => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key as DesktopTab)}
                    className={`flex-1 py-5 items-center ${idx !== 2 ? 'border-r border-gray-300' : ''}`}
                  >
                    <Text className={`text-[16px] font-semibold ${active ? 'text-primary' : 'text-black'}`}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {activeTab === 'mis-clases' && (
              <Animated.View entering={FadeIn.duration(180)} className="px-5 py-5">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="calendar-outline" size={24} color="#FF7A00" />
                  <Text className="text-[15px] font-bold text-black ml-3">Estas son tus Clases Reservadas</Text>
                </View>
                <View className="gap-y-3">
                  {dashboardClasses.map((cls, idx) => (
                    <View key={cls.id} className="flex-row items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white min-h-[88px]">
                      <View className="w-[72px] items-center justify-center border-r border-gray-200 bg-white">
                        <Text className="text-primary text-[13px] font-bold">{idx === 0 ? 'LUN' : idx === 1 ? 'MAR' : 'MIÉ'}</Text>
                        <Text className="text-[20px] font-bold text-gray-700 leading-none mt-1">{20 + idx}</Text>
                      </View>
                      <Image
                        source={{
                          uri:
                            cls.id === 'c7'
                              ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop'
                              : cls.id === 'c8'
                                ? 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop'
                                : 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop'
                        }}
                        className="w-[88px] h-full object-cover"
                      />
                      <TouchableOpacity className="flex-1 px-4 py-3 justify-between" onPress={() => setQuickReservation({ title: cls.title, time: '7:00 PM - 8:00 PM', date: '12 May 2025', seat: '13', status: 'Pagado' })}>
                        <View>
                          <Text className="text-[14px] font-bold text-black">
                            {cls.title} <Text className="text-primary">***</Text>
                          </Text>
                          <Text className="text-[13px] font-semibold text-gray-600 mt-1">7:00 PM - 8:00 PM</Text>
                          <Text className="text-[12px] font-medium text-gray-500 mt-0.5">Instructor: {cls.instructorName}</Text>
                        </View>
                      </TouchableOpacity>
                      <View className="w-[290px] px-4 py-3 justify-between">
                        <View>
                          <Text className="text-[13px] font-semibold text-gray-600">{cls.days?.[0] || 'Lunes - Miércoles - Viernes'}</Text>
                          <Text className="text-[13px] font-semibold text-gray-600 mt-1">{cls.schedule}</Text>
                        </View>
                      </View>
                      <View className="w-[124px] items-center justify-center pr-4">
                        {idx === 2 ? (
                          <View className="bg-green-100 rounded-lg px-4 py-2">
                            <Text className="text-green-700 font-bold text-sm">Disponible</Text>
                          </View>
                        ) : null}
                        <Ionicons name="chevron-forward" size={22} color="#555" className="mt-2" />
                      </View>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {activeTab === 'clases-hoy' && (
              <Animated.View entering={FadeIn.duration(180)} className="px-5 py-5">
                <View className="flex-row items-center mb-6">
                  <Ionicons name="calendar-outline" size={24} color="#FF7A00" />
                  <Text className="text-[15px] font-bold text-black ml-3">Clases de hoy</Text>
                </View>

                <View className="gap-y-3">
                  {dashboardClasses.slice(0, 2).map((cls, idx) => (
                    <View key={cls.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white flex-row min-h-[132px]">
                      <Image
                        source={{
                          uri:
                            idx === 0
                              ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop'
                              : 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=400&auto=format&fit=crop'
                        }}
                        className="w-[240px] h-full object-cover"
                      />
                      <View className="flex-1 px-5 py-4 justify-between">
                        <View>
                          <Text className="text-[15px] font-bold text-black">{cls.title} <Text className="text-primary">***</Text></Text>
                          <Text className="text-[18px] font-bold text-black mt-2">
                            {idx === 0 ? '6:00 PM - 7:00 PM' : '7:00 PM - 8:00 PM'}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="text-[11px] font-semibold text-gray-500 uppercase">Instructor</Text>
                            <Text className="text-[12px] font-semibold text-black">{cls.instructorName}</Text>
                          </View>
                          <View className="w-8 h-8 rounded-full bg-amber-700 items-center justify-center">
                            <Text className="text-white font-bold">{cls.instructorName.charAt(0)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {activeTab === 'calendario' && (
              <Animated.View entering={FadeIn.duration(180)} className="px-5 py-5">
                <View className="flex-row justify-between items-center mb-5 px-2">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={26} color="#666" />
                    <Text className="text-[15px] font-bold text-black ml-3">Mi semana</Text>
                  </View>
                  <View className="flex-row items-center gap-x-4">
                    <Text className="text-[20px] font-semibold text-gray-500">20 - 26 May, 2024</Text>
                    <Ionicons name="chevron-back" size={18} color="#555" />
                    <Ionicons name="chevron-forward" size={18} color="#555" />
                  </View>
                </View>

                <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <View className="flex-row border-b border-gray-200">
                    <View className="w-[85px]" />
                    {weekDays.map((day, dayIdx) => (
                      <View key={day} className={`flex-1 items-center py-4 border-l border-gray-200 ${dayIdx === 0 ? 'border-l-0' : ''}`}>
                        <Text className="text-[15px] font-bold text-gray-700 text-center">{day.split(' ')[0]}</Text>
                        <Text className="text-[18px] font-bold text-gray-700">{day.split(' ')[1]}</Text>
                      </View>
                    ))}
                  </View>

                  {['6 AM', '12 PM', '6 PM', '8 PM'].map((slot, slotIdx) => (
                    <View key={slot} className="flex-row border-b border-gray-200 last:border-b-0 min-h-[88px]">
                      <View className="w-[85px] items-center justify-center border-r border-gray-200 bg-gray-50">
                        <Text className="text-[15px] font-bold text-gray-600">{slot}</Text>
                      </View>
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const event = calendarEvents.find((ev) => ev.day === dayIdx && ((slotIdx === 2 && ev.time === '6:00 PM') || (slotIdx === 3 && ev.time === '7:00 PM')));
                        return (
                          <View key={`${slot}-${dayIdx}`} className="flex-1 border-l border-gray-200 p-2 justify-center">
                            {event ? (
                              <View className={`${event.color} rounded-lg px-3 py-3 items-center`}>
                                <Text className="text-black font-bold text-sm">{event.title}</Text>
                                <Text className="text-black font-bold text-xs mt-0.5">{event.time}</Text>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>

      <ReservationQuickDetail
        visible={!!quickReservation}
        onClose={() => setQuickReservation(null)}
        title={quickReservation?.title || ''}
        time={quickReservation?.time}
        date={quickReservation?.date}
        seat={quickReservation?.seat}
        status={quickReservation?.status}
        onOpenFull={() => quickReservation && router.push('/(client)/(tabs)/classes/detail')}
      />
    </SafeAreaView>
  );
}
