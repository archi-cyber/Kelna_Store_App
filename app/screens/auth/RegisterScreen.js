import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const result = await register(username.trim(), email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur d\'inscription', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="gift" size={40} color="#FFF" />
          </View>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté Kelna</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={COLORS.textLight}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={COLORS.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              Déjà un compte ?{' '}
              <Text style={styles.linkBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: SIZES.sm,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.bodySmall,
    color: 'rgba(255,255,255,0.8)',
  },
  form: {
    flex: 1,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  inputIcon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.sm,
    ...SHADOWS.large,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: SIZES.h4,
    fontWeight: '700',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  linkText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
