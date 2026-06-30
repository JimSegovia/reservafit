import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Loader } from '@/components/ui/loader';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ReservationQuickDetail } from '@/components/reservation-quick-detail';
import { ClientDesktopShell } from '@/components/client-desktop-shell';

type DesktopTab = 'mis-clases' | 'clases-hoy' | 'calendario';

const DAY_MS = 24 * 60 * 60 * 1000;

const getMonday = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diffToMonday);
  return copy;
};

const getSlotLabel = (timeRange: string) => {
  const start = timeRange.split('-')[0]?.trim();
  if (!start) return null;
  const normalized = start.toUpperCase();
  if (normalized.includes('AM') || normalized.includes('PM')) return normalized;
  return null;
};

const getEventColor = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('zumba')) return '#fed7aa';
  if (lower.includes('salsa')) return '#ddd6fe';
  if (lower.includes('bachata')) return '#bfdbfe';
  return '#d1fae5';
};

const formatDashboardRange = (weekStart: Date) => {
  const weekEnd = new Date(weekStart.getTime() + DAY_MS * 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear();
  if (sameMonth) {
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekStart.toLocaleDateString('es-ES', { month: 'short' })}, ${weekStart.getFullYear()}`;
  }
  const startText = weekStart.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const endText = weekEnd.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  return `${startText} - ${endText}, ${weekEnd.getFullYear()}`;
};

export default function ClientHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isCompactDesktop = width < 1180;
  const horizontalPadding = width < 900 ? 52 : 120;
  const calendarViewportWidth = Math.max(width - horizontalPadding, 540);
  const timeColumnWidth = width < 900 ? 54 : 60;
  const dayColumnWidth = width < 900 ? 66 : 80;
  const calendarTableMinWidth = timeColumnWidth + dayColumnWidth * 7;

  const isNative = Platform.OS !== 'web';

  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const reservations = useAppStore((state) => state.reservations);
  const classes = useAppStore((state) => state.classes);
  const cancelReservation = useAppStore((state) => state.cancelReservation);
  const showToast = useAppStore((state) => state.showToast);
  const fetchClasses = useAppStore((state) => state.fetchClasses);
  const fetchInstructors = useAppStore((state) => state.fetchInstructors);
  const fetchReservations = useAppStore((state) => state.fetchReservations);

  const [activeTab, setActiveTab] = useState<DesktopTab>('mis-clases');
  const [quickReservation, setQuickReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

  const earliestReservationWeekStart = useMemo(() => {
    const paidReservations = reservations.filter((res) => res.status === 'Pagado');
    if (paidReservations.length === 0) return null;
    const parsedDates = paidReservations
      .map((res) => new Date(res.date))
      .filter((date) => !Number.isNaN(date.getTime()));
    if (parsedDates.length === 0) return null;
    const earliestDate = parsedDates.reduce((min, date) => (date < min ? date : min), parsedDates[0]);
    return getMonday(earliestDate);
  }, [reservations]);

  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => earliestReservationWeekStart ?? getMonday(new Date()));
  const initialWeekSynced = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchInstructors(),
        fetchReservations()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchClasses, fetchInstructors, fetchReservations]);

  useEffect(() => {
    if (earliestReservationWeekStart && !initialWeekSynced.current) {
      setSelectedWeekStart(earliestReservationWeekStart);
      initialWeekSynced.current = true;
    }
  }, [earliestReservationWeekStart]);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/landing');
  };

  const promptCancelReservation = (id: string) => {
    setReservationToCancel(id);
  };

  const handleCancelReservationConfirm = async () => {
    if (reservationToCancel) {
      await cancelReservation(reservationToCancel);
      setReservationToCancel(null);
      showToast('Tu reserva ha sido cancelada y reembolsada.', 'success');
    }
  };

  const clientReservations = reservations.filter((res) => res.status === 'Pagado');
  const todayReservations = useMemo(() => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedToday = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    return clientReservations.filter(res => res.date === formattedToday);
  }, [clientReservations]);

  const weeklyCalendarData = useMemo(() => {
    const paidReservations = reservations.filter((res) => res.status === 'Pagado');
    const parsed = paidReservations
      .map((res) => ({
        ...res,
        parsedDate: new Date(res.date),
        slotLabel: getSlotLabel(res.time),
      }))
      .filter((res) => !Number.isNaN(res.parsedDate.getTime()) && !!res.slotLabel);

    const weekStart = selectedWeekStart;
    const weekDays = Array.from({ length: 7 }).map((_, dayOffset) => {
      const date = new Date(weekStart.getTime() + DAY_MS * dayOffset);
      const weekday = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
      return {
        key: date.toISOString(),
        label: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        dayNumber: date.getDate(),
        date,
      };
    });

    const events = parsed.map((res) => {
      const normalizedDate = new Date(res.parsedDate);
      normalizedDate.setHours(0, 0, 0, 0);
      const dayIdx = Math.round((normalizedDate.getTime() - weekStart.getTime()) / DAY_MS);
      const [startTime] = res.time.split('-').map(s => s.trim());
      const eventDateTime = new Date(res.parsedDate);
      if (startTime) {
        const [timePart, period] = startTime.split(' ');
        const [hours, minutes] = timePart.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        eventDateTime.setHours(hour24, minutes || 0, 0, 0);
      }
      return {
        id: res.id,
        dayIdx,
        slot: res.slotLabel as string,
        title: res.className,
        time: res.time,
        isPast: eventDateTime < new Date(),
      };
    }).filter((event) => event.dayIdx >= 0 && event.dayIdx <= 6);

    return {
      weekDays,
      weekRangeLabel: formatDashboardRange(weekStart),
      events,
    };
  }, [reservations, selectedWeekStart]);

  const weekSlots = ['6:00 AM', '12:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

  if (loading && !isWeb) { // Show full screen loader only on mobile
    return (
      <SafeAreaView className="flex-1 bg-cream justify-center items-center">
        <Loader variant="inline" label="Cargando tu panel de control..." />
      </SafeAreaView>
    );
  }

  const mobileContent = (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <ExpoImage
            source={require('../../../../assets/images/logo.svg')}
            style={{ width: 150, height: 50 }}
            contentFit="contain"
          />
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full border border-gray-200"
        >
          <Text className="text-sm font-bold text-gray-800 mr-2">{user?.name.split(' ')[0]}</Text>
          <Ionicons name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(200).delay(50)} className="mb-6">
        <Text className="text-2xl font-normal text-black">
          ¡Hola, {user?.name || 'Ana Pérez'}! 👋
        </Text>
      </Animated.View>

      <Animated.Text entering={FadeInDown.duration(200).delay(100)} className={`${isNative ? 'text-gray-600' : 'text-gray-500'} font-bold text-center text-sm tracking-wide mb-4`}>
        Estas son tus Clases Reservadas
      </Animated.Text>

      <View className="gap-y-4 mb-6">
        {clientReservations.length === 0 ? (
          <EmptyState
            variant="no-bookings"
            title="No tienes reservas activas"
            message="No tienes reservas activas para esta semana."
            actionLabel="Explorar clases"
            onAction={() => router.push('/(client)/(tabs)/classes')}
          />
        ) : (
          clientReservations.map((res, idx) => (
            <Animated.View
              key={res.id}
              entering={FadeInDown.duration(200).delay(150 + idx * 50)}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
            >
              <Image
                source={
                  res.className.toLowerCase().includes('zumba')
                    ? require('../../../../assets/images/zumba.jpg')
                    : res.className.toLowerCase().includes('salsa')
                    ? require('../../../../assets/images/Salsa.jpeg')
                    : require('../../../../assets/images/bachata.jpg')
                }
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9, maxHeight: 200 }}
                resizeMode="cover"
              />
              <View className="p-4 items-center">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="people-outline" size={16} color="#FF7A00" />
                  <Text className="text-lg font-bold text-black ml-1.5">{res.className}</Text>
                </View>
                <Text className="text-base font-extrabold text-black mb-1.5">{res.time}</Text>
                <View className="flex-row justify-between w-full border-t border-gray-100 pt-3 mt-1 px-2 items-center">
                  <View className="flex-1 mr-2">
                    <Text className={`text-xs font-semibold ${isNative ? 'text-gray-600' : 'text-gray-500'}`}>Cupos: {res.seats.join(', ')}</Text>
                    <Text className={`text-xs font-semibold ${isNative ? 'text-gray-600' : 'text-gray-500'} mt-0.5 text-ellipsis overflow-hidden`}>
                      Profesor: {res.className.toLowerCase().includes('salsa') ? 'Profesor B' : 'Profesor A'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => promptCancelReservation(res.id)}
                    className="bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"
                  >
                    <Text className="text-red-600 text-xs font-bold">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const desktopContent = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {loading ? (
             <View className="flex-1 justify-center items-center">
                <Loader variant="inline" label="Cargando tu panel de control..." />
             </View>
        ) : (
            <>
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
                        <Text className={`text-[16px] font-semibold ${active ? (isNative ? 'text-primary-text-strong' : 'text-primary') : 'text-black'}`}>{tab.label}</Text>
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
                    {clientReservations.length === 0 ? (
                        <EmptyState
                          variant="no-bookings"
                          title="No tienes reservas activas"
                          message="No tienes reservas activas para esta semana."
                          actionLabel="Explorar clases"
                          onAction={() => router.push('/(client)/(tabs)/classes')}
                        />
                    ) : (
                    <View className="gap-y-3">
                        {clientReservations.map((res) => {
                        const parsedDate = new Date(res.date);
                        const dayLabels = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                        const dayLabel = dayLabels[parsedDate.getDay()] || 'LUN';
                        const dayNumber = parsedDate.getDate();
                        const classInfo = classes.find(c => c.id === res.classId);
                        return (
                        <View key={res.id} className="flex-row items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white min-h-[88px]">
                            <View className="w-[72px] items-center justify-center border-r border-gray-200 bg-white">
                            <Text className={`${isNative ? 'text-primary-text-strong' : 'text-primary'} text-[13px] font-bold`}>{dayLabel}</Text>
                            <Text className="text-[20px] font-bold text-gray-700 leading-none mt-1">{dayNumber}</Text>
                            </View>
                            <Image
                              source={
                                res.className.toLowerCase().includes('zumba')
                                  ? require('../../../../assets/images/zumba.jpg')
                                  : res.className.toLowerCase().includes('salsa')
                                  ? require('../../../../assets/images/Salsa.jpeg')
                                  : require('../../../../assets/images/bachata.jpg')
                              }
                              style={{ width: 88, height: '100%', aspectRatio: 1.5 }}
                              resizeMode="cover"
                            />
                            <TouchableOpacity className="flex-1 px-4 py-3 justify-between" onPress={() => setQuickReservation({ title: res.className, time: res.time, date: res.date, seat: res.seats.join(', '), status: 'Pagado' })}>
                            <View>
                                <Text className="text-[14px] font-bold text-black">{res.className}</Text>
                                <Text className="text-[13px] font-semibold text-gray-600 mt-1">{res.time}</Text>
                                <Text className={`text-[12px] font-medium ${isNative ? 'text-gray-600' : 'text-gray-500'} mt-0.5`}>Instructor: {classInfo?.instructorName || 'Profesor'}</Text>
                                <Text className={`text-[12px] font-medium ${isNative ? 'text-gray-600' : 'text-gray-500'} mt-0.5`}>Cupos: {res.seats.join(', ')}</Text>
                            </View>
                            </TouchableOpacity>
                            <View className="w-[124px] items-center justify-center pr-4">
                            <View className="bg-green-100 rounded-lg px-4 py-2">
                                <Text className="text-green-700 font-bold text-sm">Pagado</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => promptCancelReservation(res.id)}
                                className="mt-2 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"
                            >
                                <Text className="text-red-600 text-xs font-bold">Cancelar</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        );
                        })}
                    </View>
                    )}
                    </Animated.View>
                )}

                {activeTab === 'clases-hoy' && (
                    <Animated.View entering={FadeIn.duration(180)} className="px-5 py-5">
                    <View className="flex-row items-center mb-6">
                        <Ionicons name="calendar-outline" size={24} color="#FF7A00" />
                        <Text className="text-[15px] font-bold text-black ml-3">Clases de hoy</Text>
                    </View>

                    {todayReservations.length === 0 ? (
                        <EmptyState
                          variant="no-bookings"
                          title="Sin clases hoy"
                          message="No tienes reservas para hoy."
                          actionLabel="Explorar clases"
                          onAction={() => router.push('/(client)/(tabs)/classes')}
                        />
                    ) : (
                    <View className="gap-y-3">
                        {todayReservations.map((res) => {
                        const classInfo = classes.find(c => c.id === res.classId);
                        return (
                        <View key={res.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white flex-row min-h-[132px]">
                            <Image
                              source={
                                res.className.toLowerCase().includes('zumba')
                                  ? require('../../../../assets/images/zumba.jpg')
                                  : res.className.toLowerCase().includes('salsa')
                                  ? require('../../../../assets/images/Salsa.jpeg')
                                  : require('../../../../assets/images/bachata.jpg')
                              }
                              style={{ width: 240, height: '100%', aspectRatio: 16 / 9 }}
                              resizeMode="cover"
                            />
                            <View className="flex-1 px-5 py-4 justify-between">
                            <View>
                                <Text className="text-[15px] font-bold text-black">{res.className}</Text>
                                <Text className="text-[18px] font-bold text-black mt-2">
                                {res.time}
                                </Text>
                                <Text className="text-[13px] font-semibold text-gray-600 mt-1">Cupos: {res.seats.join(', ')}</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <View>
                                <Text className={`text-[11px] font-semibold ${isNative ? 'text-gray-600' : 'text-gray-500'} uppercase`}>Instructor</Text>
                                <Text className="text-[12px] font-semibold text-black">{classInfo?.instructorName || 'Profesor'}</Text>
                                </View>
                                <View className="bg-green-100 rounded-lg px-4 py-2">
                                <Text className="text-green-700 font-bold text-sm">Pagado</Text>
                                </View>
                            </View>
                            </View>
                        </View>
                        );
                        })}
                    </View>
                    )}
                    </Animated.View>
                )}

                {activeTab === 'calendario' && (
                    <Animated.View entering={FadeIn.duration(180)} className="px-5 py-5">
                    <View className={`mb-5 px-2 ${isCompactDesktop ? 'flex-col items-start gap-y-3' : 'flex-row justify-between items-center'}`}>
                        <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={26} color="#666" />
                        <Text className="text-[15px] font-bold text-black ml-3">Mi semana</Text>
                        </View>
                        <View className={`flex-row items-center ${isCompactDesktop ? 'gap-x-3' : 'gap-x-4'}`}>
                        <Text className={`${isCompactDesktop ? 'text-[16px]' : 'text-[20px]'} font-semibold ${isNative ? 'text-gray-600' : 'text-gray-500'}`}>{weeklyCalendarData.weekRangeLabel}</Text>
                        <TouchableOpacity hitSlop={{ top: 13, bottom: 13, left: 13, right: 13 }} onPress={() => setSelectedWeekStart((prev) => new Date(prev.getTime() - DAY_MS * 7))}>
                          <Ionicons name="chevron-back" size={18} color="#555" />
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{ top: 13, bottom: 13, left: 13, right: 13 }} onPress={() => setSelectedWeekStart((prev) => new Date(prev.getTime() + DAY_MS * 7))}>
                          <Ionicons name="chevron-forward" size={18} color="#555" />
                        </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                      className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
                      style={{
                        minWidth: Math.max(calendarTableMinWidth, calendarViewportWidth),
                        width: Math.max(calendarTableMinWidth, calendarViewportWidth),
                      }}
                    >
                        <View className="flex-row border-b border-gray-200">
                        <View style={{ width: timeColumnWidth }} />
                        {weeklyCalendarData.weekDays.map((day, dayIdx) => {
                            const todayMidnight = new Date(new Date().toDateString());
                            const isPastDay = day.date < todayMidnight;
                            return (
                            <View key={day.key} className={`flex-1 items-center py-4 border-l border-gray-200 ${dayIdx === 0 ? 'border-l-0' : ''} ${isPastDay ? 'opacity-40' : ''}`}>
                            <Text className={`${isCompactDesktop ? 'text-[13px]' : 'text-[15px]'} font-bold text-gray-700 text-center`}>{day.label}</Text>
                            <Text className={`${isCompactDesktop ? 'text-[16px]' : 'text-[18px]'} font-bold text-gray-700`}>{day.dayNumber}</Text>
                            </View>
                            );
                        })}
                        </View>

                        {weekSlots.map((slot) => (
                        <View key={slot} className="flex-row border-b border-gray-200 last:border-b-0 min-h-[88px]">
                            <View className="items-center justify-center border-r border-gray-200 bg-gray-50" style={{ width: timeColumnWidth }}>
                            <Text className={`${isCompactDesktop ? 'text-[13px]' : 'text-[15px]'} font-bold text-gray-600`}>{slot.replace(':00', '')}</Text>
                            </View>
                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                            const event = weeklyCalendarData.events.find((ev) => ev.dayIdx === dayIdx && ev.slot === slot);
                            return (
                                <View key={`${slot}-${dayIdx}`} className="flex-1 border-l border-gray-200 p-2 justify-center">
                                {event ? (
                                    <View className={`rounded-lg px-3 py-3 items-center ${event.isPast ? 'opacity-40' : ''}`} style={{ backgroundColor: getEventColor(event.title) }}>
                                    <Text className={`${isCompactDesktop ? 'text-xs' : 'text-sm'} text-black font-bold ${event.isPast ? 'line-through' : ''}`}>{event.title}</Text>
                                    <Text className="text-black font-bold text-xs mt-0.5">{event.time}</Text>
                                    </View>
                                ) : null}
                                </View>
                            );
                            })}
                        </View>
                        ))}
                    </View>
                    </ScrollView>
                    </Animated.View>
                )}
                </View>
            </>
        )}
    </ScrollView>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-cream">
        <ClientDesktopShell title={`¡Hola, ${user?.name || 'Ana Pérez'}! 👋`} subtitle="Resumen general">
            {isWeb ? desktopContent : mobileContent}
        </ClientDesktopShell>

        {/* Global Dialogs Rendered at the bottom for both Web & Mobile */}
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

        <ConfirmDialog
            visible={showLogoutConfirm}
            title="Cerrar sesión"
            message="¿Estás seguro de que deseas salir de tu cuenta?"
            confirmLabel="Salir"
            cancelLabel="Volver"
            onConfirm={handleLogoutConfirm}
            onCancel={() => setShowLogoutConfirm(false)}
            variant="default"
        />

        <ConfirmDialog
            visible={!!reservationToCancel}
            title="Cancelar Reserva"
            message="¿Estás seguro de que deseas cancelar esta reserva? Se realizará un reembolso automático."
            confirmLabel="Cancelar Reserva"
            cancelLabel="Mantener"
            onConfirm={handleCancelReservationConfirm}
            onCancel={() => setReservationToCancel(null)}
            variant="danger"
        />
    </SafeAreaView>
  );
}
