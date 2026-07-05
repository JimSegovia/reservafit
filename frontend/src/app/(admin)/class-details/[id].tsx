import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import { parseDateTime } from '@/utils/date';
import api from '@/api/api';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Disponible: { bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
  Lleno:     { bg: 'bg-red-50 border-red-200',     text: 'text-red-700' },
  Cancelada: { bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-700' },
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export default function ClassDetailsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { id } = useLocalSearchParams<{ id: string }>();
  const instructors = useAppStore((state) => state.instructors);
  const classes = useAppStore((state) => state.classes);
  const fetchInstructors = useAppStore((state) => state.fetchInstructors);
  const classData = classes.find((c) => c.id === id || c.id_clase === id);
  const className = classData?.title || '';

  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const fechaHoy = getTodayString();

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
  const [cupos, setCupos] = useState('30');

  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);
  const [showHoraFinPicker, setShowHoraFinPicker] = useState(false);

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
    setCupos('30');
    setShowInstructorMenu(false);

    // Reset pickers
    const today = new Date();
    setCalendarYear(today.getFullYear());
    setCalendarMonth(today.getMonth());
    setShowCalendar(false);
    setShowHoraInicioPicker(false);
    setShowHoraFinPicker(false);

    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!fecha.trim()) {
      Alert.alert('Validación', 'Debes ingresar la fecha.');
      return;
    }

    const dateParts = fecha.split('/');
    if (dateParts.length !== 3) {
      Alert.alert('Validación', 'La fecha debe tener el formato DD/MM/YYYY.');
      return;
    }
    const dayPart = dateParts[0].trim();
    const monthPart = dateParts[1].trim();
    const yearPart = dateParts[2].trim();
    if (dayPart.length !== 2 || monthPart.length !== 2 || yearPart.length !== 4) {
      Alert.alert('Validación', 'La fecha debe tener el formato DD/MM/YYYY.');
      return;
    }

    if (!horaInicio.trim() || !horaFin.trim()) {
      Alert.alert('Validación', 'Debes ingresar la hora de inicio y fin.');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(horaInicio.trim()) || !/^\d{2}:\d{2}$/.test(horaFin.trim())) {
      Alert.alert('Validación', 'Las horas deben tener el formato HH:MM (por ejemplo, 18:00).');
      return;
    }

    if (!instructorId) {
      Alert.alert('Validación', 'Debes seleccionar un instructor.');
      return;
    }

    const formattedDate = `${yearPart}-${monthPart}-${dayPart}`;
    const fecha_hora_inicio = `${formattedDate}T${horaInicio.trim()}:00`;
    const fecha_hora_fin = `${formattedDate}T${horaFin.trim()}:00`;

    const payload = {
      id_clase: id,
      id_instructor: instructorId,
      fecha_hora_inicio,
      fecha_hora_fin,
      estado,
      cupos: 30,
      filas: 6,
      columnas: 5,
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

  const handleDeleteSchedule = (scheduleId: string) => {
    Alert.alert(
      'Eliminar horario',
      '¿Estás seguro de que deseas eliminar este horario? Se cancelarán y reembolsarán todas las reservas asociadas a esta sesión.',
      [
        { text: 'Conservar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/agenda/${scheduleId}`);
              Alert.alert('Éxito', 'El horario ha sido eliminado.');
              fetchSchedules();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || error.response?.data?.message || 'Hubo un error al eliminar el horario');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchSchedules();
    fetchInstructors();
  }, [fetchInstructors]);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const startPadding = (firstDayIndex + 6) % 7;

  const daysArray = [];
  for (let i = 0; i < startPadding; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const calendarRows = [];
  let tempRow = [];
  for (let i = 0; i < daysArray.length; i++) {
    tempRow.push(daysArray[i]);
    if (tempRow.length === 7 || i === daysArray.length - 1) {
      while (tempRow.length < 7) {
        tempRow.push(null);
      }
      calendarRows.push(tempRow);
      tempRow = [];
    }
  }

  return (
    <View className="flex-1 bg-cream" style={{ flex: 1, height: '100%' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: isMobile ? 100 : 80 }}
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center flex-1 mr-2">
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Panel Admin &gt; Clase</Text>
              <Text className="text-2xl font-bold text-secondary mt-0.5">Horarios de la Clase</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openModal}
            hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {schedules.length === 0 ? (
          <View className="justify-center items-center py-10" style={{ minHeight: 300 }}>
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
            const fmtDate = (d: Date) => {
              if (isNaN(d.getTime())) return '--/--/--';
              const dd = String(d.getDate()).padStart(2, '0');
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const yyyy = d.getFullYear();
              return `${dd}/${mm}/${yyyy}`;
            };
            const fmtTime24 = (d: Date) =>
              isNaN(d.getTime()) ? '00:00' : d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
            const startTimeStr = fmtTime(startDate);
            const endTimeStr = fmtTime(endDate);
            const fechaStr = fmtDate(startDate);
            const horaInicio24 = fmtTime24(startDate);
            const horaFin24 = fmtTime24(endDate);
            const diaSemana =
              schedule.Dia ||
              (isNaN(startDate.getTime())
                ? null
                : startDate.toLocaleDateString('es-ES', { weekday: 'long' }));

            return (
              <View
                key={schedule.id_detalle_clase}
                className={`bg-white rounded-2xl p-5 mb-4 shadow-md ${isMobile ? '' : 'flex-row justify-between items-center'}`}
              >
                <View className={`${isMobile ? 'mb-3' : 'flex-1 mr-3'}`}>
                  {diaSemana ? (
                    <Text className="font-semibold text-sm text-gray-800 capitalize mb-0.5">
                      {diaSemana}
                    </Text>
                  ) : null}
                  <Text className="font-bold text-lg text-secondary mb-1">
                    {startTimeStr} - {endTimeStr}
                  </Text>
                  <Text className="text-sm text-gray-500">{schedule.instructor?.nombre || 'Sin asignar'}</Text>
                  <Text className="text-sm font-medium text-gray-400 mt-1">
                    {schedule._count?.detalles_reserva || 0}/{schedule.cupos} cupos
                  </Text>
                </View>

                <View className={`${isMobile ? 'flex-row items-center justify-between' : 'flex-row items-center'}`} style={{ gap: 12 }}>
                  <View
                    className={`px-3 py-1 rounded-full border ${statusStyle.bg}`}
                  >
                    <Text className={`text-xs font-bold ${statusStyle.text}`}>
                      {schedule.estado}
                    </Text>
                  </View>

                  <View className="flex-row items-center" style={{ gap: 12 }}>
                    <TouchableOpacity
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={() => {
                        setEditingScheduleId(schedule.id_detalle_clase);
                        setFecha(fechaStr);
                        setHoraInicio(horaInicio24);
                        setHoraFin(horaFin24);
                        setInstructorId(schedule.id_instructor);
                        setSelectedInstructorName(schedule.instructor?.nombre || '');
                        setEstado(schedule.estado);
                        setTematica(schedule.tematica || '');
                        setCupos(schedule.cupos ? schedule.cupos.toString() : '30');
                        setShowInstructorMenu(false);

                        // Parse date for calendar
                        if (fechaStr) {
                          const parts = fechaStr.split('/');
                          if (parts.length === 3) {
                            const m = parseInt(parts[1], 10) - 1;
                            const y = parseInt(parts[2], 10);
                            if (!isNaN(y) && !isNaN(m)) {
                              setCalendarYear(y);
                              setCalendarMonth(m);
                            }
                          }
                        }

                        setShowCalendar(false);
                        setShowHoraInicioPicker(false);
                        setShowHoraFinPicker(false);
                        setModalVisible(true);
                      }}
                      className="p-1"
                    >
                      <Ionicons name="pencil-outline" size={20} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={() => handleDeleteSchedule(schedule.id_detalle_clase)}
                      className="p-1"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
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
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F0F08" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              <View className={`${isMobile ? 'flex-col' : 'flex-row'} gap-3 mb-4`}>
                <View className={isMobile ? '' : 'flex-1'}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Fecha</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCalendar(!showCalendar);
                      setShowHoraInicioPicker(false);
                      setShowHoraFinPicker(false);
                    }}
                    className="w-full border border-gray-200 rounded-2xl bg-white px-3 py-3 flex-row justify-between items-center"
                  >
                    <Text className={fecha ? 'text-secondary text-sm' : 'text-gray-400 text-sm'}>
                      {fecha || 'DD/MM/YYYY'}
                    </Text>
                    <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <View className={isMobile ? '' : 'flex-1'}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Hora Inicio</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowHoraInicioPicker(!showHoraInicioPicker);
                      setShowCalendar(false);
                      setShowHoraFinPicker(false);
                    }}
                    className="w-full border border-gray-200 rounded-2xl bg-white px-3 py-3 flex-row justify-between items-center"
                  >
                    <Text className={horaInicio ? 'text-secondary text-sm' : 'text-gray-400 text-sm'}>
                      {horaInicio || '18:00'}
                    </Text>
                    <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <View className={isMobile ? '' : 'flex-1'}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Hora Fin</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowHoraFinPicker(!showHoraFinPicker);
                      setShowCalendar(false);
                      setShowHoraInicioPicker(false);
                    }}
                    className="w-full border border-gray-200 rounded-2xl bg-white px-3 py-3 flex-row justify-between items-center"
                  >
                    <Text className={horaFin ? 'text-secondary text-sm' : 'text-gray-400 text-sm'}>
                      {horaFin || '19:00'}
                    </Text>
                    <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Active Picker Area */}
              {showCalendar && (
                <View className="border border-gray-200 rounded-2xl bg-white p-4 mb-4 shadow-sm">
                  <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={prevMonth} className="p-1" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="chevron-back" size={20} color="#FF7A00" />
                    </TouchableOpacity>
                    <Text className="font-bold text-sm text-secondary">
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </Text>
                    <TouchableOpacity onPress={nextMonth} className="p-1" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="chevron-forward" size={20} color="#FF7A00" />
                    </TouchableOpacity>
                  </View>

                  {/* Weekdays header */}
                  <View className="flex-row mb-2">
                    {WEEKDAYS.map((day, idx) => (
                      <Text key={idx} className="flex-1 text-center text-xs font-bold text-gray-400">
                        {day}
                      </Text>
                    ))}
                  </View>

                  {/* Days grid */}
                  {calendarRows.map((row, rowIdx) => (
                    <View key={rowIdx} className="flex-row mb-1">
                      {row.map((day, dayIdx) => {
                        if (day === null) {
                          return <View key={dayIdx} className="flex-1 aspect-square" />;
                        }

                        const dayStr = String(day).padStart(2, '0');
                        const monthStr = String(calendarMonth + 1).padStart(2, '0');
                        const dateStr = `${dayStr}/${monthStr}/${calendarYear}`;
                        const isSelected = fecha === dateStr;

                        return (
                          <TouchableOpacity
                            key={dayIdx}
                            onPress={() => {
                              setFecha(dateStr);
                              setShowCalendar(false);
                            }}
                            className={`flex-1 aspect-square justify-center items-center rounded-full ${
                              isSelected ? 'bg-primary' : 'hover:bg-gray-100'
                            }`}
                          >
                            <Text className={`text-xs ${isSelected ? 'text-white font-bold' : 'text-secondary'}`}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}

              {showHoraInicioPicker && (
                <View className="border border-gray-200 rounded-2xl bg-white p-4 mb-4 shadow-sm">
                  <Text className="text-xs font-bold text-gray-500 mb-3">Seleccionar Hora de Inicio</Text>
                  <View className="flex-row justify-center items-center" style={{ gap: 20 }}>
                    {/* Hours Column */}
                    <View className="flex-1">
                      <Text className="text-[10px] text-gray-400 font-bold text-center mb-2">HORA</Text>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {Array.from({ length: 24 }).map((_, h) => {
                          const hStr = String(h).padStart(2, '0');
                          const currentHour = (horaInicio || '18:00').split(':')[0];
                          const isSelected = currentHour === hStr;
                          return (
                            <TouchableOpacity
                              key={h}
                              onPress={() => {
                                const currentMin = (horaInicio || '18:00').split(':')[1] || '00';
                                setHoraInicio(`${hStr}:${currentMin}`);
                              }}
                              className={`py-2 px-3 items-center rounded-xl mb-1 ${
                                isSelected ? 'bg-primary' : 'bg-gray-50'
                              }`}
                            >
                              <Text className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-secondary'}`}>
                                {hStr}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Minutes Column */}
                    <View className="flex-1">
                      <Text className="text-[10px] text-gray-400 font-bold text-center mb-2">MINUTOS</Text>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((mStr) => {
                          const currentMin = (horaInicio || '18:00').split(':')[1];
                          const isSelected = currentMin === mStr;
                          return (
                            <TouchableOpacity
                              key={mStr}
                              onPress={() => {
                                const currentHour = (horaInicio || '18:00').split(':')[0] || '18';
                                setHoraInicio(`${currentHour}:${mStr}`);
                                setShowHoraInicioPicker(false);
                              }}
                              className={`py-2 px-3 items-center rounded-xl mb-1 ${
                                isSelected ? 'bg-primary' : 'bg-gray-50'
                              }`}
                            >
                              <Text className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-secondary'}`}>
                                {mStr}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              )}

              {showHoraFinPicker && (
                <View className="border border-gray-200 rounded-2xl bg-white p-4 mb-4 shadow-sm">
                  <Text className="text-xs font-bold text-gray-500 mb-3">Seleccionar Hora de Fin</Text>
                  <View className="flex-row justify-center items-center" style={{ gap: 20 }}>
                    {/* Hours Column */}
                    <View className="flex-1">
                      <Text className="text-[10px] text-gray-400 font-bold text-center mb-2">HORA</Text>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {Array.from({ length: 24 }).map((_, h) => {
                          const hStr = String(h).padStart(2, '0');
                          const currentHour = (horaFin || '19:00').split(':')[0];
                          const isSelected = currentHour === hStr;
                          return (
                            <TouchableOpacity
                              key={h}
                              onPress={() => {
                                const currentMin = (horaFin || '19:00').split(':')[1] || '00';
                                setHoraFin(`${hStr}:${currentMin}`);
                              }}
                              className={`py-2 px-3 items-center rounded-xl mb-1 ${
                                isSelected ? 'bg-primary' : 'bg-gray-50'
                              }`}
                            >
                              <Text className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-secondary'}`}>
                                {hStr}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Minutes Column */}
                    <View className="flex-1">
                      <Text className="text-[10px] text-gray-400 font-bold text-center mb-2">MINUTOS</Text>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((mStr) => {
                          const currentMin = (horaFin || '19:00').split(':')[1];
                          const isSelected = currentMin === mStr;
                          return (
                            <TouchableOpacity
                              key={mStr}
                              onPress={() => {
                                const currentHour = (horaFin || '19:00').split(':')[0] || '19';
                                setHoraFin(`${currentHour}:${mStr}`);
                                setShowHoraFinPicker(false);
                              }}
                              className={`py-2 px-3 items-center rounded-xl mb-1 ${
                                isSelected ? 'bg-primary' : 'bg-gray-50'
                              }`}
                            >
                              <Text className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-secondary'}`}>
                                {mStr}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              )}

              <View className={`${isMobile ? 'flex-col' : 'flex-row'} gap-3 mb-4`}>
                <View style={isMobile ? {} : { flex: 2 }}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Temática (Color de ropa)</Text>
                  <TextInput
                    value={tematica}
                    onChangeText={setTematica}
                    placeholder="Ej. Ropa negra"
                    placeholderTextColor="#9CA3AF"
                    className="w-full border border-gray-200 rounded-2xl bg-white px-4 py-3 text-secondary text-sm"
                  />
                </View>
                <View style={isMobile ? {} : { flex: 1 }}>
                  <Text className="text-gray-500 font-bold text-xs mb-1.5">Cupos</Text>
                  <View className="w-full border border-gray-200 rounded-2xl bg-gray-50 px-4 py-3">
                    <Text className="text-gray-500 text-sm">30 cupos (Fijo)</Text>
                  </View>
                  {editingScheduleId && (
                    <Text className="text-xs text-gray-400 mt-1.5 ml-1">
                      Reservados: {schedules.find(s => s.id_detalle_clase === editingScheduleId)?._count?.detalles_reserva || 0}
                    </Text>
                  )}
                </View>
              </View>

              <View className="mb-4 relative z-50" style={{ zIndex: 50, elevation: 50 }}>
                <Text className="text-gray-500 font-bold text-xs mb-1.5">Instructor</Text>
                <TouchableOpacity
                  onPress={() => setShowInstructorMenu(!showInstructorMenu)}
                  className="w-full border border-gray-200 rounded-2xl bg-white px-4 py-3 flex-row justify-between items-center"
                >
                  <Text className={selectedInstructorName ? 'text-secondary text-sm' : 'text-gray-400 text-sm'}>
                    {selectedInstructorName || 'Selecciona un instructor'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                </TouchableOpacity>
                {showInstructorMenu && (
                  <View className="mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-sm max-h-48 overflow-hidden">
                    <ScrollView nestedScrollEnabled>
                       {instructors
                        .filter((i) => i.status === 'Activo')
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
                      {instructors.filter((i) => i.status === 'Activo').length === 0 && (
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
                  <View className={`${isMobile ? 'flex-col' : 'flex-row'}`} style={{ gap: 8 }}>
                    {ESTADOS.map((option) => {
                      const isSelected = estado === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => setEstado(option)}
                          className={`flex-1 py-3 border rounded-2xl items-center ${
                            isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-200'
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
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">
                {editingScheduleId ? 'Actualizar' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
