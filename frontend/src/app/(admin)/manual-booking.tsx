import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import api from '@/api/api';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function AdminManualBookingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const showToast = useAppStore((state) => state.showToast);
  
  const allClasses = useAppStore((state) => state.classes);
  const classes = allClasses.filter(c => c.status === 'Activo');
  const addManualBooking = useAppStore((state) => state.addManualBooking);
  const fetchClasses = useAppStore((state) => state.fetchClasses);
  const agenda = useAppStore((state) => state.agenda);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [paymentType, setPaymentType] = useState<'Efectivo' | 'Tarjeta'>('Efectivo');
  const [price, setPrice] = useState('40.00');
  const [loading, setLoading] = useState(false);

  // Seat states
  const [occupiedList, setOccupiedList] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [tempSeats, setTempSeats] = useState<number[]>([]);
  const seatNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  // Auto-fetch classes if not loaded yet
  useEffect(() => {
    if (allClasses.length === 0) {
      fetchClasses();
    }
  }, []);

  // Load default class selections
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  // Load default schedules based on class selection
  useEffect(() => {
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (selectedClass) {
      setSelectedSchedule(selectedClass.slots?.[0] || selectedClass.schedule.split(' ').slice(-2).join(' ') || '6:00 PM - 7:00 PM');
    }
  }, [selectedClassId]);

  // Fetch occupied seats
  useEffect(() => {
    const fetchOccupied = async () => {
      const match = agenda.find((a: any) => a.id_clase === selectedClassId);
      if (!match) {
        setOccupiedList([]);
        setSelectedSeats([]);
        return;
      }
      try {
        const response = await api.get(`/detalles-reserva/ocupados/${match.id_detalle_clase}`);
        setOccupiedList(response.data.data || []);
      } catch (err) {
        console.error('Error fetching occupied seats:', err);
        setOccupiedList([]);
      }
      setSelectedSeats([]);
    };
    if (selectedClassId) {
      fetchOccupied();
    }
  }, [selectedClassId, agenda]);

  // Update total price when seats or class changes
  useEffect(() => {
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (selectedClass) {
      const seatCount = selectedSeats.length > 0 ? selectedSeats.length : 1;
      setPrice((selectedClass.price * seatCount).toFixed(2));
    }
  }, [selectedSeats, selectedClassId]);

  const openSeatModal = () => {
    setTempSeats([...selectedSeats]);
    setShowSeatModal(true);
  };

  const handleTempSeatPress = (seatNum: number) => {
    if (occupiedList.includes(seatNum)) return;
    setTempSeats(prev =>
      prev.includes(seatNum)
        ? prev.filter(s => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const confirmSeats = () => {
    setSelectedSeats(tempSeats);
    setShowSeatModal(false);
  };

  const cancelSeats = () => {
    setShowSeatModal(false);
  };

  const handleRegister = async () => {
    if (!clientName || !clientLastName || !clientEmail || !clientPhone || !selectedClassId || !selectedSchedule) {
      showToast('Por favor llena todos los campos de cliente y reserva.', 'warning');
      return;
    }

    if (selectedSeats.length === 0) {
      showToast('Por favor selecciona al menos un cupo.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const success = await addManualBooking({
        clientName,
        clientLastName,
        clientEmail,
        clientPhone,
        classId: selectedClassId,
        schedule: selectedSchedule,
        paymentType,
        price: parseFloat(price) || 40.00,
        selectedSeats
      });

      setLoading(false);

      if (success) {
        showToast('La reserva manual fue registrada exitosamente.', 'success');
        // Clear fields
        setClientName('');
        setClientLastName('');
        setClientEmail('');
        setClientPhone('');
        setSelectedSeats([]);
        router.push('/(admin)/bookings-history');
      } else {
        showToast('No se pudo registrar la reserva. Intenta de nuevo.', 'error');
      }
    } catch (e) {
      setLoading(false);
      showToast('Ocurrió un error al registrar la reserva manual.', 'error');
    }
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  const enrolledStr = `${occupiedList.length}/30`;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: isMobile ? 16 : 24, paddingVertical: 16, paddingBottom: isMobile ? 80 : 30 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.replace('/(admin)')}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Reserva Manual</Text>
            <Text className="text-2xl font-extrabold text-black mt-0.5 font-sans">Reserva manual</Text>
          </View>
        </Animated.View>

        {/* Section: Datos del cliente */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)}>
          <Text className="text-base font-extrabold text-black mb-3">Datos del cliente</Text>
          
          <View className="gap-y-3 mb-6">
            <View className={isMobile ? 'flex-col gap-y-3' : 'flex-row justify-between'}>
              <TextInput
                placeholder="Nombre"
                value={clientName}
                onChangeText={setClientName}
                placeholderTextColor="#9CA3AF"
                className={`border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm ${isMobile ? 'w-full' : 'w-[48%]'}`}
              />
              <TextInput
                placeholder="Apellido"
                value={clientLastName}
                onChangeText={setClientLastName}
                placeholderTextColor="#9CA3AF"
                className={`border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm ${isMobile ? 'w-full' : 'w-[48%]'}`}
              />
            </View>

            <TextInput
              placeholder="Correo electrónico"
              value={clientEmail}
              onChangeText={setClientEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
            />

            <TextInput
              placeholder="Número de celular (9XX XXX XXX)"
              value={clientPhone}
              onChangeText={setClientPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
              className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
            />
          </View>
        </Animated.View>

        {/* Section: Clase y horario */}
        <Animated.View entering={FadeInDown.duration(200).delay(100)}>
          <Text className="text-base font-extrabold text-black mb-3">Clase y horario</Text>

          <View className="gap-y-3 mb-6">
            {/* Mock select for Class */}
            <Text className="text-gray-500 font-bold text-xs mb-0.5 ml-1">Clase</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-x-2 py-1">
              {classes.map(c => {
                const isSelected = c.id === selectedClassId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedClassId(c.id)}
                    className={`px-4 py-2.5 rounded-xl border ${
                      isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Mock select for Schedule */}
            <Text className="text-gray-500 font-bold text-xs mb-0.5 ml-1 mt-2">Horario</Text>
            <View className={`${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
              {activeClass?.slots?.map((slot, index) => {
                const isSelected = slot === selectedSchedule;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSchedule(slot)}
                    className={`px-4 py-2.5 rounded-xl border ${
                      isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              }) || (
                <View className="border border-gray-300 rounded-xl bg-white px-4 py-3 flex-1">
                  <Text className="text-black text-sm">{selectedSchedule}</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Section: Cupos */}
        <Animated.View entering={FadeInDown.duration(200).delay(120)}>
          <Text className="text-base font-extrabold text-black mb-3">Selección de cupo(s)</Text>

          <TouchableOpacity
            onPress={openSeatModal}
            className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-sm text-gray-500 font-semibold">
                {selectedSeats.length > 0
                  ? `${selectedSeats.length} cupo(s) seleccionado(s): ${selectedSeats.join(', ')}`
                  : 'Toca para seleccionar cupos'}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">Cupos: {occupiedList.length}/30 ocupados</Text>
            </View>
            <Ionicons name="grid-outline" size={24} color="#FF7A00" />
          </TouchableOpacity>
        </Animated.View>

        {/* Section: Pago */}
        <Animated.View entering={FadeInDown.duration(200).delay(150)}>
          <Text className="text-base font-extrabold text-black mb-3">Pago</Text>

          <View className="gap-y-3 mb-6">
            <Text className="text-gray-500 font-bold text-xs ml-1">Tipo de pago</Text>
            <View className={`${isMobile ? 'flex-col' : 'flex-row'} gap-3 mb-2`}>
              <TouchableOpacity
                onPress={() => setPaymentType('Efectivo')}
                className="flex-row items-center"
              >
                <Ionicons
                  name={paymentType === 'Efectivo' ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={paymentType === 'Efectivo' ? "#FF7A00" : "gray"}
                />
                <Text className="text-black text-sm font-bold ml-1.5">Efectivo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPaymentType('Tarjeta')}
                className="flex-row items-center"
              >
                <Ionicons
                  name={paymentType === 'Tarjeta' ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={paymentType === 'Tarjeta' ? "#FF7A00" : "gray"}
                />
                <Text className="text-black text-sm font-bold ml-1.5">Tarjeta</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 font-bold text-xs ml-1">Monto (S/)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="40.00"
              placeholderTextColor="#9CA3AF"
              className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
            />
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.duration(200).delay(200)}>
          <Button
            label="Registrar reserva"
            onPress={handleRegister}
            disabled={loading}
            loading={loading}
            variant="primary"
          />
        </Animated.View>

        {/* Capacity Indicator */}
        <Animated.Text entering={FadeInDown.duration(200).delay(250)} className="text-center text-gray-500 text-xs font-bold mb-4 mt-2">
          Cupos disponibles: {enrolledStr}
        </Animated.Text>
      </ScrollView>

      {/* Seat Selection Overlay */}
      {showSeatModal && (
        <View className="absolute inset-0 z-50 bg-black/50 justify-end">
          <View className={`bg-cream rounded-t-3xl ${isMobile ? 'max-h-[80%]' : 'max-h-[90%]'} p-5`}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-extrabold text-black">Seleccionar cupo(s)</Text>
              <TouchableOpacity onPress={cancelSeats}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center">
                <Text className="text-base font-extrabold text-black mr-1">Sala Única</Text>
              </View>
              <Text className="text-xs text-gray-400 font-bold mt-1">Cupos: 30 alumnos</Text>
            </View>

            <ScrollView>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {seatNumbers.map((seatNum, idx) => {
                  const isOccupied = occupiedList.includes(seatNum);
                  const isSelected = tempSeats.includes(seatNum);

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
                      className="aspect-square"
                      style={{ width: '14.5%' }}
                    >
                      <TouchableOpacity
                        onPress={() => handleTempSeatPress(seatNum)}
                        disabled={isOccupied}
                        className={`w-full h-full border rounded-xl items-center justify-center ${bgStyle}`}
                      >
                        <Text className={`text-xs font-bold ${textStyle}`}>{seatNum}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>

              <View className="flex-row justify-around mt-6 mb-4">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full border border-gray-300 bg-white mr-1.5" />
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
              </View>
            </ScrollView>

            <View className="flex-row gap-x-3 pt-2 border-t border-gray-200">
              <View className="flex-1">
                <Button label="Cancelar" onPress={cancelSeats} variant="secondary" />
              </View>
              <View className="flex-1">
                <Button
                  label={`Confirmar (${tempSeats.length})`}
                  onPress={confirmSeats}
                  disabled={tempSeats.length === 0}
                  variant="primary"
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
