import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const ProductDetailScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    Alert.alert(
      'Ajouté au panier ! 🎉',
      `${product.name} x${quantity} a été ajouté à votre panier.`,
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < Math.floor(rating) ? 'star' : 'star-outline'}
          size={18}
          color={COLORS.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? COLORS.accent : COLORS.text}
            />
          </TouchableOpacity>

          {product.is_popular && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔥 Populaire</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{product.category_name || product.occasion}</Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingText}>{product.rating} / 5</Text>
          </View>

          <Text style={styles.price}>{product.price}€</Text>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.occasion && (
            <View style={styles.occasionContainer}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              <Text style={styles.occasionText}>Idéal pour : {product.occasion}</Text>
            </View>
          )}

          {/* Quantité */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton Ajouter au panier */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{(product.price * quantity).toFixed(2)}€</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={22} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SIZES.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  heartButton: {
    position: 'absolute',
    top: 50,
    right: SIZES.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  badge: {
    position: 'absolute',
    bottom: SIZES.md,
    left: SIZES.md,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSmall,
  },
  badgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: SIZES.caption,
  },
  infoContainer: {
    padding: SIZES.lg,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0ECFF',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    marginBottom: SIZES.sm,
  },
  categoryText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  stars: {
    flexDirection: 'row',
    marginRight: SIZES.sm,
  },
  ratingText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  price: {
    fontSize: SIZES.h1,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  descriptionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  description: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SIZES.md,
  },
  occasionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0ECFF',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.md,
  },
  occasionText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SIZES.sm,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.md,
    marginBottom: 120,
  },
  quantityLabel: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SIZES.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  totalContainer: {
    marginRight: SIZES.md,
  },
  totalLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: SIZES.body,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
