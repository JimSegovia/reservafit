import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export type LoaderVariant = 'fullscreen' | 'inline' | 'button';

interface LoaderProps {
  variant?: LoaderVariant;
  size?: 'small' | 'large';
  color?: string;
  label?: string;
}

export function Loader({
  variant = 'inline',
  size = 'large',
  color = '#FF7A00', // Default brand primary color
  label,
}: LoaderProps) {
  if (variant === 'fullscreen') {
    return (
      <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
        <ThemedView className="p-6 rounded-2xl items-center justify-center bg-white dark:bg-zinc-900 shadow-xl border border-gray-150">
          <ActivityIndicator size={size} color={color} />
          {label && (
            <ThemedText className="mt-3 text-sm font-bold text-center">
              {label}
            </ThemedText>
          )}
        </ThemedView>
      </View>
    );
  }

  if (variant === 'button') {
    return (
      <View className="flex-row items-center justify-center gap-x-2">
        <ActivityIndicator size="small" color="#FFFFFF" />
        {label && (
          <ThemedText className="text-white text-base font-bold">
            {label}
          </ThemedText>
        )}
      </View>
    );
  }

  // Inline default
  return (
    <View className="flex-1 justify-center items-center py-6">
      <ActivityIndicator size={size} color={color} />
      {label && (
        <ThemedText className={`mt-2 text-sm font-semibold ${Platform.OS !== 'web' ? 'text-gray-600' : 'text-gray-500'}`}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}
