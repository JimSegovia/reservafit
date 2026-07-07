import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Image as ExpoImage } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const resetPassword = useAppStore((state) => state.resetPassword);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputsRef = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = cleanText;
    setCode(newCode);

    if (cleanText.length > 0 && index < 5) {
      inputsRef[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  const handleResetPassword = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      showToast('Por favor ingresa el código completo de 6 dígitos.', 'warning');
      return;
    }

    if (!newPassword) {
      showToast('Por favor ingresa tu nueva contraseña.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await resetPassword(fullCode, newPassword);
      setLoading(false);

      if (success) {
        showToast('¡Contraseña actualizada exitosamente!', 'success');
        router.replace('/(auth)/login');
      } else {
        setError('Código inválido o expirado. Intenta de nuevo.');
        showToast('Error al restablecer la contraseña.', 'error');
      }
    } catch (e) {
      setLoading(false);
      setError('Ocurrió un error al restablecer la contraseña.');
    }
  };

  const isSubmitDisabled = loading || code.join('').length < 6 || !newPassword || newPassword.length < 6;

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

              {/* OTP Icon */}
              <Animated.View entering={ZoomIn.duration(200)} className={`items-center ${isWeb ? 'mb-10' : 'mb-8'}`}>
                <View className={`${isWeb ? 'w-36 h-36' : 'w-28 h-28'} rounded-full bg-orange-100 items-center justify-center`}>
                  <View className={`${isWeb ? 'w-28 h-28' : 'w-20 h-20'} rounded-full bg-orange-300 items-center justify-center`}>
                    <Ionicons name="lock-closed" size={isWeb ? 48 : 36} color="white" />
                  </View>
                </View>
                <Text className={`${isWeb ? 'text-[44px]' : 'text-2xl'} font-bold text-black mt-6 text-center`}>Restablecer contraseña</Text>
                <Text className={`${isWeb ? 'text-[22px] leading-7 px-10' : 'text-sm leading-relaxed px-4'} text-center text-gray-500`}>
                  Ingresa el código de 6 dígitos que enviamos a tu correo
                  {params.email ? ` (${params.email})` : ''} y tu nueva contraseña.
                </Text>
              </Animated.View>

              {error ? (
                <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4 font-semibold">
                  {error}
                </Animated.Text>
              ) : null}

              {/* OTP Input Fields */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)} className={`flex-row justify-center ${isWeb ? 'mb-8 gap-x-5' : 'mb-6 px-2'}`}>
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

              {/* New Password Input */}
              <Animated.View entering={FadeInDown.duration(200).delay(100)} className="mb-8">
                <View className={`flex-row items-center border rounded-xl bg-white px-4 py-4 border-gray-300`}>
                  <Ionicons name="lock-closed-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-black text-base p-0"
                    editable={!loading}
                  />
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Reset Password Button */}
              <Animated.View entering={FadeInDown.duration(200).delay(150)} className="mb-2">
                <Button
                  label="Restablecer contraseña"
                  onPress={handleResetPassword}
                  disabled={isSubmitDisabled}
                  loading={loading}
                />
              </Animated.View>

              {/* Back to Login */}
              <Animated.View entering={FadeInDown.duration(200).delay(200)} className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600 text-sm">¿Recordaste tu contraseña? </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')} disabled={loading}>
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
