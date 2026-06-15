import api from '../api/api';

export const reservationsService = {
  getAll: async () => {
    const response = await api.get('/reservas');
    return response.data;
  },
  
  create: async (data: { id_usuario: string; id_detalle_clase: string; numero_cupo: number }) => {
    const response = await api.post('/reservas/reservas', data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/reservas/${id}`, { estado: status });
    return response.data;
  },
  
  checkoutPayment: async (data: { id_reserva: string; amount: number; description: string }) => {
    const response = await api.post('/pagos/checkout', data);
    return response.data;
  }
};
