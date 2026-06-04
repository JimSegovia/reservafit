import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Loader } from '@/components/ui/loader';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function VerifyScreen() {
  const router = useRouter();
  const verifyOtp = useAppStore((state) => state.verifyOtp);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [code, setCode] = useState<string[]>(['2', '4', '7', '1', '9', '6']); // prefilled with mockup numbers for easy demo
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [loading, setLoading] = useState(false);

  const inputsRef = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = cleanText;
    setCode(newCode);

    // Auto focus next input
    if (cleanText.length > 0 && index < 5) {
      inputsRef[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Backspace handling to go to previous input
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      showToast('Por favor ingresa el código completo de 6 dígitos.', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const success = verifyOtp(fullCode);
      if (success) {
        showToast('¡Cuenta verificada y sesión iniciada!', 'success');
        router.replace('/(client)/(tabs)');
      } else {
        setError('Código OTP inválido o expirado. Usa "247196".');
        showToast('Código de verificación incorrecto.', 'error');
      }
    }, 1200);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(45);
    showToast('Código OTP reenviado con éxito.', 'info');
  };

  const isSubmitDisabled = loading || code.join('').length < 6;

  return (
    <SafeAreaView className="flex-1 bg-cream">
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
            paddingHorizontal: isWeb ? 0 : 24,
            paddingVertical: isWeb ? 36 : 16,
            paddingBottom: 30,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className={`mx-auto ${isWeb ? 'w-full max-w-[1120px] px-6' : 'w-full'}`}>
            <View className={`mx-auto bg-white ${isWeb ? 'w-full rounded-2xl border border-gray-200 shadow-[0_8px_18px_rgba(0,0,0,0.14)] px-8 py-12' : 'px-6 py-8 rounded-2xl border border-gray-100 shadow-sm'}`}>
              
              {/* Back Button for Mobile */}
              {!isWeb && (
                <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="flex-row items-center py-1 mb-4">
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-sm font-semibold ml-1">Volver</Text>
                </TouchableOpacity>
              )}

              {/* OTP Icon */}
              <Animated.View entering={ZoomIn.duration(200)} className={`items-center ${isWeb ? 'mb-10' : 'mb-8'}`}>
                <View className={`${isWeb ? 'w-36 h-36' : 'w-32 h-32'} rounded-full bg-orange-100 items-center justify-center`}>
                  <View className={`${isWeb ? 'w-28 h-28' : 'w-24 h-24'} rounded-full bg-orange-300 items-center justify-center`}>
                    <Ionicons name="mail" size={isWeb ? 56 : 48} color="white" />
                  </View>
                </View>
                <Text className={`${isWeb ? 'text-[44px]' : 'text-2xl'} font-bold text-black mt-6 text-center`}>Verifica tu cuenta</Text>
                <Text className={`${isWeb ? 'text-[22px] leading-7 px-10' : 'text-sm leading-relaxed px-6'} text-center text-gray-500`}>
                  Hemos enviado un código de verificación (OTP) a tu correo
                  {'\n'}electrónico
                </Text>
              </Animated.View>

              {error ? (
                <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4 font-semibold">
                  {error}
                </Animated.Text>
              ) : null}

              {/* OTP Input Fields */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)} className={`flex-row justify-center ${isWeb ? 'mb-12 gap-x-5' : 'mb-8 px-2'}`}>
                {code.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={inputsRef[idx]}
                    value={val}
                    onChangeText={(text) => handleChangeText(text, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    maxLength={1}
                    keyboardType="number-pad"
                    className={`${isWeb ? 'w-20 h-32 text-[52px] bg-[#fbf8f1]' : 'w-12 h-14 text-xl bg-white'} border border-gray-300 rounded-md text-center font-bold text-black mx-1`}
                    placeholderTextColor="#9CA3AF"
                    selectTextOnFocus
                    editable={!loading}
                  />
                ))}
              </Animated.View>

              {/* Resend Link */}
              <Animated.View entering={FadeInDown.duration(200).delay(100)} className="items-center mb-8">
                <TouchableOpacity onPress={handleResend} disabled={countdown > 0 || loading}>
                  <Text className={`${isWeb ? 'text-[20px]' : 'text-sm'} text-gray-500 font-semibold text-center`}>
                    ¿No recibiste el código?{' '}
                    <Text className={`font-bold ${countdown > 0 ? 'text-gray-400' : 'text-primary'}`}>
                      Reenviar {countdown > 0 ? `(00:${countdown < 10 ? '0' : ''}${countdown})` : ''}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Verification Button */}
              <Animated.View entering={FadeInDown.duration(200).delay(150)} className="mb-2">
                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={isSubmitDisabled}
                  activeOpacity={0.7}
                  className={`w-full bg-primary items-center justify-center shadow-lg shadow-orange-500/20 ${isWeb ? 'py-5 rounded-md' : 'py-4 rounded-2xl'} ${isSubmitDisabled ? 'opacity-50' : ''}`}
                  style={{ minHeight: isWeb ? 76 : 56 }}
                >
                  {loading ? (
                    <Loader variant="button" label="Verificando..." />
                  ) : (
                    <Text className={`${isWeb ? 'text-[22px]' : 'text-base'} text-white font-bold`}>Verificar</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
