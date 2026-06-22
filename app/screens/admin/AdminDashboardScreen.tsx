// app/screens/admin/AdminDashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminScreen, AdminRole } from './AdminNavigator';
import { Palette, Radius, Spacing, FontSize, FontWeight, A11y, Shadow } from '../../../constants/theme';

type Props = {
  role: AdminRole;
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
};

const STATS = [
  { label: 'Moradores',      value: '48', icon: 'account-group',    color: Palette.info },
  { label: 'Carrinhos',      value: '6',  icon: 'cart-outline',     color: Palette.success },
  { label: 'Em uso',         value: '2',  icon: 'cart-check',       color: Palette.warning },
  { label: 'Faces cadastr.', value: '31', icon: 'face-recognition', color: Palette.purple },
] as const;

const RECENT_LOGS = [
  { name: 'Ana Beatriz',  apt: '101', tower: 'Torre Mar',   time: '14:32', ok: true  },
  { name: 'Carlos Souza', apt: '202', tower: 'Torre Serra', time: '13:15', ok: true  },
  { name: 'Desconhecido', apt: '—',   tower: 'Torre Mar',   time: '12:48', ok: false },
  { name: 'Pedro Alves',  apt: '404', tower: 'Torre Mar',   time: '11:20', ok: true  },
];

const MENU_ITEMS: { id: AdminScreen; label: string; icon: string; color: string; roles: AdminRole[] }[] = [
  { id: 'moradores',      label: 'Moradores',             icon: 'account-group',    color: Palette.info,    roles: ['admin', 'portaria'] },
  { id: 'carrinhos',      label: 'Carrinhos',             icon: 'cart-outline',     color: Palette.success, roles: ['admin', 'portaria'] },
  { id: 'historico',      label: 'Histórico',             icon: 'history',          color: Palette.warning, roles: ['admin', 'portaria'] },
  { id: 'reconhecimento', label: 'Reconhecimento Facial', icon: 'face-recognition', color: Palette.purple,  roles: ['admin', 'portaria'] },
  { id: 'configuracoes',  label: 'Configurações',         icon: 'cog',              color: Palette.danger,  roles: ['admin'] },
];

export default function AdminDashboardScreen({ role, onNavigate, onLogout }: Props) {
  const visibleMenu = MENU_ITEMS.filter((m) => m.roles.includes(role));
  const roleLabel = role === 'admin' ? 'Administrador' : 'Portaria';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgElevated} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CartKey Gerencial</Text>
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name={role === 'admin' ? 'shield-account' : 'security'} size={14} color={Palette.primary} />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} accessibilityRole="button" accessibilityLabel="Sair">
          <MaterialCommunityIcons name="logout" size={22} color={Palette.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: s.color + '24' }]}>
                <MaterialCommunityIcons name={s.icon as any} size={24} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Módulos</Text>
        <View style={styles.menuGrid}>
          {visibleMenu.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuCard} onPress={() => onNavigate(item.id)} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={item.label}>
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '24' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={30} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={Palette.textMuted} style={{ marginTop: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Últimos Acessos</Text>
        <View style={styles.card}>
          {RECENT_LOGS.map((log, i) => (
            <View key={i} style={[styles.logRow, i < RECENT_LOGS.length - 1 && styles.logRowBorder]}>
              <View style={[styles.logDot, { backgroundColor: log.ok ? Palette.success : Palette.danger }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logName}>{log.name}</Text>
                <Text style={styles.logSub}>{log.tower} · Ap. {log.apt}</Text>
              </View>
              <Text style={styles.logTime}>{log.time}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => onNavigate('historico')} style={styles.seeAllBtn} accessibilityRole="button" accessibilityLabel="Ver histórico completo">
            <Text style={styles.seeAllText}>Ver histórico completo →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Status das Torres</Text>
        <View style={styles.towersRow}>
          {[
            { name: 'Torre Mar', livres: 1, total: 2 },
            { name: 'Torre Serra', livres: 2, total: 2 },
            { name: 'Torre Cidade', livres: 0, total: 2 },
          ].map((t) => (
            <View key={t.name} style={styles.towerCard}>
              <MaterialCommunityIcons name="cart-outline" size={24} color={t.livres === 0 ? Palette.danger : Palette.success} />
              <Text style={styles.towerName}>{t.name.replace('Torre ', '')}</Text>
              <Text style={[styles.towerCount, { color: t.livres === 0 ? Palette.danger : Palette.success }]}>{t.livres}/{t.total}</Text>
              <Text style={styles.towerSub}>livre(s)</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: Spacing.lg,
    backgroundColor: Palette.bgElevated, borderBottomWidth: 1, borderBottomColor: Palette.border,
  },
  headerTitle: { color: Palette.text, fontSize: FontSize.xl, fontWeight: FontWeight.heavy, letterSpacing: -0.3 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  roleText: { color: Palette.primary, fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1 },
  logoutBtn: {
    width: A11y.minHit, height: A11y.minHit, borderRadius: Radius.md,
    backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: Palette.dangerBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '47.5%', backgroundColor: Palette.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Palette.border, alignItems: 'flex-start', ...Shadow },
  statIconWrap: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { color: Palette.text, fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  statLabel: { color: Palette.textMuted, fontSize: FontSize.sm, marginTop: 2 },

  sectionTitle: { color: Palette.textMuted, fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: Spacing.xl, marginBottom: Spacing.sm },

  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  menuCard: { width: '47.5%', backgroundColor: Palette.surface, borderRadius: Radius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', ...Shadow },
  menuIconWrap: { width: 60, height: 60, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  menuLabel: { color: Palette.text, fontWeight: FontWeight.bold, fontSize: FontSize.sm, textAlign: 'center' },

  card: { backgroundColor: Palette.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Palette.border, ...Shadow },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  logRowBorder: { borderBottomWidth: 1, borderBottomColor: Palette.border },
  logDot: { width: 10, height: 10, borderRadius: 5 },
  logName: { color: Palette.text, fontWeight: FontWeight.medium, fontSize: FontSize.md },
  logSub: { color: Palette.textMuted, fontSize: FontSize.sm, marginTop: 1 },
  logTime: { color: Palette.textMuted, fontSize: FontSize.sm },
  seeAllBtn: { marginTop: Spacing.sm, alignItems: 'center', minHeight: A11y.minHit, justifyContent: 'center' },
  seeAllText: { color: Palette.info, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  towersRow: { flexDirection: 'row', gap: Spacing.sm },
  towerCard: { flex: 1, backgroundColor: Palette.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', ...Shadow },
  towerName: { color: Palette.text, fontWeight: FontWeight.bold, fontSize: FontSize.sm, marginTop: Spacing.xs },
  towerCount: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, marginTop: 2 },
  towerSub: { color: Palette.textMuted, fontSize: FontSize.xs },
});