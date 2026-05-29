import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const registerUser = useAppStore((state) => state.registerUser);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !lastName || !email || !phone || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    
    registerUser({
      name: `${name} ${lastName}`,
      email,
      phone,
      role: 'client'
    });

    setError('');
    router.replace('/(auth)/verify');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream p-0 m-0">
      {/* Web Header */}
      {isWeb && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-10 border-b border-gray-300/50 bg-cream z-10">
          <TouchableOpacity onPress={() => router.push('/(auth)/landing')} className="flex-row items-center">
            <Ionicons name="body-outline" size={32} color="#FF7A00" />
            <Text className="text-[28px] font-bold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingBottom: 30, 
            paddingHorizontal: isWeb ? 0 : 24, 
            paddingVertical: isWeb ? 40 : 16,
            justifyContent: isWeb ? 'center' : 'flex-start'
          }} 
          showsVerticalScrollIndicator={false}
        >
          <View className={`md:w-[500px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10 ${isWeb ? 'mt-0' : ''}`}>
            
            {/* Top Filter/Icon alignment match mockup (Mobile Only) */}
            {!isWeb && (
              <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-end mb-4">
                <Ionicons name="funnel-outline" size={20} color="#D1D5DB" />
              </Animated.View>
            )}

            {/* Large Profile Icon */}
            <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-6">
              <View className={`rounded-full bg-primary items-center justify-center ${isWeb ? 'w-24 h-24' : 'w-20 h-20'}`}>
                <Ionicons name="person" size={isWeb ? 54 : 45} color="white" />
              </View>
              <Text className={`font-bold text-black mt-4 ${isWeb ? 'text-3xl' : 'text-2xl'}`}>Registro de usuario</Text>
            </Animated.View>

            {error ? (
              <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">
                {error}
              </Animated.Text>
            ) : null}

            {/* Form */}
            <View className="gap-y-4 mb-6">
              {/* Nombre */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)}>
                <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Nombre</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3">
                  <Ionicons name="person-outline" size={20} color={isWeb ? "#9CA3AF" : "gray"} />
                  <TextInput
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                  />
                </View>
              </Animated.View>

              {/* Apellido */}
              <Animated.View entering={FadeInDown.duration(200).delay(80)}>
                <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Apellido</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3">
                  <Ionicons name="person-outline" size={20} color={isWeb ? "#9CA3AF" : "gray"} />
                  <TextInput
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                  />
                </View>
              </Animated.View>

              {/* Correo electrónico */}
              <Animated.View entering={FadeInDown.duration(200).delay(110)}>
                <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Correo electrónico</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3">
                  <Ionicons name="mail-outline" size={20} color={isWeb ? "#9CA3AF" : "gray"} />
                  <TextInput
                    placeholder="Correo@ejemplo.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                  />
                </View>
              </Animated.View>

              {/* Número de celular */}
              <Animated.View entering={FadeInDown.duration(200).delay(140)}>
                <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Número de celular</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3">
                  <Ionicons name="call-outline" size={20} color={isWeb ? "#9CA3AF" : "gray"} />
                  <TextInput
                    placeholder="9XX XXX XXX"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                  />
                </View>
              </Animated.View>

              {/* Contraseña */}
              <Animated.View entering={FadeInDown.duration(200).delay(170)}>
                <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Contraseña</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3">
                  <Ionicons name="lock-closed-outline" size={20} color={isWeb ? "#9CA3AF" : "gray"} />
                  <TextInput
                    placeholder="****************"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>

            {/* Submit Button */}
            <Animated.View entering={FadeInDown.duration(200).delay(200)} className={isWeb ? 'mt-2 mb-2' : 'mb-6'}>
              <TouchableOpacity
                onPress={handleRegister}
                activeOpacity={0.7}
                className={`w-full bg-primary rounded-xl items-center shadow-lg shadow-orange-500/20 ${isWeb ? 'py-3' : 'py-4'}`}
              >
                <Text className="text-white text-base font-bold">Registrarse</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login redirection (Mobile Only) */}
            {!isWeb && (
              <Animated.View entering={FadeInDown.duration(200).delay(230)} className="flex-row justify-center items-center mb-6">
                <Text className="text-gray-600 text-sm">¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text className="text-primary font-bold text-sm">Inicio sesión</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
