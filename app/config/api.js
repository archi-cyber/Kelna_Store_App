import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//  IMPORTANT : Remplacez par l'IP de votre machine sur le réseau local
// Pour trouver votre IP : 
// - Windows : ipconfig
// - Mac/Linux : ifconfig ou ip addr
const API_URL = 'http://192.168.0.160:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lecture token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, déconnecter l'utilisateur
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
