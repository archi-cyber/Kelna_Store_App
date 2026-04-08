// backend/config/firebase-admin.js
const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp = null;

try {
  const serviceAccount = require('../' + (process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-service-account.json'));

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialisé');
} catch (error) {
  console.warn('⚠️  Firebase Admin non configuré:', error.message);
  console.warn('   Les notifications push seront désactivées.');
}

/**
 * Envoyer une notification push à un utilisateur
 * @param {string} pushToken - Token FCM de l'appareil
 * @param {string} title - Titre de la notification
 * @param {string} body - Corps du message
 * @param {object} data - Données additionnelles (optionnel)
 */
const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!firebaseApp) {
    console.warn('Firebase non initialisé, notification ignorée');
    return null;
  }

  if (!pushToken) {
    console.warn('Aucun push token fourni');
    return null;
  }

  try {
    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]); // FCM n'accepte que des strings
        return acc;
      }, {}),
      token: pushToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'kelna-default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification envoyée:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur envoi notification:', error.message);
    return null;
  }
};

/**
 * Envoyer une notification à plusieurs utilisateurs
 */
const sendMulticastNotification = async (pushTokens, title, body, data = {}) => {
  if (!firebaseApp || !pushTokens || pushTokens.length === 0) return null;

  try {
    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
      tokens: pushTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ ${response.successCount}/${pushTokens.length} notifications envoyées`);
    return response;
  } catch (error) {
    console.error('❌ Erreur envoi multicast:', error.message);
    return null;
  }
};

module.exports = {
  admin,
  firebaseApp,
  sendPushNotification,
  sendMulticastNotification,
};