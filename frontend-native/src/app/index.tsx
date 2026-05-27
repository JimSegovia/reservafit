import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { useAppStore } from '@/store/useStore';

export default function IndexScreen() {
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // Redirection routing logic based on user authentication status
    if (!user) {
      router.replace('/(auth)/landing');
    } else if (user.role === 'admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/(client)/(tabs)');
    }
  }, [user]);

  return (
    <View className="flex-1 items-center justify-center bg-cream">
      <ActivityIndicator size="large" color="#FF7A00" />
    </View>
  );
}
