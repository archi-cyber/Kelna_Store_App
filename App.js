import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { CartProvider } from './app/context/CartContext';
import AppNavigator from './app/navigation/AppNavigator';
import notificationService from './app/services/notificationService';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (isAuthenticated) {
      // Enregistrer pour les push notifications
      notificationService.registerForPushNotifications();

      // Notification reçue alors que l'app est ouverte
      notificationListener.current = notificationService.addNotificationReceivedListener(
        notification => {
          console.log('Notification reçue:', notification);
        }
      );

      // L'utilisateur a cliqué sur une notification
      responseListener.current = notificationService.addNotificationResponseReceivedListener(
        response => {
          console.log('Notification cliquée:', response);
          // Tu peux naviguer vers un écran spécifique ici
        }
      );
    }

    return () => {
      notificationService.removeNotificationSubscription(notificationListener.current);
      notificationService.removeNotificationSubscription(responseListener.current);
    };
  }, [isAuthenticated]);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}