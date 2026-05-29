import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CheckoutWeb() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(client)/(tabs)/classes');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
      <View className="items-center gap-4">
        <Text className="text-xl font-extrabold text-black text-center">Stripe checkout is not available on web</Text>
        <Text className="text-gray-500 text-center">Open the app on iOS or Android to complete this payment.</Text>
        <TouchableOpacity onPress={() => router.replace('/(client)/(tabs)/classes')} className="px-5 py-3 rounded-xl bg-primary">
          <Text className="text-white font-bold">Volver a clases</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
