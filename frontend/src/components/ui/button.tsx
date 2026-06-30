import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loader } from './loader';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
  textClassName?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
  textClassName = '',
}: ButtonProps) {
  const isMobile = Platform.OS !== 'web';

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          buttonClass: 'bg-secondary active:bg-secondary/90',
          textClass: 'text-white font-bold',
          iconColor: '#FFFFFF',
        };
      case 'outline':
        return {
          buttonClass: 'bg-transparent border border-primary',
          textClass: isMobile ? 'text-primary-text-strong font-bold' : 'text-primary font-bold',
          iconColor: isMobile ? '#B85A00' : '#FF7A00',
        };
      case 'danger':
        return {
          buttonClass: 'bg-danger-border active:bg-danger-border/90',
          textClass: 'text-white font-bold',
          iconColor: '#FFFFFF',
        };
      case 'ghost':
        return {
          buttonClass: 'bg-transparent',
          textClass: isMobile ? 'text-primary-text-strong font-semibold' : 'text-primary font-semibold',
          iconColor: isMobile ? '#B85A00' : '#FF7A00',
        };
      case 'primary':
      default:
        return {
          buttonClass: 'bg-primary active:bg-primary/90',
          textClass: isMobile ? 'text-secondary font-bold' : 'text-white font-bold',
          iconColor: isMobile ? '#1F0F08' : '#FFFFFF',
        };
    }
  };

  const { buttonClass, textClass, iconColor } = getVariantStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      className={`w-full py-4 px-6 rounded-2xl flex-row items-center justify-center shadow-sm ${buttonClass} ${
        isDisabled ? 'opacity-40 shadow-none' : ''
      } ${className}`}
      style={{ minHeight: 56 }}
    >
      {loading ? (
        <Loader variant="button" />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={iconColor}
              className="mr-2"
            />
          )}
          <Text className={`${isMobile ? 'text-lg' : 'text-base'} text-center ${textClass} ${textClassName}`}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
