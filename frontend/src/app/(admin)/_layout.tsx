import { Stack, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useAppStore } from '@/store/useStore';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAppStore((state) => state.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const navItems = [
    { label: 'Dashboard', icon: 'grid-outline', route: '/(admin)' },
    { label: 'Instructores', icon: 'people-outline', route: '/(admin)/instructors' },
    { label: 'Clases', icon: 'calendar-outline', route: '/(admin)/classes-mgmt' },
    { label: 'Historial', icon: 'receipt-outline', route: '/(admin)/bookings-history' },
    { label: 'Reservar', icon: 'book-outline', route: '/(admin)/manual-booking' },
  ];

  const isActive = (route: string) => {
    if (route === '/(admin)') return pathname === '/';
    const slug = route.split('/').pop();
    return pathname === `/${slug}`;
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/landing');
  };

  if (isMobile) {
    return (
      <View className="flex-1 bg-cream">
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        {/* Bottom Navigation Footer */}
        <View className="bg-secondary flex-row justify-around items-center px-1 py-2 pb-4">
          {navItems.map((item, idx) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => router.push(item.route as any)}
                className="items-center py-1 px-0.5"
                style={{ flex: 1 }}
                hitSlop={{ top: 7, bottom: 7, left: 0, right: 0 }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={active ? '#FF7A00' : '#9CA3AF'}
                />
                <Text
                  className={`text-[9px] font-semibold mt-0.5 text-center ${
                    active ? 'text-primary' : 'text-gray-400'
                  }`}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={() => setShowLogoutConfirm(true)}
            className="items-center py-1 px-0.5"
            style={{ flex: 1 }}
            hitSlop={{ top: 7, bottom: 7, left: 0, right: 0 }}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-[9px] font-semibold mt-0.5 text-center text-red-400" numberOfLines={1}>
              Salir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row h-screen bg-cream">
      {/* Sidebar */}
      <View className="w-64 bg-secondary flex-col justify-between px-4 py-6">
        <View>
          <TouchableOpacity
            onPress={() => router.push('/(admin)')}
            className="mb-10 px-2"
          >
            <ExpoImage
              source={require('../../../assets/images/logoblanco.svg')}
              style={{ width: 150, height: 45 }}
              contentFit="contain"
            />
          </TouchableOpacity>

          <View className="gap-y-0.5">
            {navItems.map((item, idx) => {
              const active = isActive(item.route);
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => router.push(item.route as any)}
                  className={`flex-row items-center px-3 py-2.5 rounded-xl ${
                    active ? 'bg-primary' : ''
                  }`}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={active ? '#FFFFFF' : '#9CA3AF'}
                  />
                  <Text
                    className={`ml-3 text-sm font-semibold ${
                      active ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          className="flex-row items-center px-3 py-2.5 rounded-xl mb-2"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="ml-3 text-sm font-semibold text-red-400">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      <ConfirmDialog
        visible={showLogoutConfirm}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas salir del panel de administración?"
        confirmLabel="Salir"
        cancelLabel="Volver"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        variant="default"
      />
    </View>
  );
}
