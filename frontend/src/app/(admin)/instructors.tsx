import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, Instructor } from '@/store/useStore';

import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function AdminInstructorsScreen() {
  const router = useRouter();
  const instructors = useAppStore((state) => state.instructors);
  const addInstructor = useAppStore((state) => state.addInstructor);
  const updateInstructor = useAppStore((state) => state.updateInstructor);
  const deleteInstructor = useAppStore((state) => state.deleteInstructor);

  const [search, setSearch] = useState('');
  
  // Modal states for Add/Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');

  const filteredInstructors = instructors.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleSave = () => {
    if (!name || !specialty) return;
    
    if (editingId) {
      updateInstructor(editingId, { name, specialty, status });
    } else {
      addInstructor({ name, specialty, status });
    }
    
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1 mr-2">
            <TouchableOpacity onPress={() => router.replace('/(admin)')}>
              <Ionicons name="arrow-back" size={24} color="black" className="mr-4" />
            </TouchableOpacity>
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Instructores</Text>
              <Text className="text-2xl font-extrabold text-black mt-0.5">Instructores</Text>
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

        {/* Search bar */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3 py-3 mb-6">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            placeholder="Buscar instructor"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-black text-sm p-0"
          />
        </Animated.View>

        {/* Instructors list */}
        <View className="gap-y-4 mb-6">
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
                  className="bg-white border border-gray-250 rounded-2xl p-4 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center flex-1">
                    {/* Circle Photo Placeholder */}
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                      <Ionicons name="person" size={22} color="gray" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-black">{inst.name}</Text>
                      <Text className="text-xs text-gray-500 mt-0.5">{inst.specialty}</Text>
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
                        {inst.status}
                      </Text>
                    </View>

                    {/* Edit button */}
                    <TouchableOpacity onPress={() => openEditModal(inst)} className="p-1">
                      <Ionicons name="pencil-outline" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Delete button */}
                    <TouchableOpacity onPress={() => deleteInstructor(inst.id)} className="p-1">
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
                {editingId ? 'Editar Instructor' : 'Agregar Instructor'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Juan Pérez"
                placeholderTextColor="#9CA3AF"
                className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-black text-sm"
              />
            </View>

            <View>
              <Text className="text-gray-500 font-bold text-xs mb-1">Especialidad</Text>
              <TextInput
                value={specialty}
                onChangeText={setSpecialty}
                placeholder="Salsa / Bachata"
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
    </SafeAreaView>
  );
}
