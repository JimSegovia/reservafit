import api from '../api/api';

export const instructorsService = {
  getAll: async () => {
    const response = await api.get('/instructores');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/instructores', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/instructores/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/instructores/${id}`);
    return response.data;
  }
};
