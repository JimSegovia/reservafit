import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Image as ExpoImage } from 'expo-image';

import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const registerUser = useAppStore((state) => state.registerUser);
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateName = (text: string) => {
    setName(text);
    if (!text.trim()) {
      setNameError('El nombre es obligatorio.');
    } else {
      setNameError('');
    }
  };

  const validateLastName = (text: string) => {
    setLastName(text);
    if (!text.trim()) {
      setLastNameError('El apellido es obligatorio.');
    } else {
      setLastNameError('');
    }
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text.trim()) {
      setEmailError('El correo electrónico es obligatorio.');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Por favor ingresa un correo válido (ej: usuario@correo.com).');
    } else {
      setEmailError('');
    }
  };

  const validatePhone = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setPhone(cleanText);
    if (!cleanText.trim()) {
      setPhoneError('El número de celular es obligatorio.');
    } else if (cleanText.length !== 9 || !cleanText.startsWith('9')) {
      setPhoneError('El celular debe tener 9 dígitos y empezar con el número 9.');
    } else {
      setPhoneError('');
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
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Por favor confirma tu contraseña.');
    } else if (text !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = () => {
    if (!name || !lastName || !email || !phone || !password || !confirmPassword) {
      validateName(name);
      validateLastName(lastName);
      validateEmail(email);
      validatePhone(phone);
      validatePassword(password);
      validateConfirmPassword(confirmPassword);
      showToast('Por favor completa todos los campos requeridos.', 'warning');
      return;
    }

    if (nameError || lastNameError || emailError || phoneError || passwordError || confirmPasswordError) {
      showToast('Por favor corrige los errores antes de continuar.', 'warning');
      return;
    }
    
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (email.toLowerCase() === 'registered@reservafit.com') {
        setEmailError('Este correo electrónico ya se encuentra registrado.');
        showToast('El correo ya está registrado.', 'error');
        return;
      }

      registerUser({
        name: `${name} ${lastName}`,
        email,
        phone,
        role: 'client'
      });

      showToast('¡Código de verificación enviado a tu correo!', 'success');
      router.replace('/(auth)/verify');
    }, 1500);
  };

  const isSubmitDisabled = loading || !name || !lastName || !email || !phone || !password || !confirmPassword ||
    !!nameError || !!lastNameError || !!emailError || !!phoneError || !!passwordError || !!confirmPasswordError;

  return (
    <SafeAreaView className="flex-1 bg-cream p-0 m-0">
      {/* Web Header */}
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
            
            {/* Mobile Header with Back Button */}
            {!isWeb && (
              <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mt-2 mb-6">
                <TouchableOpacity onPress={() => router.push('/(auth)/landing')} className="flex-row items-center py-1">
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-sm font-semibold ml-1">Volver</Text>
                </TouchableOpacity>
                <View className="flex-row items-center">
                  <ExpoImage
                    source={require('../../../assets/images/logo.svg')}
                    style={{ width: 120, height: 35 }}
                    contentFit="contain"
                  />
                </View>
              </Animated.View>
            )}

            {/* Large Profile Icon */}
            <Animated.View entering={ZoomIn.duration(200)} className="items-center mb-6">
              <View className={`rounded-full bg-primary items-center justify-center ${isWeb ? 'w-24 h-24' : 'w-20 h-20'}`}>
                <Ionicons name="person-add" size={isWeb ? 50 : 42} color="white" />
              </View>
              <Text className={`font-bold text-black mt-4 ${isWeb ? 'text-3xl' : 'text-2xl'}`}>Crear cuenta</Text>
            </Animated.View>

            {/* Form */}
            <View className="gap-y-4 mb-6">
              {/* Nombre */}
              <Animated.View entering={FadeInDown.duration(200).delay(50)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="person-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Nombre</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${nameError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Tu nombre"
                    value={name}
                    onChangeText={validateName}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                </View>
                {nameError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{nameError}</Text>
                ) : null}
              </Animated.View>

              {/* Apellido */}
              <Animated.View entering={FadeInDown.duration(200).delay(80)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="person-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Apellido</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${lastNameError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Tu apellido"
                    value={lastName}
                    onChangeText={validateLastName}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                </View>
                {lastNameError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{lastNameError}</Text>
                ) : null}
              </Animated.View>

              {/* Correo electrónico */}
              <Animated.View entering={FadeInDown.duration(200).delay(110)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="mail-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Correo electrónico</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${emailError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChangeText={validateEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                </View>
                {emailError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{emailError}</Text>
                ) : null}
              </Animated.View>

              {/* Número de celular */}
              <Animated.View entering={FadeInDown.duration(200).delay(140)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="call-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Número de celular</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${phoneError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="9XX XXX XXX"
                    value={phone}
                    onChangeText={validatePhone}
                    keyboardType="phone-pad"
                    maxLength={9}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                </View>
                {phoneError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{phoneError}</Text>
                ) : null}
              </Animated.View>

              {/* Contraseña */}
              <Animated.View entering={FadeInDown.duration(200).delay(170)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="lock-closed-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Contraseña</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${passwordError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Crea tu contraseña (mín. 6 caracteres)"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{passwordError}</Text>
                ) : null}
              </Animated.View>

              {/* Confirmar Contraseña */}
              <Animated.View entering={FadeInDown.duration(200).delay(185)}>
                <View className="flex-row items-center mb-1.5 ml-1">
                  <Ionicons name="lock-closed-outline" size={16} color="#FF7A00" className="mr-1" />
                  <Text className="text-gray-600 font-bold text-sm">Confirmar contraseña</Text>
                </View>
                <View className={`flex-row items-center border rounded-xl bg-white px-3 py-3 ${confirmPasswordError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'}`}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChangeText={validateConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-black text-sm p-0"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1 font-semibold">{confirmPasswordError}</Text>
                ) : null}
              </Animated.View>
            </View>

            {/* Submit Button */}
            <Animated.View entering={FadeInDown.duration(200).delay(200)} className={isWeb ? 'mt-2 mb-2' : 'mb-6'}>
              <Button
                label="Registrarse"
                onPress={handleRegister}
                disabled={isSubmitDisabled}
                loading={loading}
              />
            </Animated.View>

            {/* Login redirection */}
            <Animated.View entering={FadeInDown.duration(200).delay(230)} className="flex-row justify-center items-center mb-6">
              <Text className="text-gray-600 text-sm">¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
                <Text className="text-primary font-bold text-sm">Iniciar sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
