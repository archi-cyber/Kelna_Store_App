import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';
import { COLORS, SIZES } from '../config/theme';

const SORT_OPTIONS = [
  { label: 'Récents', value: 'recent' },
  { label: 'Prix ↑', value: 'price_asc' },
  { label: 'Prix ↓', value: 'price_desc' },
  { label: 'Note', value: 'rating' },
  { label: 'Populaire', value: 'popular' },
];

const OCCASIONS = ['Anniversaire', 'Noël', 'Saint-Valentin', 'Fête des mères', 'Toute occasion'];

const CatalogScreen = ({ navigation, route }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(route.params?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [selectedSort, setSelectedSort] = useState(route.params?.sort || 'recent');
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedSort, selectedOccasion]);

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erreur catégories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedSort) filters.sort = selectedSort;
      if (selectedOccasion) filters.occasion = selectedOccasion;
      if (search) filters.search = search;
      
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Erreur produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue</Text>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={handleSearch}
          style={styles.searchBar}
        />
      </View>

      {/* Filtres catégories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <CategoryChip
          label="Tous"
          selected={!selectedCategory}
          onPress={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.name}
            selected={selectedCategory === cat.name}
            onPress={() => setSelectedCategory(
              selectedCategory === cat.name ? null : cat.name
            )}
          />
        ))}
      </ScrollView>

      {/* Filtres tri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.sortChip, selectedSort === option.value && styles.sortChipActive]}
            onPress={() => setSelectedSort(option.value)}
          >
            <Text style={[
              styles.sortLabel,
              selectedSort === option.value && styles.sortLabelActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtres occasion */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.occasionChip, !selectedOccasion && styles.occasionChipActive]}
          onPress={() => setSelectedOccasion(null)}
        >
          <Text style={[styles.occasionLabel, !selectedOccasion && styles.occasionLabelActive]}>
            Toutes occasions
          </Text>
        </TouchableOpacity>
        {OCCASIONS.map((occ) => (
          <TouchableOpacity
            key={occ}
            style={[styles.occasionChip, selectedOccasion === occ && styles.occasionChipActive]}
            onPress={() => setSelectedOccasion(selectedOccasion === occ ? null : occ)}
          >
            <Text style={[
              styles.occasionLabel,
              selectedOccasion === occ && styles.occasionLabelActive
            ]}>
              {occ}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Résultats */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>{products.length} résultat(s)</Text>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddToCart={addToCart}
              style={{ marginHorizontal: SIZES.lg }}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
              <Text style={styles.emptySubtext}>Essayez d'autres filtres</Text>
            </View>
          }
        />
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
    backgroundColor: COLORS.card,
    paddingTop: 60,
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  searchBar: {
    marginBottom: 0,
  },
  filterRow: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    maxHeight: 52,
  },
  sortRow: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.sm,
    maxHeight: 44,
  },
  sortChip: {
    paddingHorizontal: SIZES.sm + 4,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  sortLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sortLabelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  occasionChip: {
    paddingHorizontal: SIZES.sm + 4,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  occasionChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  occasionLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  occasionLabelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  resultHeader: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  resultCount: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingBottom: SIZES.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.md,
  },
  emptySubtext: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
});

export default CatalogScreen;
