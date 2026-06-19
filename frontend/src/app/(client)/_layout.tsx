import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 250 }}>
      {/* (tabs) is the main tab bar navigation */}
      <Stack.Screen name="(tabs)" />
      {/* Position selector, checkout, and success screens do not show the bottom tab bar */}
      <Stack.Screen name="position" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="success" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
