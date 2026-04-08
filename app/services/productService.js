import api from '../config/api';

const productService = {
  // Obtenir tous les produits avec filtres
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.occasion) params.append('occasion', filters.occasion);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data.products;
    } catch (error) {
      console.error('Erreur récupération produits:', error);
      throw error;
    }
  },

  // Obtenir un produit par ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product;
    } catch (error) {
      console.error('Erreur récupération produit:', error);
      throw error;
    }
  },

  // Obtenir les catégories
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data.categories;
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      throw error;
    }
  },

  // Obtenir les produits populaires
  getPopularProducts: async () => {
    try {
      const response = await api.get('/products/popular');
      return response.data.products;
    } catch (error) {
      console.error('Erreur récupération populaires:', error);
      throw error;
    }
  },

  // Toggle favori
  toggleFavorite: async (productId) => {
    try {
      const response = await api.post(`/products/${productId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('Erreur favori:', error);
      throw error;
    }
  },

  // Obtenir les favoris
  getFavorites: async () => {
    try {
      const response = await api.get('/products/favorites');
      return response.data.products;
    } catch (error) {
      console.error('Erreur favoris:', error);
      throw error;
    }
  },
};

export default productService;
