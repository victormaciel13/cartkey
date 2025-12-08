import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import {
  getStatus,
  unlockCart,
  returnCart,
  StatusResponse,
  User,
} from '../service/api'; // ou ../services/api
import { TOWERS } from '../../constants/towers';

type Props = {
  user: User;
  onLogout: () => void;
};

const HomeScreen: React.FC<Props> = ({ user, onLogout }) => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const towerName =
    TOWERS.find((t) => t.id === user.towerId)?.name ?? 'Minha torre';

  async function loadStatus() {
    try {
      setLoadingStatus(true);
      const data = await getStatus(user.apartment, user.towerId);
      setStatus(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao carregar status dos carrinhos.');
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleUnlock() {
    try {
      setLoadingAction(true);
      const updated = await unlockCart(user.apartment, user.towerId);
      setStatus(updated);
      if (updated.myCart) {
        Alert.alert(
          'Carrinho liberado',
          `Você está com o carrinho #${updated.myCart.id} na ${towerName}.`
        );
      } else {
        Alert.alert(
          'Aviso',
          'Nenhum carrinho foi destravado. Pode ser que não haja disponível na sua torre.'
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao destravar carrinho.');
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleReturnCart() {
    try {
      setLoadingAction(true);
      const updated = await returnCart(user.apartment, user.towerId);
      setStatus(updated);
      Alert.alert('Sucesso', 'Carrinho devolvido com sucesso.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao devolver carrinho.');
    } finally {
      setLoadingAction(false);
    }
  }

  const hasMyCart = !!status?.myCart;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>
        Olá, ap. {user.apartment} – {towerName}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da sua torre</Text>

        {loadingStatus ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Text style={styles.infoText}>
              Carrinhos disponíveis na sua torre:{' '}
              <Text style={styles.bold}>{status?.availableCarts ?? 0}</Text>
            </Text>

            {status?.availableCarts === 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.infoText}>
                  Nenhum carrinho disponível na sua torre no momento.
                </Text>
                <Text style={[styles.infoText, { marginTop: 4 }]}>
                  Em uso pelos apartamentos:
                </Text>
                {status?.cartsInUse?.length ? (
                  status.cartsInUse.map((cart) => (
                    <Text key={cart.id} style={styles.listItem}>
                      • Carrinho #{cart.id} – Ap. {cart.apartment}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.listItem}>Nenhum registro</Text>
                )}
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meu status</Text>
        {hasMyCart ? (
          <>
            <Text style={styles.infoText}>
              Você está com o carrinho #<Text style={styles.bold}>{status?.myCart?.id}</Text>
            </Text>
            {status?.myCart?.since && (
              <Text style={styles.infoText}>Desde: {status.myCart.since}</Text>
            )}
            <PrimaryButton
              label={loadingAction ? 'Devolvendo...' : 'Devolver carrinho'}
              onPress={handleReturnCart}
              disabled={loadingAction}
            />
          </>
        ) : (
          <Text style={styles.infoText}>
            Você não está com nenhum carrinho no momento.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carrinhos por torre</Text>
        {loadingStatus ? (
          <ActivityIndicator size="small" />
        ) : (
          status?.towersSummary.map((item) => (
            <Text key={item.towerId} style={styles.infoText}>
              {item.name}: <Text style={styles.bold}>{item.availableCarts}</Text> livre(s)
            </Text>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ações</Text>
        <PrimaryButton
          label={loadingAction ? 'Processando...' : 'Destravar carrinho'}
          onPress={handleUnlock}
          disabled={loadingAction}
        />
        <PrimaryButton
          label="Atualizar status"
          onPress={loadStatus}
          style={{ marginTop: 8, backgroundColor: '#ccc' }}
          textStyle={{ color: '#000' }}
        />
        <PrimaryButton
          label="Sair"
          onPress={onLogout}
          style={{ marginTop: 8, backgroundColor: '#e63946' }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
  listItem: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
});

export default HomeScreen;
