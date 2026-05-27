import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);

  const [email, setEmail] = useState('cliente@reservafit.com'); // Default pre-populated for convenience
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    // Determine role by email name for easy routing testing
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'client';
    
    login(email, role);
    setError('');

    // Redirect
    if (role === 'admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/(client)/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
<ScrollView 
           contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, flex: 1, paddingHorizontal: 24, paddingVertical: 16, justifyContent: 'space-between' }} 
           showsVerticalScrollIndicator={false}
         >
          <View>
            {/* Logo */}
            <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-center mt-6 mb-8">
              <Ionicons name="body-outline" size={32} color="#FF7A00" />
              <Text className="text-3xl font-bold ml-1 text-black">
                Reserva<Text className="text-primary">Fit</Text>
              </Text>
            </Animated.View>

            {/* Headline */}
            <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-6">
              <Text className="text-2xl font-bold text-black text-center">Iniciar Sesión</Text>
              <Text className="text-gray-500 text-center mt-1 text-sm">
                Continua reservando tu clase favorita.
              </Text>
            </Animated.View>

            {error ? (
              <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">
                {error}
              </Animated.Text>
            ) : null}

            {/* Inputs */}
            <Animated.View entering={FadeInDown.duration(200).delay(100)} className="gap-y-4 mb-6">
              <View>
                <TextInput
                  placeholder="Usuario o correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9CA3AF"
                  className="w-full border border-gray-300 rounded-xl bg-white px-4 py-4 text-black text-sm"
                />
              </View>

              <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 py-4">
                <TextInput
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-black text-sm p-0"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Remember Me and Forgot Password */}
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

            {/* Submit Button */}
            <Animated.View entering={FadeInDown.duration(200).delay(200)} className="mb-6">
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.7}
                className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20"
              >
                <Text className="text-white text-base font-bold">Ingresar</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Register redirection */}
            <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mb-4">
              <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-primary font-bold text-sm">Regístrate</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Minimum duration warning */}
            <Animated.View entering={FadeInDown.duration(200).delay(300)} className="flex-row items-center justify-center py-2 mb-4">
              <Ionicons name="time-outline" size={16} color="black" />
              <Text className="text-xs text-black font-medium ml-1">
                Reserva mínima: 10 minutos
              </Text>
            </Animated.View>
          </View>

          {/* Bottom Kettlebell / Yoga Mat mockup decoration */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
