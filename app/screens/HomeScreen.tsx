// app/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, ActivityIndicator,
  ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStatus, unlockCart, returnCart, StatusResponse, User } from '../service/api';
import { TOWERS, TowerId } from '../../constants/towers';
import {
  Palette, Radius, Spacing, FontSize, FontWeight, A11y, Shadow,
} from '../../constants/theme';

type Props = { user: User; onLogout: () => void };

const HomeScreen: React.FC<Props> = ({ user, onLogout }) => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [currentTowerId, setCurrentTowerId] = useState<TowerId>('MAR');
  const [showTowerSelect, setShowTowerSelect] = useState(false);

  const currentTowerName = TOWERS.find((t) => t.id === currentTowerId)?.name ?? 'Torre selecionada';
  const myTowerName = status?.myCart && TOWERS.find((t) => t.id === status.myCart!.towerId)?.name;
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

  useEffect(() => { loadStatus(); }, []);

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
        Alert.alert('Carrinho liberado! 🛒', `Carrinho #${updated.myCart.id} liberado na ${TOWERS.find((t) => t.id === towerId)?.name}.`);
      } else if (updated.myCart && updated.myCart.towerId !== towerId) {
        Alert.alert('Aviso', `Você já possui um carrinho em uso na ${TOWERS.find((t) => t.id === updated.myCart!.towerId)?.name}.`);
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
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgElevated} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot}>
              <MaterialCommunityIcons name="cart-outline" size={22} color={Palette.primary} />
            </View>
            <View>
              <Text style={styles.headerGreeting}>Bem-vindo de volta</Text>
              <Text style={styles.headerApt}>
                Apartamento <Text style={styles.headerAptAccent}>{user.apartment}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Sair"
          >
            <MaterialCommunityIcons name="logout" size={22} color={Palette.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          {/* ── Torre selecionada ── */}
          <View style={styles.torreCard}>
            <Text style={styles.sectionLabel}>Torre selecionada</Text>
            <Text style={styles.torreName}>{currentTowerName}</Text>

            {loadingStatus ? (
              <ActivityIndicator color={Palette.primary} style={{ marginVertical: 14 }} />
            ) : (
              <View style={styles.torreCountRow}>
                <Text style={[styles.torreCount, availableCarts === 0 && styles.torreCountZero]}>{availableCarts}</Text>
                <Text style={styles.torreCountLabel}>carrinhos{'\n'}disponíveis</Text>
              </View>
            )}

            {!loadingStatus && availableCarts === 0 && status?.cartsInUse?.length ? (
              <View style={styles.inUseBox}>
                <Text style={styles.inUseTitle}>Em uso por:</Text>
                {status.cartsInUse.map((cart) => (
                  <Text key={cart.id} style={styles.inUseItem}>• Carrinho #{cart.id} – Ap. {cart.apartment}</Text>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={styles.alterarBtn} onPress={handleCycleTower} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Alterar torre exibida">
              <MaterialCommunityIcons name="swap-horizontal" size={18} color={Palette.primary} />
              <Text style={styles.alterarBtnText}>Alterar torre exibida</Text>
            </TouchableOpacity>
          </View>

          {/* ── Meu status ── */}
          <View style={[styles.statusCard, hasMyCart && styles.statusCardActive]}>
            <View style={[styles.statusIconWrap, hasMyCart && styles.statusIconWrapActive]}>
              <MaterialCommunityIcons name="cart" size={26} color={hasMyCart ? Palette.primary : Palette.textMuted} />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusLabel}>Meu status</Text>
              {hasMyCart ? (
                <>
                  <Text style={styles.statusVal}>
                    Carrinho <Text style={styles.statusValBold}>#{status?.myCart?.id}</Text>
                    {myTowerName ? ` · ${myTowerName}` : ''}
                  </Text>
                  {status?.myCart?.since && <Text style={styles.statusSince}>Desde {status.myCart.since}</Text>}
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

          {/* ── Carrinhos por torre ── */}
          <View>
            <Text style={styles.sectionLabel}>Carrinhos por torre</Text>
            <View style={styles.torresGrid}>
              {loadingStatus
                ? TOWERS.map((t) => (
                    <View key={t.id} style={styles.torreMini}>
                      <Text style={styles.torreMiniName}>{t.name.replace('Torre ', '')}</Text>
                      <ActivityIndicator color={Palette.primary} size="small" />
                    </View>
                  ))
                : (status?.towersSummary ?? TOWERS.map((t) => ({ towerId: t.id, name: t.name, availableCarts: 0 }))).map((item) => (
                    <View key={item.towerId} style={styles.torreMini}>
                      <Text style={styles.torreMiniName}>{item.name.replace('Torre ', '')}</Text>
                      <Text style={[styles.torreMiniCount, item.availableCarts === 0 && styles.torreMiniCountZero]}>{item.availableCarts}</Text>
                      <Text style={styles.torreMiniSub}>livre(s)</Text>
                    </View>
                  ))}
            </View>
          </View>

          {/* ── Ações ── */}
          <View>
            <Text style={styles.sectionLabel}>Ações</Text>

            {!showTowerSelect ? (
              <TouchableOpacity
                style={[styles.btnAction, styles.btnDestravar, loadingAction && styles.btnDisabled]}
                onPress={() => setShowTowerSelect(true)}
                activeOpacity={0.85}
                disabled={loadingAction}
                accessibilityRole="button"
                accessibilityLabel="Destravar carrinho"
              >
                <MaterialCommunityIcons name="lock-open-variant" size={22} color={Palette.onPrimary} />
                <Text style={styles.btnDestravLabel}>{loadingAction ? 'Aguarde...' : 'Destravar carrinho'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.towerSelectBox}>
                <Text style={styles.towerSelectTitle}>Escolha a torre:</Text>
                {TOWERS.map((tower) => (
                  <TouchableOpacity
                    key={tower.id}
                    style={[styles.btnAction, styles.btnTorre, loadingAction && styles.btnDisabled]}
                    onPress={() => handleUnlockWithTower(tower.id)}
                    activeOpacity={0.85}
                    disabled={loadingAction}
                    accessibilityRole="button"
                    accessibilityLabel={`Destravar na ${tower.name}`}
                  >
                    <MaterialCommunityIcons name="office-building-marker" size={20} color={Palette.primary} />
                    <Text style={styles.btnTorreLabel}>{tower.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.btnAction, styles.btnCancelar]} onPress={() => setShowTowerSelect(false)} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="Cancelar">
                  <Text style={styles.btnCancelarLabel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btnAction, hasMyCart ? styles.btnDevolver : styles.btnDevolverDisabled, (loadingAction || !hasMyCart) && styles.btnDisabled]}
              onPress={handleReturnCart}
              activeOpacity={0.85}
              disabled={loadingAction || !hasMyCart}
              accessibilityRole="button"
              accessibilityLabel="Devolver carrinho"
            >
              <MaterialCommunityIcons name="cart-arrow-down" size={22} color={hasMyCart ? Palette.warning : Palette.textMuted} />
              <Text style={[styles.btnDevolverLabel, !hasMyCart && { color: Palette.textMuted }]}>Devolver carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnAction, styles.btnAtualizar]} onPress={() => loadStatus()} activeOpacity={0.85} disabled={loadingStatus} accessibilityRole="button" accessibilityLabel="Atualizar status">
              <MaterialCommunityIcons name="refresh" size={20} color={Palette.info} />
              <Text style={styles.btnAtualizarLabel}>{loadingStatus ? 'Atualizando...' : 'Atualizar status'}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.bg },
  scrollContent: { paddingBottom: 40 },

  header: {
    backgroundColor: Palette.bgElevated,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  brandDot: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Palette.primarySoft,
    borderWidth: 1, borderColor: Palette.primaryBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  headerGreeting: { fontSize: FontSize.sm, color: Palette.textMuted },
  headerApt: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, color: Palette.white, marginTop: 2 },
  headerAptAccent: { color: Palette.primary },
  logoutBtn: {
    width: A11y.minHit, height: A11y.minHit, borderRadius: Radius.md,
    backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: Palette.dangerBorder,
    alignItems: 'center', justifyContent: 'center',
  },

  content: { padding: Spacing.lg, gap: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
    color: Palette.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },

  torreCard: {
    backgroundColor: Palette.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    borderWidth: 1, borderColor: Palette.primaryBorder, ...Shadow,
  },
  torreName: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, color: Palette.white, marginBottom: Spacing.sm },
  torreCountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  torreCount: { fontSize: FontSize.display, fontWeight: FontWeight.heavy, color: Palette.primary, lineHeight: 48 },
  torreCountZero: { color: Palette.danger },
  torreCountLabel: { fontSize: FontSize.md, color: Palette.textMuted, lineHeight: 22 },

  inUseBox: { backgroundColor: Palette.dangerSoft, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Palette.dangerBorder },
  inUseTitle: { fontSize: FontSize.sm, color: Palette.danger, fontWeight: FontWeight.bold, marginBottom: Spacing.xs },
  inUseItem: { fontSize: FontSize.sm, color: '#FCA5A5', marginLeft: 4, marginTop: 2 },

  alterarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    backgroundColor: Palette.primarySoft, borderRadius: Radius.sm, borderWidth: 1, borderColor: Palette.primaryBorder,
    minHeight: A11y.minHit, paddingVertical: 12,
  },
  alterarBtnText: { color: Palette.primary, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  statusCard: {
    backgroundColor: Palette.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Palette.border, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadow,
  },
  statusCardActive: { borderColor: Palette.primaryBorder },
  statusIconWrap: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: 'rgba(148,163,184,0.12)', borderWidth: 1, borderColor: Palette.border,
    alignItems: 'center', justifyContent: 'center',
  },
  statusIconWrapActive: { backgroundColor: Palette.primarySoft, borderColor: Palette.primaryBorder },
  statusText: { flex: 1 },
  statusLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.6, color: Palette.textMuted, textTransform: 'uppercase', marginBottom: 3 },
  statusVal: { fontSize: FontSize.md, color: Palette.text },
  statusValBold: { fontWeight: FontWeight.heavy, color: Palette.white },
  statusSince: { fontSize: FontSize.sm, color: Palette.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: Palette.primarySoft, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Palette.primaryBorder },
  statusBadgeText: { fontSize: FontSize.xs, color: Palette.primary, fontWeight: FontWeight.bold },

  torresGrid: { flexDirection: 'row', gap: Spacing.sm },
  torreMini: { flex: 1, backgroundColor: Palette.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.border, padding: Spacing.md, alignItems: 'center' },
  torreMiniName: { fontSize: FontSize.sm, color: Palette.textMuted, marginBottom: 4, fontWeight: FontWeight.medium },
  torreMiniCount: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Palette.primary, lineHeight: 34, marginBottom: 2 },
  torreMiniCountZero: { color: Palette.danger },
  torreMiniSub: { fontSize: FontSize.xs, color: Palette.textFaint },

  btnAction: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    minHeight: A11y.minHit, borderRadius: Radius.md, paddingVertical: 15, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  btnDisabled: { opacity: 0.5 },
  btnDestravar: { backgroundColor: Palette.primary, ...Shadow },
  btnDestravLabel: { fontSize: FontSize.md, fontWeight: FontWeight.heavy, color: Palette.onPrimary },
  btnDevolver: { backgroundColor: Palette.warningSoft, borderWidth: 1, borderColor: Palette.warningBorder },
  btnDevolverDisabled: { backgroundColor: 'rgba(148,163,184,0.08)', borderWidth: 1, borderColor: Palette.border },
  btnDevolverLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Palette.warning },
  btnAtualizar: { backgroundColor: Palette.infoSoft, borderWidth: 1, borderColor: Palette.infoBorder, paddingVertical: 13 },
  btnAtualizarLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Palette.info },

  towerSelectBox: { backgroundColor: Palette.bgElevated, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Palette.primaryBorder, marginBottom: Spacing.sm },
  towerSelectTitle: { fontSize: FontSize.sm, color: Palette.textMuted, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm },
  btnTorre: { backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: Palette.primaryBorder },
  btnTorreLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Palette.primary },
  btnCancelar: { backgroundColor: 'rgba(148,163,184,0.1)', borderWidth: 1, borderColor: Palette.border, marginBottom: 0 },
  btnCancelarLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Palette.textMuted },
});

export default HomeScreen;