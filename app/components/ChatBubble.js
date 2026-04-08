import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../config/theme';

const ChatBubble = ({ message, isUser, timestamp }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={18} color="#FFF" />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <Text style={styles.aiLabel}>Assistant Kelna IA</Text>
        )}
        <Text style={[styles.message, isUser ? styles.userText : styles.aiText]}>
          {message}
        </Text>
        {timestamp && (
          <Text style={[styles.time, isUser ? styles.userTime : styles.aiTime]}>
            {timestamp}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
    marginTop: 4,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 2,
    borderRadius: SIZES.radiusLarge,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F0ECFF',
    borderBottomLeftRadius: 4,
  },
  aiLabel: {
    fontSize: SIZES.tiny,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  message: {
    fontSize: SIZES.bodySmall,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: COLORS.text,
  },
  time: {
    fontSize: SIZES.tiny,
    marginTop: SIZES.xs,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  aiTime: {
    color: COLORS.textLight,
  },
});

export default ChatBubble;
