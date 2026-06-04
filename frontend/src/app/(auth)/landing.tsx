import React from 'react';
import { View, Text, Image, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Image as ExpoImage } from 'expo-image';

export default function LandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  return (
    <SafeAreaView className="flex-1 bg-cream p-0 m-0">
      {/* Web Navigation */}
      {isWeb ? (
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-6 px-12 border-b border-gray-155 bg-white shadow-sm z-10">
          <View className="flex-row items-center">
            <ExpoImage
              source={require('../../../assets/images/logo.svg')}
              style={{ width: 32, height: 32 }}
              className="mr-1.5"
            />
            <Text className="text-[28px] font-extrabold ml-1 text-black">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-x-6">
            <TouchableOpacity onPress={() => router.push('/help' as any)}>
              <Text className="text-gray-650 font-bold text-sm">Ayuda / FAQ</Text>
            </TouchableOpacity>
            <Button
              label="Registrarse"
              onPress={() => router.push('/(auth)/register')}
              variant="outline"
              className="py-2.5 px-6 min-h-0 h-11"
            />
            <Button
              label="Iniciar sesión"
              onPress={() => router.push('/(auth)/login')}
              variant="primary"
              className="py-2.5 px-6 min-h-0 h-11"
            />
          </View>
        </Animated.View>
      ) : null}

      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingHorizontal: isWeb ? 48 : 24, 
          paddingVertical: isWeb ? 48 : 32,
          justifyContent: 'center'
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Logo (Centered) */}
        {!isWeb && (
          <Animated.View entering={FadeIn.duration(200)} className="items-center mb-10">
            <View className="flex-row items-center">
              <ExpoImage
                source={require('../../../assets/images/logo.svg')}
                style={{ width: 36, height: 36 }}
                className="mr-1.5"
              />
              <Text className="text-3xl font-extrabold ml-1.5 text-black">
                Reserva<Text className="text-primary">Fit</Text>
              </Text>
            </View>
          </Animated.View>
        )}

        <View className={`${isWeb ? 'flex-row items-center justify-between gap-x-12' : 'flex-col'}`}>
          {/* Left/Main text content */}
          <View className={`${isWeb ? 'flex-1 pr-6' : 'mb-8'}`}>
            <Animated.View entering={FadeInDown.duration(250).delay(50)}>
              <Text className={`font-extrabold text-black leading-tight ${isWeb ? 'text-5xl lg:text-6xl text-left' : 'text-[36px] text-center'}`}>
                Entrena a tu ritmo,{"\n"}
                asegura tu <Text className="text-primary">espacio</Text>
              </Text>
              <Text className={`text-gray-500 mt-6 text-base lg:text-lg leading-relaxed ${isWeb ? 'text-left' : 'text-center'} max-w-xl mx-auto`}>
                La forma más simple y rápida de reservar tu cupo en sala. Elige tu clase favorita, selecciona tu ubicación y prepárate para entrenar.
              </Text>
            </Animated.View>

            {/* Mobile Action Buttons */}
            {!isWeb && (
              <Animated.View entering={FadeInDown.duration(250).delay(150)} className="mt-8 gap-y-4 w-full">
                <Button
                  label="Iniciar sesión"
                  onPress={() => router.push('/(auth)/login')}
                  variant="primary"
                />
                <Button
                  label="Crear una cuenta"
                  onPress={() => router.push('/(auth)/register')}
                  variant="outline"
                />
                <TouchableOpacity onPress={() => router.push('/help' as any)} className="items-center py-2 mt-2">
                  <Text className="text-primary font-bold text-sm">Centro de Ayuda / FAQ</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Right/Hero Image Column */}
          <Animated.View entering={ZoomIn.duration(250).delay(100)} className={`items-center justify-center ${isWeb ? 'flex-1' : 'mt-4'}`}>
            <View className={`w-full overflow-hidden bg-gray-200 shadow-xl ${isWeb ? 'aspect-[4/3] rounded-[40px] max-w-[600px]' : 'h-64 rounded-[30px]'}`}>
              <Image
                source={require('../../../assets/images/zumba.jpg')}
                className="w-full h-full object-cover"
              />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
