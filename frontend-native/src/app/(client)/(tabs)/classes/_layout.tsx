import { Stack } from 'expo-router';

export default function ClassesStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 250 }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="schedules" />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}
