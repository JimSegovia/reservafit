import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Image as ExpoImage } from 'expo-image';

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export function ClientDesktopShell({ children, title, subtitle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isWeb) return <>{children}</>;

  const nav = [
    { label: 'Dashboard', icon: 'home-outline' as const, href: '/(client)/(tabs)' },
    { label: 'Clases', icon: 'calendar-outline' as const, href: '/(client)/(tabs)/classes' },
    { label: 'Pagos', icon: 'card-outline' as const, href: '/(client)/(tabs)/payments' },
  ];

  const isActive = (href: string) => {
    const normalized = pathname.replace(/\/index$/, '');
    if (href === '/(client)/(tabs)') return normalized === '/(client)/(tabs)';
    if (href === '/(client)/(tabs)/classes') {
      return normalized === href || normalized.includes('/classes') || normalized.includes('/position') || normalized.includes('/checkout') || normalized.includes('/success');
    }
    if (href === '/(client)/(tabs)/payments') {
      return normalized === href || normalized.includes('/payment');
    }
    return normalized === href || normalized.startsWith(`${href}/`);
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/landing');
  };

  const headerTitle = typeof title === 'string' ? title.trim() : '';
  const headerSubtitle = typeof subtitle === 'string' ? subtitle.trim() : '';

  return (
    <View className="flex-1 flex-row bg-cream">
      <View className="w-[280px] bg-[#1f0f08] px-6 py-8 justify-between">
        <View>
          <View className="flex-row items-center mb-10 mt-2">
            <ExpoImage
              source={require('@/../assets/images/logo.svg')}
              style={{ width: 34, height: 34 }}
              className="mr-2"
            />
            <Text className="text-[26px] font-bold ml-1 text-white">
              Reserva<Text className="text-primary">Fit</Text>
            </Text>
          </View>

          {nav.map((item) => (
            <TouchableOpacity
              key={item.href}
              onPress={() => router.replace(item.href as any)}
              className={`flex-row items-center rounded-lg px-4 py-4 mb-4 ${isActive(item.href) ? 'bg-primary' : ''}`}
            >
              <Ionicons name={item.icon} size={22} color="white" />
              <Text className="text-white font-semibold ml-3 text-[15px]">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleLogoutPress} className="flex-row items-center px-4 py-4 mb-2">
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text className="text-white font-semibold ml-3 text-[15px]">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View className="flex-row justify-end items-center px-8 pt-5">
          <View className="flex-row items-center gap-x-3">
            <Text className="text-[16px] font-semibold text-black">{user?.name || 'Punch Einstein'}</Text>
            <Ionicons name="chevron-down" size={18} color="black" />
          </View>
        </View>

        <View className="flex-1 px-8 pb-8 pt-3">
          {(headerTitle || headerSubtitle) ? (
            <View className="mb-6">
              {headerTitle ? <Text className="text-[24px] font-bold text-black leading-7">{headerTitle}</Text> : null}
              {headerSubtitle ? <Text className="text-[13px] text-gray-500 font-medium mt-2">{headerSubtitle}</Text> : null}
            </View>
          ) : null}
          {children}
        </View>
      </View>

      <ConfirmDialog
        visible={showLogoutConfirm}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión en ReservaFit?"
        confirmLabel="Cerrar sesión"
        cancelLabel="Volver"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        variant="default"
      />
    </View>
  );
}
