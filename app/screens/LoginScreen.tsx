import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { login, User } from '../service/api'; // ou ../services/api
import { TOWERS, TowerId } from '../../constants/towers';

type Props = {
  onLogin: (user: User) => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [apartment, setApartment] = useState('');
  const [selectedTower, setSelectedTower] = useState<TowerId>('MAR');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!apartment.trim()) {
      Alert.alert('Atenção', 'Informe o número do apartamento.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(apartment.trim(), selectedTower);
      onLogin(user);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível fazer o login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CartKey</Text>
      <Text style={styles.subtitle}>Entre com seus dados</Text>

      <Text style={styles.label}>Apartamento</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 101, 202, 15B"
        value={apartment}
        onChangeText={setApartment}
        keyboardType="default"
        autoCapitalize="characters"
      />

      <Text style={[styles.label, { marginTop: 16 }]}>Torre</Text>
      <View style={styles.towersContainer}>
        {TOWERS.map((tower) => {
          const selected = tower.id === selectedTower;
          return (
            <TouchableOpacity
              key={tower.id}
              style={[styles.towerButton, selected && styles.towerButtonSelected]}
              onPress={() => setSelectedTower(tower.id)}
            >
              <Text
                style={[
                  styles.towerButtonText,
                  selected && styles.towerButtonTextSelected,
                ]}
              >
                {tower.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        label={loading ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  towersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  towerButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 8,
  },
  towerButtonSelected: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  towerButtonText: {
    fontSize: 14,
    color: '#333',
  },
  towerButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LoginScreen;
