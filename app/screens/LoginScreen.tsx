// app/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { login, User } from '../service/api';
import AppLogo from '../../components/AppLogo';

type Props = {
  onLogin: (user: User) => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [apartment, setApartment] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChangeApartment(text: string) {
    // 🔢 mantém apenas números: remove letras, espaços, símbolos etc.
    const onlyNumbers = text.replace(/\D/g, '');
    setApartment(onlyNumbers);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <AppLogo />

        <Text style={styles.title}>CartKey</Text>
        <Text style={styles.subtitle}>Digite o número do seu apartamento</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 101, 202, 1503"
          placeholderTextColor="#7a98b8"
          value={apartment}
          onChangeText={handleChangeApartment}
          keyboardType="number-pad"   // 🔢 teclado só de números
          maxLength={5}               // ajuste se precisar de mais dígitos
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <PrimaryButton
          label={loading ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={loading || !apartment.trim()}
        />

        {/* Dica de acesso gerencial */}
        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>Acesso Gerencial</Text>
          <Text style={styles.hintRow}>🔑 Admin: ap. <Text style={styles.hintCode}>000</Text></Text>
          <Text style={styles.hintRow}>🛎 Portaria: ap. <Text style={styles.hintCode}>999</Text></Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#001a33',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#e8f0f7',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#7a98b8',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,119,182,0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 18,
    marginBottom: 16,
    backgroundColor: '#002a50',
    color: '#e8f0f7',
    textAlign: 'center',
    letterSpacing: 4,
  },
  hintBox: {
    marginTop: 32,
    backgroundColor: '#002a50',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,119,182,0.3)',
    alignItems: 'center',
    gap: 4,
  },
  hintTitle: {
    color: '#7a98b8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  hintRow: {
    color: '#7a98b8',
    fontSize: 13,
  },
  hintCode: {
    color: '#00f5d4',
    fontWeight: '800',
  },
});

export default LoginScreen;