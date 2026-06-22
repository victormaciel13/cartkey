// app/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, StatusBar, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import TowerPicker from '../../components/TowerPicker';
import { signUp, User } from '../service/api';
import { TowerId } from '../../constants/towers';
import { Palette, Radius, Spacing, FontSize, FontWeight } from '../../constants/theme';

type Props = {
  onSignup: (user: User) => void;
  onGoToLogin: () => void;
};

const SignupScreen: React.FC<Props> = ({ onSignup, onGoToLogin }) => {
  const [towerId, setTowerId] = useState<TowerId>('MAR');
  const [apartment, setApartment] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!apartment.trim() || !fullName.trim() || !password || !accessCode.trim()) {
      Alert.alert('Atencao', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atencao', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      const user = await signUp({
        towerId,
        apartment: apartment.trim(),
        password,
        fullName: fullName.trim(),
        accessCode: accessCode.trim(),
      });
      onSignup(user);
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Nao foi possivel cadastrar.');
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Cadastre o seu apartamento no CartKey</Text>

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
          <MaterialCommunityIcons name="account" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={Palette.textFaint}
            value={fullName}
            onChangeText={setFullName}
            accessibilityLabel="Nome completo"
          />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="lock" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Senha (min. 6 caracteres)"
            placeholderTextColor={Palette.textFaint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            accessibilityLabel="Senha"
          />
          <TouchableOpacity onPress={() => setShowPass((v) => !v)} accessibilityLabel={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
            <MaterialCommunityIcons name={showPass ? 'eye-off' : 'eye'} size={22} color={Palette.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="key-variant" size={22} color={Palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Codigo do condominio"
            placeholderTextColor={Palette.textFaint}
            value={accessCode}
            onChangeText={setAccessCode}
            autoCapitalize="characters"
            accessibilityLabel="Codigo do condominio"
          />
        </View>

        <PrimaryButton
          label={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleSignup}
          disabled={loading}
        />

        <TouchableOpacity style={styles.linkBtn} onPress={onGoToLogin} accessibilityRole="button">
          <Text style={styles.linkText}>Ja tem conta? <Text style={styles.linkAccent}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.bg },
  container: { padding: Spacing.xl, paddingTop: 64, paddingBottom: 40 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, textAlign: 'center', color: Palette.text, letterSpacing: -0.5 },
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

export default SignupScreen;