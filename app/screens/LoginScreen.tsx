// app/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { login, User } from '../service/api';
import AppLogo from '../../components/AppLogo';
import { Palette, Radius, Spacing, FontSize, FontWeight } from '../../constants/theme';

type Props = { onLogin: (user: User) => void };

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [apartment, setApartment] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChangeApartment(text: string) {
    setApartment(text.replace(/\D/g, '')); // só números
  }

  async function handleLogin() {
    if (!apartment.trim()) {
      Alert.alert('Atenção', 'Informe o número do apartamento.');
      return;
    }
    try {
      setLoading(true);
      const user = await login(apartment.trim());
      onLogin(user);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível fazer o login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <View style={styles.container}>
        <AppLogo />

        <Text style={styles.title}>
          Cart<Text style={styles.titleAccent}>Key</Text>
        </Text>
        <Text style={styles.subtitle}>Digite o número do seu apartamento para entrar</Text>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="home-variant" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Ex: 101"
            placeholderTextColor={Palette.textFaint}
            value={apartment}
            onChangeText={handleChangeApartment}
            keyboardType="number-pad"
            maxLength={5}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            accessibilityLabel="Número do apartamento"
          />
        </View>

        <PrimaryButton
          label={loading ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={loading || !apartment.trim()}
        />

        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>Acesso gerencial</Text>
          <View style={styles.hintRow}>
            <MaterialCommunityIcons name="shield-account" size={18} color={Palette.primary} />
            <Text style={styles.hintText}>
              Admin: ap. <Text style={styles.hintCode}>000</Text>
            </Text>
          </View>
          <View style={styles.hintRow}>
            <MaterialCommunityIcons name="bell-ring" size={18} color={Palette.info} />
            <Text style={styles.hintText}>
              Portaria: ap. <Text style={styles.hintCode}>999</Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    backgroundColor: Palette.bg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    color: Palette.text,
    letterSpacing: -0.5,
  },
  titleAccent: { color: Palette.primary },
  subtitle: {
    fontSize: FontSize.md,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    color: Palette.textMuted,
    lineHeight: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Palette.primaryBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Palette.surface,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: FontSize.xl,
    color: Palette.text,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: FontWeight.bold,
  },
  hintBox: {
    marginTop: Spacing.xxl,
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.sm,
  },
  hintTitle: {
    color: Palette.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, justifyContent: 'center' },
  hintText: { color: Palette.textMuted, fontSize: FontSize.sm },
  hintCode: { color: Palette.primary, fontWeight: FontWeight.heavy, fontSize: FontSize.md },
});

export default LoginScreen;