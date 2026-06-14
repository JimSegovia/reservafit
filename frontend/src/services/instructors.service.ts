import api from '../api/api';

export const instructorsService = {
  getAll: async () => {
    const response = await api.get('/instructores');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/instructores', data);
    return response.data;
  }
};
