import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

// Notifications de démonstration
const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Votre commande est en route',
    body: 'Livraison prévue aujourd\'hui entre 14h-16h',
    time: 'Il y a 2h',
    read: false,
    icon: 'cube-outline',
    color: COLORS.success,
  },
  {
    id: '2',
    type: 'ai',
    title: 'Nouveau message',
    body: 'L\'assistant IA vous a suggéré 3 cadeaux',
    time: 'Il y a 5h',
    read: false,
    icon: 'sparkles-outline',
    color: COLORS.primary,
  },
  {
    id: '3',
    type: 'promo',
    title: 'Promotion spéciale',
    body: '-20% sur les produits tech ce week-end',
    time: 'Hier',
    read: true,
    icon: 'pricetag-outline',
    color: COLORS.accent,
  },
  {
    id: '4',
    type: 'order',
    title: 'Commande confirmée',
    body: 'Votre commande #1234 a été confirmée',
    time: 'Il y a 2 jours',
    read: true,
    icon: 'checkmark-circle-outline',
    color: COLORS.success,
  },
  {
    id: '5',
    type: 'promo',
    title: 'Nouvelles arrivées',
    body: 'Découvrez nos nouveaux coffrets cadeaux de printemps',
    time: 'Il y a 3 jours',
    read: true,
    icon: 'gift-outline',
    color: COLORS.warning,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.notifUnread]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DEMO_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingTop: 56,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  backButton: {
    padding: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  markAllRead: {
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    padding: SIZES.lg,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  notifUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.sm,
  },
  notifBody: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: SIZES.tiny,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  separator: {
    height: SIZES.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: SIZES.h4,
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
  },
});

export default NotificationsScreen;
