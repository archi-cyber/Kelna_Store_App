import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ScrollView, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const CATEGORIES = [
  { name: 'Fleurs', icon: '🌹' },
  { name: 'Tech', icon: '💻' },
  { name: 'Expériences', icon: '⭐' },
  { name: 'Personnalisé', icon: '❤️' },
  { name: 'Luxe', icon: '💎' },
  { name: 'Écologique', icon: '🌿' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [popularProducts, setPopularProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [popular, all] = await Promise.all([
        productService.getPopularProducts(),
        productService.getProducts(),
      ]);
      setPopularProducts(popular);
      setAllProducts(all);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    navigation.navigate('Catalog', { search: search.trim() });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Catalog', { category: category.name });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des surprises..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour {user?.username || 'Ami'} 👋</Text>
          <Text style={styles.headerSubtitle}>Trouvez le cadeau parfait</Text>
        </View>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={handleSearch}
          placeholder="Rechercher un cadeau..."
        />
      </View>

      {/* Suggestions IA */}
      <TouchableOpacity
        style={styles.aiCard}
        onPress={() => navigation.navigate('ChatAI')}
        activeOpacity={0.85}
      >
        <View style={styles.aiIconContainer}>
          <Ionicons name="sparkles" size={28} color="#FFF" />
        </View>
        <View style={styles.aiTextContainer}>
          <Text style={styles.aiTitle}>Suggéré par l'IA pour vous</Text>
          <Text style={styles.aiSubtitle}>Discutez avec notre IA pour des idées personnalisées</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Catégories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Produits populaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Populaires 🔥</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog', { sort: 'popular' })}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {popularProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={handleProductPress}
            onAddToCart={addToCart}
          />
        ))}
      </View>

      {/* Tous les produits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Découvrir</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {allProducts.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={handleProductPress}
            onAddToCart={addToCart}
          />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: SIZES.md,
    backgroundColor: COLORS.card,
  },
  greeting: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: SIZES.radiusLarge,
    borderBottomRightRadius: SIZES.radiusLarge,
    ...SHADOWS.small,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.md,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    ...SHADOWS.large,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: '#FFF',
  },
  aiSubtitle: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  seeAll: {
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: SIZES.sm,
  },
  categoryCard: {
    width: 80,
    height: 90,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
    ...SHADOWS.small,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: SIZES.xs,
  },
  categoryName: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default HomeScreen;
