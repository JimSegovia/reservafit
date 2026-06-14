import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutRouteFallback() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
      <View className="items-center gap-4">
        <Image source={require('@/assets/images/mercadopagologo.png')} style={{ width: 64, height: 64, borderRadius: 32 }} />
        <Text className="text-xl font-extrabold text-black text-center">Mercado Pago checkout no está disponible en web</Text>
        <Text className="text-gray-500 text-center">Abre la app móvil para completar tu pago fácilmente usando Mercado Pago.</Text>
        <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)/classes')} className="px-5 py-3 rounded-xl bg-primary">
          <Text className="text-white font-bold">Volver a clases</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
