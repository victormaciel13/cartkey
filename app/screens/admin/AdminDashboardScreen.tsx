// app/screens/admin/AdminDashboardScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminScreen, AdminRole } from './AdminNavigator';

type Props = {
  role: AdminRole;
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
};

// ─── Dados mock visuais ───────────────────────────────────────────────────────
const STATS = [
  { label: 'Moradores',     value: '48',  icon: 'account-group',    color: '#0077b6' },
  { label: 'Carrinhos',     value: '6',   icon: 'cart-outline',     color: '#2ecc71' },
  { label: 'Em uso',        value: '2',   icon: 'cart-check',       color: '#f4a261' },
  { label: 'Faces cadastr.',value: '31',  icon: 'face-recognition', color: '#9b59b6' },
];

const RECENT_LOGS = [
  { name: 'Ana Beatriz',   apt: '101', tower: 'Torre Mar',    time: '14:32', ok: true  },
  { name: 'Carlos Souza',  apt: '202', tower: 'Torre Serra',  time: '13:15', ok: true  },
  { name: 'Desconhecido',  apt: '—',   tower: 'Torre Mar',    time: '12:48', ok: false },
  { name: 'Pedro Alves',   apt: '404', tower: 'Torre Mar',    time: '11:20', ok: true  },
];

// Menus disponíveis por perfil
const MENU_ITEMS: {
  id: AdminScreen;
  label: string;
  icon: string;
  color: string;
  roles: AdminRole[];
}[] = [
  { id: 'moradores',      label: 'Moradores',          icon: 'account-group',    color: '#0077b6', roles: ['admin', 'portaria'] },
  { id: 'carrinhos',      label: 'Carrinhos',          icon: 'cart-outline',     color: '#2ecc71', roles: ['admin', 'portaria'] },
  { id: 'historico',      label: 'Histórico',          icon: 'history',          color: '#f4a261', roles: ['admin', 'portaria'] },
  { id: 'reconhecimento', label: 'Reconhecimento Facial', icon: 'face-recognition', color: '#9b59b6', roles: ['admin', 'portaria'] },
  { id: 'configuracoes',  label: 'Configurações',      icon: 'cog',              color: '#e63946', roles: ['admin'] },
];

export default function AdminDashboardScreen({ role, onNavigate, onLogout }: Props) {
  const visibleMenu = MENU_ITEMS.filter(m => m.roles.includes(role));
  const roleLabel   = role === 'admin' ? 'Administrador' : 'Portaria';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CartKey Gerencial</Text>
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons
              name={role === 'admin' ? 'shield-account' : 'security'}
              size={12}
              color="#00f5d4"
            />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <MaterialCommunityIcons name="logout" size={20} color="#e63946" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: s.color + '22' }]}>
                <MaterialCommunityIcons name={s.icon as any} size={22} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu de navegação */}
        <Text style={styles.sectionTitle}>Módulos</Text>
        <View style={styles.menuGrid}>
          {visibleMenu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => onNavigate(item.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '22' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={30} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#7a98b8" style={{ marginTop: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Acessos recentes */}
        <Text style={styles.sectionTitle}>Últimos Acessos</Text>
        <View style={styles.card}>
          {RECENT_LOGS.map((log, i) => (
            <View
              key={i}
              style={[styles.logRow, i < RECENT_LOGS.length - 1 && styles.logRowBorder]}
            >
              <View style={[styles.logDot, { backgroundColor: log.ok ? '#2ecc71' : '#e63946' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logName}>{log.name}</Text>
                <Text style={styles.logSub}>{log.tower} · Ap. {log.apt}</Text>
              </View>
              <Text style={styles.logTime}>{log.time}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={() => onNavigate('historico')} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Ver histórico completo →</Text>
          </TouchableOpacity>
        </View>

        {/* Status torres */}
        <Text style={styles.sectionTitle}>Status das Torres</Text>
        <View style={styles.towersRow}>
          {[
            { name: 'Torre Mar',    livres: 1, total: 2 },
            { name: 'Torre Serra',  livres: 2, total: 2 },
            { name: 'Torre Cidade', livres: 0, total: 2 },
          ].map((t) => (
            <View key={t.name} style={styles.towerCard}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={22}
                color={t.livres === 0 ? '#e63946' : '#2ecc71'}
              />
              <Text style={styles.towerName}>{t.name.replace('Torre ', '')}</Text>
              <Text style={[styles.towerCount, { color: t.livres === 0 ? '#e63946' : '#2ecc71' }]}>
                {t.livres}/{t.total}
              </Text>
              <Text style={styles.towerSub}>livre(s)</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#001a33' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 18,
    backgroundColor: '#001a33',
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.3)',
  },
  headerTitle: { color: '#e8f0f7', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  roleBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  roleText:    { color: '#00f5d4', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  logoutBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: '#002a50', alignItems: 'center', justifyContent: 'center' },
  scroll:      { padding: 16, paddingBottom: 40 },

  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  statCard:    { width: '47.5%', backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', alignItems: 'flex-start' },
  statIconWrap:{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue:   { color: '#e8f0f7', fontSize: 26, fontWeight: '800' },
  statLabel:   { color: '#7a98b8', fontSize: 12, marginTop: 2 },

  sectionTitle:{ color: '#7a98b8', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },

  menuGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  menuCard:    { width: '47.5%', backgroundColor: '#002a50', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', alignItems: 'center' },
  menuIconWrap:{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  menuLabel:   { color: '#e8f0f7', fontWeight: '700', fontSize: 13, textAlign: 'center' },

  card:        { backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  logRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  logRowBorder:{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.2)' },
  logDot:      { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  logName:     { color: '#e8f0f7', fontWeight: '600', fontSize: 14 },
  logSub:      { color: '#7a98b8', fontSize: 12, marginTop: 1 },
  logTime:     { color: '#7a98b8', fontSize: 12 },
  seeAllBtn:   { marginTop: 10, alignItems: 'center' },
  seeAllText:  { color: '#00b4d8', fontSize: 13, fontWeight: '600' },

  towersRow:   { flexDirection: 'row', gap: 10 },
  towerCard:   { flex: 1, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', alignItems: 'center' },
  towerName:   { color: '#e8f0f7', fontWeight: '700', fontSize: 13, marginTop: 6 },
  towerCount:  { fontSize: 22, fontWeight: '800', marginTop: 2 },
  towerSub:    { color: '#7a98b8', fontSize: 11 },
});