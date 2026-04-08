import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const MENU_ITEMS = [
  { icon: 'receipt-outline', label: 'Historique des commandes', screen: 'OrderHistory' },
  { icon: 'chatbubbles-outline', label: 'Messages', screen: 'ChatAI' },
  { icon: 'heart-outline', label: 'Favoris', screen: 'Favorites' },
  { icon: 'settings-outline', label: 'Paramètres', screen: 'Settings' },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
      setOrdersCount(data.length);
    } catch (error) {
      // Silently fail
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleMenuPress = (item) => {
  if (item.screen === 'ChatAI') {
    navigation.navigate('ChatAI');
  } else if (item.screen === 'Favorites') {
    navigation.navigate('Favorites');
  } else if (item.screen === 'OrderHistory') {
    if (orders.length === 0) {
      Alert.alert('Historique', 'Vous n\'avez pas encore de commandes.');
    } else {
      Alert.alert(
        'Historique des commandes',
        `Vous avez ${ordersCount} commande(s).\n\nDernière commande : ${orders[0]?.total?.toFixed(2)}€ - ${orders[0]?.status}`
      );
    }
  } else {
    Alert.alert('Bientôt disponible', 'Cette fonctionnalité arrive prochainement !');
  }
};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.username || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{ordersCount}</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Avis</Text>
          </View>
        </View>
      </View>

      {/* Notifications preview */}
      <TouchableOpacity
        style={styles.notifCard}
        onPress={() => navigation.navigate('Notifications')}
      >
        <View style={styles.notifIconContainer}>
          <Ionicons name="notifications" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.notifTextContainer}>
          <Text style={styles.notifTitle}>Notifications</Text>
          <Text style={styles.notifSubtitle}>Voir vos dernières notifications</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </TouchableOpacity>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Menu</Text>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: SIZES.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: SIZES.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SIZES.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  statValue: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: '#FFF',
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.lg,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  notifIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  notifTextContainer: {
    flex: 1,
  },
  notifTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  notifSubtitle: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.lg,
  },
  menuSectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
    ...SHADOWS.small,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.xl,
    height: 52,
    borderRadius: SIZES.radius,
  },
  logoutText: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default ProfileScreen;
