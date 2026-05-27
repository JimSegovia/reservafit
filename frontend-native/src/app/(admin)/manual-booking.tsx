import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function AdminManualBookingScreen() {
  const router = useRouter();
  
  const allClasses = useAppStore((state) => state.classes);
  const classes = allClasses.filter(c => c.status === 'Activo');
  const addManualBooking = useAppStore((state) => state.addManualBooking);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [paymentType, setPaymentType] = useState<'Efectivo' | 'Tarjeta'>('Efectivo');
  const [price, setPrice] = useState('40.00');

  // Load default class selections
  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  // Load default schedules based on class selection
  useEffect(() => {
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (selectedClass) {
      setSelectedSchedule(selectedClass.slots?.[0] || selectedClass.schedule.split(' ').slice(-2).join(' ') || '6:00 PM - 7:00 PM');
      setPrice(selectedClass.price.toFixed(2));
    }
  }, [selectedClassId]);

  const handleRegister = () => {
    if (!clientName || !clientLastName || !clientEmail || !clientPhone || !selectedClassId || !selectedSchedule) {
      Alert.alert('Error', 'Por favor llena todos los campos de cliente y reserva.');
      return;
    }

    const success = addManualBooking({
      clientName,
      clientLastName,
      clientEmail,
      clientPhone,
      classId: selectedClassId,
      schedule: selectedSchedule,
      paymentType,
      price: parseFloat(price) || 40.00
    });

    if (success) {
      Alert.alert('Éxito', 'La reserva manual fue registrada exitosamente.');
      // Clear fields
      setClientName('');
      setClientLastName('');
      setClientEmail('');
      setClientPhone('');
      router.push('/(admin)/bookings-history');
    } else {
      Alert.alert('Error', 'No se pudo registrar la reserva. Intenta de nuevo.');
    }
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  const enrolledStr = activeClass ? `${activeClass.enrolled}/${activeClass.capacity}` : '15/30';

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.replace('/(admin)')}>
            <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-black">Registrar reserva manual</Text>
        </Animated.View>

        {/* Section: Datos del cliente */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)}>
          <Text className="text-base font-extrabold text-black mb-3">Datos del cliente</Text>
          
          <View className="gap-y-3 mb-6">
            <View className="flex-row justify-between">
              <TextInput
                placeholder="Nombre"
                value={clientName}
                onChangeText={setClientName}
                placeholderTextColor="#9CA3AF"
                className="w-[48%] border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
              />
              <TextInput
                placeholder="Apellido"
                value={clientLastName}
                onChangeText={setClientLastName}
                placeholderTextColor="#9CA3AF"
                className="w-[48%] border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
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
            <View className="flex-row gap-x-2">
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

        {/* Section: Pago */}
        <Animated.View entering={FadeInDown.duration(200).delay(150)}>
          <Text className="text-base font-extrabold text-black mb-3">Pago</Text>

          <View className="gap-y-3 mb-6">
            <Text className="text-gray-500 font-bold text-xs ml-1">Tipo de pago</Text>
            <View className="flex-row gap-x-4 mb-2">
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

            <Text className="text-gray-500 font-bold text-xs ml-1">Monto (S/.)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="S/ 40.00"
              placeholderTextColor="#9CA3AF"
              className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-black text-sm"
            />
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.duration(200).delay(200)}>
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.7}
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-4"
          >
            <Text className="text-white text-base font-bold">Registrar reserva</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Capacity Indicator */}
        <Animated.Text entering={FadeInDown.duration(200).delay(250)} className="text-center text-gray-500 text-xs font-bold mb-4">
          Cupos disponibles {enrolledStr}
        </Animated.Text>
      </ScrollView>
    </SafeAreaView>
  );
}
