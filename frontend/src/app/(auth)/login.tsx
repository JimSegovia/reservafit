import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, useWindowDimensions, StyleSheet } from 'react-native';
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

  const handleLogin = async () => {
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

    try {
      const success = await login(email, password);
      
      if (success) {
        showToast('¡Inicio de sesión exitoso!', 'success');
        
        // Use user state from store after login or decode token, but here we assume logic
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'client';
        if (role === 'admin') {
          router.replace('/(admin)');
        } else {
          router.replace('/(client)/(tabs)');
        }
      } else {
        setPasswordError('Credenciales incorrectas.');
        setError('Error al iniciar sesión. Verifica tus datos.');
        showToast('Error al iniciar sesión.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || !email || !password || !!emailError || !!passwordError;

  return (
    <View style={isWeb ? undefined : { position: 'relative', zIndex: 2 }} className={`flex-1 ${isWeb ? 'bg-cream' : ''}`}>
      <ImageBackground
        source={isWeb ? undefined : require('../../../assets/images/iniciar sesion mobile.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {isWeb && (
          <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-10 border-b border-gray-300/50 bg-cream z-10">
            <TouchableOpacity onPress={() => router.push('/(auth)/landing')} className="flex-row items-center">
              <ExpoImage
                source={require('../../../assets/images/logo.svg')}
                style={{ width: 160, height: 50 }}
                contentFit="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        <SafeAreaView style={{ flex: 1, position: 'relative', zIndex: 2, elevation: 2 }} className="flex-1" edges={['top', 'bottom']}>
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
              {!isWeb && (
                <TouchableOpacity 
                  onPress={() => router.back()} 
                  className="w-10 h-10 rounded-full bg-white/90 items-center justify-center absolute top-4 left-4 z-10 shadow-sm"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              )}

              <View className={`md:w-[500px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10 ${isWeb ? 'mt-0' : ''}`}>
                
                <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-8">
                  <ExpoImage
                    source={require('../../../assets/images/logo.svg')}
                    style={{ width: 240, height: 80 }}
                    contentFit="contain"
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-8">
                  <Text className="text-2xl font-bold text-gray-800 text-center">Iniciar Sesión</Text>
                  <Text className="text-gray-600 text-center mt-2 text-base">
                    Continúa reservando tu clase favorita.
                  </Text>
                </Animated.View>

                {error ? (
                  <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4 font-semibold">
                    {error}
                  </Animated.Text>
                ) : null}

                <Animated.View entering={FadeInDown.duration(200).delay(100)} className="gap-y-5 mb-6">
                  <View>
                    <View className={`flex-row items-center border rounded-xl bg-white px-4 py-4 border-gray-300 ${emailError ? 'border-red-500' : 'border-gray-200'}`}>
                      <TextInput
                        placeholder="Usuario o correo electrónico"
                        value={email}
                        onChangeText={validateEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-black text-base p-0"
                        editable={!loading}
                      />
                    </View>
                    {emailError ? (
                      <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{emailError}</Text>
                    ) : null}
                  </View>

                  <View>
                    <View className={`flex-row items-center border rounded-xl bg-white px-4 py-4 border-gray-300 ${passwordError ? 'border-red-500' : 'border-gray-200'}`}>
                      <TextInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={validatePassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-black text-base p-0"
                        editable={!loading}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                    {passwordError ? (
                      <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{passwordError}</Text>
                    ) : null}
                  </View>
                </Animated.View>

                {!isWeb && (
                  <Animated.View entering={FadeInDown.duration(200).delay(150)} className="flex-row justify-between items-center mb-8">
                    <TouchableOpacity
                      onPress={() => setRememberMe(!rememberMe)}
                      className="flex-row items-center"
                      disabled={loading}
                    >
                      <Ionicons
                        name={rememberMe ? "checkbox" : "square-outline"}
                        size={22}
                        color={rememberMe ? "#FF7A00" : "#4B5563"}
                      />
                      <Text className="text-gray-700 text-sm ml-2 font-medium">Recordarme</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity disabled={loading}>
                      <Text className="text-primary font-bold text-sm">¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {isWeb && (
                  <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mb-6 mt-2">
                    <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
                      <Text className="text-primary font-bold text-sm">Regístrate</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(200).delay(200)}>
                  <Button
                    label="Ingresar"
                    onPress={handleLogin}
                    disabled={isSubmitDisabled}
                    loading={loading}
                    className="py-4"
                  />
                </Animated.View>

                {!isWeb && (
                  <>
                    <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row justify-center items-center mt-8">
                      <Text className="text-gray-700 text-base font-medium">¿No tienes cuenta? </Text>
                      <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
                        <Text className="text-primary font-bold text-base">Regístrate</Text>
                      </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.duration(200).delay(300)} className="flex-row justify-center items-center mt-4">
                      <Ionicons name="time-outline" size={16} color="#4B5563" />
                      <Text className="text-gray-600 text-sm ml-2">Reserva mínima: 10 minutos</Text>
                    </Animated.View>
                  </>
                )}

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
