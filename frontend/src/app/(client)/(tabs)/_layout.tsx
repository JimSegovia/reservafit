import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(8, insets.bottom || 8);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isWeb
          ? { display: 'none' }
          : {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
              height: 60 + bottomPad, // increase height to account for safe area
              paddingBottom: bottomPad,
              paddingTop: 8,
            },
        tabBarActiveTintColor: '#FF7A00',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Clases',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Pagos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "card" : "card-outline"} size={22} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
