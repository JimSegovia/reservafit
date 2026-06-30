import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TooltipProps {
  content: string;
  className?: string;
  size?: number;
}

export function Tooltip({ content, className = '', size = 16 }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className={`inline-flex flex-row items-center justify-center ${className}`}>
      <TouchableOpacity 
        onPress={() => setVisible(true)} 
        activeOpacity={0.6}
        className="p-0.5"
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      >
        <Ionicons name="help-circle-outline" size={size} color="#FF7A00" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/40 items-center justify-center px-6"
          onPress={() => setVisible(false)}
        >
          <Pressable 
            className="w-[85%] max-w-sm min-h-[160px] bg-white rounded-[32px] p-8 shadow-xl shadow-black/10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-2 border-b border-gray-100 pb-1.5">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={16} color="#FF7A00" className="mr-1" />
                <Text className="text-xs font-extrabold text-black">Ayuda e Información</Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                <Ionicons name="close" size={16} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-600 leading-relaxed font-semibold">
              {content}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
