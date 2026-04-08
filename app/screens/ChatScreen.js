import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, KeyboardAvoidingView,
  Platform, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const ChatScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { conversationId, receiverId, receiverName, receiverAvatar } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const stopPollingRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      // Rafraîchir automatiquement toutes les 3 secondes
      stopPollingRef.current = chatService.pollMessages(
        conversationId,
        (newMessages) => setMessages(newMessages),
        3000
      );
    } else {
      setLoading(false);
    }

    return () => {
      if (stopPollingRef.current) stopPollingRef.current();
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Erreur messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (imageUrl = null) => {
    if ((!input.trim() && !imageUrl) || sending) return;

    const messageContent = input.trim() || '📷 Photo';
    setInput('');
    setSending(true);

    // Optimistic update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      content: messageContent,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await chatService.sendMessage(receiverId, messageContent, imageUrl);
      // Recharger pour avoir l'ID réel
      await loadMessages();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message.');
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Dans une vraie app, tu uploaderais l'image sur ton serveur ici
      // Pour l'instant on passe juste l'URI locale
      sendMessage(result.assets[0].uri);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender_id === user.id;
    const time = new Date(item.created_at).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.otherRow]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={styles.messageImage} />
          )}
          {item.content && item.content !== '📷 Photo' && (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.otherText]}>
              {item.content}
            </Text>
          )}
          <Text style={[styles.messageTime, isUser ? styles.userTime : styles.otherTime]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          {receiverAvatar ? (
            <Image source={{ uri: receiverAvatar }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
          )}
          <View>
            <Text style={styles.headerName}>{receiverName || 'Utilisateur'}</Text>
            <Text style={styles.headerStatus}>En ligne</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {loading ? (
        <LoadingSpinner message="Chargement des messages..." />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Aucun message</Text>
              <Text style={styles.emptySubtext}>Envoyez le premier message !</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Tapez votre message..."
          placeholderTextColor={COLORS.textLight}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || sending}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: COLORS.primary,
    paddingTop: 54,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  backButton: {
    padding: SIZES.sm,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.sm,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  headerName: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: '#FFF',
  },
  headerStatus: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  moreButton: {
    padding: SIZES.sm,
  },
  messagesList: {
    padding: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SIZES.sm,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xs,
    alignSelf: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusLarge,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
    ...SHADOWS.small,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.xs,
  },
  messageText: {
    fontSize: SIZES.bodySmall,
    lineHeight: 20,
  },
  userText: {
    color: '#FFF',
  },
  otherText: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: SIZES.tiny,
    marginTop: 2,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherTime: {
    color: COLORS.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
  },
  emptySubtext: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
    paddingBottom: Platform.OS === 'ios' ? 30 : SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    padding: SIZES.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusLarge,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
});

export default ChatScreen;