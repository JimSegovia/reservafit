import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, Instructor } from '@/store/useStore';
import api from '@/api/api';

import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function AdminInstructorsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isNative = Platform.OS !== 'web';
  const instructors = useAppStore((state) => state.instructors);
  const deleteInstructor = useAppStore((state) => state.deleteInstructor);
  const fetchInstructors = useAppStore((state) => state.fetchInstructors);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInstructors();
      setLoading(false);
    };
    loadData();
  }, [fetchInstructors]);
  
  // Modal states for Add/Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'Todos' || inst.specialty === selectedClass;
    const matchesStatus = selectedStatus === 'Todos' || inst.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSpecialty('');
    setStatus('Activo');
    setModalVisible(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingId(inst.id);
    setName(inst.name);
    setSpecialty(inst.specialty);
    setStatus(inst.status);
    setModalVisible(true);
  };

  const handleGuardarInstructor = async () => {
    if (!name.trim() || !specialty.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y Especialidad son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const names = name.trim().split(' ');
      const firstName = names[0] || 'Instructor';
      const lastName = names.slice(1).join(' ') || 'General';
      const serializedFields = JSON.stringify({
        specialty: specialty.trim(),
        status
      });

      const payload = {
        nombre: firstName,
        apellidos: lastName,
        foto_url: serializedFields
      };

      if (editingId) {
        await api.patch(`/instructores/${editingId}`, payload);
      } else {
        await api.post('/instructores', payload);
      }

      setName('');
      setSpecialty('');
      setStatus('Activo');
      setEditingId(null);
      setModalVisible(false);
      await fetchInstructors();
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Error al guardar instructor';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-cream" style={{ flex: 1, height: '100%' }}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: isMobile ? 100 : 80 }} 
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1 mr-2">
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.replace('/(admin)')}>
              <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
            </TouchableOpacity>
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Instructores</Text>
              <Text className="text-2xl font-bold text-secondary mt-0.5">Instructores</Text>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={openAddModal}
            hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Filters row */}
        <View className={`${isMobile ? 'flex-col' : 'flex-row items-center flex-wrap'} gap-3 mb-6 relative z-50`} style={{ zIndex: 50, elevation: 50 }}>
          <Animated.View entering={FadeInDown.duration(200).delay(50)} className={`flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3 ${isMobile ? 'w-full' : 'w-72'}`}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              placeholder="Buscar instructor"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-black text-sm p-0"
            />
          </Animated.View>

          <View className="relative z-50">
            <TouchableOpacity
              onPress={() => { setShowClassMenu(!showClassMenu); setShowStatusMenu(false); }}
              className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 gap-2"
            >
              <Text className="text-sm font-medium text-secondary">Clase</Text>
              <Text className="text-sm text-gray-500">{selectedClass}</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
            {showClassMenu && (
              <View className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                {['Todos', 'Salsa', 'Reggaeton', 'Bachata'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => { setSelectedClass(option); setShowClassMenu(false); }}
                    className={`px-4 py-2.5 ${selectedClass === option ? 'bg-gray-50' : ''}`}
                  >
                    <Text className={`text-sm ${selectedClass === option ? 'text-primary font-medium' : 'text-secondary'}`}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="relative z-50">
            <TouchableOpacity
              onPress={() => { setShowStatusMenu(!showStatusMenu); setShowClassMenu(false); }}
              className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 gap-2"
            >
              <Text className="text-sm font-medium text-secondary">Estado</Text>
              <Text className="text-sm text-gray-500">{selectedStatus}</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
            {showStatusMenu && (
              <View className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                {['Todos', 'Activo', 'Inactivo'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => { setSelectedStatus(option); setShowStatusMenu(false); }}
                    className={`px-4 py-2.5 ${selectedStatus === option ? 'bg-gray-50' : ''}`}
                  >
                    <Text className={`text-sm ${selectedStatus === option ? 'text-primary font-medium' : 'text-secondary'}`}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Instructors list */}
        <View className="gap-y-4 mb-6" style={{ zIndex: 1 }}>
          {filteredInstructors.length === 0 ? (
            <Text className="text-center text-gray-500 py-8">No se encontraron instructores.</Text>
          ) : (
            filteredInstructors.map((inst) => {
              const isActive = inst.status === 'Activo';
              return (
                <Animated.View
                  key={inst.id}
                  entering={FadeInDown.duration(200)}
                  layout={LinearTransition}
                  className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-4 ${isMobile ? '' : 'flex-row justify-between items-center'}`}
                >
                  <View className={`${isMobile ? 'flex-col' : 'flex-row items-center flex-1'}`}>
                    <View className={`${isMobile ? 'flex-row items-center mb-3' : 'flex-row items-center flex-1'}`}>
                      {/* Circle Photo Placeholder */}
                      <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                        <Ionicons name="person" size={22} color="gray" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-secondary">{inst.name}</Text>
                        <Text className="text-sm text-gray-500 font-normal mt-0.5">{inst.specialty}</Text>
                      </View>
                    </View>

                    <View className={`${isMobile ? 'flex-row items-center justify-between' : 'flex-row items-center gap-x-2'}`}>
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
                          {inst.status}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-x-2">
                        {/* Edit button */}
                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => openEditModal(inst)} className="p-1">
                          <Ionicons name="pencil-outline" size={20} color="black" />
                        </TouchableOpacity>

                        {/* Delete button */}
                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => deleteInstructor(inst.id)} className="p-1">
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-secondary">
                {editingId ? 'Editar Instructor' : 'Agregar Instructor'}
              </Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F0F08" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 font-bold text-xs mb-1.5">Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Juan Pérez"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-secondary text-sm"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 font-bold text-xs mb-1.5">Especialidad</Text>
              <TextInput
                value={specialty}
                onChangeText={setSpecialty}
                placeholder="Salsa / Bachata"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-secondary text-sm"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-500 font-bold text-xs mb-1.5">Estado</Text>
              <View className="flex-row" style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setStatus('Activo')}
                  className={`flex-1 py-3 border rounded-xl items-center ${
                    status === 'Activo' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-bold ${status === 'Activo' ? isNative ? 'text-secondary' : 'text-white' : 'text-secondary'}`}>
                    Activo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStatus('Inactivo')}
                  className={`flex-1 py-3 border rounded-xl items-center ${
                    status === 'Inactivo' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-bold ${status === 'Inactivo' ? isNative ? 'text-secondary' : 'text-white' : 'text-secondary'}`}>
                    Inactivo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleGuardarInstructor}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl items-center shadow-lg shadow-orange-500/20 ${isSubmitting ? 'bg-gray-400' : 'bg-primary'}`}
            >
              <Text className="text-white text-base font-bold">{isSubmitting ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
