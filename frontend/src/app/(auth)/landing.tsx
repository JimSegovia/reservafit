import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-4">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="body-outline" size={28} color="#FF7A00" />
            <Text className="text-2xl font-bold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={28} color="black" />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Headline */}
        <Animated.View entering={FadeInDown.duration(250).delay(50)} className="mb-4">
          <Text className="text-[34px] font-extrabold text-black leading-tight text-center">
            Reserva tu lugar,{"\n"}
            vive la <Text className="text-primary">experiencia</Text>
          </Text>
          <Text className="text-gray-600 text-center mt-3 text-base leading-relaxed px-4">
            Reserva tus clases favoritas en nuestra única sala. Entrena, aprende y disfruta al máximo.
          </Text>
        </Animated.View>

        {/* Hero Image Block */}
        <Animated.View entering={ZoomIn.duration(250).delay(100)} className="items-center my-4">
          <View className="w-full h-64 rounded-[40px] overflow-hidden bg-gray-200">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' }}
              className="w-full h-full object-cover"
            />
          </View>
        </Animated.View>

        {/* Info Cards Row */}
        <Animated.View entering={FadeInDown.duration(250).delay(150)} className="flex-row justify-between bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
          <View className="flex-1 flex-row items-center border-r border-gray-155 pr-2">
            <Ionicons name="people-outline" size={24} color="black" />
            <View className="ml-2">
              <Text className="text-sm font-bold text-black">Una sala</Text>
              <Text className="text-xs text-gray-500">Cupo 30</Text>
            </View>
          </View>
          <View className="flex-1 flex-row items-center pl-4">
            <Ionicons name="calendar-outline" size={24} color="black" />
            <View className="ml-2">
              <Text className="text-sm font-bold text-black">Clases</Text>
              <Text className="text-xs text-gray-500">Lun a Sab</Text>
              <Text className="text-[10px] text-gray-400">6 AM - 10 PM</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.duration(250).delay(200)}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 mb-6"
          >
            <Text className="text-white text-lg font-bold">Iniciar Sesión</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Link and Info */}
        <Animated.View entering={FadeInDown.duration(250).delay(250)} className="items-center mb-4">
          <TouchableOpacity className="mb-4">
            <Text className="text-black font-bold text-sm">¿Cómo funciona?</Text>
          </TouchableOpacity>

          <View className="flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-50">
            <Ionicons name="time-outline" size={16} color="black" />
            <Text className="text-xs text-black font-medium ml-1">
              Reserva mínima: 10 minutos
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
