import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart';

const cartService = {
  // Récupérer le panier depuis le stockage local
  getCart: async () => {
    try {
      const cart = await AsyncStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Erreur lecture panier:', error);
      return [];
    }
  },

  // Sauvegarder le panier
  saveCart: async (cartItems) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde panier:', error);
      return false;
    }
  },

  // Ajouter un produit au panier
  addItem: async (product) => {
    try {
      const cart = await cartService.getCart();
      const existingIndex = cart.findIndex(item => item.id === product.id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await cartService.saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      throw error;
    }
  },

  // Retirer un produit
  removeItem: async (productId) => {
    try {
      const cart = await cartService.getCart();
      const updated = cart.filter(item => item.id !== productId);
      await cartService.saveCart(updated);
      return updated;
    } catch (error) {
      console.error('Erreur retrait panier:', error);
      throw error;
    }
  },

  // Modifier la quantité
  updateQuantity: async (productId, quantity) => {
    try {
      const cart = await cartService.getCart();

      if (quantity <= 0) {
        return await cartService.removeItem(productId);
      }

      const updated = cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );

      await cartService.saveCart(updated);
      return updated;
    } catch (error) {
      console.error('Erreur mise à jour quantité:', error);
      throw error;
    }
  },

  // Vider le panier
  clearCart: async () => {
    try {
      await AsyncStorage.removeItem(CART_KEY);
      return [];
    } catch (error) {
      console.error('Erreur vidage panier:', error);
      return [];
    }
  },

  // Calculer le total
  getTotal: (cartItems) => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  },

  // Nombre d'articles
  getCount: (cartItems) => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  },

  // Calculer les frais de livraison
  getShippingCost: (cartItems, threshold = 50) => {
    const total = cartService.getTotal(cartItems);
    if (cartItems.length === 0) return 0;
    return total >= threshold ? 0 : 9.0;
  },
};

export default cartService;