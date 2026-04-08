import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';
import { COLORS, SIZES } from '../config/theme';

const FavoritesScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Recharger à chaque fois qu'on revient sur l'écran
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await productService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erreur favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = (product) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${product.name}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.toggleFavorite(product.id);
              setFavorites(prev => prev.filter(p => p.id !== product.id));
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer ce favori.');
            }
          },
        },
      ]
    );
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={addToCart}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Ionicons name="heart" size={22} color={COLORS.accent} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes favoris</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <LoadingSpinner message="Chargement de vos favoris..." />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={60} color={COLORS.accent} />
          </View>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Ajoutez des produits à vos favoris pour les retrouver facilement ici
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Catalog')}
          >
            <Text style={styles.exploreButtonText}>Explorer le catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {favorites.length} produit{favorites.length > 1 ? 's' : ''} favori{favorites.length > 1 ? 's' : ''}
            </Text>
          </View>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
              />
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingTop: 56,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  countContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  countText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  cardContainer: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.xl,
    paddingHorizontal: SIZES.lg,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: SIZES.body,
    fontWeight: '700',
  },
});

export default FavoritesScreen;