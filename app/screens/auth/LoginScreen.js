import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur de connexion', result.message);
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
          <View style={styles.logoContainer}>
            <Ionicons name="gift" size={48} color="#FFF" />
          </View>
          <Text style={styles.title}>Kelna Store</Text>
          <Text style={styles.subtitle}>Osez la surprise, vivez l'exceptionnel</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Connexion</Text>

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
              autoCorrect={false}
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
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Pas encore de compte ?{' '}
              <Text style={styles.linkBold}>S'inscrire</Text>
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
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
  form: {
    flex: 1,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  formTitle: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.lg,
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

export default LoginScreen;
