import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './button';

export type EmptyStateVariant = 'no-classes' | 'no-bookings' | 'no-results' | 'error';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  variant,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  // Define default values based on the variant
  const getDefaults = () => {
    switch (variant) {
      case 'no-classes':
        return {
          icon: 'calendar-outline' as const,
          iconColor: '#FF7A00',
          title: 'No hay clases programadas',
          message: 'Actualmente no hay clases programadas para esta fecha o categoría.',
        };
      case 'no-bookings':
        return {
          icon: 'clipboard-outline' as const,
          iconColor: '#3B82F6',
          title: 'Sin reservas',
          message: 'Aún no has realizado ninguna reserva. ¡Empieza a entrenar hoy mismo!',
        };
      case 'error':
        return {
          icon: 'alert-circle-outline' as const,
          iconColor: '#EF4444',
          title: 'Ocurrió un error',
          message: 'No pudimos cargar los datos. Por favor, inténtalo de nuevo.',
        };
      case 'no-results':
      default:
        return {
          icon: 'search-outline' as const,
          iconColor: '#9CA3AF',
          title: 'Sin resultados',
          message: 'No encontramos resultados que coincidan con tu búsqueda o filtros.',
        };
    }
  };

  const defaults = getDefaults();
  const displayTitle = title || defaults.title;
  const displayMessage = message || defaults.message;
  const isMobile = Platform.OS !== 'web';

  return (
    <View className="py-12 px-6 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 rounded-3xl p-6 shadow-md w-full">
      <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center mb-4">
        <Ionicons name={defaults.icon} size={36} color={defaults.iconColor} />
      </View>

      <Text className="text-lg font-normal text-black dark:text-white text-center mb-2">
        {displayTitle}
      </Text>

      <Text className={`text-sm ${isMobile ? 'text-gray-600' : 'text-gray-500'} dark:text-gray-400 text-center leading-relaxed max-w-sm mb-6`}>
        {displayMessage}
      </Text>

      {onAction && actionLabel ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          className="w-auto px-8"
        />
      ) : null}
    </View>
  );
}
