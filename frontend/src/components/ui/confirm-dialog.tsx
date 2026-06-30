import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';
  const isMobile = Platform.OS !== 'web';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="w-full max-w-[380px] bg-white dark:bg-zinc-900 rounded-[28px] p-6 items-center shadow-2xl border border-gray-150">
          {/* Icon header */}
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-5 ${
              isDanger ? 'bg-red-50 dark:bg-red-950/30' : 'bg-orange-50 dark:bg-orange-950/30'
            }`}
          >
            <Ionicons
              name={isDanger ? 'trash-outline' : 'alert-circle-outline'}
              size={36}
              color={isDanger ? '#E53935' : '#FF7A00'}
            />
          </View>

          {/* Title */}
          <Text className="text-xl font-extrabold text-center text-black dark:text-white mb-2">
            {title}
          </Text>

          {/* Message */}
          <Text className={`${isMobile ? 'text-gray-600' : 'text-gray-500'} dark:text-gray-400 text-center text-[15px] leading-relaxed mb-8 px-2`}>
            {message}
          </Text>

          {/* Actions */}
          <View className="flex-row gap-x-3 w-full">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl py-4 items-center"
            >
              <Text className="text-[15px] font-bold text-gray-700 dark:text-gray-300">
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 rounded-2xl py-4 items-center justify-center ${
                isDanger ? 'bg-danger-border' : 'bg-primary'
              }`}
            >
              <Text className={`${isMobile && !isDanger ? 'text-secondary' : 'text-white'} text-[15px] font-bold`}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
