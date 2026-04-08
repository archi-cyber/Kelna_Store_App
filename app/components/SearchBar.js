import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const SearchBar = ({ value, onChangeText, onSubmit, placeholder, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder || 'Rechercher un cadeau...'}
        placeholderTextColor={COLORS.textLight}
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  icon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
  },
});

export default SearchBar;
