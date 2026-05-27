import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function VerifyScreen() {
  const router = useRouter();
  const verifyOtp = useAppStore((state) => state.verifyOtp);

  const [code, setCode] = useState<string[]>(['2', '4', '7', '1', '9', '6']); // prefilled with mockup numbers for easy demo
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);

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
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text.length > 0 && index < 5) {
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
    const success = verifyOtp(fullCode);
    if (success) {
      setError('');
      router.replace('/(client)/(tabs)');
    } else {
      setError('Código OTP inválido o expirado. Usa "247196".');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 justify-center py-4"
        >
          {/* OTP Icon */}
          <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-8">
            <View className="w-32 h-32 rounded-full bg-orange-100 items-center justify-center">
              {/* Mock Envelope Circle */}
              <View className="w-24 h-24 rounded-full bg-orange-300 items-center justify-center">
                <Ionicons name="mail" size={48} color="white" />
              </View>
            </View>
            <Text className="text-2xl font-bold text-black mt-6">Verifica tu cuenta</Text>
            <Text className="text-gray-500 text-center mt-2 text-sm leading-relaxed px-6">
              Hemos enviado un código OTP a tu correo electrónico
            </Text>
          </Animated.View>

          {error ? (
            <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4">
              {error}
            </Animated.Text>
          ) : null}

          {/* OTP Input Fields */}
          <Animated.View entering={FadeInDown.duration(200).delay(50)} className="flex-row justify-between mb-8 px-2">
            {code.map((val, idx) => (
              <TextInput
                key={idx}
                ref={inputsRef[idx]}
                value={val}
                onChangeText={(text) => handleChangeText(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                maxLength={1}
                keyboardType="number-pad"
                className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold bg-white text-black"
                placeholderTextColor="#9CA3AF"
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          {/* Resend Link */}
          <Animated.View entering={FadeInDown.duration(200).delay(100)} className="items-center mb-8">
            <Text className="text-gray-500 text-sm">
              ¿No recibiste el código?{' '}
              <Text className="text-primary font-bold">
                Reenviar {countdown > 0 ? `(00:${countdown < 10 ? '0' : ''}${countdown})` : ''}
              </Text>
            </Text>
          </Animated.View>

          {/* Verification Button */}
          <Animated.View entering={FadeInDown.duration(200).delay(150)} className="mb-2">
            <TouchableOpacity
              onPress={handleVerify}
              activeOpacity={0.7}
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">Verificar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
