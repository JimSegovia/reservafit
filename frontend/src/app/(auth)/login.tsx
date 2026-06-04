import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [email, setEmail] = useState('cliente@reservafit.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('El correo electrónico es obligatorio.');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Por favor ingresa un correo válido (ej: usuario@correo.com).');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('La contraseña es obligatoria.');
    } else if (text.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      validateEmail(email);
      validatePassword(password);
      showToast('Por favor completa todos los campos requeridos.', 'warning');
      return;
    }

    if (emailError || passwordError) {
      showToast('Por favor corrige los errores antes de continuar.', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);

      if (email.toLowerCase() === 'error@reservafit.com') {
        setError('El servidor no responde. Intenta de nuevo más tarde.');
        showToast('Error de conexión con el servidor.', 'error');
        return;
      }

      if (password !== '123456') {
        setPasswordError('La contraseña es incorrecta.');
        setError('Contraseña incorrecta. Inténtalo de nuevo.');
        showToast('Contraseña incorrecta.', 'error');
        return;
      }

      const role = email.toLowerCase().includes('admin') ? 'admin' : 'client';
      login(email, role);
      showToast('¡Inicio de sesión exitoso!', 'success');

      if (role === 'admin') {
        router.replace('/(admin)');
      } else {
        router.replace('/(client)/(tabs)');
      }
    }, 1200);
  };

  const isSubmitDisabled = loading || !email || !password || !!emailError || !!passwordError;

  return (
    <View className="flex-1 bg-cream">
      {/* Background Image only for mobile - spans entire screen including status bar */}
      {!isWeb && (
        <Image
          source={require('../../../../assets/images/iniciar sesion mobile.jpg')}
          style={StyleSheet.absoluteFill}
          className="opacity-90"
          resizeMode="cover"
        />
      )}

      {/* Web Header */}
      {isWeb && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-10 border-b border-gray-300/50 bg-cream z-10">
          <TouchableOpacity onPress={() => router.push('/help' as any)} className="flex-row items-center">
            <ExpoImage
              source={require('../../../../assets/images/logo.svg')}
              style={{ width: 32, height: 32 }}
              className="mr-1.5"
            />
            <Text className="text-[28px] font-bold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
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
              justifyContent: 'center'
            }} 
            showsVerticalScrollIndicator={false}
          >
            {/* Mobile Back Button (Float Top Left) */}
            {!isWeb && (
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="w-10 h-10 rounded-full bg-white/90 items-center justify-center absolute top-4 left-4 z-10 shadow-sm"
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            )}

            <View className={`md:w-[500px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10 ${isWeb ? 'mt-0' : 'bg-white/95 p-6 rounded-3xl border border-white/25 shadow-md'}`}>
              
              {/* Logo Centered & Larger (Web & Mobile) */}
              <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-6">
                <View className="w-32 h-32 rounded-3xl bg-white items-center justify-center shadow-md overflow-hidden">
                  <ExpoImage
                    source={require('../../../../assets/images/logo.svg')}
                    style={{ width: 90, height: 90 }}
                    contentFit="contain"
                  />
                </View>
                <Text className="text-3xl font-extrabold text-black mt-3">
                  Reserva<Text className="text-primary">Fit</Text>
                </Text>
              </Animated.View>

              {/* Headline */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-6">
                <Text className="text-xl font-bold text-gray-700 text-center">Iniciar sesión</Text>
                <Text className="text-gray-500 text-center mt-1 text-xs px-4">
                  {isWeb ? "Inicia sesión para ver las clases que tenemos preparadas para ti." : "Continúa reservando tu clase favorita."}
                </Text>
              </Animated.View>

              {error ? (
                <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4 font-semibold">
                  {error}
                </Animated.Text>
              ) : null}

              {/* Inputs */}
              <Animated.View entering={FadeInDown.duration(200).delay(100)} className="gap-y-5 mb-6">
                <View>
                  <View className="flex-row items-center mb-1.5 ml-1">
                    <Ionicons name="mail-outline" size={16} color="#FF7A00" className="mr-1" />
                    <Text className="text-gray-600 font-bold text-sm">Correo electrónico</Text>
                  </View>
                  <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3.5 border-gray-300 ${emailError ? 'border-red-500 bg-red-50/10' : ''}`}>
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-2" />
                    <TextInput
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChangeText={validateEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 text-black text-sm p-0 ml-1"
                      editable={!loading}
                    />
                  </View>
                  {emailError ? (
                    <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{emailError}</Text>
                  ) : null}
                </View>

                <View>
                  <View className="flex-row items-center mb-1.5 ml-1">
                    <Ionicons name="lock-closed-outline" size={16} color="#FF7A00" className="mr-1" />
                    <Text className="text-gray-600 font-bold text-sm">Contraseña</Text>
                  </View>
                  <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3.5 border-gray-300 ${passwordError ? 'border-red-500 bg-red-50/10' : ''}`}>
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="mr-2" />
                    <TextInput
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChangeText={validatePassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 text-black text-sm p-0 ml-1"
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{passwordError}</Text>
                  ) : null}
                </View>
              </Animated.View>

              {/* Remember Me and Forgot Password (Mobile Only) */}
              {!isWeb && (
                <Animated.View entering={FadeInDown.duration(200).delay(150)} className="flex-row justify-between items-center mb-8">
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    className="flex-row items-center"
                    disabled={loading}
                  >
                    <Ionicons
                      name={rememberMe ? "checkbox" : "square-outline"}
                      size={20}
                      color={rememberMe ? "#FF7A00" : "gray"}
                    />
                    <Text className="text-gray-655 text-xs ml-1.5 font-bold">Recordarme</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity disabled={loading}>
                    <Text className="text-primary font-bold text-xs">¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Register redirection (Web) */}
              {isWeb && (
                <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mb-6 mt-2">
                  <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
                    <Text className="text-primary font-bold text-sm">Regístrate</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Submit Button */}
              <Animated.View entering={FadeInDown.duration(200).delay(200)} className="mt-2">
                <Button
                  label="Ingresar"
                  onPress={handleLogin}
                  disabled={isSubmitDisabled}
                  loading={loading}
                />
              </Animated.View>

              {/* Register redirection (Mobile) */}
              {!isWeb && (
                <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mt-6">
                  <Text className="text-gray-650 text-sm font-semibold">¿No tienes cuenta? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
                    <Text className="text-primary font-extrabold text-sm">Regístrate</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
