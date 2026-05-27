import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const registerUser = useAppStore((state) => state.registerUser);

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
    
    // Store user data mock in Zustand and set mockup OTP
    registerUser({
      name: `${name} ${lastName}`,
      email,
      phone,
      role: 'client'
    });

    setError('');
    // Go to OTP verify screen (replace so back doesn't return to register)
    router.replace('/(auth)/verify');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
<ScrollView 
           contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, flex: 1, paddingHorizontal: 24, paddingVertical: 16 }} 
           showsVerticalScrollIndicator={false}
         >
          {/* Top Filter/Icon alignment match mockup */}
          <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-end mb-4">
            <Ionicons name="funnel-outline" size={20} color="#D1D5DB" />
          </Animated.View>

          {/* Large Profile Icon */}
          <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Ionicons name="person" size={45} color="white" />
            </View>
            <Text className="text-2xl font-bold text-black mt-3">Registro de usuario</Text>
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
                <Ionicons name="person-outline" size={20} color="gray" />
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
                <Ionicons name="person-outline" size={20} color="gray" />
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
                <Ionicons name="mail-outline" size={20} color="gray" />
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
                <Ionicons name="call-outline" size={20} color="gray" />
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
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
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
          <Animated.View entering={FadeInDown.duration(200).delay(200)} className="mb-6">
            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.7}
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">Registrar</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login redirection */}
          <Animated.View entering={FadeInDown.duration(200).delay(230)} className="flex-row justify-center items-center mb-6">
            <Text className="text-gray-600 text-sm">¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-bold text-sm">Inicio sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
