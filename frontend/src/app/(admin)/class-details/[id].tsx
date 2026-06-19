import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { parseDateTime } from '@/utils/date';
import api from '@/api/api';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Disponible: { bg: 'bg-green-50 border-green-300', text: 'text-green-700' },
  Lleno:     { bg: 'bg-red-50 border-red-300',     text: 'text-red-700' },
  Cancelada: { bg: 'bg-blue-50 border-blue-300',    text: 'text-blue-700' },
};

export default function ClassDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const instructors = useAppStore((state) => state.instructors);
  const classes = useAppStore((state) => state.classes);
  const classData = classes.find((c) => c.id === id || c.id_clase === id);
  const className = classData?.title || '';

  const fechaHoy = new Date().toLocaleDateString('es-ES');

  const [schedules, setSchedules] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [fecha, setFecha] = useState(fechaHoy);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tematica, setTematica] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [selectedInstructorName, setSelectedInstructorName] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [showInstructorMenu, setShowInstructorMenu] = useState(false);

  const ESTADOS = ['Disponible', 'Lleno', 'Cancelada'];

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/agenda');
      const agenda = response.data.data || [];
      const classSchedules = agenda.filter((a: any) => a.id_clase === id);
      setSchedules(classSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const openModal = () => {
    setEditingScheduleId(null);
    setFecha(fechaHoy);
    setHoraInicio('');
    setHoraFin('');
    setTematica('');
    setInstructorId('');
    setSelectedInstructorName('');
    setEstado('Disponible');
    setShowInstructorMenu(false);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!horaInicio.trim() || !horaFin.trim()) {
      Alert.alert('Validación', 'Debes ingresar la hora de inicio y fin.');
      return;
    }

    const dateParts = fecha.split('/');
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    const fecha_hora_inicio = `${formattedDate} ${horaInicio}:00`;
    const fecha_hora_fin = `${formattedDate} ${horaFin}:00`;

    const payload = {
      id_clase: id,
      id_instructor: instructorId,
      fecha_hora_inicio,
      fecha_hora_fin,
      estado,
      cupos: 30,
      tematica
    };

    try {
      if (editingScheduleId) {
        await api.patch(`/agenda/${editingScheduleId}`, payload);
      } else {
        await api.post('/agenda', payload);
      }

      setModalVisible(false);
      setFecha(fechaHoy);
      setHoraInicio('');
      setHoraFin('');
      setTematica('');
      setInstructorId('');
      setSelectedInstructorName('');
      setEstado('Disponible');
      setEditingScheduleId(null);
      fetchSchedules();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || error.response?.data?.message || 'Hubo un error al guardar el horario');
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-4"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Clase</Text>
              <Text className="text-2xl font-extrabold text-black mt-0.5">Horarios de la Clase</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openModal}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {schedules.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center font-medium">No hay horarios programados aún.</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">Haz clic en el botón '+' para añadir uno.</Text>
          </View>
        ) : (
          schedules.map((schedule) => {
            const statusStyle = STATUS_STYLES[schedule.estado] || STATUS_STYLES.Disponible;
            const startDate = parseDateTime(schedule.fecha_hora_inicio);
            const endDate = parseDateTime(schedule.fecha_hora_fin);

            console.log('DEBUG Schedule:', {
              raw: schedule.fecha_hora_inicio,
              parsed: startDate.toString(),
              valid: !isNaN(startDate.getTime())
            });

            const fmtTime = (d: Date) =>
              isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
            const fmtDate = (d: Date) =>
              isNaN(d.getTime()) ? '--/--/--' : d.toLocaleDateString('es-ES');
            const fmtTime24 = (d: Date) =>
              isNaN(d.getTime()) ? '00:00' : d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
            const startTimeStr = fmtTime(startDate);
            const endTimeStr = fmtTime(endDate);
            const fechaStr = fmtDate(startDate);
            const horaInicio24 = fmtTime24(startDate);
            const horaFin24 = fmtTime24(endDate);

            return (
              <View
                key={schedule.id_detalle_clase}
                className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm flex-row justify-between items-center"
              >
                <View className="flex-1 mr-3">
                  <Text className="font-bold text-lg text-secondary mb-1">
                    {startTimeStr} - {endTimeStr}
                  </Text>
                  <Text className="text-sm text-gray-500">{schedule.instructor?.nombre || 'Sin asignar'}</Text>
                  <Text className="text-sm font-medium text-gray-400 mt-1">
                    {schedule._count?.detalles_reserva || 0}/{schedule.cupos} cupos
                  </Text>
                </View>

                <View className="flex-row items-center" style={{ gap: 12 }}>
                  <View
                    className={`px-3 py-1 rounded-full border ${statusStyle.bg}`}
                  >
                    <Text className={`text-xs font-bold ${statusStyle.text}`}>
                      {schedule.estado}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setEditingScheduleId(schedule.id_detalle_clase);
                      setFecha(fechaStr);
                      setHoraInicio(horaInicio24);
                      setHoraFin(horaFin24);
                      setInstructorId(schedule.id_instructor);
                      setSelectedInstructorName(schedule.instructor?.nombre || '');
                      setEstado(schedule.estado);
                      setTematica(schedule.tematica || '');
                      setShowInstructorMenu(false);
                      setModalVisible(true);
                    }}
                    className="p-1"
                  >
                    <Ionicons name="pencil-outline" size={20} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { /* TODO: eliminar horario */ }} className="p-1">
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Horario Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-secondary">
                {editingScheduleId ? 'Editar Sesión / Horario' : 'Añadir Sesión / Horario'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F0F08" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Fecha</Text>
                  <TextInput
                    value={fecha}
                    onChangeText={setFecha}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                    className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-secondary text-sm"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Hora Inicio</Text>
                  <TextInput
                    value={horaInicio}
                    onChangeText={setHoraInicio}
                    placeholder="18:00"
                    placeholderTextColor="#9CA3AF"
                    className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-secondary text-sm"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Hora Fin</Text>
                  <TextInput
                    value={horaFin}
                    onChangeText={setHoraFin}
                    placeholder="19:00"
                    placeholderTextColor="#9CA3AF"
                    className="w-full border border-gray-300 rounded-xl bg-white px-3 py-3 text-secondary text-sm"
                  />
                </View>
              </View>

              <View className="flex-row gap-3 mb-4">
                <View style={{ flex: 2 }}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Temática (Color de ropa)</Text>
                  <TextInput
                    value={tematica}
                    onChangeText={setTematica}
                    placeholder="Ej. Ropa negra"
                    placeholderTextColor="#9CA3AF"
                    className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 text-secondary text-sm"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Cupos</Text>
                  <View className="w-full border border-gray-300 rounded-xl bg-gray-100 px-4 py-3">
                    <Text className="text-secondary text-sm">
                      {editingScheduleId
                        ? `${schedules.find(s => s.id_detalle_clase === editingScheduleId)?._count?.detalles_reserva || 0} / ${schedules.find(s => s.id_detalle_clase === editingScheduleId)?.cupos || 30}`
                        : '0 / 30'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4 relative z-50" style={{ zIndex: 50, elevation: 50 }}>
                <Text className="text-gray-500 font-bold text-xs mb-1.5">Instructor</Text>
                <TouchableOpacity
                  onPress={() => setShowInstructorMenu(!showInstructorMenu)}
                  className="w-full border border-gray-300 rounded-xl bg-white px-4 py-3 flex-row justify-between items-center"
                >
                  <Text className={selectedInstructorName ? 'text-secondary text-sm' : 'text-gray-400 text-sm'}>
                    {selectedInstructorName || 'Selecciona un instructor'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                </TouchableOpacity>
                {showInstructorMenu && (
                  <View className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 z-50 overflow-hidden">
                    <ScrollView>
                      {instructors
                        .filter((i) => i.status === 'Activo' && i.specialty.toLowerCase().includes(className.toLowerCase()))
                        .map((inst) => (
                          <TouchableOpacity
                            key={inst.id}
                            onPress={() => {
                              setInstructorId(inst.id);
                              setSelectedInstructorName(inst.name);
                              setShowInstructorMenu(false);
                            }}
                            className="p-3 border-b border-gray-100"
                          >
                            <Text className="text-secondary text-sm">{inst.name}</Text>
                            <Text className="text-xs text-gray-400">{inst.specialty}</Text>
                          </TouchableOpacity>
                        ))}
                      {instructors.filter((i) => i.status === 'Activo' && i.specialty.toLowerCase().includes(className.toLowerCase())).length === 0 && (
                        <View className="p-3">
                          <Text className="text-gray-400 text-sm text-center">No hay instructores activos</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {editingScheduleId && (
                <View className="mb-6">
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Estado</Text>
                  <View className="flex-row" style={{ gap: 8 }}>
                    {ESTADOS.map((option) => {
                      const isSelected = estado === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => setEstado(option)}
                          className={`flex-1 py-3 border rounded-xl items-center ${
                            isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                          }`}
                        >
                          <Text
                            className={`font-bold text-xs ${
                              isSelected ? 'text-white' : 'text-secondary'
                            }`}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={handleSave}
              className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">
                {editingScheduleId ? 'Actualizar' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
