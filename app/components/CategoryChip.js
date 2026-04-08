import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../config/theme';

const CategoryChip = ({ label, selected, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.text,
  },
  labelSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default CategoryChip;
