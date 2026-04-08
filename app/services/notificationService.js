import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

// Configuration du handler de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const notificationService = {
  // Demander la permission et obtenir le token
  registerForPushNotifications: async () => {
    try {
      if (!Device.isDevice) {
        console.warn('Les notifications push nécessitent un appareil physique');
        return null;
      }

      // Vérifier les permissions existantes
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Demander la permission si pas encore accordée
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission de notifications refusée');
        return null;
      }

      // Obtenir le token Expo Push
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      // Configuration Android (canal de notification)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('kelna-default', {
          name: 'Kelna Store',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6A35FF',
        });
      }

      // Sauvegarder localement
      await AsyncStorage.setItem('pushToken', token);

      // Envoyer au backend
      try {
        await api.post('/auth/push-token', { push_token: token });
      } catch (e) {
        console.warn('Impossible de sauvegarder le push token sur le serveur');
      }

      return token;
    } catch (error) {
      console.error('Erreur enregistrement notifications:', error);
      return null;
    }
  },

  // Écouter les notifications reçues (app ouverte)
  addNotificationReceivedListener: (callback) => {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // Écouter les interactions utilisateur avec les notifications (clic)
  addNotificationResponseReceivedListener: (callback) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  // Supprimer un listener
  removeNotificationSubscription: (subscription) => {
    if (subscription) {
      subscription.remove();
    }
  },

  // Envoyer une notification locale (sans serveur, pour test)
  scheduleLocalNotification: async (title, body, data = {}, secondsDelay = 1) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: { seconds: secondsDelay },
      });
    } catch (error) {
      console.error('Erreur notification locale:', error);
    }
  },

  // Annuler toutes les notifications programmées
  cancelAllNotifications: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  },

  // Définir le badge de l'app (iOS)
  setBadgeCount: async (count) => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Erreur badge:', error);
    }
  },

  // Effacer le badge
  clearBadge: async () => {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Erreur clear badge:', error);
    }
  },
};

export default notificationService;