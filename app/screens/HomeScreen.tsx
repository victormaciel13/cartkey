// app/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  getStatus,
  unlockCart,
  returnCart,
  StatusResponse,
  User,
} from '../service/api';
import { TOWERS, TowerId } from '../../constants/towers';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0A1628',
  card: '#0D1F3C',
  cardBorder: 'rgba(255,255,255,0.08)',
  teal: '#00C9A7',
  tealBg: 'rgba(0,201,167,0.12)',
  tealBorder: 'rgba(0,201,167,0.25)',
  blue: '#38BDF8',
  blueBg: 'rgba(56,189,248,0.08)',
  blueBorder: 'rgba(56,189,248,0.2)',
  orange: '#F59E0B',
  orangeBg: 'rgba(245,158,11,0.12)',
  orangeBorder: 'rgba(245,158,11,0.3)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.12)',
  redBorder: 'rgba(239,68,68,0.3)',
  green: '#22C55E',
  white: '#FFFFFF',
  muted: '#64748B',
  lightBlue: '#93C5FD',
  slate: '#CBD5E1',
};

// ─── Types ───────────────────────────────────────────────────────────────────
type Props = {
  user: User;
  onLogout: () => void;
};

// ─── Component ───────────────────────────────────────────────────────────────
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

  const hasMyCart = !!status?.myCart;
  const availableCarts = status?.availableCarts ?? 0;

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

  function handleCycleTower() {
    const idx = TOWERS.findIndex((t) => t.id === currentTowerId);
    const next = TOWERS[(idx + 1) % TOWERS.length];
    setCurrentTowerId(next.id);
    loadStatus(next.id);
  }

  async function handleUnlockWithTower(towerId: TowerId) {
    try {
      setLoadingAction(true);
      const updated = await unlockCart(user.apartment, towerId);
      setCurrentTowerId(towerId);
      setStatus(updated);
      if (updated.myCart && updated.myCart.towerId === towerId) {
        Alert.alert(
          'Carrinho liberado! 🛒',
          `Carrinho #${updated.myCart.id} liberado na ${TOWERS.find((t) => t.id === towerId)?.name}.`
        );
      } else if (updated.myCart && updated.myCart.towerId !== towerId) {
        Alert.alert(
          'Aviso',
          `Você já possui um carrinho em uso na ${TOWERS.find((t) => t.id === updated.myCart!.towerId)?.name}.`
        );
      } else {
        Alert.alert('Sem carrinhos', 'Nenhum carrinho disponível nessa torre no momento.');
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
      Alert.alert('Devolvido!', 'Carrinho devolvido com sucesso.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao devolver carrinho.');
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Bem-vindo de volta</Text>
            <Text style={styles.headerApt}>
              Ap. <Text style={styles.headerAptAccent}>{user.apartment}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>⎋</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          {/* ── Torre selecionada ───────────────────────────────────── */}
          <View style={styles.torreCard}>
            <Text style={styles.sectionLabel}>Torre selecionada</Text>
            <Text style={styles.torreName}>{currentTowerName}</Text>

            {loadingStatus ? (
              <ActivityIndicator color={C.teal} style={{ marginVertical: 12 }} />
            ) : (
              <View style={styles.torreCountRow}>
                <Text style={[styles.torreCount, availableCarts === 0 && styles.torreCountZero]}>
                  {availableCarts}
                </Text>
                <Text style={styles.torreCountLabel}>
                  carrinhos{'\n'}disponíveis
                </Text>
              </View>
            )}

            {/* Carrinhos em uso quando torre está cheia */}
            {!loadingStatus && availableCarts === 0 && status?.cartsInUse?.length ? (
              <View style={styles.inUseBox}>
                <Text style={styles.inUseTitle}>Em uso por:</Text>
                {status.cartsInUse.map((cart) => (
                  <Text key={cart.id} style={styles.inUseItem}>
                    • Carrinho #{cart.id} – Ap. {cart.apartment}
                  </Text>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={styles.alterarBtn} onPress={handleCycleTower} activeOpacity={0.7}>
              <Text style={styles.alterarBtnText}>Alterar torre exibida</Text>
            </TouchableOpacity>
          </View>

          {/* ── Meu status ─────────────────────────────────────────── */}
          <View style={[styles.statusCard, hasMyCart && styles.statusCardActive]}>
            <View style={[styles.statusIconWrap, hasMyCart && styles.statusIconWrapActive]}>
              <Text style={[styles.statusIconEmoji, hasMyCart && { color: C.teal }]}>🛒</Text>
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusLabel}>Meu status</Text>
              {hasMyCart ? (
                <>
                  <Text style={styles.statusVal}>
                    Carrinho <Text style={styles.statusValBold}>#{status?.myCart?.id}</Text>
                    {myTowerName ? ` · ${myTowerName}` : ''}
                  </Text>
                  {status?.myCart?.since && (
                    <Text style={styles.statusSince}>Desde {status.myCart.since}</Text>
                  )}
                </>
              ) : (
                <Text style={styles.statusVal}>Nenhum carrinho em uso</Text>
              )}
            </View>
            {hasMyCart && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Em uso</Text>
              </View>
            )}
          </View>

          {/* ── Carrinhos por torre ─────────────────────────────────── */}
          <View>
            <Text style={styles.sectionLabel}>Carrinhos por torre</Text>
            <View style={styles.torresGrid}>
              {loadingStatus
                ? TOWERS.map((t) => (
                    <View key={t.id} style={styles.torreMini}>
                      <Text style={styles.torreMiniName}>{t.name.replace('Torre ', '')}</Text>
                      <ActivityIndicator color={C.teal} size="small" />
                    </View>
                  ))
                : (status?.towersSummary ?? TOWERS.map((t) => ({ towerId: t.id, name: t.name, availableCarts: 0 }))).map((item) => (
                    <View key={item.towerId} style={styles.torreMini}>
                      <Text style={styles.torreMiniName}>
                        {item.name.replace('Torre ', '')}
                      </Text>
                      <Text style={[styles.torreMiniCount, item.availableCarts === 0 && styles.torreMiniCountZero]}>
                        {item.availableCarts}
                      </Text>
                      <Text style={styles.torreMiniSub}>livre(s)</Text>
                    </View>
                  ))}
            </View>
          </View>

          {/* ── Ações ──────────────────────────────────────────────── */}
          <View>
            <Text style={styles.sectionLabel}>Ações</Text>

            {!showTowerSelect ? (
              <TouchableOpacity
                style={[styles.btnAction, styles.btnDestravar, loadingAction && styles.btnDisabled]}
                onPress={() => setShowTowerSelect(true)}
                activeOpacity={0.8}
                disabled={loadingAction}
              >
                <Text style={styles.btnDestravLabel}>
                  {loadingAction ? 'Aguarde...' : '🔓  Destravar carrinho'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.towerSelectBox}>
                <Text style={styles.towerSelectTitle}>Escolha a torre:</Text>
                {TOWERS.map((tower) => (
                  <TouchableOpacity
                    key={tower.id}
                    style={[styles.btnAction, styles.btnTorre, loadingAction && styles.btnDisabled]}
                    onPress={() => handleUnlockWithTower(tower.id)}
                    activeOpacity={0.8}
                    disabled={loadingAction}
                  >
                    <Text style={styles.btnTorreLabel}>{tower.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.btnAction, styles.btnCancelar]}
                  onPress={() => setShowTowerSelect(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnCancelarLabel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.btnAction,
                hasMyCart ? styles.btnDevolver : styles.btnDevolverDisabled,
                (loadingAction || !hasMyCart) && styles.btnDisabled,
              ]}
              onPress={handleReturnCart}
              activeOpacity={0.8}
              disabled={loadingAction || !hasMyCart}
            >
              <Text style={[styles.btnDevolverLabel, !hasMyCart && { color: C.muted }]}>
                🔄  Devolver carrinho
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, styles.btnAtualizar]}
              onPress={() => loadStatus()}
              activeOpacity={0.8}
              disabled={loadingStatus}
            >
              <Text style={styles.btnAtualizarLabel}>
                {loadingStatus ? 'Atualizando...' : '↻  Atualizar status'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: C.card,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: C.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerGreeting: {
    fontSize: 12,
    color: C.muted,
    letterSpacing: 0.3,
  },
  headerApt: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    marginTop: 2,
  },
  headerAptAccent: {
    color: C.teal,
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.redBg,
    borderWidth: 0.5,
    borderColor: C.redBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 18,
    color: C.red,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: C.muted,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  torreCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
  },
  torreName: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    marginBottom: 10,
  },
  torreCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  torreCount: {
    fontSize: 48,
    fontWeight: '700',
    color: C.teal,
    lineHeight: 52,
  },
  torreCountZero: {
    color: C.red,
  },
  torreCountLabel: {
    fontSize: 13,
    color: C.lightBlue,
    lineHeight: 18,
  },
  inUseBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.redBorder,
  },
  inUseTitle: {
    fontSize: 12,
    color: C.red,
    fontWeight: '600',
    marginBottom: 4,
  },
  inUseItem: {
    fontSize: 13,
    color: '#FDA4AF',
    marginLeft: 4,
    marginTop: 2,
  },
  alterarBtn: {
    backgroundColor: C.tealBg,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
    paddingVertical: 11,
    alignItems: 'center',
  },
  alterarBtnText: {
    color: C.teal,
    fontSize: 13,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statusCardActive: {
    borderColor: C.tealBorder,
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(100,116,139,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(100,116,139,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusIconWrapActive: {
    backgroundColor: C.tealBg,
    borderColor: C.tealBorder,
  },
  statusIconEmoji: {
    fontSize: 20,
    color: C.muted,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: C.muted,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  statusVal: {
    fontSize: 14,
    color: C.slate,
  },
  statusValBold: {
    fontWeight: '700',
    color: C.white,
  },
  statusSince: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: C.tealBg,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
  },
  statusBadgeText: {
    fontSize: 11,
    color: C.teal,
    fontWeight: '600',
  },
  torresGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  torreMini: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  torreMiniName: {
    fontSize: 11,
    color: C.muted,
    marginBottom: 4,
  },
  torreMiniCount: {
    fontSize: 26,
    fontWeight: '700',
    color: C.teal,
    lineHeight: 30,
    marginBottom: 2,
  },
  torreMiniCountZero: {
    color: C.red,
  },
  torreMiniSub: {
    fontSize: 10,
    color: 'rgba(100,116,139,0.7)',
  },
  btnAction: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnDestravar: {
    backgroundColor: C.teal,
  },
  btnDestravLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A1628',
  },
  btnDevolver: {
    backgroundColor: C.orangeBg,
    borderWidth: 0.5,
    borderColor: C.orangeBorder,
  },
  btnDevolverDisabled: {
    backgroundColor: 'rgba(100,116,139,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(100,116,139,0.15)',
  },
  btnDevolverLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.orange,
  },
  btnAtualizar: {
    backgroundColor: C.blueBg,
    borderWidth: 0.5,
    borderColor: C.blueBorder,
    paddingVertical: 12,
  },
  btnAtualizarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.blue,
  },
  towerSelectBox: {
    backgroundColor: 'rgba(13,31,60,0.8)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
    marginBottom: 10,
  },
  towerSelectTitle: {
    fontSize: 12,
    color: C.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  btnTorre: {
    backgroundColor: C.tealBg,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
    paddingVertical: 13,
  },
  btnTorreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.teal,
  },
  btnCancelar: {
    backgroundColor: 'rgba(100,116,139,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(100,116,139,0.2)',
    paddingVertical: 11,
    marginBottom: 0,
  },
  btnCancelarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.muted,
  },
});

export default HomeScreen;