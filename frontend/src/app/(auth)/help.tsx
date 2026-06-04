import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '¿Cómo puedo reservar una clase?',
      answer: 'Es muy sencillo: ve a la sección de "Clases", filtra por el día o la disciplina que prefieras y presiona "Ver horarios y reservar". Luego, selecciona tus asientos libres en el mapa interactivo y completa el pago correspondiente.',
    },
    {
      question: '¿Por cuánto tiempo se bloquean mis asientos?',
      answer: 'Al seleccionar tus asientos, estos quedarán reservados exclusivamente para ti durante 10 minutos. Durante este tiempo, debes completar el proceso de pago. Si el tiempo expira, los asientos volverán a estar disponibles para otros usuarios.',
    },
    {
      question: '¿Cómo cancelo una reserva y obtengo un reembolso?',
      answer: 'Puedes cancelar una reserva activa ingresando a tu panel de inicio ("Mis clases"). Busca la clase que deseas cancelar, presiona el botón "Cancelar" y confirma la acción en el diálogo. Tu reserva será cancelada y se gestionará el reembolso de forma inmediata.',
    },
    {
      question: '¿Qué métodos de pago están permitidos?',
      answer: 'En la plataforma web, aceptamos pagos a través de Yape. En la aplicación móvil nativa, aceptamos tarjetas de crédito, débito y billeteras móviles compatibles a través de la pasarela de pagos segura de Stripe.',
    },
    {
      question: '¿Hay un límite de reservas por usuario?',
      answer: 'No existe un límite estricto de reservas, pero debes asegurarte de contar con créditos suficientes o completar el proceso de pago para cada clase a la que decidas asistir. Los cupos están sujetos a la capacidad física de la sala (30 espacios).',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream p-0 m-0">
      {/* Web Header */}
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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
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
          <View className={`md:w-[600px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10`}>
            
            {/* Mobile Header with Back Button */}
            {!isWeb && (
              <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mt-2 mb-6">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-1">
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-sm font-semibold ml-1">Volver</Text>
                </TouchableOpacity>
                <View className="flex-row items-center">
                  <ExpoImage
                    source={require('../../../assets/images/logo.svg')}
                    style={{ width: 24, height: 24 }}
                    className="mr-1"
                  />
                  <Text className="text-lg font-bold ml-1 text-black">
                    Reserva<Text className="text-primary">Fit</Text>
                  </Text>
                </View>
              </Animated.View>
            )}

            {/* Title / Header */}
            <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-6">
              <View className="w-14 h-14 rounded-full bg-orange-100 items-center justify-center mb-3">
                <Ionicons name="help-buoy-outline" size={28} color="#FF7A00" />
              </View>
              <Text className="text-2xl font-extrabold text-black text-center">Centro de Ayuda</Text>
              <Text className="text-gray-500 text-xs font-bold text-center mt-1">Preguntas Frecuentes (FAQ)</Text>
            </Animated.View>

            {/* Accordion FAQ List */}
            <View className="gap-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <Animated.View 
                    key={index} 
                    entering={FadeInDown.duration(200).delay(80 + index * 40)}
                    layout={Layout.springify()}
                    className={`border rounded-2xl bg-white overflow-hidden ${isOpen ? 'border-primary' : 'border-gray-300'}`}
                  >
                    <TouchableOpacity 
                      onPress={() => toggleFAQ(index)} 
                      activeOpacity={0.7}
                      className="flex-row justify-between items-center p-4"
                    >
                      <Text className={`text-sm font-bold flex-1 pr-4 ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
                        {faq.question}
                      </Text>
                      <Ionicons 
                        name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} 
                        size={18} 
                        color={isOpen ? '#FF7A00' : 'gray'} 
                      />
                    </TouchableOpacity>

                    {isOpen && (
                      <Animated.View entering={FadeIn.duration(200)} className="px-4 pb-4 pt-1 border-t border-gray-100">
                        <Text className="text-xs text-gray-500 font-semibold leading-relaxed">
                          {faq.answer}
                        </Text>
                      </Animated.View>
                    )}
                  </Animated.View>
                );
              })}
            </View>

            {/* Support Box */}
            <Animated.View 
              entering={FadeInDown.duration(200).delay(350)} 
              className="bg-orange-50 border border-orange-150 rounded-2xl p-4 mt-8 items-center"
            >
              <Ionicons name="mail-open-outline" size={24} color="#FF7A00" />
              <Text className="text-xs font-bold text-gray-800 mt-2 text-center">¿No encontraste lo que buscabas?</Text>
              <Text className="text-[10px] text-gray-500 mt-1 text-center font-semibold">Escríbenos directamente a soporte@reservafit.com y responderemos a la brevedad.</Text>
            </Animated.View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
