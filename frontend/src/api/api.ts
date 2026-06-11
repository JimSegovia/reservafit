import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 1. Creamos la instancia central de Axios
const api = axios.create({
  // Llamamos a la variable de entorno con el estándar de Expo
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  
  // Opcional: Un timeout de 10 segundos. Si el server no responde, cancela la petición
  // en lugar de dejar al usuario con una pantalla de carga infinita.
  timeout: 10000, 
  
  // Aseguramos que envíe y reciba JSON por defecto
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor de Peticiones
// Este código se ejecuta automáticamente ANTES de que cualquier petición salga hacia Railway
api.interceptors.request.use(
  async (config) => {
    try {
      // Buscamos el token en el almacenamiento seguro del celular
      // Nota: Asegúrate de que al hacer el Login guardes el token con esta misma llave 'token_jwt'
      const token = await SecureStore.getItemAsync('token_jwt');
      
      // Si existe el token, lo inyectamos en las cabeceras de autorización
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al recuperar el token de SecureStore:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Respuestas (El Guardián de Entrada) - Opcional pero recomendado
// Este código revisa las respuestas ANTES de que lleguen a tus componentes
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la dejamos pasar normal
    return response;
  },
  async (error) => {
    // Si el backend nos devuelve un 401 (No Autorizado), significa que el token expiró o es inválido.
    // Aquí podrías agregar lógica para desloguear al usuario automáticamente y mandarlo al Login.
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado o inválido. Sesión terminada.');
      await SecureStore.deleteItemAsync('token_jwt');
      // Lógica de redirección al login (dependerá de cómo uses Expo Router)
    }
    
    return Promise.reject(error);
  }
);

export default api;