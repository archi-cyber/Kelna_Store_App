import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>{item.price}€</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
        <Text style={styles.subtotal}>
          {(item.price * item.quantity).toFixed(2)}€
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
    marginBottom: SIZES.sm,
    ...SHADOWS.small,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: SIZES.sm,
    justifyContent: 'center',
  },
  name: {
    fontSize: SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  price: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SIZES.md,
  },
  right: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: SIZES.sm,
  },
  deleteBtn: {
    padding: SIZES.xs,
  },
  subtotal: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default CartItem;
