// Formater un prix
export const formatPrice = (price) => {
  return parseFloat(price).toFixed(2) + '€';
};

// Formater une date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Formater une heure
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Tronquer un texte
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Calculer la notation en étoiles
export const getStarRating = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
};

// Générer un ID unique
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Délai (pour animations/loading)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Capitaliser la première lettre
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Statuts de commande en français
export const ORDER_STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#FFB347',
    confirmed: '#4A90D9',
    shipped: '#6A35FF',
    delivered: '#27AE60',
    cancelled: '#E74C3C',
  };
  return colors[status] || '#777777';
};
