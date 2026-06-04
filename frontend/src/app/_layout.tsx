import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { cssInterop } from 'react-native-css-interop';
import Animated from 'react-native-reanimated';
import '../global.css';
import { Toast } from '@/components/ui/toast';

cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
cssInterop(Animated.ScrollView, { className: 'style' });
cssInterop(Animated.Image, { className: 'style' });

export default function RootLayout() {
  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <Toast />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 250 }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </View>
  );
}
