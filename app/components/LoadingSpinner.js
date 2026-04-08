import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../config/theme';

const LoadingSpinner = ({ message, size = 'large', color }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  message: {
    marginTop: SIZES.md,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
