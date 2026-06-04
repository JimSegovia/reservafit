import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Modal, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, ClassItem } from '@/store/useStore';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';

import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function AdminClassesScreen() {
  const router = useRouter();
  const classes = useAppStore((state) => state.classes);
  const addClass = useAppStore((state) => state.addClass);
  const updateClass = useAppStore((state) => state.updateClass);
  const deleteClass = useAppStore((state) => state.deleteClass);
  const showToast = useAppStore((state) => state.showToast);

  const [search, setSearch] = useState('');
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states for Add/Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [price, setPrice] = useState('40');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');

  const filteredClasses = classes.filter((cls) =>
    cls.title.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Lista de clases actualizada.', 'success');
    }, 1200);
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setSchedule('');
    setInstructorName('');
    setPrice('40');
    setStatus('Activo');
    setModalVisible(true);
  };

  const openEditModal = (cls: ClassItem) => {
    setEditingId(cls.id);
    setTitle(cls.title);
    setSchedule(cls.schedule);
    setInstructorName(cls.instructorName);
    setPrice(cls.price.toString());
    setStatus(cls.status);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title || !schedule || !instructorName) {
      showToast('Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }
    
    const parsedPrice = parseFloat(price) || 0;

    if (editingId) {
      updateClass(editingId, { title, schedule, instructorName, price: parsedPrice, status });
      showToast('Clase actualizada con éxito.', 'success');
    } else {
      addClass({
        title,
        schedule,
        instructorName,
        price: parsedPrice,
        status,
        capacity: 30,
        enrolled: 0
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
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
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
              <Text className="text-2xl font-extrabold text-black mt-0.5">Clases</Text>
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

        {/* Classes List */}
        <View className="gap-y-4 mb-6">
          {filteredClasses.length === 0 ? (
            <EmptyState
              variant="no-results"
              title="No se encontraron clases"
              message={search ? `No hay clases que coincidan con la búsqueda "${search}".` : "No hay clases registradas en el sistema."}
              actionLabel={search ? "Limpiar búsqueda" : "Agregar clase"}
              onAction={search ? () => setSearch('') : openAddModal}
            />
          ) : (
            filteredClasses.map((cls) => {
              const isActive = cls.status === 'Activo';
              return (
                <Animated.View
                  key={cls.id}
                  entering={FadeInDown.duration(200)}
                  layout={LinearTransition}
                  className="bg-white border border-gray-250 rounded-2xl p-4 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    {/* Circle Image Placeholder */}
                    <View className="w-12 h-12 rounded-xl bg-gray-200 mr-3 items-center justify-center">
                      <Ionicons name="calendar" size={22} color="gray" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-black">{cls.title}</Text>
                      <Text className="text-xs text-gray-400 font-bold mt-0.5">{cls.schedule}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">Instructor: {cls.instructorName}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-x-2">
                    {/* Status badge */}
                    <View
                      className={`px-3 py-1 rounded-full border ${
                        isActive ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isActive ? 'text-green-700' : 'text-gray-500'
                        }`}
                      >
                        {cls.status}
                      </Text>
                    </View>

                    {/* Edit button */}
                    <TouchableOpacity onPress={() => openEditModal(cls)} className="p-1">
                      <Ionicons name="pencil-outline" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Delete button */}
                    <TouchableOpacity onPress={() => promptDeleteClass(cls.id)} className="p-1">
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-cream rounded-t-[30px] p-6 gap-y-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
              <Text className="text-xl font-extrabold text-black">
                {editingId ? 'Editar Clase' : 'Agregar Clase'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Nombre de la Clase</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Salsa Básica"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-black text-sm"
              />
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Horario y Días</Text>
              <TextInput
                value={schedule}
                onChangeText={setSchedule}
                placeholder="Lun / Mié 6-7 PM"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-black text-sm"
              />
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Nombre del Instructor</Text>
              <TextInput
                value={instructorName}
                onChangeText={setInstructorName}
                placeholder="Juan Pérez"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-black text-sm"
              />
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Precio (S/)</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="40"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-black text-sm"
              />
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Estado</Text>
              <View className="flex-row gap-x-4">
                <TouchableOpacity
                  onPress={() => setStatus('Activo')}
                  className={`flex-1 py-3 border rounded-xl items-center ${
                    status === 'Activo' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-bold ${status === 'Activo' ? 'text-white' : 'text-black'}`}>
                    Activo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStatus('Inactivo')}
                  className={`flex-1 py-3 border rounded-xl items-center ${
                    status === 'Inactivo' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-bold ${status === 'Inactivo' ? 'text-white' : 'text-black'}`}>
                    Inactivo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-orange-500/20 mt-4"
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
