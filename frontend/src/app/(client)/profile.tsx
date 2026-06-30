import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { ClientDesktopShell } from '@/components/client-desktop-shell';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const logout = useAppStore((state) => state.logout);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [nombres, setNombres] = useState(user?.name?.split(' ')[0] || '');
  const [apellidos, setApellidos] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email] = useState(user?.email || '');
  const [celular, setCelular] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const success = await updateProfile({ nombres, apellidos, celular });
    setLoading(false);
    if (success) {
      router.back();
    }
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace('/(auth)/landing');
  };

  const formContent = (
    <ScrollView contentContainerStyle={{ padding: isWeb ? 0 : 20 }}>
      {!isWeb && (
        <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-200 mr-4"
          >
            <Ionicons name="arrow-back" size={18} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-black">Mi Perfil</Text>
        </Animated.View>
      )}

      <View className={`bg-white border border-gray-200 shadow-sm gap-y-4 ${isWeb ? 'max-w-xl w-full mx-auto p-8 rounded-3xl' : 'p-6 rounded-3xl'}`}>
        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-1">Nombres</Text>
          <TextInput
            value={nombres}
            onChangeText={setNombres}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-black"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-1">Apellidos</Text>
          <TextInput
            value={apellidos}
            onChangeText={setApellidos}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-black"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-1">Correo Electrónico</Text>
          <TextInput
            value={email}
            editable={false}
            className={`bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-base ${isNative ? 'text-gray-600' : 'text-gray-500'}`}
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-1">Celular</Text>
          <TextInput
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-black"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className={`bg-primary rounded-xl py-4 mt-4 items-center ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogoutPress}
          className="flex-row justify-center items-center py-4 mt-2"
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-red-600 font-bold text-base ml-2">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <>
      {isWeb
        ? <ClientDesktopShell title="Mi Perfil" subtitle="Edita tus datos personales">{formContent}</ClientDesktopShell>
        : (
          <SafeAreaView className="flex-1 bg-cream">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="flex-1"
            >
              {formContent}
            </KeyboardAvoidingView>
          </SafeAreaView>
        )
      }

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
    </>
  );
}
