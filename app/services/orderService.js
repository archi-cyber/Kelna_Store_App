import api from '../config/api';

const orderService = {
  // Créer une commande
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur création commande:', error);
      throw error;
    }
  },

  // Obtenir l'historique des commandes
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data.orders;
    } catch (error) {
      console.error('Erreur historique commandes:', error);
      throw error;
    }
  },

  // Obtenir le détail d'une commande
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.order;
    } catch (error) {
      console.error('Erreur détail commande:', error);
      throw error;
    }
  },
};

export default orderService;
