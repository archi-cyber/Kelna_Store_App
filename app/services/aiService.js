import api from '../config/api';

const aiService = {
  // Envoyer un message au chatbot IA
  sendMessage: async (message) => {
    try {
      const response = await api.post('/ai/chat', { message });
      return response.data.response;
    } catch (error) {
      console.error('Erreur chat IA:', error);
      return 'Désolé, je rencontre un problème. Veuillez réessayer plus tard.';
    }
  },

  // Obtenir des suggestions
  getSuggestions: async (criteria) => {
    try {
      const response = await api.post('/ai/suggest', criteria);
      return response.data;
    } catch (error) {
      console.error('Erreur suggestions:', error);
      throw error;
    }
  },

  // Obtenir l'historique du chat
  getChatHistory: async () => {
    try {
      const response = await api.get('/ai/history');
      return response.data.history;
    } catch (error) {
      console.error('Erreur historique:', error);
      return [];
    }
  },
};

export default aiService;
