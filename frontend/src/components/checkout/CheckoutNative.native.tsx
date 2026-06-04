import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Loader } from '@/components/ui/loader';

export default function CheckoutNative() {
  const { StripeProvider, useStripe } = require('@stripe/stripe-react-native');
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

  return (
    <StripeProvider publishableKey={publishableKey}>
      <CheckoutContent useStripe={useStripe} />
    </StripeProvider>
  );
}

function CheckoutContent({ useStripe }: { useStripe: typeof import('@stripe/stripe-react-native').useStripe }) {
  const router = useRouter();
  const currentBooking = useAppStore((state) => state.currentBooking);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const decrementTimer = useAppStore((state) => state.decrementTimer);
  const user = useAppStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);
  
  const { initPaymentSheet, presentPaymentSheet } = useStripe();


  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!currentBooking) router.replace('/(client)/(tabs)/classes');
  }, [currentBooking, router]);

  useEffect(() => {
    const interval = setInterval(() => decrementTimer(), 1000);
    return () => clearInterval(interval);
  }, [decrementTimer]);

  if (!currentBooking) return null;

  

  const handlePayPress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPay = async () => {
    setShowConfirmModal(false);
    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:300/api';

    try {
      setIsProcessing(true);
      setError('');
      showToast('Iniciando pago con Stripe...', 'info');

      const response = await fetch(`${apiBaseUrl}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentBooking.totalPrice,
          currency: 'pen',
          metadata: {
            classId: currentBooking.classId,
            className: currentBooking.className,
            day: currentBooking.day,
            time: currentBooking.time,
            seats: currentBooking.selectedSeats.join(','),
            clientPhone: '',
            clientName: user?.name ?? 'Cliente',
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.clientSecret) throw new Error(data.error || 'No se pudo iniciar el pago con Stripe.');

      const initResult = await initPaymentSheet({
        merchantDisplayName: 'ReservaFit',
        paymentIntentClientSecret: data.clientSecret,
        defaultBillingDetails: { name: user?.name, email: user?.email },
      });

      if (initResult.error) throw new Error(initResult.error.message);
      const presentResult = await presentPaymentSheet();
      if (presentResult.error) throw new Error(presentResult.error.message);

      const reservation = confirmBooking(phone);
      if (!reservation) throw new Error('El pago fue exitoso, pero no se pudo registrar la reserva.');

      showToast('¡Pago procesado y reserva confirmada!', 'success');
      router.push('/(client)/success');
    } catch (paymentError) {
      const message = paymentError instanceof Error ? paymentError.message : 'Ocurrió un error al procesar el pago.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const isSubmitDisabled = isProcessing;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-1">
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="text-sm font-semibold ml-1">Volver</Text>
            </TouchableOpacity>
            <Text className="text-lg font-extrabold text-black">Pagar</Text>
            <View className="w-6" />
          </Animated.View>

          {/* Step Indicator (H3) */}
          <View className="flex-row items-center justify-center mb-6 gap-x-2 px-2">
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-orange-200 items-center justify-center"><Text className="text-[10px] font-bold text-orange-800">1</Text></View>
              <Text className="text-[10px] text-gray-500 font-bold ml-1">Clase</Text>
            </View>
            <View className="w-4 h-[2px] bg-orange-200" />
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-orange-200 items-center justify-center"><Text className="text-[10px] font-bold text-orange-800">2</Text></View>
              <Text className="text-[10px] text-gray-500 font-bold ml-1">Asientos</Text>
            </View>
            <View className="w-4 h-[2px] bg-primary" />
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center"><Text className="text-[10px] font-bold text-white">3</Text></View>
              <Text className="text-[10px] text-primary font-bold ml-1">Pago</Text>
            </View>
          </View>

          <Animated.View entering={ZoomIn.duration(200).delay(50)} className="items-center mb-6">
<Image source={require('@/assets/images/mercadopagologo.png')} style={{ width: 64, height: 64, borderRadius: 32 }} />
<Text className="text-gray-500 text-xs font-semibold text-center mt-2.5 px-6">Paga de forma segura con Mercado Pago.</Text>
          </Animated.View>

          {error ? <Animated.Text entering={FadeIn.duration(150)} className="text-red-500 text-sm text-center mb-4 font-semibold">{error}</Animated.Text> : null}
          
          <Animated.View entering={FadeInDown.duration(200).delay(100)} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm mb-6">
            <Text className="text-base font-extrabold text-black mb-4">Resumen del pedido</Text>
            <View className="gap-y-2.5 mb-4 border-b border-gray-100 pb-4">
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Clase</Text><Text className="text-black font-extrabold text-sm">{currentBooking.className}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Horario</Text><Text className="text-black font-extrabold text-sm">{currentBooking.time}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Asientos</Text><Text className="text-black font-extrabold text-sm">{currentBooking.selectedSeats.join(', ')}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Fecha</Text><Text className="text-black font-extrabold text-sm">{currentBooking.day}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-500 font-bold text-sm">Instructor</Text><Text className="text-black font-extrabold text-sm">{currentBooking.instructorName}</Text></View>
            </View>
            <View className="flex-row justify-between items-center"><View><Text className="text-xs font-bold text-gray-400">Monto a pagar</Text><Text className="text-2xl font-extrabold text-primary mt-0.5">S/ {currentBooking.totalPrice.toFixed(2)}</Text></View></View>
          </Animated.View>

          

          <Animated.View entering={FadeInDown.duration(200).delay(200)}>
            <TouchableOpacity 
              onPress={handlePayPress} 
              disabled={isSubmitDisabled} 
              activeOpacity={0.7} 
              className={`w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-500/20 mb-4 ${isSubmitDisabled ? 'opacity-50' : 'bg-primary'}`}
              style={{ minHeight: 56 }}
            >
              {isProcessing ? (
                <Loader variant="button" label="Procesando pago..." />
              ) : (
                <Text className="text-white text-base font-bold">Pagar</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(200).delay(250)} className="flex-row items-center justify-center py-2 mb-4">
            <Ionicons name="time-outline" size={16} color="#FF7A00" />
            <Text className="text-xs text-gray-500 font-semibold ml-1.5">Reserva bloqueada por {formatTime(currentBooking.timeLeft)}min</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full max-w-[340px] bg-white rounded-3xl p-5 items-center shadow-2xl border border-gray-100">
<View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-4">
                <Image source={require('@/assets/images/mercadopagologo.png')} style={{ width: 48, height: 48 }} />
              </View>
            <Text className="text-lg font-bold text-center text-black">Confirmar pago</Text>
<Text className="text-gray-500 text-center mt-2 text-sm leading-relaxed">
                ¿Deseas pagar <Text className="font-extrabold text-primary">S/ {currentBooking.totalPrice.toFixed(2)}</Text> por tu reserva?
              </Text>
            <View className="flex-row gap-x-3 mt-6 w-full">
              <TouchableOpacity onPress={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 rounded-xl py-3 items-center">
                <Text className="text-sm font-bold text-gray-600">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmPay} className="flex-1 bg-primary rounded-xl py-3 items-center">
                <Text className="text-white text-sm font-bold">Pagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
