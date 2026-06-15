import api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { correo_electronico: email, contrasena: password });
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { correo_electronico: email, codigo_otp: otp });
    return response.data;
  },
  
  logout: async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token_jwt');
    } else {
      await SecureStore.deleteItemAsync('token_jwt');
    }
  }
};
