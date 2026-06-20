import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Modal, RefreshControl, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, ClassItem } from '@/store/useStore';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Tooltip } from '@/components/ui/tooltip';

import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function AdminClassesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const classes = useAppStore((state) => state.classes);
  const addClass = useAppStore((state) => state.addClass);
  const updateClass = useAppStore((state) => state.updateClass);
  const deleteClass = useAppStore((state) => state.deleteClass);
  const fetchClasses = useAppStore((state) => state.fetchClasses);
  const showToast = useAppStore((state) => state.showToast);

  const [search, setSearch] = useState('');
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      await fetchClasses();
      setLoading(false);
    };
    loadClasses();
  }, [fetchClasses]);

  // Modal states for Add/Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filteredClasses = classes.filter((cls) =>
    cls.title.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
    showToast('Lista de clases actualizada.', 'success');
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const openEditModal = (cls: ClassItem) => {
    const classId = cls.id_clase || cls.id;
    setEditingId(classId);
    setTitle(cls.title);
    setDescription(cls.theme || '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Por favor ingresa el nombre de la clase.', 'warning');
      return;
    }
    
    if (editingId) {
      if (!editingId || editingId === 'undefined') {
        showToast('No se encontró el ID de la clase a editar.', 'error');
        return;
      }
      updateClass(editingId, { title, theme: description.trim() });
      showToast('Clase actualizada con éxito.', 'success');
    } else {
      addClass({
        title,
        schedule: '',
        instructorName: '',
        price: 0,
        status: 'Activo',
        capacity: 30,
        enrolled: 0,
        theme: description.trim()
      });
      showToast('Clase creada con éxito.', 'success');
    }
    
    setModalVisible(false);
  };

  const promptDeleteClass = (id: string) => {
    setClassToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      deleteClass(classToDelete);
      setClassToDelete(null);
      showToast('La clase ha sido eliminada.', 'success');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: isMobile ? 80 : 40 }} 
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7A00']} />}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.replace('/(admin)')}>
              <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
            </TouchableOpacity>
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Clases</Text>
              <View className="flex-row items-center mt-0.5">
                <Text className="text-2xl font-extrabold text-black mr-1">Clases</Text>
                <Tooltip content="Gestiona las clases del sistema. Puedes crear nuevas clases, modificar sus horarios/instructores, o eliminarlas." />
              </View>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={openAddModal}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3 mb-6">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            placeholder="Buscar clase por nombre..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-black text-sm p-0"
          />
        </Animated.View>

        {/* Classes Grid */}
        <View className="flex-row flex-wrap gap-4 mb-6">
          {filteredClasses.length === 0 ? (
            <EmptyState
              variant="no-results"
              title="No se encontraron clases"
              message={search ? `No hay clases que coincidan con la búsqueda "${search}".` : "No hay clases registradas en el sistema."}
              actionLabel={search ? "Limpiar búsqueda" : "Agregar clase"}
              onAction={search ? () => setSearch('') : openAddModal}
            />
          ) : (
            filteredClasses.map((cls) => (
              <Animated.View
                key={cls.id}
                entering={FadeInDown.duration(200)}
                layout={LinearTransition}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
                style={isMobile ? { width: '100%' as any } : { width: '48%' as any }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center">
                    <Ionicons name="fitness-outline" size={20} color="#FF7A00" />
                  </View>
                  <View className="flex-row gap-x-1">
                    <TouchableOpacity onPress={() => openEditModal(cls)} className="p-1">
                      <Ionicons name="pencil-outline" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => promptDeleteClass(cls.id_clase || cls.id)} className="p-1">
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-lg font-bold text-secondary mb-1" numberOfLines={1}>{cls.title}</Text>
                <Text className="text-xs text-gray-400 mb-4" numberOfLines={2}>
                  {cls.theme || 'Sin descripción'}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/(admin)/class-details/${cls.id_clase || cls.id}`)}
                  className="flex-row items-center justify-center bg-primary/10 rounded-xl py-2.5"
                >
                  <Ionicons name="calendar-outline" size={16} color="#FF7A00" />
                  <Text className="text-primary font-bold text-xs ml-1.5">Gestionar Horarios</Text>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-secondary">
                {editingId ? 'Editar Clase' : 'Agregar Clase'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F0F08" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 font-bold text-xs mb-1.5">Nombre de la Clase</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Salsa Básica"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-secondary text-sm"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-500 font-bold text-xs mb-1.5">Descripción / Temática</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Aprende los fundamentos de la salsa cubana..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-secondary text-sm min-h-[80px]"
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={!!classToDelete}
        title="Eliminar clase"
        message="¿Estás seguro de que deseas eliminar esta clase del sistema? Esta acción es irreversible."
        confirmLabel="Eliminar clase"
        cancelLabel="Conservar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setClassToDelete(null)}
        variant="danger"
      />
    </SafeAreaView>
  );
}
