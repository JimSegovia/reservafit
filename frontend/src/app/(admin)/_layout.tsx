import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminTabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(8, insets.bottom || 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 60 + bottomPad,
          paddingBottom: bottomPad,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF7A00',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="instructors"
        options={{
          title: 'Instructores',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="classes-mgmt"
        options={{
          title: 'Clases',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="manual-booking"
        options={{
          title: 'Reservar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="bookings-history"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={20} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
