import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [email, setEmail] = useState('cliente@reservafit.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    const role = email.toLowerCase().includes('admin') ? 'admin' : 'client';
    
    login(email, role);
    setError('');

    if (role === 'admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/(client)/(tabs)');
    }
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
            justifyContent: isWeb ? 'center' : 'space-between'
          }} 
          showsVerticalScrollIndicator={false}
        >
          <View className={`md:w-[500px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10 ${isWeb ? 'mt-0' : ''}`}>
            
            {/* Logo (Mobile Only) */}
            {!isWeb && (
              <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-center mt-6 mb-8">
                <Ionicons name="body-outline" size={32} color="#FF7A00" />
                <Text className="text-3xl font-bold ml-1 text-black">
                  Reserva<Text className="text-primary">Fit</Text>
                </Text>
              </Animated.View>
            )}

            {/* Web Top Icon */}
            {isWeb && (
              <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-6">
                <View className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-sm">
                  <Ionicons name="person" size={54} color="white" />
                </View>
              </Animated.View>
            )}

            {/* Headline */}
            <Animated.View entering={FadeInDown.duration(200).delay(50)} className={`items-center ${isWeb ? 'mb-10' : 'mb-6'}`}>
              <Text className={`font-bold text-black text-center ${isWeb ? 'text-3xl' : 'text-2xl'}`}>Iniciar sesión</Text>
              <Text className={`text-gray-500 text-center mt-2 ${isWeb ? 'text-sm px-6' : 'text-sm'}`}>
                {isWeb ? "Inicia sesión para ver las clases que tenemos preparadas para ti." : "Continua reservando tu clase favorita."}
              </Text>
            </Animated.View>

            {error ? (
              <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">
                {error}
              </Animated.Text>
            ) : null}

            {/* Inputs */}
            <Animated.View entering={FadeInDown.duration(200).delay(100)} className="gap-y-5 mb-6">
              <View>
                {isWeb && <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Correo electrónico</Text>}
                <View className={`flex-row items-center border border-gray-300 rounded-xl bg-white ${isWeb ? 'px-3 py-3' : 'px-4 py-4'}`}>
                  {isWeb && <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-2" />}
                  <TextInput
                    placeholder={isWeb ? "Correo@ejemplo.com" : "Usuario o correo electrónico"}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-black text-sm p-0 ml-1"
                  />
                </View>
              </View>

              <View>
                {isWeb && <Text className="text-gray-500 font-bold text-sm mb-1 ml-1">Contraseña</Text>}
                <View className={`flex-row items-center border border-gray-300 rounded-xl bg-white ${isWeb ? 'px-3 py-3' : 'px-4 py-4'}`}>
                  {isWeb && <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="mr-2" />}
                  <TextInput
                    placeholder={isWeb ? "****************" : "Contraseña"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-black text-sm p-0 ml-1"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Remember Me and Forgot Password (Mobile Only) */}
            {!isWeb && (
              <Animated.View entering={FadeInDown.duration(200).delay(150)} className="flex-row justify-between items-center mb-8">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center"
                >
                  <Ionicons
                    name={rememberMe ? "checkbox" : "square-outline"}
                    size={20}
                    color={rememberMe ? "#FF7A00" : "gray"}
                  />
                  <Text className="text-gray-600 text-sm ml-1.5 font-medium">Recordarme</Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Text className="text-primary font-bold text-sm">¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Register redirection (Web order: above button) */}
            {isWeb && (
              <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mb-6 mt-2">
                <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text className="text-primary font-bold text-sm">Registrate</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Submit Button */}
            <Animated.View entering={FadeInDown.duration(200).delay(200)} className={isWeb ? 'mt-2' : 'mb-6'}>
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.7}
                className={`w-full bg-primary rounded-xl items-center shadow-lg shadow-orange-500/20 ${isWeb ? 'py-3' : 'py-4'}`}
              >
                <Text className="text-white text-base font-bold">Ingresar</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Register redirection (Mobile order: below button) */}
            {!isWeb && (
              <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mb-4">
                <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text className="text-primary font-bold text-sm">Regístrate</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Minimum duration warning (Mobile Only) */}
            {!isWeb && (
              <Animated.View entering={FadeInDown.duration(200).delay(300)} className="flex-row items-center justify-center py-2 mb-4">
                <Ionicons name="time-outline" size={16} color="black" />
                <Text className="text-xs text-black font-medium ml-1">
                  Reserva mínima: 10 minutos
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Bottom Kettlebell / Yoga Mat mockup decoration (Mobile Only) */}
          {!isWeb && (
            <Animated.View entering={FadeIn.duration(250).delay(350)} className="flex-row justify-between items-end mt-4 -mx-6">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop' }}
                className="w-24 h-24 rounded-tr-3xl rounded-br-3xl opacity-30 object-cover"
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200&auto=format&fit=crop' }}
                className="w-24 h-24 rounded-tl-3xl rounded-bl-3xl opacity-30 object-cover"
              />
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
