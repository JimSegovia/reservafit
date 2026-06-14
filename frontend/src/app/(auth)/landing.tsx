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
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-12 border-b border-gray-155 bg-white shadow-sm z-10 w-full overflow-hidden">
          <View className="flex-row items-center">
            <ExpoImage
              source={require('../../../assets/images/logo.svg')}
              style={{ width: 160, height: 50 }}
              contentFit="contain"
            />
          </View>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => router.push('/help' as any)}>
              <Text className="text-gray-650 font-bold text-sm">Ayuda / FAQ</Text>
            </TouchableOpacity>
            <Button
              label="Iniciar sesión"
              onPress={() => router.push('/(auth)/login')}
              variant="outline"
              className="py-2.5 px-8 min-h-0 h-11 !w-auto"
            />
            <Button
              label="Registrarse"
              onPress={() => router.push('/(auth)/register')}
              variant="primary"
              className="py-2.5 px-8 min-h-0 h-11 !w-auto"
            />
          </View>
        </Animated.View>
      ) : null}

      <ScrollView 
          contentContainerStyle={{ 
           flexGrow: 1, 
           paddingHorizontal: isWeb ? 48 : 24, 
           paddingTop: isWeb ? 44 : 28,
           paddingBottom: isWeb ? 44 : 40,
           justifyContent: isWeb ? 'center' : 'flex-start'
         }}
         showsVerticalScrollIndicator={false}
       >
         {/* Mobile Logo (Centered) */}
         {!isWeb && (
           <Animated.View entering={FadeIn.duration(200)} className="items-center mb-8">
             <View className="flex-row items-center">
               <ExpoImage
                 source={require('../../../assets/images/logo.svg')}
                 style={{ width: 220, height: 72 }}
                 contentFit="contain"
               />
             </View>
           </Animated.View>
         )}

         <View className={`${isWeb ? 'flex-row items-center justify-between gap-x-10' : 'flex-col'}`}>
           {/* Left/Main text content */}
           <View className={`${isWeb ? 'flex-1 pr-6' : 'mb-8'}`}>
             <Animated.View entering={FadeInDown.duration(250).delay(50)}>
               <Text className={`font-extrabold text-black leading-tight ${isWeb ? 'text-6xl lg:text-[64px] text-left max-w-xl' : 'text-[38px] text-center max-w-sm mx-auto'}`}>
                 Entrena a tu ritmo, asegura tu <Text className="text-primary">espacio</Text>
               </Text>
               <Text className={`text-gray-500 mt-5 text-base lg:text-lg leading-relaxed max-w-xl ${isWeb ? 'text-left' : 'text-center mx-auto'}`}>
                 La forma más simple y rápida de reservar tu cupo en sala. Elige tu clase favorita, selecciona tu ubicación y prepárate para entrenar.
               </Text>
             </Animated.View>

            {/* Mobile Action Buttons */}
            {!isWeb && (
               <Animated.View entering={FadeInDown.duration(250).delay(150)} className="mt-8 gap-y-3 w-full pb-2">
                 <Button
                   label="Iniciar sesión"
                   onPress={() => router.push('/(auth)/login')}
                   variant="outline"
                   className="min-h-0 h-12"
                 />
                 <Button
                   label="Registrarse"
                   onPress={() => router.push('/(auth)/register')}
                   variant="primary"
                   className="min-h-0 h-12"
                 />
                 <TouchableOpacity onPress={() => router.push('/help' as any)} className="items-center py-2 mt-1">
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
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
