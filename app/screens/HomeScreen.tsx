// app/screens/HomeScreen.tsx
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
} from '../service/api';
import { TOWERS, TowerId } from '../../constants/towers';

type Props = {
  user: User;
  onLogout: () => void;
};

const HomeScreen: React.FC<Props> = ({ user, onLogout }) => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const [currentTowerId, setCurrentTowerId] = useState<TowerId>('MAR');
  const [showTowerSelect, setShowTowerSelect] = useState(false);

  const currentTowerName =
    TOWERS.find((t) => t.id === currentTowerId)?.name ?? 'Torre selecionada';

  const myTowerName =
    status?.myCart &&
    TOWERS.find((t) => t.id === status.myCart!.towerId)?.name;

  async function loadStatus(towerId = currentTowerId) {
    try {
      setLoadingStatus(true);
      const data = await getStatus(user.apartment, towerId);
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

  async function handleUnlockWithTower(towerId: TowerId) {
    try {
      setLoadingAction(true);
      const updated = await unlockCart(user.apartment, towerId);
      setCurrentTowerId(towerId);
      setStatus(updated);

      if (updated.myCart && updated.myCart.towerId === towerId) {
        Alert.alert(
          'Carrinho liberado',
          `Carrinho #${updated.myCart.id} liberado na ${TOWERS.find(
            (t) => t.id === towerId
          )?.name}.`
        );
      } else if (updated.myCart && updated.myCart.towerId !== towerId) {
        Alert.alert(
          'Aviso',
          `Você já possui um carrinho em uso na ${TOWERS.find(
            (t) => t.id === updated.myCart!.towerId
          )?.name}.`
        );
      } else {
        Alert.alert(
          'Aviso',
          'Nenhum carrinho disponível nessa torre no momento.'
        );
      }

      setShowTowerSelect(false);
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
      const updated = await returnCart(user.apartment, currentTowerId);
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
      <Text style={styles.welcome}>Olá, ap. {user.apartment}</Text>

      {/* Status da torre selecionada */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da torre</Text>
        <Text style={styles.infoText}>Torre selecionada: {currentTowerName}</Text>

        {loadingStatus ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Text style={styles.infoText}>
              Carrinhos disponíveis:{' '}
              <Text style={styles.bold}>{status?.availableCarts ?? 0}</Text>
            </Text>

            {status?.availableCarts === 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.infoText}>
                  Nenhum carrinho disponível nesta torre.
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

            <PrimaryButton
              label="Alterar torre exibida"
              onPress={() => {
                // alterna torre para navegar status
                const idx = TOWERS.findIndex((t) => t.id === currentTowerId);
                const next = TOWERS[(idx + 1) % TOWERS.length];
                setCurrentTowerId(next.id);
                loadStatus(next.id);
              }}
              style={{ marginTop: 8, backgroundColor: '#ccc' }}
              textStyle={{ color: '#000' }}
            />
          </>
        )}
      </View>

      {/* Meu status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meu status</Text>
        {hasMyCart ? (
          <>
            <Text style={styles.infoText}>
              Você está com o carrinho #
              <Text style={styles.bold}>{status?.myCart?.id}</Text>
            </Text>
            {myTowerName && (
              <Text style={styles.infoText}>Torre: {myTowerName}</Text>
            )}
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

      {/* Resumo por torre */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carrinhos por torre</Text>
        {loadingStatus ? (
          <ActivityIndicator size="small" />
        ) : (
          status?.towersSummary.map((item) => (
            <Text key={item.towerId} style={styles.infoText}>
              {item.name}:{' '}
              <Text style={styles.bold}>{item.availableCarts}</Text> livre(s)
            </Text>
          ))
        )}
      </View>

      {/* Ações */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ações</Text>

        <PrimaryButton
          label="Destravar carrinho"
          onPress={() => setShowTowerSelect(true)}
          disabled={loadingAction}
        />

        {showTowerSelect && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.infoText}>Escolha a torre para destravar:</Text>
            {TOWERS.map((tower) => (
              <PrimaryButton
                key={tower.id}
                label={tower.name}
                onPress={() => handleUnlockWithTower(tower.id)}
                style={{ backgroundColor: '#444' }}
              />
            ))}
            <PrimaryButton
              label="Cancelar"
              onPress={() => setShowTowerSelect(false)}
              style={{ backgroundColor: '#ccc' }}
              textStyle={{ color: '#000' }}
            />
          </View>
        )}

        <PrimaryButton
          label="Atualizar status"
          onPress={() => loadStatus()}
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
