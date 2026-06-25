import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const forgotPassword = useAppStore((state) => state.forgotPassword);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('El correo electrónico es obligatorio.');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Por favor ingresa un correo válido.');
    } else {
      setEmailError('');
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      validateEmail(email);
      showToast('Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }

    if (emailError) {
      showToast('Por favor corrige el error antes de continuar.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const success = await forgotPassword(email);
      setLoading(false);

      if (success) {
        showToast('Si el correo existe, recibirás un código de verificación.', 'success');
        router.push({ pathname: '/(auth)/reset-password', params: { email } });
      } else {
        showToast('Error al enviar el código. Intenta de nuevo.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {isWeb && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-10 border-b border-gray-300/50 bg-cream z-10">
          <TouchableOpacity onPress={() => router.push('/(auth)/landing')} className="flex-row items-center">
            <ExpoImage
              source={require('../../../assets/images/logo.svg')}
              style={{ width: 32, height: 32 }}
              className="mr-1.5"
            />
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
            paddingHorizontal: isWeb ? 0 : 24,
            paddingVertical: isWeb ? 36 : 16,
            paddingBottom: 30,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className={`mx-auto ${isWeb ? 'w-full max-w-[1120px] px-6' : 'w-full'}`}>
            <View className={`mx-auto bg-white ${isWeb ? 'w-full rounded-2xl border border-gray-200 shadow-[0_8px_18px_rgba(0,0,0,0.14)] px-8 py-12' : 'px-6 py-8 rounded-2xl border border-gray-100 shadow-sm'}`}>
              
              {/* Back Button */}
              {!isWeb && (
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-1 mb-4">
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-sm font-semibold ml-1">Volver</Text>
                </TouchableOpacity>
              )}

              {/* Icon */}
              <Animated.View entering={ZoomIn.duration(200)} className={`items-center ${isWeb ? 'mb-10' : 'mb-8'}`}>
                <View className={`${isWeb ? 'w-36 h-36' : 'w-28 h-28'} rounded-full bg-orange-100 items-center justify-center`}>
                  <View className={`${isWeb ? 'w-28 h-28' : 'w-20 h-20'} rounded-full bg-orange-300 items-center justify-center`}>
                    <Ionicons name="key" size={isWeb ? 48 : 36} color="white" />
                  </View>
                </View>
                <Text className={`${isWeb ? 'text-[44px]' : 'text-2xl'} font-bold text-black mt-6 text-center`}>¿Olvidaste tu contraseña?</Text>
                <Text className={`${isWeb ? 'text-[22px] leading-7 px-10' : 'text-sm leading-relaxed px-4'} text-center text-gray-500`}>
                  No te preocupes, ingresa tu correo electrónico y te enviaremos un código para restablecerla.
                </Text>
              </Animated.View>

              {/* Email Input */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)} className="mb-8">
                <View className={`flex-row items-center border rounded-xl bg-white px-4 py-4 border-gray-300 ${emailError ? 'border-red-500' : 'border-gray-200'}`}>
                  <Ionicons name="mail-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Correo electrónico"
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
              </Animated.View>

              {/* Send Code Button */}
              <Animated.View entering={FadeInDown.duration(200).delay(100)} className="mb-2">
                <Button
                  label="Enviar código"
                  onPress={handleSendCode}
                  disabled={loading || !email || !!emailError}
                  loading={loading}
                />
              </Animated.View>

              {/* Back to Login */}
              <Animated.View entering={FadeInDown.duration(200).delay(150)} className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600 text-sm">¿Recordaste tu contraseña? </Text>
                <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                  <Text className="text-primary font-bold text-sm">Iniciar sesión</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
