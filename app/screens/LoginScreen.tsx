// app/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, StatusBar, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import TowerPicker from '../../components/TowerPicker';
import AppLogo from '../../components/AppLogo';
import { login, User } from '../service/api';
import { TowerId } from '../../constants/towers';
import { Palette, Radius, Spacing, FontSize, FontWeight } from '../../constants/theme';

type Props = {
  onLogin: (user: User) => void;
  onGoToSignup: () => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin, onGoToSignup }) => {
  const [towerId, setTowerId] = useState<TowerId>('MAR');
  const [apartment, setApartment] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!apartment.trim() || !password) {
      Alert.alert('Atencao', 'Preencha o apartamento e a senha.');
      return;
    }
    try {
      setLoading(true);
      const user = await login({ towerId, apartment: apartment.trim(), password });
      onLogin(user);
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppLogo />
        <Text style={styles.title}>Cart<Text style={styles.titleAccent}>Key</Text></Text>
        <Text style={styles.subtitle}>Entre com a sua torre e apartamento</Text>

        <TowerPicker value={towerId} onChange={setTowerId} />

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="home-variant" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Apartamento (ex: 101)"
            placeholderTextColor={Palette.textFaint}
            value={apartment}
            onChangeText={(t) => setApartment(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={5}
            accessibilityLabel="Numero do apartamento"
          />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="lock" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={Palette.textFaint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            accessibilityLabel="Senha"
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setShowPass((v) => !v)} accessibilityLabel={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
            <MaterialCommunityIcons name={showPass ? 'eye-off' : 'eye'} size={22} color={Palette.textMuted} />
          </TouchableOpacity>
        </View>

        <PrimaryButton
          label={loading ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={loading || !apartment.trim() || !password}
        />

        <TouchableOpacity style={styles.linkBtn} onPress={onGoToSignup} accessibilityRole="button">
          <Text style={styles.linkText}>Nao tem conta? <Text style={styles.linkAccent}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.bg },
  container: { padding: Spacing.xl, paddingTop: 64, paddingBottom: 40 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, textAlign: 'center', color: Palette.text, letterSpacing: -0.5 },
  titleAccent: { color: Palette.primary },
  subtitle: { fontSize: FontSize.md, textAlign: 'center', color: Palette.textMuted, marginTop: Spacing.xs, marginBottom: Spacing.xl, lineHeight: 24 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1.5, borderColor: Palette.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, backgroundColor: Palette.surface, marginBottom: Spacing.md,
  },
  input: { flex: 1, paddingVertical: 15, fontSize: FontSize.lg, color: Palette.text },
  linkBtn: { alignItems: 'center', paddingVertical: Spacing.md, marginTop: Spacing.xs },
  linkText: { color: Palette.textMuted, fontSize: FontSize.md },
  linkAccent: { color: Palette.primary, fontWeight: FontWeight.bold },
});

export default LoginScreen;