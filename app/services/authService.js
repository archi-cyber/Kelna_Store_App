import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  // Inscription
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, token, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription.',
      };
    }
  },

  // Connexion
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, token, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email ou mot de passe incorrect.',
      };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  // Obtenir le profil
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Erreur profil:', error);
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Enregistrer le token push (FCM / Expo)
  savePushToken: async (pushToken) => {
    try {
      await api.post('/auth/push-token', { push_token: pushToken });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  // Vérifier si un token existe et est valide
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch {
      return false;
    }
  },

  // Récupérer l'utilisateur stocké localement
  getStoredUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

export default authService;