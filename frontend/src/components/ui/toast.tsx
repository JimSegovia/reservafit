import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export function Toast() {
  const toast = useAppStore((state) => state.toast);
  const hideToast = useAppStore((state) => state.hideToast);
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const getStyleAndIcon = () => {
    switch (toast.type) {
      case 'success':
        return {
          bgClass: 'bg-success-bg border-success-border',
          textClass: 'text-success-text',
          iconName: 'checkmark-circle-outline' as const,
          iconColor: '#2E7D32',
        };
      case 'error':
        return {
          bgClass: 'bg-danger-bg border-danger-border',
          textClass: 'text-danger-text',
          iconName: 'close-circle-outline' as const,
          iconColor: '#C62828',
        };
      case 'warning':
        return {
          bgClass: 'bg-amber-50 border-amber-300',
          textClass: 'text-amber-800',
          iconName: 'warning-outline' as const,
          iconColor: '#D97706',
        };
      case 'info':
      default:
        return {
          bgClass: 'bg-sky-50 border-sky-300',
          textClass: 'text-sky-800',
          iconName: 'information-circle-outline' as const,
          iconColor: '#0288D1',
        };
    }
  };

  const { bgClass, textClass, iconName, iconColor } = getStyleAndIcon();

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(250)}
      style={{
        position: 'absolute',
        top: isWeb ? 24 : 50,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 9999,
      }}
      pointerEvents="box-none"
    >
      <View
        className={`flex-row items-center max-w-[500px] w-full bg-white dark:bg-zinc-900 border rounded-2xl p-4 shadow-lg ${bgClass}`}
      >
        <Ionicons name={iconName} size={24} color={iconColor} className="mr-3" />
        <Text className={`flex-1 text-sm font-semibold leading-5 ${textClass}`}>
          {toast.message}
        </Text>
        <TouchableOpacity onPress={hideToast} className="p-1" hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="close" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
