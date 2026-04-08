import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, ScrollView, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const SORT_OPTIONS = [
  { label: 'Plus récents', value: 'recent', icon: 'time-outline' },
  { label: 'Prix croissant', value: 'price_asc', icon: 'arrow-up-outline' },
  { label: 'Prix décroissant', value: 'price_desc', icon: 'arrow-down-outline' },
  { label: 'Mieux notés', value: 'rating', icon: 'star-outline' },
  { label: 'Plus populaires', value: 'popular', icon: 'flame-outline' },
];

const OCCASIONS = [
  'Anniversaire',
  'Noël',
  'Saint-Valentin',
  'Fête des mères',
  'Toute occasion',
];

const FilterBar = ({ categories = [], filters = {}, onApply, onReset }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const openModal = () => {
    setLocalFilters(filters);
    setModalVisible(true);
  };

  const handleApply = () => {
    onApply?.(localFilters);
    setModalVisible(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      category: null,
      occasion: null,
      sort: 'recent',
      min_price: '',
      max_price: '',
    };
    setLocalFilters(emptyFilters);
    onReset?.();
  };

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Compter les filtres actifs pour afficher un badge
  const activeCount = Object.keys(filters).filter(key => {
    if (key === 'sort') return filters[key] && filters[key] !== 'recent';
    return filters[key];
  }).length;

  return (
    <>
      {/* Barre de filtres compacte */}
      <View style={styles.bar}>
        <TouchableOpacity style={styles.filterButton} onPress={openModal}>
          <Ionicons name="options-outline" size={20} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>Filtres</Text>
          {activeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {activeCount > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="close-circle" size={16} color={COLORS.accent} />
            <Text style={styles.resetText}>Réinitialiser</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de filtres */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Tri */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trier par</Text>
                {SORT_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionRow,
                      localFilters.sort === option.value && styles.optionRowActive,
                    ]}
                    onPress={() => updateFilter('sort', option.value)}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={localFilters.sort === option.value ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        localFilters.sort === option.value && styles.optionLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {localFilters.sort === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Catégories */}
              {categories.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Catégorie</Text>
                  <View style={styles.chipsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.chip,
                        !localFilters.category && styles.chipActive,
                      ]}
                      onPress={() => updateFilter('category', null)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          !localFilters.category && styles.chipTextActive,
                        ]}
                      >
                        Toutes
                      </Text>
                    </TouchableOpacity>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat.id || cat.name}
                        style={[
                          styles.chip,
                          localFilters.category === cat.name && styles.chipActive,
                        ]}
                        onPress={() => updateFilter('category', cat.name)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            localFilters.category === cat.name && styles.chipTextActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Occasion */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Occasion</Text>
                <View style={styles.chipsContainer}>
                  {OCCASIONS.map(occ => (
                    <TouchableOpacity
                      key={occ}
                      style={[
                        styles.chip,
                        localFilters.occasion === occ && styles.chipActive,
                      ]}
                      onPress={() =>
                        updateFilter('occasion', localFilters.occasion === occ ? null : occ)
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          localFilters.occasion === occ && styles.chipTextActive,
                        ]}
                      >
                        {occ}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Prix */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prix (€)</Text>
                <View style={styles.priceRow}>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Min</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={String(localFilters.min_price || '')}
                      onChangeText={(v) => updateFilter('min_price', v)}
                      placeholder="0"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.priceSeparator}>—</Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Max</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={String(localFilters.max_price || '')}
                      onChangeText={(v) => updateFilter('max_price', v)}
                      placeholder="500"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>

            {/* Footer boutons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButtonLarge} onPress={handleReset}>
                <Text style={styles.resetButtonLargeText}>Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.background,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  filterButtonText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SIZES.xs,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
  },
  resetText: {
    fontSize: SIZES.caption,
    color: COLORS.accent,
    marginLeft: 4,
    fontWeight: '500',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingTop: SIZES.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm + 2,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.xs,
  },
  optionRowActive: {
    backgroundColor: '#F0ECFF',
  },
  optionLabel: {
    flex: 1,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SIZES.sm,
    fontWeight: '500',
  },
  optionLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: SIZES.caption,
    color: COLORS.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  priceInput: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 2,
    fontSize: SIZES.body,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceSeparator: {
    fontSize: SIZES.h3,
    color: COLORS.textLight,
    marginHorizontal: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SIZES.lg,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  resetButtonLarge: {
    flex: 1,
    height: 52,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  resetButtonLargeText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    height: 52,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  applyButtonText: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default FilterBar;