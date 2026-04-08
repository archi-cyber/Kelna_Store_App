import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import orderService from '../services/orderService';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const SHIPPING_COST = 9.00;

const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des articles avant de commander.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Adresse requise', 'Veuillez entrer une adresse de livraison.');
      return;
    }

    Alert.alert(
      'Confirmer la commande',
      `Total : ${total.toFixed(2)}€\nLivraison à : ${address}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Commander',
          onPress: async () => {
            setLoading(true);
            try {
              const orderData = {
                items: cartItems.map(item => ({
                  product_id: item.id,
                  quantity: item.quantity,
                  price: item.price,
                })),
                shipping_address: address,
                total,
              };

              await orderService.createOrder(orderData);
              clearCart();
              Alert.alert(
                'Commande confirmée ! 🎉',
                'Votre commande a été passée avec succès.',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
              );
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de passer la commande.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Votre panier</Text>
        <Text style={styles.itemCount}>{cartItems.length} article(s)</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <Text style={styles.emptySubtext}>Découvrez nos surprises cadeaux</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Catalog')}
          >
            <Text style={styles.shopButtonText}>Parcourir le catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.addressSection}>
                <Text style={styles.sectionLabel}>Adresse de livraison</Text>
                <View style={styles.addressInput}>
                  <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
                  <TextInput
                    style={styles.addressTextInput}
                    placeholder="123 Rue Example, Paris"
                    placeholderTextColor={COLORS.textLight}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>
              </View>
            }
          />

          {/* Récapitulatif */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)}€</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>{shipping.toFixed(2)}€</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, loading && { opacity: 0.7 }]}
              onPress={handleCheckout}
              disabled={loading}
            >
              <Text style={styles.checkoutButtonText}>
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.secureText}>
              🔒 Paiement sécurisé par carte ou PayPal
            </Text>
          </View>
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
    backgroundColor: COLORS.card,
    paddingTop: 60,
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemCount: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: SIZES.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.md,
  },
  emptySubtext: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    marginBottom: SIZES.lg,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius,
  },
  shopButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: SIZES.body,
  },
  addressSection: {
    marginTop: SIZES.md,
  },
  sectionLabel: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  addressInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressTextInput: {
    flex: 1,
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
    marginLeft: SIZES.sm,
    minHeight: 40,
  },
  summary: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    padding: SIZES.lg,
    paddingBottom: 34,
    ...SHADOWS.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  summaryLabel: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.sm,
  },
  totalLabel: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.h4,
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.accent,
    height: 52,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: SIZES.body,
    fontWeight: '700',
  },
  secureText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
});

export default CartScreen;
