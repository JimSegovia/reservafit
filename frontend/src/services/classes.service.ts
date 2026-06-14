import api from '../api/api';

export const classesService = {
  getAll: async () => {
    const response = await api.get('/clases');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/clases', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/clases/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/clases/${id}`);
    return response.data;
  }
};
