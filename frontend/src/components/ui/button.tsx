import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
          textClass: 'text-primary font-bold',
          iconColor: '#FF7A00',
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
          textClass: 'text-primary font-semibold',
          iconColor: '#FF7A00',
        };
      case 'primary':
      default:
        return {
          buttonClass: 'bg-primary active:bg-primary/90',
          textClass: 'text-white font-bold',
          iconColor: '#FFFFFF',
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
          <Text className={`text-base text-center ${textClass} ${textClassName}`}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
