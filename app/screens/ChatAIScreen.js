import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, KeyboardAvoidingView,
  Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from '../components/ChatBubble';
import aiService from '../services/aiService';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

const QUICK_SUGGESTIONS = [
  'Pour anniversaire',
  'Moins de 50€',
  'Cadeau tech',
  'Idée originale',
  'Pour ma mère',
  'Cadeau luxe',
];

const ChatAIScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      message: 'Bonjour ! 👋 Je suis l\'assistant Kelna IA. Je peux vous aider à trouver le cadeau parfait. Pour qui cherchez-vous un cadeau ?',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await aiService.getChatHistory();
      if (history && history.length > 0) {
        const formattedHistory = history.map((msg, index) => ({
          id: `hist-${index}`,
          role: msg.role,
          message: msg.message,
          timestamp: new Date(msg.created_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setMessages(prev => [...prev, ...formattedHistory]);
      }
    } catch (error) {
      // Silently fail - first time user
    }
  };

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      message: messageText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.sendMessage(messageText);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: response,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: 'Désolé, je rencontre un problème technique. Réessayez dans quelques instants.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <ChatBubble
      message={item.message}
      isUser={item.role === 'user'}
      timestamp={item.timestamp}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistant Kelna IA</Text>
            <Text style={styles.headerStatus}>
              {loading ? 'En train d\'écrire...' : 'En ligne'}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Suggestions rapides */}
      {messages.length <= 2 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={QUICK_SUGGESTIONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => sendMessage(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.suggestionsList}
          />
        </View>
      )}

      {/* Loading indicator */}
      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typingText}>L'IA réfléchit...</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Tapez votre message..."
          placeholderTextColor={COLORS.textLight}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
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
    marginRight: SIZES.sm,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: '#FFF',
  },
  headerStatus: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  messagesList: {
    paddingVertical: SIZES.md,
  },
  suggestionsContainer: {
    paddingBottom: SIZES.sm,
  },
  suggestionsList: {
    paddingHorizontal: SIZES.md,
  },
  suggestionChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  suggestionText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xs,
  },
  typingText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginLeft: SIZES.sm,
    fontStyle: 'italic',
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
    marginRight: SIZES.xs,
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

export default ChatAIScreen;
