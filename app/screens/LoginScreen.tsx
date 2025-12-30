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
          placeholderTextColor="#999"
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
