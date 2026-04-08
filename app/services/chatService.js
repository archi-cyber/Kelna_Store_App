import api from '../config/api';

const chatService = {
  // Récupérer toutes les conversations
  getConversations: async () => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data.conversations;
    } catch (error) {
      console.error('Erreur conversations:', error);
      throw error;
    }
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      return response.data.messages;
    } catch (error) {
      console.error('Erreur messages:', error);
      throw error;
    }
  },

  // Envoyer un message
  sendMessage: async (receiverId, content, imageUrl = null) => {
    try {
      const response = await api.post('/chat/messages', {
        receiver_id: receiverId,
        content,
        image_url: imageUrl,
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur envoi message:', error);
      throw error;
    }
  },

  // Supprimer une conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression:', error);
      throw error;
    }
  },

  // Obtenir le nombre de messages non lus
  getUnreadCount: async () => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Erreur unread:', error);
      return 0;
    }
  },

  // Polling pour rafraîchir les messages (utilisation simple sans Firebase)
  pollMessages: (conversationId, callback, interval = 3000) => {
    const poll = async () => {
      try {
        const messages = await chatService.getMessages(conversationId);
        callback(messages);
      } catch (error) {
        console.error('Erreur polling:', error);
      }
    };

    poll(); // Appel initial
    const intervalId = setInterval(poll, interval);

    // Retourner une fonction pour arrêter le polling
    return () => clearInterval(intervalId);
  },
};

export default chatService;