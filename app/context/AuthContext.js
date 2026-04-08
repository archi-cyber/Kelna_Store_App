import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au lancement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion.';
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token: newToken, user: userData } = response.data;

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur d\'inscription.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await api.put('/auth/profile', updatedData);
      const newUser = { ...user, ...updatedData };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erreur mise à jour.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
