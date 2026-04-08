import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

// Mapping des types de notifications vers leurs styles
const NOTIFICATION_TYPES = {
  order: {
    icon: 'cube-outline',
    color: COLORS.success,
    bgColor: '#E8F8EF',
  },
  ai: {
    icon: 'sparkles-outline',
    color: COLORS.primary,
    bgColor: '#F0ECFF',
  },
  promo: {
    icon: 'pricetag-outline',
    color: COLORS.accent,
    bgColor: '#FFE4ED',
  },
  message: {
    icon: 'chatbubble-outline',
    color: '#4A90D9',
    bgColor: '#E3F2FD',
  },
  shipping: {
    icon: 'car-outline',
    color: COLORS.warning,
    bgColor: '#FFF4E5',
  },
  default: {
    icon: 'notifications-outline',
    color: COLORS.textSecondary,
    bgColor: COLORS.background,
  },
};

const NotificationItem = ({ notification, onPress, onDelete }) => {
  const type = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.default;

  return (
    <TouchableOpacity
      style={[styles.container, !notification.read && styles.unreadContainer]}
      onPress={() => onPress?.(notification)}
      activeOpacity={0.7}
    >
      {/* Indicateur non lu (barre colorée à gauche) */}
      {!notification.read && <View style={styles.unreadIndicator} />}

      {/* Icône */}
      <View style={[styles.iconContainer, { backgroundColor: type.bgColor }]}>
        <Ionicons
          name={notification.icon || type.icon}
          size={22}
          color={notification.color || type.color}
        />
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, !notification.read && styles.titleUnread]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.dot} />}
        </View>

        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>

        <View style={styles.footer}>
          <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
          <Text style={styles.time}>{notification.time}</Text>
        </View>
      </View>

      {/* Bouton supprimer */}
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(notification)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  unreadContainer: {
    backgroundColor: '#FDFCFF',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.primary,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    flex: 1,
    fontSize: SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
  },
  titleUnread: {
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.sm,
  },
  body: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SIZES.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  time: {
    fontSize: SIZES.tiny,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  deleteButton: {
    padding: SIZES.xs,
    marginLeft: SIZES.xs,
    alignSelf: 'flex-start',
  },
});

export default NotificationItem;