import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useStore';
import api from '@/api/api';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface ClienteMonedas {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  celular: string;
  codigo_referido: string | null;
  saldo_monedas: number;
}

export default function ClientesMonedasScreen() {
  const showToast = useAppStore((state) => state.showToast);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isNative = Platform.OS !== 'web';

  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<ClienteMonedas[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCliente, setSelectedCliente] = useState<ClienteMonedas | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [ajusteCantidad, setAjusteCantidad] = useState('');
  const [ajusteMotivo, setAjusteMotivo] = useState('');
  const [tipoAjuste, setTipoAjuste] = useState<'sumar' | 'restar'>('sumar');

  const [showHistorial, setShowHistorial] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [historialLoading, setHistorialLoading] = useState(false);

  const fetchClientes = async (searchTerm = '', pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/clientes?search=${encodeURIComponent(searchTerm)}&page=${pageNum}&limit=20`);
      setClientes(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error('Error fetching clientes:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes(search, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchClientes(search, 1);
  };

  const openAdjustModal = (cliente: ClienteMonedas) => {
    setSelectedCliente(cliente);
    setAjusteCantidad('');
    setAjusteMotivo('');
    setTipoAjuste('sumar');
    setShowAdjustModal(true);
  };

  const handleAjustarMonedas = async () => {
    const cantidad = parseInt(ajusteCantidad);
    if (!cantidad || cantidad <= 0) {
      showToast('Ingresa una cantidad válida.', 'warning');
      return;
    }
    if (!ajusteMotivo.trim()) {
      showToast('El motivo es obligatorio.', 'warning');
      return;
    }

    try {
      const finalCantidad = tipoAjuste === 'sumar' ? cantidad : -cantidad;
      await api.post('/admin/ajustar-monedas', {
        id_usuario: selectedCliente?.id_usuario,
        cantidad: finalCantidad,
        motivo: ajusteMotivo,
      });
      showToast('Monedas ajustadas correctamente.', 'success');
      setShowAdjustModal(false);
      fetchClientes(search, page);
    } catch (error: any) {
      showToast(error?.response?.data?.error || 'Error al ajustar monedas.', 'error');
    }
  };

  const openHistorial = async (cliente: ClienteMonedas) => {
    setSelectedCliente(cliente);
    setShowHistorial(true);
    setHistorialLoading(true);
    try {
      const response = await api.get(`/monedas/${cliente.id_usuario}`);
      setHistorial(response.data.historial || []);
    } catch (err) {
      console.error('Error fetching historial:', err);
    }
    setHistorialLoading(false);
  };

  const totalPages = Math.ceil(total / 20);

  const tipoLabels: Record<string, string> = {
    ganada_cancelacion: 'Cancelación',
    ganada_compra_bono: 'Bono fidelidad',
    gastada_clase: 'Pago de clase',
    devuelta_admin: 'Clase cancelada',
    devuelta_minimo: 'Mínimo no alcanzado',
    ganada_referido: 'Referido',
    ajuste_admin: 'Ajuste admin',
  };

  return (
    <View className={`flex-1 bg-cream ${isMobile ? 'px-4 pt-3 pb-4' : 'px-8 pt-6 pb-4'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: isMobile ? 100 : 80 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(200)} className="mb-4">
          <Text className="text-2xl font-semibold text-secondary">Monedas de Clientes</Text>
          <Text className="text-[13px] text-gray-500 mt-1">Gestiona el saldo de monedas de todos los clientes</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(200).delay(50)} className="flex-row items-center gap-x-2 mb-6">
          <View className="flex-1 flex-row items-center border border-gray-200 rounded-2xl bg-white px-3 py-3 shadow-sm">
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              placeholder="Buscar por nombre o email..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-black text-sm p-0"
            />
          </View>
          <TouchableOpacity onPress={handleSearch} className="bg-primary rounded-2xl px-4 py-3">
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <View className="py-20 items-center"><Text className="text-gray-400">Cargando...</Text></View>
        ) : clientes.length === 0 ? (
          <View className="py-20 items-center">
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-3">No se encontraron clientes</Text>
          </View>
        ) : (
          <>
            <View className="gap-y-3 mb-6">
              {clientes.map((c, idx) => (
                <Animated.View key={c.id_usuario} entering={FadeInDown.duration(200).delay(idx * 30)} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-3">
                      <Text className="text-base font-extrabold text-black">{c.nombres} {c.apellidos}</Text>
                      <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} mt-0.5`}>{c.email}</Text>
                      {c.codigo_referido ? (
                        <Text className="text-xs text-amber-600 mt-0.5 font-mono">{c.codigo_referido}</Text>
                      ) : null}
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-extrabold text-amber-600">{c.saldo_monedas} 🪙</Text>
                      <View className="flex-row gap-x-1.5 mt-2">
                        <TouchableOpacity onPress={() => openAdjustModal(c)} className="bg-green-100 rounded-lg px-2.5 py-1">
                          <Text className="text-green-700 text-xs font-bold">+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setSelectedCliente(c); setTipoAjuste('restar'); openAdjustModal(c); }} className="bg-red-100 rounded-lg px-2.5 py-1">
                          <Text className="text-red-700 text-xs font-bold">-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openHistorial(c)} className="bg-blue-100 rounded-lg px-2.5 py-1">
                          <Ionicons name="list-outline" size={14} color="#2563EB" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>

            {totalPages > 1 && (
              <View className="flex-row justify-center items-center gap-x-4 mb-6">
                <TouchableOpacity onPress={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className={`p-2 ${page <= 1 ? 'opacity-30' : ''}`}>
                  <Ionicons name="chevron-back" size={20} color="black" />
                </TouchableOpacity>
                <Text className="text-sm font-bold">{page} / {totalPages}</Text>
                <TouchableOpacity onPress={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className={`p-2 ${page >= totalPages ? 'opacity-30' : ''}`}>
                  <Ionicons name="chevron-forward" size={20} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal Ajuste */}
      <Modal visible={showAdjustModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-extrabold text-black">Ajustar Monedas</Text>
              <TouchableOpacity onPress={() => setShowAdjustModal(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {selectedCliente && (
              <Text className="text-sm text-gray-500 mb-4">
                {selectedCliente.nombres} {selectedCliente.apellidos} · Saldo: {selectedCliente.saldo_monedas} 🪙
              </Text>
            )}

            <View className="flex-row gap-x-3 mb-4">
              <TouchableOpacity onPress={() => setTipoAjuste('sumar')} className={`flex-1 py-2.5 rounded-xl items-center ${tipoAjuste === 'sumar' ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}>
                <Text className={`font-bold ${tipoAjuste === 'sumar' ? 'text-green-700' : 'text-gray-500'}`}>Sumar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTipoAjuste('restar')} className={`flex-1 py-2.5 rounded-xl items-center ${tipoAjuste === 'restar' ? 'bg-red-100 border border-red-300' : 'bg-gray-100'}`}>
                <Text className={`font-bold ${tipoAjuste === 'restar' ? 'text-red-700' : 'text-gray-500'}`}>Restar</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 mb-1">Cantidad</Text>
              <TextInput value={ajusteCantidad} onChangeText={setAjusteCantidad} keyboardType="numeric" placeholder="5" placeholderTextColor="#9CA3AF" className="border border-gray-200 rounded-xl px-4 py-3 text-black text-sm" />
            </View>

            <View className="mb-6">
              <Text className="text-xs font-bold text-gray-500 mb-1">Motivo (obligatorio)</Text>
              <TextInput value={ajusteMotivo} onChangeText={setAjusteMotivo} placeholder="Bono de bienvenida, corrección..." placeholderTextColor="#9CA3AF" className="border border-gray-200 rounded-xl px-4 py-3 text-black text-sm" />
            </View>

            <View className="flex-row gap-x-3">
              <TouchableOpacity onPress={() => setShowAdjustModal(false)} className="flex-1 bg-gray-200 rounded-xl py-3 items-center">
                <Text className="font-bold text-sm text-gray-700">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAjustarMonedas} className="flex-1 bg-primary rounded-xl py-3 items-center">
                <Text className="text-white font-bold text-sm">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Historial */}
      <Modal visible={showHistorial} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-extrabold text-black">Historial</Text>
              <TouchableOpacity onPress={() => setShowHistorial(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {selectedCliente && (
              <Text className="text-sm text-gray-500 mb-4">
                {selectedCliente.nombres} {selectedCliente.apellidos} · Saldo: {selectedCliente.saldo_monedas} 🪙
              </Text>
            )}

            {historialLoading ? (
              <View className="py-10 items-center"><Text className="text-gray-400">Cargando...</Text></View>
            ) : historial.length === 0 ? (
              <View className="py-10 items-center">
                <Ionicons name="star-outline" size={40} color="#D1D5DB" />
                <Text className="text-gray-400 mt-2">Sin transacciones</Text>
              </View>
            ) : (
              <ScrollView className="max-h-96" showsVerticalScrollIndicator>
                <View className="gap-y-2">
                  {historial.map((h: any, i: number) => (
                    <View key={i} className="flex-row justify-between items-center border-b border-gray-100 pb-2">
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-black">{tipoLabels[h.tipo] || h.tipo}</Text>
                        <Text className="text-[10px] text-gray-400">
                          {new Date(h.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <Text className={`text-sm font-extrabold ${h.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {h.cantidad > 0 ? '+' : ''}{h.cantidad} 🪙
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
