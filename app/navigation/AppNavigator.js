import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChatAIScreen from '../screens/ChatAIScreen';
import ChatScreen from '../screens/ChatScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Chargement de Kelna Store..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ChatAI"
            component={ChatAIScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;